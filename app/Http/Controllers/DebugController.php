<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Scorer;
use App\SpecialBets\SpecialBet;
use App\Enums\BetTypes;
use App\Bet;


class DebugController extends Controller
{
    public function __construct()
    {
       $this->middleware('auth');
       $this->middleware('admin');
    }

    public function getTableIds($table_name){
        $ids = DB::table($table_name)->select(['id'])->get()->pluck('id')->toArray();
        echo "Table {$table_name} ids:<br>";
        foreach ($ids as $id){
            echo "{$id}<br>";
        }
        echo "<br>";
        return "DONE";
    }

    public function getFullTable($table_name){
        $rows = DB::table($table_name)->get()->toArray();
        echo "Table {$table_name} rows:";
        foreach ($rows as $row){
            echo "<br>";
            foreach($row as $attr => $val){
                if ( in_array($attr, ["password", "remember_token"]) ){
                    continue;
                }
                echo "{$attr} => {$val}  |  ";
            }
        }
        echo "<br>";
        return "DONE";
    }

    public function getScorersIntuitiveData(){
        $rows = Scorer::all(['id', 'external_id', 'name'])->toArray();
        echo "Scorers:";
        foreach ($rows as $row){
            echo "<br>{";
            foreach($row as $attr => $val){
                echo "<br>....{$attr} => {$val}";
            }
            echo "<br>}";

        }
        echo "<br>";
        return "DONE";
    }

    public function getSpecialBetsData($name){
        $type_id = SpecialBet::getBetTypeIdByName($name);
        $rows = Bet::select('id', 'user_id', 'data')
                ->where('type', BetTypes::SpecialBet)
                ->where('type_id', $type_id)
                ->get()->toArray();
        echo "{$name} Bets:";
        foreach ($rows as $row){
            echo "<br>{";
            foreach($row as $attr => $val){
                if ($attr == "data"){
                    $val = data_get(json_decode($val), 'answer');
                }
                echo "<br>....{$attr} => {$val}";
            }
            echo "<br>}";
        }
        echo "<br>";
        return "DONE";
    }
}
