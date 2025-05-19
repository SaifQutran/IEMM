<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'f_name',
        'l_name',
        'email',
        'username',
        'password',
        'phone',
        'sex',
        'user_type',
        'birth_date',
        'shop_id',
        'signed_in',
        'remember_token',
        'email_verified_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'sex' => 'boolean',
            'signed_in' => 'boolean',
            'birth_date' => 'date',
        ];
    }

    // Relationships
    public function shop()
    {
        return $this->belongsTo(Shop::class);
    }

    public function malls()
    {
        return $this->hasMany(Mall::class, 'owner_id');
    }

    public function bills()
    {
        return $this->hasMany(Bill::class);
    }

    public function customerBills()
    {
        return $this->hasMany(Bill::class, 'customer_id');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }
}
