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
        $yemeniProducts = [
            'قهوة يمنية' => 'مشروبات',
            'قات' => 'مواد غذائية',
            'عسل سدر' => 'مواد غذائية',
            'خنجر يمني' => 'تحف',
            'سجاد يمني' => 'أثاث',
            'بخور يمني' => 'عطور',
            'عطر يمني' => 'عطور',
            'ثوب يمني' => 'ملابس',
            'شال يمني' => 'ملابس',
            'حلويات يمنية' => 'حلويات',
            'شاي يمني' => 'مشروبات',
            'تمور يمنية' => 'مواد غذائية',
            'عصير يمني' => 'مشروبات',
            'مجوهرات فضية' => 'مجوهرات',
            'أقمشة يمنية' => 'أقمشة'
        ];

        $product = $this->faker->randomElement(array_keys($yemeniProducts));
        $category = $yemeniProducts[$product];

        return [
            'name' => $product,
            'description' => 'منتج يمني أصيل ' . $this->faker->text(),
            'price' => $this->faker->randomFloat(2, 1, 1000),
            'category' => $category,
            'barcode' => $this->faker->ean13(),
            'Manufact_country_id' => 1, // Yemen
            'company_id' => $this->faker->numberBetween(1, 50),
            'shop_id' => $this->faker->numberBetween(1, 40),
            'is_showed_online' => $this->faker->boolean(),
        ];
    }
}
