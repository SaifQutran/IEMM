<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('malls', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            // $table->integer('floors_count');
            $table->string('location');
            $table->foreignId('owner_id')->nullable()->constrained('users')->cascadeOnDelete();
            $table->foreignId('city_id')->nullable()->constrained()->nullOnDelete();
            $table->decimal('X_Coordinates', 10, 7);
            $table->decimal('Y_Coordinates', 10, 7);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('malls');
    }
};
