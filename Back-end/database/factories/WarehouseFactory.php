<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Warehouse>
 */
class WarehouseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $cities = [
            'الرياض' => 'المنطقة الصناعية',
            'جدة' => 'المنطقة الصناعية',
            'الدمام' => 'المنطقة الصناعية',
            'مكة المكرمة' => 'المنطقة الصناعية',
            'المدينة المنورة' => 'المنطقة الصناعية'
        ];

        $city = $this->faker->randomElement(array_keys($cities));
        $warehouseTypes = [
            'مستودع رئيسي',
            'مستودع فرعي',
            'مستودع توزيع',
            'مستودع مؤقت',
            'مستودع مركزي'
        ];

        return [
            'city_id' => $this->faker->numberBetween(1, 22),
            'location' => $city . ', ' . $cities[$city] . ', ' . $this->faker->buildingNumber(),
            'name' => $this->faker->randomElement($warehouseTypes) . ' ' . $this->faker->company,
            'shop_id' => $this->faker->numberBetween(1, 40),
        ];
    }
}
