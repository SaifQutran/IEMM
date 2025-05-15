<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Reservation>
 */
class ReservationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'date' => $this->faker->dateTime(),
            'quantity' => $this->faker->numberBetween(1, 10),
            'user_id' => $this->faker->numberBetween(1, 50),
            'product_id' => $this->faker->numberBetween(1, 200),
            'is_recieved' => $this->faker->boolean(),
            'unit_price' => $this->faker->randomFloat(2, 1, 1000),
            'recieved_at' => $this->faker->dateTime(),
        ];
    }
}
