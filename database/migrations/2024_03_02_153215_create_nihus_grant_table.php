<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNihusGrantTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('nihus_grants', function (Blueprint $table) {
            $table->id();
            $table->foreignId("user_tournament_id");
            $table->integer('amount');
            $table->string("grant_reason");
            $table->boolean("seen")->default(false);
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
        Schema::dropIfExists('nihus_grants');
    }
}
