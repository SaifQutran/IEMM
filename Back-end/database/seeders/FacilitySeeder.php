<?php

namespace Database\Seeders;

use App\Models\Facility;
use App\Models\Floor;
use App\Models\Mall;
use Illuminate\Database\Seeder;

class FacilitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $malls = Mall::all();

        foreach ($malls as $mall) {
            // Get all floors for this mall
            $floors = $mall->floors;

            // Create 2-4 facilities per floor
            foreach ($floors as $floor) {
                $facilityCount = rand(2, 4);

                for ($i = 0; $i < $facilityCount; $i++) {
                    Facility::create([
                        'mall_id' => $mall->id,
                        'floor_id' => $floor->id,
                        'width' => rand(10, 50),
                        'length' => rand(10, 50),
                        'rent_price' => rand(1000, 5000),
                        'electricity_id_number' => 'ELE' . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT),
                        'water_id_number' => 'WAT' . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT),
                        'X_Coordinates' => rand(0, 100),
                        'Y_Coordinates' => rand(0, 100),
                        'status' => rand(0, 1)
                    ]);
                }
            }
        }
    }
}
