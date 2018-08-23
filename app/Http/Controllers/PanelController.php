<?php

namespace App\Http\Controllers;

use App\Panel;
use App\County;
use App\PanelData;
use Illuminate\Http\Request;

class PanelController extends Controller
{
    public function receivePanelData(Request $request)
    {
      	// Create a panel data entry
		PanelData::create($request->all());

		// Update location information for the user if latitude and longitude have been availed
		if($request->has('latitude') && $request->has('longitude')){
			$county = County::where('name',$this->getCounty(['latitude'=>$request->latitude, 'longitude'=>$request->longitude]))->first();
			// Update panel data according to data provided
			Panel::findOrFail($request->panel_id)->user->location()->update(array_merge($request->all(), [
				'county_id' => $county ? $county->id : 0
			]));
		}
    }
}