<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBracketGamesTables extends Migration
{
    public function up()
    {
        // One row per knockout tie (sourced from 365scores /brackets).
        Schema::create('bracket_games', function (Blueprint $table) {
            $table->id();
            $table->foreignId('competition_id');
            $table->integer('stage_num');                 // 365 stage num
            $table->integer('group_num');                 // 365 tie num within stage
            $table->string('sub_type');                   // GameSubTypes: LAST_32..FINAL / THIRD_PLACE
            $table->string('match_label')->nullable();    // "Match 74"
            $table->string('side')->nullable();           // "left" | "right" | null  (computed)
            $table->integer('start_time')->nullable();

            // resolved links (filled as data arrives from 365)
            $table->string('external_id')->nullable();    // 365 game id (games[].id)
            $table->foreignId('game_id')->nullable();     // our matches.id once matched

            // where the winner advances (null for Final & 3rd place)
            $table->integer('dest_stage_num')->nullable();
            $table->integer('dest_group_num')->nullable();

            $table->timestamps();

            $table->unique(['competition_id', 'stage_num', 'group_num']);
        });

        // Two rows per tie: the home (slot_num 1) and away (slot_num 2) participants.
        Schema::create('bracket_slots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bracket_game_id');
            $table->integer('slot_num');                  // 1 = home, 2 = away

            // source descriptor (the relations)
            $table->string('kind');                       // group_position | match_winner | match_loser
            $table->integer('origin_stage_num')->nullable();
            $table->integer('origin_group_num')->nullable();
            $table->integer('origin_position')->nullable();
            $table->string('symbolic_name')->nullable();  // "1ST" | "W74" | "3RD"
            $table->string('allowed_groups')->nullable(); // "ABCDF" for symbolic 3rd-place slots

            // resolved references
            $table->foreignId('group_id')->nullable();          // our groups.id (kind=group_position)
            $table->foreignId('feeds_from_game_id')->nullable(); // bracket_games.id (kind=match_winner/loser)
            $table->foreignId('team_id')->nullable();            // our teams.id (when competitor resolved)

            $table->timestamps();

            $table->unique(['bracket_game_id', 'slot_num']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('bracket_slots');
        Schema::dropIfExists('bracket_games');
    }
}
