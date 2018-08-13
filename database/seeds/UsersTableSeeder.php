<?php

use Illuminate\Database\Seeder;
use Faker\Generator as Faker;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(Faker $faker)
    {
    	App\User::create([
            'role_id' => 1,
            'location_id' => 1,
            'name' => 'Green Invest',
            'email' => 'greeninvest@mail.com',
            'phone_number' => '700000000',
            'avatar' => 'admin.jpg',
            'password' => Hash::make('secret'),
        ]);

        App\User::create([
            'role_id' => 2,
            'location_id' => 2,
            'name' => 'Alvin Kaburu',
            'email' => 'geekaburu@amprest.co.ke',
            'phone_number' => '727467877',
            'avatar' => 'alvin_kaburu.png',
            'password' => Hash::make('secret'),
        ]);

        // Seed Users table data
        for ($i=3; $i<=5; $i++){
            App\User::create([
                'role_id' => 2,
                'location_id' => $i,
                'name' => $faker->name,
                'email' => $faker->safeEmail,
                'phone_number' => $faker->phoneNumber,
                'avatar' => $faker->randomElement($array = ['one.jpg','two.jpg','three.jpg','four.jpg','five.jpg','six.jpg']),
                'password' => Hash::make('secret'),
            ]);
        }

        // factory(App\User::class, 38)->create();
    }
}
