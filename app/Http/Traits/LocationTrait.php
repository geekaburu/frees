<?php

namespace App\Http\Traits;

use GuzzleHttp\Client;
use Illuminate\Http\Request;

trait LocationTrait
{
	/**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        // The Guzzle HTTP Client instance.
        $this->client = new Client([
            // Set the default headers.
            'headers' => [
                'Content-Type' => 'application/json',
            ],
        ]);
    }

    /**
     * Get a county name given a set of coordinates.
     *
     * @param array()
     * @return string
     */
	public function getCounty($coordinates)
	{
		// Reverse Geocode the current location
		$location = $this->reverseGeocode($coordinates);
		
		// Get the current county and store result in array 
		$data = array();
		$results = ($location->results)[0];
		foreach($results->address_components as $element){
			$data[ implode(' ',$element->types) ] = $element->long_name;
		}	

		// Return the county name without the county postfix
		return str_replace(' County', '', $data['administrative_area_level_1 political']);
	}

	/**
    * Return results of the geocoding API given a set of coordinates.
    *
    * @param array()
    * @return array()
    */
	public function reverseGeocode($coordinates)
	{
		return json_decode($this->client->request('GET', 'https://maps.googleapis.com/maps/api/geocode/json', [
            'query' => [
    			'latlng' => $coordinates['latitude'].','.$coordinates['longitude'],
    			'key' => env('GOOGLE_API_KEY'),
    		],
        ])->getBody());
	}
}