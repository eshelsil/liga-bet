<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCurrentStandingsTable extends Migration
{
    public function up()
    {
        // Live (current) group standings, refreshed every update run from 365scores.
        // One row per team per group. Distinct from groups.standings (final-only JSON).
        Schema::create('current_standings', function (Blueprint $table) {
            $table->id();
            // groups.id and teams.id are unsigned INT (created via increments()),
            // so the FK columns must match that type, not the BIGINT that foreignId() defaults to.
            $table->unsignedInteger('group_id');
            $table->unsignedInteger('team_id');
            $table->foreign('group_id')->references('id')->on('groups')->cascadeOnDelete();
            $table->foreign('team_id')->references('id')->on('teams')->cascadeOnDelete();
            $table->unsignedSmallInteger('position');
            $table->unsignedSmallInteger('game_played')->default(0);
            $table->unsignedSmallInteger('points')->default(0);
            $table->unsignedSmallInteger('goals_for')->default(0);
            $table->unsignedSmallInteger('goals_against')->default(0);
            $table->smallInteger('goals_diff')->default(0); // signed (for - against)
            $table->boolean('is_eliminated')->default(false);
            $table->timestamps();

            $table->unique(['group_id', 'team_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('current_standings');
    }
}
