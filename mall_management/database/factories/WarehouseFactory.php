<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Warehouse>
 */
class WarehouseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'city_id' => $this->faker->numberBetween(1, 22),
            'location' => $this->faker->address(),
            'name' => $this->faker->company . ' Warehouse',
            'shop_id' => $this->faker->numberBetween(1, 40),
        ];
    }
}
