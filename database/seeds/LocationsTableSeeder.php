<?php

use Illuminate\Database\Seeder;
use Faker\Generator as Faker;

class LocationsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(Faker $faker)
    {
        $i = 1;
        foreach (App\User::all() as $user) {
            App\Location::create([
                'id' => $i,
                'county_id'	=> $faker->numberBetween($min = 1, $max = 48),
                'longitude' => $faker->latitude($min = 34, $max = 40.75),
                'latitude' 	=> $faker->latitude($min = -4.5, $max = 5),
                'town'      => 'Random',
            ]);
            $i++;
        }
    }
}