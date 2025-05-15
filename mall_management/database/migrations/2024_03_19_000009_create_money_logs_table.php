<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('money_logs', function (Blueprint $table) {
            $table->id();
            $table->decimal('amount', 10, 2);
            $table->integer('type_id')->nullable();
            $table->date('date')->nullable();
            $table->foreignId('shop_id')->nullable()->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('money_logs');
    }
}; 