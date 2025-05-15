<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Sale>
 */
class SaleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'quantity' => $this->faker->numberBetween(1, 100),
            'unit_price' => $this->faker->randomFloat(2, 1, 1000),
            'product_id' => $this->faker->numberBetween(1, 200),
            'bill_id' => $this->faker->numberBetween(1, 300),
            'is_reversed' => $this->faker->boolean(),
        ];
    }
}
