<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Country extends Model
{
    /** @use HasFactory<\Database\Factories\CountryFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
    ];

    // Relationships
    public function products()
    {
        return $this->hasMany(Product::class, 'Manufact_country_id');
    }
}
