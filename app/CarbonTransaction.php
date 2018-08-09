<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CarbonTransaction extends Model
{
    protected $table = 'carbon_transactions'; 
    protected $fillable = [
		'user_id','price','energy','credits',
        'amount','sold_on','dispatched_on', 'rate',
    ];

    // User that owns a transaction
    public function user() {
    	return $this->belongsTo(User::class);
    } 

    // Entries that belong to a transaction
    public function entries() {
    	return $this->hasMany(PanelData::class);
    } 
}
