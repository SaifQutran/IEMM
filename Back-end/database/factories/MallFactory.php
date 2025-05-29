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
        $yemenCities = [
            'أمانة العاصمة' => ['lat' => 15.3694, 'lng' => 44.1910],
            'همدان' => ['lat' => 15.4167, 'lng' => 44.2000],
            'خور مكسر' => ['lat' => 12.7797, 'lng' => 45.0095],
            'كريتر' => ['lat' => 12.7797, 'lng' => 45.0095],
            'الحوبان' => ['lat' => 13.5767, 'lng' => 44.0178],
            'التعزية' => ['lat' => 13.5767, 'lng' => 44.0178],
            'الحديدة المدينة' => ['lat' => 14.7979, 'lng' => 42.9530],
            'الزيدية' => ['lat' => 14.7979, 'lng' => 42.9530],
            'إب المدينة' => ['lat' => 13.9667, 'lng' => 44.1833],
            'الرضمة' => ['lat' => 13.9667, 'lng' => 44.1833],
            'ذمار المدينة' => ['lat' => 14.5577, 'lng' => 44.4054],
            'ميفعة عنس' => ['lat' => 14.5577, 'lng' => 44.4054],
            'المكلا' => ['lat' => 14.5412, 'lng' => 49.1259],
            'سيئون' => ['lat' => 15.9444, 'lng' => 48.7872],
            'تريم' => ['lat' => 16.0569, 'lng' => 49.0000],
            'الشحر' => ['lat' => 14.7597, 'lng' => 49.6064],
            'عتق' => ['lat' => 14.5500, 'lng' => 46.8333],
            'بيحان' => ['lat' => 14.8000, 'lng' => 45.7333],
            'مأرب المدينة' => ['lat' => 15.4622, 'lng' => 45.3258],
            'صرواح' => ['lat' => 15.4622, 'lng' => 45.3258],
            'البيضاء المدينة' => ['lat' => 13.9833, 'lng' => 45.5667],
            'رداع' => ['lat' => 13.9833, 'lng' => 45.5667]
        ];

        $yemenMalls = [
            'مول أمانة العاصمة',
            'مول همدان',
            'مول خور مكسر',
            'مول كريتر',
            'مول الحوبان',
            'مول التعزية',
            'مول الحديدة',
            'مول الزيدية',
            'مول إب',
            'مول الرضمة',
            'مول ذمار',
            'مول ميفعة عنس',
            'مول المكلا',
            'مول سيئون',
            'مول تريم',
            'مول الشحر',
            'مول عتق',
            'مول بيحان',
            'مول مأرب',
            'مول صرواح',
            'مول البيضاء',
            'مول رداع'
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
