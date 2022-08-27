<?php

use App\Tournament;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class TournamentAddCode extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tournaments', function (Blueprint $table) {
            $table->string('code');
        });

        Tournament::all()
            ->each(fn(Tournament $t) => $t->update(["code" => Str::lower(Str::random(6))]));

        Schema::table('tournaments', function (Blueprint $table) {
            $table->unique('code');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('tournaments', function (Blueprint $table) {
            $table->dropColumn("code");
        });
    }
}
