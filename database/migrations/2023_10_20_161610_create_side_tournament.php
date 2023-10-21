<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSideTournament extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('side_tournaments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tournament_id');
            $table->string('name');
            $table->string('emblem')->nullable();
            $table->timestamps();
        });

        Schema::table('leaderboards', function (Blueprint $table) {
            $table->foreignId('side_tournament_id')->nullable();
            $table->index(['version_id', 'side_tournament_id'], 'side_tournament_index');
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
            $table->dropIndex('side_tournament_index');
            $table->dropColumn('side_tournament_id');
        });

        Schema::dropIfExists('side_tournaments');
    }
}
