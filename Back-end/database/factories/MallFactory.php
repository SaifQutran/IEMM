<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Mall>
 */
class MallFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $yemenMalls = [
            'مول صنعاء',
            'مول تعز',
            'مول الحديدة',
            'مول عدن',
            'مول المكلا',
            'مول إب',
            'مول ذمار',
            'مول سيئون',
            'مول المكلا',
            'مول الحوطة'
        ];

        $yemenCities = [
            'صنعاء' => ['lat' => 15.3694, 'lng' => 44.1910],
            'تعز' => ['lat' => 13.5767, 'lng' => 44.0178],
            'الحديدة' => ['lat' => 14.7979, 'lng' => 42.9530],
            'عدن' => ['lat' => 12.7797, 'lng' => 45.0095],
            'المكلا' => ['lat' => 14.5412, 'lng' => 49.1259],
            'إب' => ['lat' => 13.9667, 'lng' => 44.1833],
            'ذمار' => ['lat' => 14.5577, 'lng' => 44.4054],
            'سيئون' => ['lat' => 15.9444, 'lng' => 48.7872],
            'الحوطة' => ['lat' => 13.0597, 'lng' => 44.8821]
        ];

        $city = $this->faker->randomElement(array_keys($yemenCities));
        $coordinates = $yemenCities[$city];

        return [
            'name' => $this->faker->randomElement($yemenMalls),
            'location' => $city,
            'X_Coordinates' => $coordinates['lat'],
            'Y_Coordinates' => $coordinates['lng'],
            'owner_id' => $this->faker->numberBetween(1, 50),
            'city_id' => $this->faker->numberBetween(1, 22),
        ];
    }
}
