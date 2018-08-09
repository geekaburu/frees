<?php

use Illuminate\Database\Seeder;

class PanelsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(App\Panel::class, 300)->create();
    }
}
