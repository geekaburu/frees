<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePanelDataTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('panel_data', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('panel_id');
            $table->float('angle');
            $table->float('intensity');
            $table->float('voltage');
            $table->float('temperature');
            $table->float('humidity');
            $table->float('power');
            $table->float('energy');
            $table->float('runtime');
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
        Schema::dropIfExists('panel_data');
    }
}
