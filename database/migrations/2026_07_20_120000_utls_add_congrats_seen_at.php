<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UtlsAddCongratsSeenAt extends Migration
{
    public function up()
    {
        Schema::table('user_tournament_links', function (Blueprint $table) {
            $table->timestamp('congrats_seen_at')->nullable();
        });
    }

    public function down()
    {
        Schema::table('user_tournament_links', function (Blueprint $table) {
            $table->dropColumn('congrats_seen_at');
        });
    }
}
