<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class LeaderboardAddBetScoreOverride extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('leaderboards', function (Blueprint $table) {
            $table->json('bet_score_override')->after('score');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('leaderboards', function (Blueprint $table) {
            $table->dropColumn('bet_score_override');
        });
    }
}
