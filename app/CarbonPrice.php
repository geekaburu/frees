<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CarbonPrice extends Model
{
    protected $table = 'carbon_prices'; 
    protected $fillable = ['value','credit_rate','active'];
}
