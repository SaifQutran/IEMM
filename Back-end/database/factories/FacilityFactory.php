<?php

namespace Database\Factories;

use App\Models\Facility;
use App\Models\Floor;
use App\Models\Mall;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Facility>
 */
class FacilityFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Facility::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $mall = Mall::factory()->create();
        $floor = Floor::factory()->create(['mall_id' => $mall->id]);

        return [
            'mall_id' => $mall->id,
            'floor_id' => $floor->id,
            'width' => $this->faker->randomFloat(2, 10, 50),
            'length' => $this->faker->randomFloat(2, 10, 50),
            'rent_price' => $this->faker->randomFloat(2, 1000, 5000),
            'electricity_id_number' => $this->faker->unique()->numerify('ELE####'),
            'water_id_number' => $this->faker->unique()->numerify('WAT####'),
            'X_Coordinates' => $this->faker->randomFloat(6, 0, 100),
            'Y_Coordinates' => $this->faker->randomFloat(6, 0, 100),
            'status' => $this->faker->boolean(),
        ];
    }
}
