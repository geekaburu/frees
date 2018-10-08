<?php

namespace App\Http\Controllers;

use DB;
use Carbon\Carbon;
use Illuminate\Http\Request;

use App\User;
use App\County;
use App\PanelData;
use App\CarbonPrice;
use App\CarbonTransaction;

class AdminController extends Controller
{
    /**
     * Get dashboard data for a certain customer.
     *
     * @return \Illuminate\Http\JsonResponse
    */
    public function getDashboardData(Request $request)
    {
        // Get the current carbon cost
        $record = CarbonPrice::where('active', 1)->orderBy('created_at', 'desc')->first();
        $creditRate = $record->credit_rate;
        $carbonPrice = $record->value;

        // Get card data
        $cardData = PanelData::whereYear('panel_data.created_at', date('Y'))
            ->orderBy('panel_data.created_at', 'asc')
            ->select(
                DB::raw('(select count(users.id) as customers from users) as customers'), 
                DB::raw('sum(energy) as energy'), 
                DB::raw('sum(energy)/'.$creditRate.' as credits'),
                DB::raw('sum(energy)/'.$creditRate.'*'.$carbonPrice.' as amount'),
                DB::raw('DATE_FORMAT(panel_data.created_at,"%Y") as year') 
            )->groupBy('year')->first();

       // Get county data
       $countyData = County::withCount([
            'panelData as energy' =>function($query){
                $query->select(DB::raw('sum(energy) as energy'))
                    ->whereYear('panel_data.created_at', date('Y'));
            },
            'panelData as amount' => function($query) use ($creditRate, $carbonPrice) {
                $query->select(DB::raw('sum(energy)/'.$creditRate.'*'.$carbonPrice.' as amount'))
                    ->whereYear('panel_data.created_at', date('Y'));
            }
        ])->orderBy('energy', 'desc')->get(['id','name','energy']);

       $customerData = User::ofType('customer')->withCount([
            'panelData as energy' =>function($query){
                $query->select(DB::raw('sum(energy) as energy'))
                    ->whereYear('panel_data.created_at', date('Y'));
            },
        ])->orderBy('energy', 'desc')->get(['id','name','energy']);

       $monthData = PanelData::whereYear('created_at', date('Y'))->select(
                DB::raw('sum(energy) as energy'), 
                DB::raw('DATE_FORMAT(panel_data.created_at,"%M") as month') 
            )->groupBy('month')->orderBy('energy', 'desc')->first();

        // Get chart data
       $chartData = PanelData::orderBy('panel_data.created_at', 'asc');

       // Return response 
        return response()->json([
            'highestCards' => [
                'county' => $countyData[0],
                'customer' => $customerData[0],
                'month' => $monthData,
                'monthAmount' => $monthData->energy/$creditRate*$carbonPrice,
            ],
            'cards' => $cardData,
            'chart' => $this->generateChartData($chartData, 'live'),
            'lastDate' => Carbon::now()->endOfYear()->format('d/m/Y H:i:s'),
            'rates' => $record,
            'counties' => $countyData,
        ]);
    }
    /**
     * Get customer data.
     *
     * @return \Illuminate\Http\JsonResponse
    */
    public function getCustomerData(Request $request)
    {
        // Get the current carbon cost
        $record = CarbonPrice::where('active', 1)->orderBy('created_at', 'desc')->first();
        $creditRate = $record->credit_rate;
        $carbonPrice = $record->value;

        // Customer Data
    	$customerData =  User::ofType('customer')->withCount([
			'panelData as energy' => function($query){
	    		$query->select(DB::raw('sum(energy) as energy'))->whereYear('panel_data.created_at', date('Y'));
	    	}, 
			'panels as panels', 
	    ])->with('location')->get();

        // Energy Data
        $panelData = User::ofType('customer')->withCount([
            'panelData as energy' => function($query) {
                $query->select(DB::raw('sum(energy) as energy'))
                    ->whereYear('panel_data.created_at', date('Y'))
                    ->whereMonth('panel_data.created_at', date('m'));
            }, 
            'panelData as credits' => function($query) use ($creditRate) {
                $query->select(DB::raw('sum(energy)/'.$creditRate.' as credits'))
                    ->whereYear('panel_data.created_at', date('Y'))
                    ->whereMonth('panel_data.created_at', date('m'));
            },
            'panelData as amount' => function($query) use ($creditRate, $carbonPrice) {
                $query->select(DB::raw('sum(energy)/'.$creditRate.'*'.$carbonPrice.' as amount'))
                    ->whereYear('panel_data.created_at', date('Y'))
                    ->whereMonth('panel_data.created_at', date('m'));
            }
        ])->whereHas('panelData')->get(); 

	    return response([
			'customerData' => $customerData,
            'chart' => [
                'data' =>  $this->generateChartData(PanelData::orderBy('created_at', 'asc'), $request->chart_filter)
            ],
            'panels' => [
                'data' => $panelData,
            ],
	    ],200);
    }

    /**
     * Get customer analysis data.
     *
     * @return \Illuminate\Http\JsonResponse
    */
    public function customerAnalysis(Request $request)
    {
        // Get the data requested for
        $data = (is_numeric($request->customer) ? User::findOrFail($request->customer)->panelData() : PanelData::where('id', '>', 0));

        // Filter panel data by duration
        if($request->chart_filter == 'today') $data =  $data->whereDate('panel_data.created_at', Carbon::today());
        if($request->chart_filter == 'week')  $data =  $data->whereBetween('panel_data.created_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()]);
        if($request->chart_filter == 'month') $data =  $data->whereMonth('panel_data.created_at', date('m'))->whereYear('panel_data.created_at', date('Y'));
        if($request->chart_filter == '3month')$data =  $data->whereMonth('panel_data.created_at', '>=', Carbon::now()->subMonth(3)->month);
        if($request->chart_filter == 'year')  $data =  $data->whereYear('panel_data.created_at', date('Y'));
        if($request->chart_filter == 'today') $data =  $data->whereYear('panel_data.created_at', date('Y')); 

        // Get the current carbon cost
        $record = CarbonPrice::where('active', 1)->orderBy('created_at', 'desc')->first();
        $carbonPrice = $record->value;
        $energy = $data->sum('energy');
        $credits = $energy/($record->credit_rate);

        $stats = [
            'energy' => $energy,
            'credits' => $credits,
            'amount' => $credits * $carbonPrice,
        ];

        // Return response data
        return response()->json([
            'customers'=> User::ofType('customer')->get(['id','name']),
            'chart'=>[
                'data'=> $this->generateChartData($data->orderBy('panel_data.created_at', 'asc'), $request->chart_filter),
            ],
            'activeCustomer' => is_numeric($request->customer) ? User::with('location')->findOrFail($request->customer): $request->customer,
            'stats' => $stats,
        ]);
    }

    /**
     * Get transaction data.
     *
     * @return \Illuminate\Http\JsonResponse
    */
    public function carbonTransactions(Request $request)
    {
        // Get transactions from previous years
        $data = PanelData::select(
            DB::raw('panel_data.created_at as date'),
            DB::raw('"" as control'),
            DB::raw('sum(energy) as energy'),
            DB::raw('DATE_FORMAT(panel_data.created_at,"%Y") as year'),
            DB::raw('(select rate from carbon_transactions where DATE_FORMAT(panel_data.created_at,"%Y") = DATE_FORMAT(carbon_transactions.sold_on,"%Y")) as rate'),
            DB::raw('(select price from carbon_transactions where DATE_FORMAT(panel_data.created_at,"%Y") = DATE_FORMAT(carbon_transactions.sold_on,"%Y")) as price'),
            DB::raw('(select dispatched_on from carbon_transactions where DATE_FORMAT(panel_data.created_at,"%Y") = DATE_FORMAT(carbon_transactions.sold_on,"%Y")) as receipt_date'),
            DB::raw('(select sold_on from carbon_transactions where DATE_FORMAT(panel_data.created_at,"%Y") = DATE_FORMAT(carbon_transactions.sold_on,"%Y")) as sale_date')
        )->groupBy('year')->get();
        
        return response([
            'transactions' => $this->getTransactionData($data, true),
        ], 200);
    }

    /**
     * Get energy reports.
     *
     * @return \Illuminate\Http\JsonResponse
    */
    public function energyReports(Request $request)
    {

        $startDate = $request->start_date ? Carbon::createFromFormat('d/m/Y', $request->start_date)->format('Y-m-d') : '';
        $endDate = $request->end_date ? Carbon::createFromFormat('d/m/Y', $request->end_date) : Carbon::now();
        $customers = User::ofType('customers')->get(['id','name']);

        // Get panel data between 2 time durations
        $data = PanelData::whereBetween('panel_data.created_at', [$startDate, $endDate->addDays(1)->format('Y-m-d')]);

        if(is_numeric($request->county_id) && is_numeric($request->customer_id)) {
            // Get panel data for a user in a certain county
            $data = $data->whereHas('panel.user.location.county', function($query) use ($request){
                    $query->where('id', $request->county_id);
                })->whereHas('panel.user', function($query) use ($request){
                    $query->where('id', $request->customer_id);
                });
            $customers = County::findOrFail($request->county_id)->users()->get(['users.id','users.name']);
        } elseif (is_numeric($request->county_id)){
             // Get panel data for a certain county
            $data = $data->whereHas('panel.user.location.county', function($query) use ($request){
                    $query->where('id', $request->county_id);
                });
            $customers = County::findOrFail($request->county_id)->users()->get(['users.id','users.name']);
        } elseif (is_numeric($request->customer_id)) {
            // Get panel data for a certain county
            $data = $data->whereHas('panel.user', function($query) use ($request){
                    $query->where('id', $request->customer_id);
                });
        }

         // Select the relevant data
        $data = $data->select([
            DB::raw('panel_data.id as id'),
            DB::raw('panel_data.created_at as date'),
            DB::raw('energy as energy'),
            DB::raw('(select rate from carbon_transactions where DATE_FORMAT(panel_data.created_at,"%Y") = DATE_FORMAT(carbon_transactions.sold_on,"%Y")) as rate'),
            DB::raw('(select price from carbon_transactions where DATE_FORMAT(panel_data.created_at,"%Y") = DATE_FORMAT(carbon_transactions.sold_on,"%Y")) as price'),
            DB::raw('(select sold_on from carbon_transactions where DATE_FORMAT(panel_data.created_at,"%Y") = DATE_FORMAT(carbon_transactions.sold_on,"%Y")) as sale_date'),
            DB::raw('(select dispatched_on from carbon_transactions where DATE_FORMAT(panel_data.created_at,"%Y") = DATE_FORMAT(carbon_transactions.sold_on,"%Y")) as receipt_date')
        ])->get();

        foreach ($data as $item) {
            $panelData = PanelData::findOrFail($item->id);
            $item->county = $panelData->panel->user->location->county;
            $item->customer = $panelData->panel->user->name;
        }        

        return response([
            'transactions' =>  $this->getTransactionData($data),
            'customers' =>  User::ofType('customers')->get(['id','name']),
            'counties' => County::all(['id','name']),
        ], 200);
    }
    
    /**
     * Get finance report.
     *
     * @return \Illuminate\Http\JsonResponse
    */
    public function financeReport(Request $request)
    {
        // Return cumulative energy for a particular year
        $data = PanelData::whereYear('created_at', $request->year);
        $energy = $data->sum('energy');

        // Check the carbon Price at a particular year
        $record = ($request->year == date('Y') ? 
            CarbonPrice::select([
                'value as price',
                'credit_rate as rate'
            ])->where('active', 1)->orderBy('created_at', 'desc')->first() 
            : CarbonTransaction::whereYear('sold_on', $request->year)->first(['price','rate']));

        // Get the number of customers, Income and Remission
        $customers = User::ofType('customers')->count();
        $income = $energy/$record->rate*$record->price;
        $remission = $income * 0.85;

        return response ([
            'statement' => [
                'year' => $request->year,
                'energy' => $energy,
                'credits' => $energy/$record->rate,
                'price' => $record->price,
                'income' => $income,
                'customers' => $customers,
                'avgRemission' => $remission/$customers,
                'totalRemission' => $remission,
                'netIncome' => $income - $remission,
            ],
            'chart' => $data->orderBy('created_at', 'asc')->select([
                        DB::raw('sum(energy) as energy'),
                        DB::raw('DATE_FORMAT(panel_data.created_at,"%b") as month'),
                    ])->groupBy('month')->get(),
            'financialYears' => PanelData::orderBy('created_at', 'asc')->select([
                        DB::raw('DATE_FORMAT(panel_data.created_at,"%Y") as year'),
                    ])->groupBy('year')->get(['year']),
        ], 200);
    }
}