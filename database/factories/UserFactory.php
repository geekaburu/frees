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
        'user_id' => $faker->numberBetween($min = 2, $max = 10),
        'voltage' => $faker->randomElement($array = [240,270,300]),
        'power' => $faker->randomElement($array = [240,270,300]),
    ];
});
   
// Generate panel data
$factory->define(App\PanelData::class, function (Faker $faker) {
    return [
        'panel_id' => $faker->numberBetween($min = 1, $max = 300), 
        'angle' => $faker->numberBetween($min = 0, $max = 180), 
        'intensity' => $faker->numberBetween($min = 20, $max = 80), 
        'voltage' => $faker->numberBetween($min = 200, $max = 300), 
        'temperature' => $faker->numberBetween($min = 15, $max = 50), 
        'humidity' => $faker->numberBetween($min = 20, $max = 50), 
        'power' => $faker->numberBetween($min = 200, $max = 300), 
        'energy' => number_format((float) mt_rand() / mt_getrandmax(),2,'.','') + 0.9, 
        'runtime' => $faker->numberBetween($min = 10, $max = 20), 
        'created_at' => $faker->dateTimeBetween($startDate = '2017-12-01 00:00:00', $endDate = 'now', $timezone = null),
    ];
});

// Generate carbon prices
$factory->define(App\CarbonPrice::class, function (Faker $faker) {
    return [
        'value' => $faker->numberBetween($min = 800, $min = 1200),
        'credit_rate' => $faker->numberBetween($min = 800, $min = 1200),
        'active' => false,
    ];
});