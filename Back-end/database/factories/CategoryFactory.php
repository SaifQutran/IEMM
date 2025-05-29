<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */



class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->unique()->randomElement([
            'إلكترونيات',
            'ملابس',
            'أثاث',
            'ألعاب',
            'أدوات منزلية',
            'كتب',
            'منتجات رياضية',
            'مجوهرات',
            'أغذية',
            'مستلزمات طبية',
            'هواتف ذكية',
            'أجهزة كمبيوتر',
            'عطور',
            'مستحضرات تجميل',
            'معدات صناعية',
            'معدات زراعية',
            'قرطاسية',
            'خدمات رقمية',
            'برمجيات',
            'مستلزمات مكتبية',
            'ملابس أطفال',
            'أحذية',
            'إكسسوارات سيارات',
            'معدات تصوير',
        ]);

        return [
            'name' => $name,
            'description' => 'تصنيف يحتوي على منتجات ' . $name . ' متنوعة.',
        ];
    }
}
