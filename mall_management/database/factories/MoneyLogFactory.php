<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MoneyLog>
 */
class MoneyLogFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'amount' => $this->faker->randomFloat(2, 10, 10000),
            'type_id' => $this->faker->numberBetween(1, 5),
            'date' => $this->faker->date(),
            'shop_id' => $this->faker->numberBetween(1, 40),
        ];
    }
}
