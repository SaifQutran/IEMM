<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Stock>
 */
class StockFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $product = \App\Models\Product::inRandomOrder()->first();
        if (!$product) {
            throw new \Exception('No products found in the database');
        }

        $warehouse = \App\Models\Warehouse::where('shop_id', $product->shop_id)->inRandomOrder()->first();
        if (!$warehouse) {
            // Create a warehouse for the shop if none exists
            $warehouse = \App\Models\Warehouse::factory()->create([
                'shop_id' => $product->shop_id
            ]);
        }

        return [
            'quantity' => $this->faker->numberBetween(0, 1000),
            'product_id' => $product->id,
            'warehouse_id' => $warehouse->id,
        ];
    }
}
