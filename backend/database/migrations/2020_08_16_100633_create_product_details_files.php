<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductDetailsFiles extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('product_details_files', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('product_details_id')->unsigned();
            $table->boolean('is_main_file')->default(false);
            $table->foreign('product_details_id')->references('id')->on('product_details');
            $table->integer('files_id')->unsigned();
            $table->foreign('files_id')->references('id')->on('files')->onDelete('cascade');
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
        Schema::dropIfExists('product_details_files');
    }
}
