<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PanelController extends Controller
{
    public function receivePanelData(Request $request)
    {
    	return response()->json([
    		'status' => 'success',
    		'data' => $request->all()
    	]);
    }
}
