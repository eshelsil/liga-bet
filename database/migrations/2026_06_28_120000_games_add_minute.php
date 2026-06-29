<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class GamesAddMinute extends Migration
{
    public function up()
    {
        Schema::table('matches', function (Blueprint $table) {
            // Live match minute as 365 shows it ("87'", "45+2'", "120'", "HT", "Pen.").
            // Null while not started and once the game has ended.
            $table->string('minute')->nullable();
        });
    }

    public function down()
    {
        Schema::table('matches', function (Blueprint $table) {
            $table->dropColumn('minute');
        });
    }
}
