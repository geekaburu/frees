<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    protected $table = 'locations';
    protected $appends = ['county']; 
    protected $fillable = [
		'county_id','longitude','latitude'
    ];

    public function getCountyAttribute(){
        return $this->county()->first()->name;
    }

    // Find the user that owns a location
    public function user() {
    	return $this->hasOne(Location::class);
    } 

    // Find the user that owns a location
    public function county() {
    	return $this->belongsTo(County::class);
    } 
}
