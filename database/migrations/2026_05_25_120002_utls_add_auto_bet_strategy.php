<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UtlsAddAutoBetStrategy extends Migration
{
    public function up()
    {
        Schema::table('user_tournament_links', function (Blueprint $table) {
            $table->string('auto_bet_strategy')->default('zero');
        });
    }

    public function down()
    {
        Schema::table('user_tournament_links', function (Blueprint $table) {
            $table->dropColumn('auto_bet_strategy');
        });
    }
}
