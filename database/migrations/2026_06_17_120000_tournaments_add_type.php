<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class TournamentsAddType extends Migration
{
    public function up()
    {
        Schema::table('tournaments', function (Blueprint $table) {
            $table->string('type')->default('classic')->index();
        });
    }

    public function down()
    {
        Schema::table('tournaments', function (Blueprint $table) {
            $table->dropColumn('type');
        });
    }
}
