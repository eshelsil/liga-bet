<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class LeaderboardsVersionsUniqueGameIdPerTournament extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('leaderboards_versions', function (Blueprint $table) {
            $table->unique(['game_id', 'tournament_id'], 'one_version_per_game');
            $table->string('description')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('leaderboards_versions', function (Blueprint $table) {
            $table->dropUnique('one_version_per_game');
            $table->string('description')->change();
        });
    }
}
