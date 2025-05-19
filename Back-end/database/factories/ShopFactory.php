<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Shop>
 */
class ShopFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->company . ' Shop',
            'work_times' => $this->faker->text(30),
            'state' => $this->faker->boolean(),
            'facility_id' => $this->faker->unique()->numberBetween(1, 40),
            'rent_began_At' => $this->faker->date(),
            'mall_id' => $this->faker->numberBetween(1, 5),
            'owner_id' => $this->faker->numberBetween(1, 50),
        ];
    }
}
