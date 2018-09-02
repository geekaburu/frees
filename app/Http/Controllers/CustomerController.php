<?php

namespace App\Http\Controllers;

use DB;
use Auth;
use Validator;
use Hash;
use Carbon\Carbon;
use Illuminate\Http\Request;

use App\Panel;
use App\CarbonPrice;
use App\CarbonTransaction;

class CustomerController extends Controller
{
    /**
     * Get dashboard data for a certain customer.
     *
     * @return \Illuminate\Http\JsonResponse
    */
    public function getDashboardData(Request $request)
    {
        $user = Auth::user();

        // Get the current carbon cost
        $record = CarbonPrice::where('active', 1)->orderBy('created_at', 'desc')->first();
        $creditRate = $record->credit_rate;
        $carbonPrice = $record->value;

        $cardData = $user->panelData()
            ->whereYear('panel_data.created_at', date('Y'))
            ->orderBy('panel_data.created_at', 'asc')
            ->select(
                DB::raw(count($user->panels()->get()).' as panels'), 
                DB::raw('sum(energy) as energy'), 
                DB::raw('sum(energy)/'.$creditRate.' as credits'),
                DB::raw('sum(energy)/'.$creditRate.'*'.$carbonPrice.' as amount'),
                DB::raw('DATE_FORMAT(panel_data.created_at,"%Y") as year') 
            )->groupBy('year')->first();

        return response()->json([
            'cards' => $cardData,
            'chart' => $this->generateChartData($user->panelData(), 'live'),
            'lastDate' => Carbon::now()->endOfYear()->format('d/m/Y H:i:s'),
            'rates' => $record,
        ]);
    }
	/**
     * Get panel data for a certain customer.
     *
     * @return \Illuminate\Http\JsonResponse
    */
    public function getPanelData(Request $request)
    {
    	$user = Auth::user();

    	// Get the current carbon cost
    	$record = CarbonPrice::where('active', 1)->orderBy('created_at', 'desc')->first();
    	$creditRate = $record->credit_rate;
    	$carbonPrice = $record->value;

        // location Data
        $locationData = $user;
        $locationData->energy = $user->panelData()->whereYear('panel_data.created_at', date('Y'))->sum('energy');
        $locationData->panels = $user->panels()->count();
        $locationData->location = $user->location;

    	// Find the user location
    	$location = $user->location()->first();

    	// Get the panel energy data for the current month
    	$panelData = $user->panelData()
	    	->whereYear('panel_data.created_at', date('Y'))
            ->whereMonth('panel_data.created_at', date('m'))
	    	->select(
	            DB::raw('panel_id'),
	            DB::raw('sum(energy) as energy'), 
	            DB::raw('sum(energy)/'.$creditRate.' as credits'),
	            DB::raw('sum(energy)/'.$creditRate.'*'.$carbonPrice.' as amount') 
	    	)->groupBy('panel_id')->get();
		
	    // Return a json response with the data
    	return response()->json([
			'locationData' => $locationData,
			'controls' => $user->panelControls()->first(['mode', 'runtime', 'angle']),
			'conditions' => $user->panelData()->orderBy('panel_data.created_at', 'desc')->first(['panel_data.voltage','panel_data.power','panel_data.energy']),
			'chart' => [
				'data' => $this->generateChartData($user->panelData(), $request->chart_filter),
			],
			'panels' => [
				'data' => $panelData,
			],
			'market' => [
				'price' => $carbonPrice,
				'credit_rate' => $creditRate,
			]
    	]);		
    }

    /**
     * Update panel data for a certain customer.
     *
     * @return \Illuminate\Http\JsonResponse
    */
    public function updateControls(Request $request){
    	if(Auth::user()->panelControls()->update($request->all())){
    		return response([
    			'status' => 'success',
				'message'=>'The panel controls have been updated succesfully.'
    		], 200);
    	}
    }

    /**
     * Get panel analysis data.
     *
     * @return \Illuminate\Http\JsonResponse
    */
    public function panelAnalysis(Request $request)
    {
    	$user = Auth::user();

    	// Get the data requested for
        $data = (is_numeric($request->panel) ? $user->panelData()->where('panel_id', $request->panel) : $user->panelData());

        // Filter panel data by duration
        if($request->chart_filter == 'today' || $request->chart_filter == 'live') $data =  $data->whereDate('panel_data.created_at', Carbon::today());
        if($request->chart_filter == 'week')  $data =  $data->whereBetween('panel_data.created_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()]);
        if($request->chart_filter == 'month') $data =  $data->whereMonth('panel_data.created_at', date('m'));
        if($request->chart_filter == '3month')$data =  $data->whereMonth('panel_data.created_at', '>=', Carbon::now()->subMonth(3)->month);
        if($request->chart_filter == 'year')  $data =  $data->whereYear('panel_data.created_at', date('Y'));

        // Get the current carbon cost
        $record = CarbonPrice::where('active', 1)->orderBy('created_at', 'desc')->first();
        $carbonPrice = $record->value;
        $energy = $data->sum('panel_data.energy');
        $credits = $energy/($record->credit_rate);

        $stats = [
            'voltage' => number_format((float) $data->avg('panel_data.voltage') ,2,'.',''),
            'power' => number_format((float) $data->avg('panel_data.power') ,2,'.',''),
            'energy' => number_format((float) $energy,2,'.',''),
            'credits' => number_format((float) $credits,2,'.',''),
            'amount' => number_format((float) $credits * $carbonPrice,2,'.',''),
        ];

    	// Return response data
    	return response()->json([
    		'panels'=>$user->panels()->get(['id']),
    		'chart'=>[
    			'data' => $this->generateChartData($data, $request->chart_filter),
            ],
            'activePanel' => is_numeric($request->panel) ? Panel::findOrFail($request->panel) : $request->panel,
    		'stats' => $stats,
    	]);
    }


    /**
     * Get panel analysis data.
     *
     * @return \Illuminate\Http\JsonResponse
    */
    public function carbonTransactions(Request $request)
    {
        // Get transactions from previous years
        $data = Auth::user()->panelData()->select(
            DB::raw('panel_data.created_at as date'),
            DB::raw('sum(energy) as energy'),
            DB::raw('DATE_FORMAT(panel_data.created_at,"%Y") as year'),
            DB::raw('(select rate from carbon_transactions where DATE_FORMAT(panel_data.created_at,"%Y") = DATE_FORMAT(carbon_transactions.sold_on,"%Y")) as rate'),
            DB::raw('(select price from carbon_transactions where DATE_FORMAT(panel_data.created_at,"%Y") = DATE_FORMAT(carbon_transactions.sold_on,"%Y")) as price'),
            DB::raw('(select sold_on from carbon_transactions where DATE_FORMAT(panel_data.created_at,"%Y") = DATE_FORMAT(carbon_transactions.sold_on,"%Y")) as sale_date'),
            DB::raw('(select dispatched_on from carbon_transactions where DATE_FORMAT(panel_data.created_at,"%Y") = DATE_FORMAT(carbon_transactions.sold_on,"%Y")) as receipt_date')
        )->groupBy('year')->get();

        return response()->json($this->getTransactionData($data, true));
    }

    /**
     * Get energy reports.
     *
     * @return \Illuminate\Http\JsonResponse
    */
    public function energyReports(Request $request)
    {
        $user = Auth::user();
        $data = $user->panelData();
        $startDate = $request->start_date ? Carbon::createFromFormat('d/m/Y', $request->start_date)->format('Y-m-d') : '';
        $endDate = $request->end_date ? Carbon::createFromFormat('d/m/Y', $request->end_date) : Carbon::now();

        // Filter by panel ID
        if(is_numeric($request->panel_id)) $data = $data->where('panel_id', $request->panel_id);

        // Filter by date
        $data->whereBetween('panel_data.created_at', [$startDate, $endDate->addDays(1)->format('Y-m-d')]);

        // Select the relevant data
        $data = $data->select([
            DB::raw('panel_data.created_at as date'),
            DB::raw('panel_id'),
            DB::raw('energy'),
            DB::raw('(select rate from carbon_transactions where DATE_FORMAT(panel_data.created_at,"%Y") = DATE_FORMAT(carbon_transactions.sold_on,"%Y")) as rate'),
            DB::raw('(select price from carbon_transactions where DATE_FORMAT(panel_data.created_at,"%Y") = DATE_FORMAT(carbon_transactions.sold_on,"%Y")) as price'),
            DB::raw('(select sold_on from carbon_transactions where DATE_FORMAT(panel_data.created_at,"%Y") = DATE_FORMAT(carbon_transactions.sold_on,"%Y")) as sale_date'),
            DB::raw('(select dispatched_on from carbon_transactions where DATE_FORMAT(panel_data.created_at,"%Y") = DATE_FORMAT(carbon_transactions.sold_on,"%Y")) as receipt_date')
        ])->get();

        return response()->json([
            'transactions' =>  $this->getTransactionData($data),
            'panels' =>  $user->panels()->get(),
        ]);
    }

    public function updateUserProfile(Request $request)
    {
        // Get current logged in user
        $user = Auth::user();

        // Validate input
        $validator = Validator::make(array_merge($request->all(),['phone_number'=> '254'.substr($request->phone_number, -9)]), [
            'name' => 'required|max:255',
            'email' => 'required|email|min:5|unique:users,email,'.$user->id.',id',
            'phone_number' => ['required','unique:users,phone_number,'.$user->id.',id','regex:/^(07|7|[+]2547|2547)[0-9]+$/','size:12'],
            'town' => 'required',
            'curr_password' => 'nullable|hash:' .$user->password,
            'password' => 'nullable|confirmed|different:curr_password',
        ], ['size'    => 'The phone number format or type is invalid.',]);

         if ($validator->fails()) {
            return response(['errors'=>$validator->errors()->all()], 500);
        }

        // Upload the profile image
        if($request->avatar){ 
            $image = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $request->avatar));
            $avatar = str_replace(' ', '_', strtolower(Auth::user()->name)).'.png';
            file_put_contents(public_path('storage/avatars/'.$avatar), $image);
        } else{
            $avatar = $user->avatar;
        }

        // encript password
        $password = $request->password ? Hash::make($request->password) : $user->password;

        // update or create a new contact
        $user->update(array_merge($request->all(),[
            'password' => $password,
            'avatar' => $avatar,
            'phone_number' => '254'.substr($request->phone_number, -9),
        ]));
    
        return response([
            'state' => 'success',
            'message'=>'Your profile has been updated successfully.',
            'user'=> Auth::user(),
        ], 200);
    }
}
