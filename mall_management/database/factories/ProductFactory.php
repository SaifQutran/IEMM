<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->word(),
            'description' => $this->faker->sentence(),
            'price' => $this->faker->randomFloat(2, 1, 1000),
            'category' => $this->faker->word(),
            'barcode' => $this->faker->ean13(),
            'Manufact_country_id' => $this->faker->numberBetween(1,22),
            'company_id' => $this->faker->numberBetween(1, 50),
            'shop_id' => $this->faker->numberBetween(1, 40),
            'is_showed_online' => $this->faker->boolean(),
        ];
    }
}
