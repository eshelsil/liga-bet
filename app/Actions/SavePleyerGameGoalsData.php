<?php
/**
 * Created by PhpStorm.
 * User: omer
 * Date: 12/11/2022
 * Time: 22:30
 */

namespace App\Actions;

use App\GameDataGoal;
use App\Player;
use Illuminate\Support\Facades\Log;

class SavePleyerGameGoalsData
{
    public function handle(int $id, int $gameId, int $totalGoals, int $totalAssists)
    {
        $player = Player::find($id);
        $prevGoalsData = $player->goalsData->filter(fn($goalsData) => $goalsData->game_id != $gameId);
        $prevGoals = $prevGoalsData->sum('goals');
        $prevAssists = $prevGoalsData->sum('assists');
        $goals = $totalGoals - $prevGoals;
        $assists = $totalAssists - $prevAssists;
        if ($goals > 0 || $assists > 0) {
            GameDataGoal::updateOrInsert(
                ['game_id' => $gameId, 'player_id' => $id],
                ['goals' => $goals, 'assists' => $assists, 'created_at' => now(), 'updated_at' => now()],
            );
            Log::debug("[SavePleyerGameGoalsData][handle] Updated Player $id on Game $gameId  G-$goals  A-$assists");
        } else {
            GameDataGoal::where(['game_id' => $gameId, 'player_id' => $id])->delete();
            Log::debug("[SavePleyerGameGoalsData][handle] Removed GameDataGoal rows for Player $id on Game $gameId");
        }
    }
}