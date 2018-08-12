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
    	$path = env('DB_CONNECTION') == 'pgsql' ? database_path('counties_postgress.sql') : database_path('counties.sql');
    	DB::unprepared(File::get($path));
    }
}
