<?php

use Illuminate\Database\Seeder;

class PanelDataTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(App\PanelData::class, 500)->create();
    }
}
