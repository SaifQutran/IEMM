<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Bill>
 */
class BillFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $shop = \App\Models\Shop::inRandomOrder()->first();
        if (!$shop) {
            throw new \Exception('No shops found in the database');
        }

        $user = \App\Models\User::where('shop_id', $shop->id)->inRandomOrder()->first();
        if (!$user) {
            $user = \App\Models\User::factory()->create(['shop_id' => $shop->id]);
        }

        $customer = \App\Models\User::where('user_type', 3)->inRandomOrder()->first();
        if (!$customer) {
            $customer = \App\Models\User::factory()->create(['user_type' => 3]);
        }

        return [
            'date' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'shop_id' => $shop->id,
            'user_id' => $user->id,
            'customer_id' => $customer->id,
        ];
    }
}
