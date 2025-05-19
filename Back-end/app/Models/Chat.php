<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Chat extends Model
{
    /** @use HasFactory<\Database\Factories\ChatFactory> */
    use HasFactory;

    protected $fillable = [
        'shop_id',
        'mall_id',
    ];

    // Relationships
    public function shop()
    {
        return $this->belongsTo(Shop::class);
    }

    public function mall()
    {
        return $this->belongsTo(Mall::class);
    }

    public function messages()
    {
        return $this->hasMany(Message::class);
    }
}
