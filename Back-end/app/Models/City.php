<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class City extends Model
{
    /** @use HasFactory<\Database\Factories\CityFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'governorate_id',
    ];

    // Relationships
    public function governorate()
    {
        return $this->belongsTo(Governorate::class);
    }

    public function malls()
    {
        return $this->hasMany(Mall::class);
    }

    public function warehouses()
    {
        return $this->hasMany(Warehouse::class);
    }
}
