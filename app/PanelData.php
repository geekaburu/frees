<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PanelData extends Model
{
    protected $table = 'panel_data';
    protected $fillable = [
	  	'panel_id','angle','voltage','power','energy','runtime',
    ];
    
    // Find the panel that owns a panels data
    public function panel() {
    	return $this->belongsTo(Panel::class);
    } 
}
