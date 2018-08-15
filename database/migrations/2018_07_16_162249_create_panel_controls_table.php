<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePanelControlsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('panel_controls', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id');
            $table->string('mode');
            $table->integer('runtime');
            $table->float('angle');
            $table->boolean('location_request');
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
        Schema::dropIfExists('panel_controls');
    }
}
