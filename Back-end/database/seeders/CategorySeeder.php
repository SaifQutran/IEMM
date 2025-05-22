<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Shop;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create 10 categories
        $categories = Category::factory()->count(10)->create();

        // Get all shops
        $shops = Shop::all();

        // For each shop, attach 2-4 random categories
        foreach ($shops as $shop) {
            $shop->categories()->attach(
                $categories->random(rand(2, 4))->pluck('id')->toArray()
            );
        }
    }
}
