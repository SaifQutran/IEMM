<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    /** @use HasFactory<\Database\Factories\ReservationFactory> */
    use HasFactory;

    protected $fillable = [
        'date',
        'quantity',
        'user_id',
        'product_id',
        'is_recieved',
        'unit_price',
        'recieved_at',
    ];

    protected $casts = [
        'date' => 'datetime',
        'quantity' => 'integer',
        'is_recieved' => 'boolean',
        'unit_price' => 'decimal:2',
        'recieved_at' => 'datetime',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
