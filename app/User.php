<?php

namespace App;

use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable implements JWTSubject
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password',
        'phone_number', 'avatar', 'role_id', 'location_id'
    ];
    
     /**
     * Scope a query to only include users of a given type.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param mixed $type
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeOfType($query, $type)
    {
        return $query->where('role_id', $type == 'admin' ? 1 : 2);
    }

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    // Get transactions that belong to a user
    public function transactions() {
        return $this->hasMany(CarbonTransaction::class);
    } 

    // Get the location that belongs to a user
    public function location() {
        return $this->belongsTo(Location::class);
    } 

    // Get the panels that belong to a user
    public function panels() {
        return $this->hasMany(Panel::class);
    } 

    // Get a control that belongs to a user
    public function panelControls() {
        return $this->hasOne(PanelControl::class);
    } 

    // Get panel data that belongs to a user
    public function panelData() {
        return $this->hasManyThrough(PanelData::class, Panel::class);
    } 

    // Get role assigned to a user
    public function role() {
        return $this->belongsTo(Role::class);
    } 
}
