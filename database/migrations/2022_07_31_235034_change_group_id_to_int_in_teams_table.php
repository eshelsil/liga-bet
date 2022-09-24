<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ChangeGroupIdToIntInTeamsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (DB::connection()->getDriverName() == "pgsql") {
            DB::statement('ALTER TABLE teams ALTER COLUMN 
                  group_id TYPE integer USING (group_id)::integer');
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        if (DB::connection()->getDriverName() == "pgsql") {
            Schema::table('teams', function (Blueprint $table) {
                $table->string("group_id")->change();
            });
        }
    }
}
