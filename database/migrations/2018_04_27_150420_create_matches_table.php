<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMatchesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('matches', function (Blueprint $table) {
            $table->increments('id');
            $table->string("external_id")->nullable();
            $table->string("type");
            $table->string("sub_type");
            $table->integer("team_home_id");
            $table->integer("team_away_id");
            $table->integer("start_time")->nullable();
            $table->integer("result_home")->nullable();
            $table->integer("result_away")->nullable();
            $table->integer("score")->nullable();
            $table->integer("ko_winner")->nullable(); # get winner of knockout game;
            $table->boolean('is_done')->storedAs('result_home is not null and result_away is not null');
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
        Schema::dropIfExists('matches');
    }
}
