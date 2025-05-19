<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MoneyLog extends Model
{
    /** @use HasFactory<\Database\Factories\MoneyLogFactory> */
    use HasFactory;

    protected $fillable = [
        'amount',
        'paid_amount',
        'type_id',
        'date',
        'shop_id',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'type_id' => 'integer',
        'date' => 'date',
    ];

    // Relationships
    public function shop()
    {
        return $this->belongsTo(Shop::class);
    }
}
