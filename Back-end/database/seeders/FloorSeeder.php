<?php

namespace Database\Seeders;

use App\Models\Floor;
use App\Models\Mall;
use Illuminate\Database\Seeder;

class FloorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all malls
        $malls = Mall::all();

        // For each mall, create 3-5 floors
        foreach ($malls as $mall) {
            $floorCount = rand(3, 5);
            
            for ($i = 1; $i <= $floorCount; $i++) {
                Floor::create([
                    'length' => rand(50, 200),
                    'width' => rand(50, 200),
                    'floor_number' => $i,
                    'mall_id' => $mall->id
                ]);
            }
        }
    }
} 