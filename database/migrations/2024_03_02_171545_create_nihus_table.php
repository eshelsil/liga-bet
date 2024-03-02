<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNihusTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('nihuses', function (Blueprint $table) {
            $table->id();
            $table->foreignId("tournament_id");
            $table->foreignId("game_id");
            $table->foreignId("sender_utl_id");
            $table->foreignId("target_utl_id");
            $table->string("text");
            $table->string("gif");
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
        Schema::dropIfExists('nihuses');
    }
}
