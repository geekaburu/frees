<?php

use Illuminate\Database\Seeder;

class CarbonTransactionsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
    	App\CarbonTransaction::insert([[
            'rate' => 900,
            'price' => 2300,
            'energy' => 1468800,
            'credits' => 1632,
            'amount' => 1305600,
            'sold_on' => '2017-12-29 00:00:00',
            'dispatched_on' => '2017-12-30 01:05:56',
    	],[
            'rate' => 1000,
            'price' => 2000,
            'energy' => 1468800,
            'credits' => 1632,
            'amount' => 1305600,
            'sold_on' => '2016-12-29 00:00:00',
            'dispatched_on' => '2016-12-30 01:05:56',
        ]]);
        //factory(App\CarbonTransaction::class, 100)->create();
    }
}
