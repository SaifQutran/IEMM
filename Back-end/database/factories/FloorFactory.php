<?php

namespace Database\Factories;

use App\Models\Floor;
use App\Models\Mall;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Floor>
 */
class FloorFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Floor::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'length' => $this->faker->randomFloat(2, 50, 200),
            'width' => $this->faker->randomFloat(2, 50, 200),
            'floor_number' => $this->faker->numberBetween(1, 10),
            'mall_id' => Mall::factory()
        ];
    }
} 