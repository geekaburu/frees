<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCarbonTransactionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('carbon_transactions', function (Blueprint $table) {
            $table->increments('id');
            $table->float('rate');
            $table->float('price');
            $table->float('energy');
            $table->float('credits');
            $table->float('amount');
            $table->dateTime('sold_on')->nullable();
            $table->dateTime('dispatched_on')->nullable();
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
        Schema::dropIfExists('carbon_transactions');
    }
}
