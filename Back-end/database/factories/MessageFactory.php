<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Message>
 */
class MessageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $messages = [
            'الرجاء مراجعة فاتورة الماء',
            'الرجاء مراجعة فاتورة الكهرباء',
            'الرجاء الاستعجال في تسديد المتأخرات من الإيجار',
            'تم تسديد المبلغ يرجى مراجعة السجلات',
            'يرجى مراجعة المدفوعات المعلقة',
            'تم استلام الدفعة الشهرية',
            'يرجى تحديث بيانات الفواتير',
            'تم تسجيل شكوى جديدة بخصوص الفواتير',
            'يرجى مراجعة كشف الحساب الشهري',
            'تم إصدار فاتورة جديدة'
        ];

        return [
            'content' => $this->faker->randomElement($messages),
            'sender_type' => $this->faker->boolean(),
            'sender_id' => $this->faker->numberBetween(1, 50),
            'chat_id' => $this->faker->numberBetween(1, 40),
        ];
    }
}
