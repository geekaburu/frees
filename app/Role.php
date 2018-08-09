<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    protected $table = 'roles'; 
    protected $fillable = ['name', 'display_name'];

    // Get the users with a particular role 
    public function users() {
        return $this->hasMany(User::class);
    } 
}
