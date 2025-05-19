<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('facilities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mall_id')->nullable()->constrained()->cascadeOnDelete();
            $table->decimal('width', 8, 2)->nullable();
            $table->decimal('length', 8, 2)->nullable();
            $table->decimal('rent_price', 10, 2)->nullable();
            $table->integer('floor')->nullable();
            $table->string('electricity_id_number')->nullable();
            $table->string('water_id_number')->nullable();
            $table->string('X_Coordinates')->nullable();
            $table->string('Y_Coordinates')->nullable();
            $table->boolean('status')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('facilities');
    }
};
