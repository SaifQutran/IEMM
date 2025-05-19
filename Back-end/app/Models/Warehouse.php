<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Warehouse extends Model
{
    /** @use HasFactory<\Database\Factories\WarehouseFactory> */
    use HasFactory;

    protected $fillable = [
        'city_id',
        'location',
        'name',
        'shop_id',
        'is_primary'
    ];

    // Relationships
    public function city()
    {
        return $this->belongsTo(City::class);
    }

    public function shop()
    {
        return $this->belongsTo(Shop::class);
    }

    public function stocks()
    {
        return $this->hasMany(Stock::class, 'wearhouse_id');
    }
}
