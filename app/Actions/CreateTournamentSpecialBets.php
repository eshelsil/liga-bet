<?php
/**
 * Created by PhpStorm.
 * User: omer
 * Date: 23/07/2022
 * Time: 20:13
 */

namespace App\Actions;

use App\Bet;
use App\Enums\BetTypes;
use App\Game;
use App\Group;
use App\SpecialBets\SpecialBet;
use App\Tournament;
use App\TournamentUser;
use App\User;
use Faker\Generator as FakerGenerator;

class CreateTournamentSpecialBets
{

    const DEFAULT_DATA = [
        ["type" => SpecialBet::TYPE_WINNER, "title" => "זוכה"],
        ["type" => SpecialBet::TYPE_RUNNER_UP, "title" => "סגנית"],
        ["type" => SpecialBet::TYPE_TOP_SCORER, "title" => "מלך השערים"],
        ["type" => SpecialBet::TYPE_MOST_ASSISTS, "title" => "מלך הבישולים"],
        ["type" => SpecialBet::TYPE_MVP, "title" => "מצטיין הטורניר"],
        ["type" => SpecialBet::TYPE_OFFENSIVE_TEAM, "title" => "ההתקפה החזקה בבתים"],
    ];

    public function handle(Tournament $tournament)
    {
        return collect(self::DEFAULT_DATA)->map(function ($data) use ($tournament) {
            $sb = new SpecialBet();
            $sb->type = $data["type"];
            $sb->title = $data["title"];
            $sb->tournament_id = $tournament->id;
            $sb->save();

            return $sb;
        });
    }
}