<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CountryGovernorateCityCompanySeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        // Insert countries
        DB::table('countries')->insert([
            ['name' => 'الصين', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'الولايات المتحدة الأمريكية', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'ألمانيا', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'اليابان', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'كوريا الجنوبية', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'الهند', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'تركيا', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'إيطاليا', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'فرنسا', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'إسبانيا', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'المملكة المتحدة', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'البرازيل', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'المكسيك', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'روسيا', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'إندونيسيا', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'تايوان', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'فيتنام', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'مصر', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'السعودية', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'عمان', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'اليمن', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'الإمارات', 'created_at' => $now, 'updated_at' => $now],
        ]);

        // Governorates
        DB::table('governorates')->insert([
            ['governorate' => 'صنعاء', 'created_at' => $now, 'updated_at' => $now],
            ['governorate' => 'عدن', 'created_at' => $now, 'updated_at' => $now],
            ['governorate' => 'تعز', 'created_at' => $now, 'updated_at' => $now],
            ['governorate' => 'الحديدة', 'created_at' => $now, 'updated_at' => $now],
            ['governorate' => 'إب', 'created_at' => $now, 'updated_at' => $now],
            ['governorate' => 'ذمار', 'created_at' => $now, 'updated_at' => $now],
            ['governorate' => 'المكلا (حضرموت)', 'created_at' => $now, 'updated_at' => $now],
            ['governorate' => 'شبوة', 'created_at' => $now, 'updated_at' => $now],
            ['governorate' => 'مأرب', 'created_at' => $now, 'updated_at' => $now],
            ['governorate' => 'البيضاء', 'created_at' => $now, 'updated_at' => $now],
        ]);

        // Cities
        DB::table('cities')->insert([
            ['name' => 'أمانة العاصمة', 'governorate_id' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'همدان', 'governorate_id' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'خور مكسر', 'governorate_id' => 2, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'كريتر', 'governorate_id' => 2, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'الحوبان', 'governorate_id' => 3, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'التعزية', 'governorate_id' => 3, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'الحديدة المدينة', 'governorate_id' => 4, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'الزيدية', 'governorate_id' => 4, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'إب المدينة', 'governorate_id' => 5, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'الرضمة', 'governorate_id' => 5, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'ذمار المدينة', 'governorate_id' => 6, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'ميفعة عنس', 'governorate_id' => 6, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'المكلا', 'governorate_id' => 7, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'سيئون', 'governorate_id' => 7, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'تريم', 'governorate_id' => 7, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'الشحر', 'governorate_id' => 7, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'عتق', 'governorate_id' => 8, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'بيحان', 'governorate_id' => 8, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'مأرب المدينة', 'governorate_id' => 9, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'صرواح', 'governorate_id' => 9, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'البيضاء المدينة', 'governorate_id' => 10, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'رداع', 'governorate_id' => 10, 'created_at' => $now, 'updated_at' => $now],
        ]);

        // Companies
        DB::table('companies')->insert([
            ['name' => 'Nike', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Adidas', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Puma', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Under Armour', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Reebok', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Zara', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'H&M', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Uniqlo', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Levi\'s', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Gucci', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Apple', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Samsung', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Huawei', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Xiaomi', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Sony', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'LG', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Dell', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'HP', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Lenovo', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'ASUS', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'PlayStation', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Xbox', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Nintendo', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Hasbro', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Mattel', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'LEGO', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Bandai', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Funko', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Hot Wheels', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Nerf', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Bosch', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Philips', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Whirlpool', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Panasonic', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Sharp', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Toshiba', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Electrolux', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Kenwood', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Beko', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Ariston', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Chanel', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Dior', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Versace', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Ray-Ban', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Oakley', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'New Balance', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Crocs', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Timberland', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Converse', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Fila', 'created_at' => $now, 'updated_at' => $now],
        ]);
    }
}
