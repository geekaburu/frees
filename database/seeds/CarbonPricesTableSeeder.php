<?php

use Illuminate\Database\Seeder;

class CarbonPricesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
    	// Create an active price
    	App\CarbonPrice::create([
            'value' => 1200,
			'credit_rate' => 900,
			'active' => 1,
    	]);
        factory(App\CarbonPrice::class, 29)->create();
    }
}
