<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shop extends Model
{
    /** @use HasFactory<\Database\Factories\ShopFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'work_times',
        'state',
        'facility_id',
        'rent_began_At',
        'mall_id',
        'owner_id',
    ];

    protected $casts = [
        'state' => 'boolean',
        'rent_began_At' => 'date',
    ];

    // Relationships
    public function facility()
    {
        return $this->belongsTo(Facility::class);
    }

    public function mall()
    {
        return $this->belongsTo(Mall::class);
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function moneyLogs()
    {
        return $this->hasMany(MoneyLog::class);
    }

    public function bills()
    {
        return $this->hasMany(Bill::class);
    }

    public function warehouses()
    {
        return $this->hasMany(Warehouse::class);
    }

    public function chats()
    {
        return $this->hasMany(Chat::class);
    }
}
