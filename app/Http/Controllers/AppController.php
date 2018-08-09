<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\CarbonPrice;
use Auth;

class AppController extends Controller
{
    public function getSessionData()
    {
    	return response([
    		'user' => Auth::user(),
			'price' => CarbonPrice::where('active', 1)->first()->value,
    	], 200);
    }

    public function reverseGeocoding()
    {
    	
    }
}
