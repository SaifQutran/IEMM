<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Reservation>
 */
class ReservationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $user = \App\Models\User::inRandomOrder()->first();
        if (!$user) {
            throw new \Exception('No users found in the database');
        }

        if (!$user->shop_id) {
            // Create a shop for the user if none exists
            $shop = \App\Models\Shop::factory()->create();
            $user->update(['shop_id' => $shop->id]);
        }

        $product = \App\Models\Product::where('shop_id', $user->shop_id)->inRandomOrder()->first();
        if (!$product) {
            // Create a product for the shop if none exists
            $product = \App\Models\Product::factory()->create([
                'shop_id' => $user->shop_id
            ]);
        }

        return [
            'date' => $this->faker->dateTime(),
            'quantity' => $this->faker->numberBetween(1, 10),
            'user_id' => $user->id,
            'product_id' => $product->id,
            'is_recieved' => $this->faker->boolean(),
            'unit_price' => $product->price,
            'recieved_at' => $this->faker->dateTime(),
        ];
    }
}
