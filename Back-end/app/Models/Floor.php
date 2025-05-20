<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Floor extends Model
{
    /** @use HasFactory<\Database\Factories\FloorFactory> */
    use HasFactory;

    protected $fillable = [
        'length',
        'width',
        'floor_number',
        'mall_id'
    ];

    protected $casts = [
        'length' => 'decimal:2',
        'width' => 'decimal:2',
        'floor_number' => 'integer'
    ];

    // Relationships
    public function mall()
    {
        return $this->belongsTo(Mall::class);
    }

    public function facilities()
    {
        return $this->hasMany(Facility::class);
    }
} 