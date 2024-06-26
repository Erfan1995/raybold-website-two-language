<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProjectFiles extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('project_files', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('projects_id')->unsigned();
            $table->foreign('projects_id')->references('id')->on('projects')->cascadeOnDelete();
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
        Schema::dropIfExists('project_files');
    }
}
