<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    /** @use HasFactory<\Database\Factories\MessageFactory> */
    use HasFactory;

    protected $fillable = [
        'content',
        'sender_type',
        'sender_id',
        'chat_id',
    ];

    protected $casts = [
        'sender_type' => 'boolean',
    ];

    // Relationships
    public function chat()
    {
        return $this->belongsTo(Chat::class);
    }
}
