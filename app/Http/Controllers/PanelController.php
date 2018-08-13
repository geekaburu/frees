<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PanelController extends Controller
{
    public function receivePanelData(Request $request)
    {
    	Log::info($request->all());
    	return response()->json([
    		'status' => 'success',
    		'data' => $request->all()
    	]);
    }
}
