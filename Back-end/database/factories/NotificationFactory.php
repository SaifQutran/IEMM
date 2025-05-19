<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Notification>
 */
class NotificationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => $this->faker->numberBetween(1, 50),
            'product_id' => $this->faker->numberBetween(1, 200),
            'is_answered' => $this->faker->boolean(),
            'read_at' => $this->faker->dateTime(),
            'recieved_at' => $this->faker->dateTime(),
        ];
    }
}
