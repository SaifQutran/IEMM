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
        $bill = \App\Models\Bill::inRandomOrder()->first();
        if (!$bill) {
            throw new \Exception('No bills found in the database');
        }

        $product = \App\Models\Product::where('shop_id', $bill->shop_id)->inRandomOrder()->first();
        if (!$product) {
            // Create a product for the shop if none exists
            $product = \App\Models\Product::factory()->create([
                'shop_id' => $bill->shop_id
            ]);
        }

        return [
            'quantity' => $this->faker->numberBetween(1, 100),
            'unit_price' => $product->price,
            'product_id' => $product->id,
            'bill_id' => $bill->id,
            'is_reserved' => $this->faker->boolean(),
        ];
    }
}
