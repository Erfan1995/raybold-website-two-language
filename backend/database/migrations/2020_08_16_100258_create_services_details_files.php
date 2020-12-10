<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateServicesDetailsFiles extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('services_details_files', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('service_details_id')->unsigned();
            $table->foreign('service_details_id')->references('id')->on('services_details');
            $table->integer('files_id')->unsigned();
            $table->foreign('files_id')->references('id')->on('files');
            $table->boolean('is_main_file')->default(false);
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
        Schema::dropIfExists('services_details_files');
    }
}
