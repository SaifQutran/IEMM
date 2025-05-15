<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Facility>
 */
class FacilityFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'mall_id' => $this->faker->numberBetween(1, 5),
            'width' => $this->faker->randomFloat(2, 10, 100),
            'length' => $this->faker->randomFloat(2, 10, 100),
            'rent_price' => $this->faker->randomFloat(2, 1000, 10000),
            'floor' => $this->faker->numberBetween(1, 10),
            'electricity_id_number' => $this->faker->uuid(),
            'water_id_number' => $this->faker->uuid(),
            'X_Coordinates' => $this->faker->latitude(),
            'Y_Coordinates' => $this->faker->longitude(),
            'status' => $this->faker->boolean(),
        ];
    }
}
