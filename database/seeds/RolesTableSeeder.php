<?php

use Illuminate\Database\Seeder;

class RolesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        App\Role::create(['id'=>1, 'name' => 'solar_company', 'display_name' => 'Solar Company']);
        App\Role::create(['id'=>2,'name' => 'customer', 'display_name' => 'Customer']);
    }
}
