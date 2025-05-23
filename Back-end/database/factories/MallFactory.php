<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Mall>
 */
class MallFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' =>  ' مول ' . $this->faker->company ,
            // 'floors' => $this->faker->numberBetween(1, 10),
            'location' => $this->faker->address(),
            'X_Coordinates' => $this->faker->latitude(),
            'Y_Coordinates' => $this->faker->longitude(),
            'owner_id' => $this->faker->numberBetween(1, 50) ,
            'city_id' => $this->faker->numberBetween(1,22),
        ];
    }
}
