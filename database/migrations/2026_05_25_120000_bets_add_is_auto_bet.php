<?php

use App\TournamentUser;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class BetsAddIsAutoBet extends Migration
{
    public function up()
    {
        Schema::table('bets', function (Blueprint $table) {
            $table->boolean('is_auto_bet')->default(false);
        });
    }

    public function down()
    {
        Schema::table('bets', function (Blueprint $table) {
            $table->dropColumn('is_auto_bet');
        });
    }
}
