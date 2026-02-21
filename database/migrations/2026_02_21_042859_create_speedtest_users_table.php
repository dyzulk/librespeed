<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('speedtest_users', function (Blueprint $table) {
            $table->id();
            $table->string('ip')->nullable();
            $table->text('ispinfo')->nullable();
            $table->text('extra')->nullable();
            $table->string('ua')->nullable();
            $table->string('lang')->nullable();
            $table->string('dl')->nullable();
            $table->string('ul')->nullable();
            $table->string('ping')->nullable();
            $table->string('jitter')->nullable();
            $table->longText('log')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('speedtest_users');
    }
};
