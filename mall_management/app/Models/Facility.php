<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Facility extends Model
{
    /** @use HasFactory<\Database\Factories\FacilityFactory> */
    use HasFactory;

    protected $fillable = [
        'mall_id',
        'width',
        'length',
        'rent_price',
        'floor',
        'electricity_id_number',
        'water_id_number',
        'X_Coordinates',
        'Y_Coordinates',
        'status',
    ];

    protected $casts = [
        'width' => 'decimal:2',
        'length' => 'decimal:2',
        'rent_price' => 'decimal:2',
        'floor' => 'integer',
        'status' => 'boolean',
    ];

    // Relationships
    public function mall()
    {
        return $this->belongsTo(Mall::class);
    }

    public function shop()
    {
        return $this->hasOne(Shop::class);
    }
}
