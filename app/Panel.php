<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Panel extends Model
{
    protected $table = 'panels'; 
    protected $fillable = [
		'user_id','voltage','power',
    ];

    // Find the user that owns a panel
    public function user() {
    	return $this->belongsTo(User::class);
    } 

    // Find data that belongs to a panel
    public function data() {
    	return $this->hasMany(PanelData::class);
    } 
}
