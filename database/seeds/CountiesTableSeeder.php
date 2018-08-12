<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class CountiesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::unprepared(database_path('counties.sql'));
    }
}
