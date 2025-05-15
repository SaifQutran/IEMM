<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Bill>
 */
class BillFactory extends Factory
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
            'shop_id' => $this->faker->numberBetween(1, 40),
            'user_id' => $this->faker->numberBetween(1, 50),
            'customer_id' => $this->faker->numberBetween(1, 50),
        ];
    }
}
