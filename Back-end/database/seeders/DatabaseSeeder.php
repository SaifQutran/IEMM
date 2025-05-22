<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            CountryGovernorateCityCompanySeeder::class,
            UserSeeder::class,
            MallSeeder::class,
            FloorSeeder::class,
            FacilitySeeder::class,
            ShopSeeder::class,
            CategorySeeder::class,
            MoneyLogSeeder::class,
            ProductSeeder::class,
            WarehouseSeeder::class,
            StockSeeder::class,
            BillSeeder::class,
            SaleSeeder::class,
            ReviewSeeder::class,
            ChatSeeder::class,
            MessageSeeder::class,
            NotificationSeeder::class,
            ReservationSeeder::class,
        ]);
    }
}
