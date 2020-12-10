<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAboutUsFiles extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('about_us_files', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('about_us_id')->unsigned();
            $table->foreign('about_us_id')->references('id')->on('about_us')->cascadeOnDelete();
            $table->integer('files_id')->unsigned();
            $table->foreign('files_id')->references('id')->on('files')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('about_us_files');
    }
}
