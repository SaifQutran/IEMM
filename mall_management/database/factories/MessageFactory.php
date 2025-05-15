<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Message>
 */
class MessageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'content' => $this->faker->sentence(),
            'sender_type' => $this->faker->boolean(),
            'sender_id' => $this->faker->numberBetween(1, 50),
            'chat_id' => $this->faker->numberBetween(1, 40),
        ];
    }
}
