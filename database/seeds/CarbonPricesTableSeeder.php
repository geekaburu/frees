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
            'value' => 2400,
			'credit_rate' => 600,
			'active' => 1,
    	]);
        factory(App\CarbonPrice::class, 29)->create();
    }
}
