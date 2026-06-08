<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class GamesAddAutoBetsFilledAt extends Migration
{
    public function up()
    {
        Schema::table('matches', function (Blueprint $table) {
            $table->timestamp('auto_bets_filled_at')->nullable();
        });
    }

    public function down()
    {
        Schema::table('matches', function (Blueprint $table) {
            $table->dropColumn('auto_bets_filled_at');
        });
    }
}
