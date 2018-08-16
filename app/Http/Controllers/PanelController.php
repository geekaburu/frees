<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\PanelData;
use App\Panel;

class PanelController extends Controller
{
    public function receivePanelData(Request $request)
    {
      	// Create a panel data entry
		PanelData::create($request->all());

		// Update location information for the user
		if($request->has('latitude') && $request->has('longitude')){
			Panel::findOrFail($request->panel_id)->user->location()->update($request->only(['latitude', 'longitude']));
		}
    }
}
