<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mall extends Model
{
    /** @use HasFactory<\Database\Factories\MallFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'floors',
        'location',
        'owner_id',
        'city_id',
        'X_Coordinates',
        'Y_Coordinates',
    ];

    protected $casts = [
        'floors' => 'integer',
    ];

    // Relationships
    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function city()
    {
        return $this->belongsTo(City::class);
    }

    public function facilities()
    {
        return $this->hasMany(Facility::class);
    }

    public function shops()
    {
        return $this->hasMany(Shop::class);
    }

    public function chats()
    {
        return $this->hasMany(Chat::class);
    }
}
