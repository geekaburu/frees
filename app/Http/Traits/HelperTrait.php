<?php

namespace App\Http\Traits;

use DB;
use Auth;
use App\User;
use Carbon\Carbon;
use App\PanelData;
use App\CarbonPrice;
use App\CarbonTransaction;
use Illuminate\Http\Request;

trait HelperTrait
{
	public function generateChartData($data, $filter)
	{
		// Define parameters
	    $parameters = [
	    	DB::raw('sum(energy) as energy'),
	    ];

	    // Create filters for the query
	    if($filter == 'live'){
	    	$chartData = $data->whereDate('panel_data.created_at', Carbon::today());
	    	array_push($parameters, DB::raw('panel_data.created_at as label'));
	    	return $chartData->orderBy('panel_data.created_at', 'desc')->select($parameters)->groupBy('label')->take(5)->get();
	    } else if($filter == 'today'){
	    	$chartData = $data->whereDate('panel_data.created_at', Carbon::today());
	    	array_push($parameters, DB::raw("FROM_UNIXTIME(FLOOR(UNIX_TIMESTAMP(panel_data.created_at) / (15*60)) * (15*60)) as label"));
	    } else if($filter == 'yesterday'){
	    	$chartData = $data->whereDate('panel_data.created_at', Carbon::yesterday());
	    	array_push($parameters, DB::raw("FROM_UNIXTIME(FLOOR(UNIX_TIMESTAMP(panel_data.created_at) / (15*60)) * (15*60)) as label"));
		} else if($filter == 'week'){
	    	$chartData = $data->whereBetween('panel_data.created_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()]);
	    	array_push($parameters, DB::raw("DATE_FORMAT(panel_data.created_at,'%D %M') as label"));
	    } else if($filter == 'month'){
	    	$chartData = $data->whereYear('panel_data.created_at', date('Y'))->whereMonth('panel_data.created_at', date('m'));
	    	array_push($parameters, DB::raw("DATE_FORMAT(panel_data.created_at,'%D %M') as label"));
	    } else if($filter == '3month'){
	    	$chartData = $data->whereYear('panel_data.created_at', date('Y'))->whereMonth('panel_data.created_at', '>=', Carbon::now()->subMonth(3)->month);
	    	array_push($parameters, DB::raw("DATE_FORMAT(panel_data.created_at,'%M %Y') as label"));
	    } else if($filter == 'year'){
	    	$chartData = $data->whereYear('panel_data.created_at', date('Y'));
	    	array_push($parameters, DB::raw("DATE_FORMAT(panel_data.created_at,'%M %Y') as label"));
	    } else if(is_numeric($filter)){
	    	$chartData = $data->whereYear('panel_data.created_at', date('Y'))->whereMonth('panel_data.created_at', '>=', Carbon::now()->subMonth($filter)->month);
	    }
	    return $chartData->orderBy('panel_data.created_at', 'asc')->select($parameters)->groupBy('label')->get();
	}

	public function getTransactionData($data, $admin = false)
	{
		// Populate empty options
        $transactions = [];
        foreach ($data as $element) {
            if(Carbon::createFromFormat('Y-m-d H:i:s', $element->date)->year  == date('Y')){
				// Get the current rates
		        $record = CarbonPrice::where('active', 1)->orderBy('created_at', 'desc')->first();
                $element->credits = $element->energy / $record->credit_rate;
                $element->amount = $element->energy / $record->credit_rate * $record->value;
                $element->price = $record->value;
                $element->rate = $record->credit_rate;
                $element->status = 'Unavailable';
            } else{
                $element->credits = $element->energy / $element->rate;
                $element->amount = $element->energy / $element->rate * $element->price;
                if($element->receipt_date && $element->sale_date) $element->status = 'Received'; 
                if(!$element->sale_date) $element->status = 'Processing'; 
            }

            $element->commission = $element->amount * Auth::user()->role->commission_rate;
            $element->net_amount = $element->amount - $element->commission;

            // Add sale and dispatch status
            if($admin){
            	$element->sale_status = $element->sale_date ? 'Sold' : null; 
            	$element->dispatch_status = $element->receipt_date ? 'Remitted' : null; 
            	$rate = $element->rate;
            	$price = $element->price;
            	$element->data = User::ofType('customer')->withCount([
					'panelData as energy' => function($query) use ($element) {
		                $query->select(DB::raw('sum(energy) as energy'))
		                    ->whereYear('panel_data.created_at', $element->year);
		            }, 
		            'panelData as credits' => function($query) use ($rate, $element) {
		                $query->select(DB::raw('sum(energy)/'.$rate.' as credits'))
		                    ->whereYear('panel_data.created_at', $element->year);
		            },
		            'panelData as amount' => function($query) use ($rate, $price, $element) {
		                $query->select(DB::raw('sum(energy)/'.$rate.'*'.$price.' as amount'))
		                    ->whereYear('panel_data.created_at', $element->year);
		            },
            	])->withCount([
            		'location as county' => function($query){
            			$query->select(DB::raw('(select name from counties where locations.county_id = counties.id) as county'));
            		},
            	])->whereHas('panelData')->get();
            }
            $transactions[] = $element;
        }
        return $transactions;
	}

	public function generatePriceChartData($data, $filter){
		// Define parameters
	    $parameters = [
	    	DB::raw('avg(value) as price'),
	    	DB::raw('avg(credit_rate) as rate'),
	    ];

	    // Create filters for the query
	    if($filter == 'week') {
	    	$chartData = $data->whereBetween('carbon_prices.created_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()]);
	    	array_push($parameters, DB::raw('DATE_FORMAT(carbon_prices.created_at,"%D %M") as label'));
	    } else if($filter == 'month') {
	    	$chartData = $data->whereYear('carbon_prices.created_at', date('Y'))->whereMonth('carbon_prices.created_at', date('m'));
	    	array_push($parameters, DB::raw('DATE_FORMAT(carbon_prices.created_at,"%D %M") as label'));
	    } else if($filter == '3month'){
	    	$chartData = $data->whereYear('carbon_prices.created_at', date('Y'))->whereMonth('carbon_prices.created_at', '>=', Carbon::now()->subMonth(3)->month);
	    	array_push($parameters, DB::raw('DATE_FORMAT(carbon_prices.created_at,"%M %Y") as label'));
	    } else if($filter == 'year'){
	    	$chartData = $data->whereYear('carbon_prices.created_at', date('Y'));
	    	array_push($parameters, DB::raw('DATE_FORMAT(carbon_prices.created_at,"%M %Y") as label'));
	    }

	    // Process results
	    $data->priceAverage = $chartData->select($parameters)->avg('value');
	    $data->rateAverage = $chartData->select($parameters)->avg('credit_rate');
	    $data->chart = $chartData->select($parameters)->groupBy('label')->get();
	    return $data;
	}
}