<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'f_name' => $this->faker->firstName(),
            'l_name' => $this->faker->lastName(),
            'email' => $this->faker->unique()->safeEmail(),
            'username' => $this->faker->unique()->userName(),
            'password' => static::$password ??= Hash::make('password'),
            'phone' => $this->faker->numerify('###########'),
            'sex' => $this->faker->boolean(),
            'user_type' => $this->faker->numberBetween(1, 3),
            'birth_date' => $this->faker->date(),
            'shop_id' => null,
            'signed_in' => false,
            'remember_token' => Str::random(10),
            'email_verified_at' => now(),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn(array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
