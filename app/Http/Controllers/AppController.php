<?php

namespace App\Http\Controllers;

use Auth;
use Carbon\Carbon;
use App\CarbonPrice;
use Illuminate\Http\Request;

class AppController extends Controller
{
    public function getSessionData()
    {
    	// Return response
    	return response([
    		'user' => Auth::user(),
			'price' => CarbonPrice::where('active', 1)->first()->value,
    	], 200);
    }

    public function getPricingData(Request $request)
    {
    	// Define start date and end date
    	$startDate = $request->start_date ? Carbon::createFromFormat('d/m/Y', $request->start_date)->format('Y-m-d') : '';
        $endDate = $request->end_date ? Carbon::createFromFormat('d/m/Y', $request->end_date) : Carbon::now();

        // Return response
    	return response([
			'prices' => $this->generatePriceChartData(CarbonPrice::orderBy('carbon_prices.created_at', 'asc'), $request->chart_filter),
            'today' => CarbonPrice::where('active', 1)->first(['credit_rate', 'value']),
    	], 200);
    }
}
