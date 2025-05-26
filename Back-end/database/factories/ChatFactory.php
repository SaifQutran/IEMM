<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Shop;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Chat>
 */
class ChatFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $shop = Shop::inRandomOrder()->first(); // نجيب محل عشوائي من قاعدة البيانات

        return [
            'shop_id' => $shop->id,
            'mall_id' => $shop->mall_id, // نستخدم نفس المول المرتبط بالمحل
        ];
    }}
