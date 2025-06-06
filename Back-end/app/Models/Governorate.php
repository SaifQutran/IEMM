<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Governorate extends Model
{
    /** @use HasFactory<\Database\Factories\GovernorateFactory> */
    use HasFactory;

    protected $fillable = [
        'governorate',
    ];

    // Relationships
    public function cities()
    {
        return $this->hasMany(City::class);
    }
}
