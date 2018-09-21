<?php

use Faker\Generator as Faker;
use Illuminate\Database\Seeder;
use App\Http\Traits\LocationTrait;

class LocationsTableSeeder extends Seeder
{
    use LocationTrait;
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(Faker $faker)
    {
        foreach (App\User::all() as $user) {
            // Get coordinates
            $coordinates = [
                'latitude' => $faker->latitude($min = -1, $max = 2),
                'longitude' => $faker->longitude($min = 34, $max = 38),
            ];

            // Get the county represented by the coordinates
            $county = App\County::where('name', $this->getCounty($coordinates))->first();

            // Create a new location
            App\Location::create(array_merge([
                'county_id'	=> $county ? $county->id : 0,
            ], $coordinates));
        }
    }
}