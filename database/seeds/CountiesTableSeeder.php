<?php

use Illuminate\Database\Seeder;
use Illuminate\Filesystem\Filesystem;

class CountiesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
    	DB::unprepared(File::get(database_path('counties.sql')));
    }
}
