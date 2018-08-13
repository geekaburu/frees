<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PanelControl extends Model
{
	protected $table = 'panel_controls'; 
    protected $fillable = [
		'user_id','runtime','location','mode'
    ];

    // Find the user that owns a panel control
    public function user() {
    	return $this->belongsTo(User::class);
    } 
}
