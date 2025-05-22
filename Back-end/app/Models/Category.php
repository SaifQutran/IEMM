<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description'
    ];

    public function shops()
    {
        return $this->belongsToMany(Shop::class, 'shop_categories');
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
