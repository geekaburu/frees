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
        App\Role::create(['name' => 'solar_company', 'display_name' => 'Solar Company', 'commission_rate' => 1.0]);
        App\Role::create(['name' => 'customer', 'display_name' => 'Customer', 'commission_rate' => 0.15]);
    }
}
