<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class TournamentPreferencesAddEnableAutoBet extends Migration
{
    public function up()
    {
        Schema::table('tournament_preferences', function (Blueprint $table) {
            $table->boolean('enable_auto_bet')->default(true);
        });
    }

    public function down()
    {
        Schema::table('tournament_preferences', function (Blueprint $table) {
            $table->dropColumn('enable_auto_bet');
        });
    }
}
