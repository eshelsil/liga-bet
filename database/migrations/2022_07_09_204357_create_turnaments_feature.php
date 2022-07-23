<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTurnamentsFeature extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('competitions', function (Blueprint $table) {
            $table->id();
            $table->string("type");
            $table->string("name");
            $table->timestamp("last_registration")->nullable();
            $table->timestamp("start_time")->nullable();
            $table->json("config"); // (connections, api paths)

            $table->timestamps();
        });
        Schema::create('tournaments', function (Blueprint $table) {
            $table->id();
            $table->foreignId("competition_id");
            $table->string("name");
            $table->json("config"); // (connections, api paths)
            $table->string("status");
            $table->timestamps();
        });
        Schema::create('user_tournament_links', function (Blueprint $table) {
            $table->id();

            $table->foreignIdFor(\App\User::class);
            $table->foreignId("tournament_id");
            $table->string("role");
            $table->timestamps();
        });
        Schema::table('bets', function (Blueprint $table) {
            $table->foreignId("tournament_id");
            $table->foreignId("user_tournament_id");
            $table->dropColumn("user_id");
        });
        Schema::table('groups', function (Blueprint $table) {
            $table->foreignId("competition_id");
        });
        Schema::table('teams', function (Blueprint $table) {
            $table->foreignId("competition_id");
        });
        Schema::table('matches', function (Blueprint $table) {
            $table->foreignId("competition_id");
        });
        Schema::table('scorers', function (Blueprint $table) {
            $table->foreignId("competition_id");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('scorers', function (Blueprint $table) {
            $table->dropColumn("competition_id");
        });
        Schema::table('matches', function (Blueprint $table) {
            $table->dropColumn("competition_id");
        });
        Schema::table('teams', function (Blueprint $table) {
            $table->dropColumn("competition_id");
        });
        Schema::table('groups', function (Blueprint $table) {
            $table->dropColumn("competition_id");
        });
        Schema::table('bets', function (Blueprint $table) {
            $table->dropColumn("tournament_id");
            $table->dropColumn("user_tournament_id");
            $table->integer("user_id");
        });
        Schema::drop('user_tournament_links');
        Schema::drop('tournaments');
        Schema::drop('competitions');
    }
}
