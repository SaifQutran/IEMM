<?php

namespace Database\Seeders;

use App\Models\Bill;
use Illuminate\Database\Seeder;

class BillSeeder extends Seeder
{
    public function run(): void
    {
        Bill::factory()->count(300)->create();
    }
}
