<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('f_name', 50);
            $table->string('l_name', 50);
            $table->string('email')->unique();
            $table->string('username', 50)->unique();
            $table->string('password', 200);
            $table->string('phone', 12);
            $table->boolean('sex');
            $table->integer('user_type');
            $table->date('birth_date')->nullable();
            $table->boolean('signed_in')->default(false);
            $table->string('remember_token', 100)->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
