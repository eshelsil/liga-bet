<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLeaderboardTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('leaderboards_versions', function (Blueprint $table) {
            $table->id();
            $table->foreignId("tournament_id");
            $table->string("description");
            $table->timestamps();
        });
        Schema::create('leaderboards', function (Blueprint $table) {
            $table->id();
            $table->foreignId("user_tournament_id");
            $table->foreignId("tournament_id");
            $table->foreignId('version_id');
            $table->unsignedInteger("rank");
            $table->unsignedInteger("score");
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
        Schema::dropIfExists('leaderboards');
        Schema::dropIfExists('leaderboards_versions');
    }
}
