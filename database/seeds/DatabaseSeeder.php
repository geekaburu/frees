<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->call(CarbonPricesTableSeeder::class);
        $this->call(CarbonTransactionsTableSeeder::class);
        $this->call(UsersTableSeeder::class);
        $this->call(LocationsTableSeeder::class);
        $this->call(PanelsTableSeeder::class);
        $this->call(PanelControlsTableSeeder::class);
        $this->call(PanelDataTableSeeder::class);
        $this->call(RolesTableSeeder::class);
        $this->call(CountiesTableSeeder::class);
    }
}
