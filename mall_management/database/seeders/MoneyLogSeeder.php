<?php

namespace Database\Seeders;

use App\Models\MoneyLog;
use Illuminate\Database\Seeder;

class MoneyLogSeeder extends Seeder
{
    public function run(): void
    {
        MoneyLog::factory()->count(100)->create();
    }
}
