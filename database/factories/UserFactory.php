<?php

use Faker\Generator as Faker;

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| This directory should contain each of the model factory definitions for
| your application. Factories provide a convenient way to generate new
| model instances for testing / seeding your application's database.
|
*/

// Generate panel information
$factory->define(App\Panel::class, function (Faker $faker) {
    return [
        'user_id' => $faker->numberBetween($min = 2, $max = 5),
        'voltage' => $faker->randomElement($array = [270,300]),
        'power' => $faker->randomElement($array = [270,300]),
    ];
});
   
// Generate panel data
$factory->define(App\PanelData::class, function (Faker $faker) {
    return [
        'panel_id' => $faker->numberBetween($min = 1, $max = 20), 
        'angle' => $faker->numberBetween($min = 0, $max = 180), 
        'voltage' => $faker->numberBetween($min = 1, $max = 5), 
        'power' => ($faker->numberBetween($min = 1, $max = 12))/10, 
        'energy' => ($faker->numberBetween($min = 1, $min = 200))/10, 
        'runtime' => $faker->numberBetween($min = 10, $max = 20), 
        'created_at' => $faker->dateTimeBetween($startDate = '2018-06-01 00:00:00', $endDate = 'now', $timezone = null),
    ];
});

// Generate carbon prices
$factory->define(App\CarbonPrice::class, function (Faker $faker) {
    return [
        'value' => $faker->numberBetween($min = 2000, $max = 2500),
        'credit_rate' => $faker->numberBetween($min = 900, $max = 1000),
        'active' => false,
        'created_at' => $faker->dateTimeBetween($startDate = '2018-01-01 00:00:00', $endDate = 'now', $timezone = null),
    ];
});