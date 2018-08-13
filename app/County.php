<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class County extends Model
{
    use \Staudenmeir\EloquentHasManyDeep\HasRelationships;

    /**
    * The attributes that should be mutated to dates.
    *
    * @var array
    */
    protected $table    = 'counties';    
    protected $fillable = ['name'];

    /**
     * Get the users that belong to a county.
    */
    public function users()
    {
        return $this->hasManyThrough(User::class, Location::class);
    }

    /**
     * Get the locations that belong to a county.
    */
    public function locations()
    {
        return $this->hasMany(Location::class);
    }

    /**
     * Return all panel data from a particular county.
    */
    public function panelData()
    {
        return $this->hasManyDeep(PanelData::class, [Location::class, User::class, Panel::class]); 
    }
}
