<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Shop>
 */
class ShopFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $facility = \App\Models\Facility::inRandomOrder()->first();

        $shopTypes = [
            'محل قات',
            'محل ملابس يمنية',
            'محل عسل',
            'محل مجوهرات فضية',
            'محل بخور',
            'محل قهوة يمنية',
            'محل سجاد يمني',
            'محل خناجر',
            'محل عطور يمنية',
            'محل حلويات يمنية',
            'محل أقمشة',
            'محل مستلزمات منزلية',
            'محل إلكترونيات',
            'محل أحذية يمنية',
            'محل هدايا'
        ];

        $yemeniNames = [
            'اليمن السعيد',
            'صنعاء القديمة',
            'تعز الأصيلة',
            'عدن الجميلة',
            'المكلا العريقة',
            'إب الخضراء',
            'ذمار الأصيلة',
            'سيئون العريقة',
            'الحوطة الجميلة'
        ];

        $workTimes = [
            '09:00 - 22:00',
            '10:00 - 23:00',
            '08:00 - 21:00',
            '09:30 - 22:30',
            '10:30 - 23:30'
        ];

        return [
            'name' => $this->faker->randomElement($shopTypes) . ' ' . $this->faker->randomElement($yemeniNames),
            'work_times' => $this->faker->randomElement($workTimes),
            'state' => $this->faker->boolean(80), // 80% chance of being open
            'facility_id' => $facility->id,
            'rent_began_At' => $this->faker->dateTimeBetween('-2 years', 'now'),
            'mall_id' => $facility->mall_id,
            'owner_id' => $this->faker->numberBetween(1, 50),
        ];
    }
}
