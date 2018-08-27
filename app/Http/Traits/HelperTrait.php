<?php

namespace App\Http\Traits;

use DB;
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
	    	DB::raw('panel_data.created_at as label') 
	    ];

	    // Create filters for the query
	    if($filter == 'live'){
	    	$chartData = $data->whereDate('panel_data.created_at', Carbon::today());
	    	return $chartData->orderBy('panel_data.created_at', 'desc')->select($parameters)->groupBy('label')->get();
	    } else if($filter == 'today'){
	    	$chartData = $data->whereDate('panel_data.created_at', Carbon::today());
	    } else if($filter == 'week'){
	    	$chartData = $data->whereBetween('panel_data.created_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()]);
	    } else if($filter == 'month'){
	    	$chartData = $data->whereYear('panel_data.created_at', date('Y'))->whereMonth('panel_data.created_at', date('m'));
	    } else if($filter == '3month'){
	    	$chartData = $data->whereYear('panel_data.created_at', date('Y'))->whereMonth('panel_data.created_at', '>=', Carbon::now()->subMonth(3)->month);
	    	unset($parameters[1]);
	    	array_push($parameters, DB::raw("DATE_FORMAT(panel_data.created_at,'%M %Y') as label"));
	    } else if($filter == 'year'){
	    	$chartData = $data->whereYear('panel_data.created_at', date('Y'));
	    	unset($parameters[1]);
	    	array_push($parameters, DB::raw("DATE_FORMAT(panel_data.created_at,'%M %Y') as label"));
	    } else if(is_numeric($filter)){
	    	$chartData = $data->whereYear('panel_data.created_at', date('Y'))->whereMonth('panel_data.created_at', '>=', Carbon::now()->subMonth($filter)->month);
	    }
	    return $chartData->orderBy('panel_data.created_at', 'asc')->select($parameters)->groupBy('label')->get();
	}

	public function getTransactionData($data, $admin = false)
	{
		// Get the current rates
        $record = CarbonPrice::where('active', 1)->orderBy('created_at', 'desc')->first();
        $price = $record->value;
        $rate = $record->credit_rate;

        // Populate empty options
        $transactions = [];
        foreach ($data as $element) {
            if(Carbon::createFromFormat('Y-m-d H:i:s', $element->date)->year  == date('Y')){
                $element->credits = number_format((float) $element->energy/ $rate,5,'.','');
                $element->amount = number_format((float) $element->energy / $rate * $price,2,'.','');
                $element->price = $price;
                $element->rate = $rate;
                $element->status = 'Unavailable';
            } else{
                $element->credits = number_format((float) $element->energy/ $element->rate,5,'.','');
                $element->amount = number_format((float) $element->energy / $element->rate * $element->price,2,'.','');
                if($element->receipt_date && $element->sale_date) $element->status = 'Received'; 
                if(!$element->sale_date) $element->status = 'Processing'; 
            }

            // Add sale and dispatch status
            if($admin){
            	$element->sale_status = $element->sale_date ? 'Sold' : null; 
            	$element->dispatch_status = $element->receipt_date ? 'Dispatched' : null; 
            	$element->data = User::ofType('customer')->withCount([
					'panelData as energy' => function($query) use ($element) {
		                $query->select(DB::raw('sum(energy) as energy'))
		                    ->whereYear('panel_data.created_at', $element->year);
		            }, 
		            'panelData as credits' => function($query) use ($rate, $element) {
		                $query->select(DB::raw('round(sum(energy)/'.$rate.', 2) as credits'))
		                    ->whereYear('panel_data.created_at', $element->year);
		            },
		            'panelData as amount' => function($query) use ($rate, $price, $element) {
		                $query->select(DB::raw('round(sum(energy)/'.$rate.'*'.$price.', 2) as amount'))
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
	    	DB::raw('carbon_prices.created_at as label')
	    ];

	    // Create filters for the query
	    if($filter == 'week')
	    	$chartData = $data->whereBetween('carbon_prices.created_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()]);
	    else if($filter == 'month')
	    	$chartData = $data->whereYear('carbon_prices.created_at', date('Y'))->whereMonth('carbon_prices.created_at', date('m'));
	    else if($filter == '3month'){
	    	$chartData = $data->whereYear('carbon_prices.created_at', date('Y'))->whereMonth('carbon_prices.created_at', '>=', Carbon::now()->subMonth(3)->month);
	    	unset($parameters[2]);
	    	array_push($parameters, DB::raw("DATE_FORMAT(carbon_prices.created_at,'%M %Y') as label"));
	    }
	    else if($filter == 'year'){
	    	$chartData = $data->whereYear('carbon_prices.created_at', date('Y'));
	    	unset($parameters[2]);
	    	array_push($parameters, DB::raw("DATE_FORMAT(carbon_prices.created_at,'%M %Y') as label"));
	    }

	    // Process results
	    $data->priceAverage = $chartData->select($parameters)->avg('value');
	    $data->rateAverage = $chartData->select($parameters)->avg('credit_rate');
	    $data->chart = $chartData->select($parameters)->groupBy('label')->get();
	    return $data;
	}
}