<?php

namespace App\Http\Resources;

use App\Player;
use App\SpecialBets\SpecialBet;
use App\Team;
use Illuminate\Http\Resources\Json\JsonResource;

class SpecialQuestionResource extends JsonResource
{

    static $typeToAttribute = [
        'runner_up' => 'runnerUp',
        'top_scorer' => 'topScorer',
        'most_assists' => 'topAssists',
        'offensive_team' => 'offensiveTeam',
        'defensive_team' => 'defensiveTeam',
    ];

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        /** @var SpecialBet $specialQuestion */
        $specialQuestion = $this->resource;
        $type = $specialQuestion->type;

        return [
            "id"              => $specialQuestion->id,
            "type"            => static::$typeToAttribute[$type] ?? $type,
            "tournament_id"   => $specialQuestion->tournament_id,
            "answer"          => $specialQuestion->answer ? $this->translateAnswers($specialQuestion) : null
        ];
    }

    protected function translateAnswers(SpecialBet $specialQuestion)
    {
        $ids = explode(",", $specialQuestion->answer);
        return $ids;

        if (in_array($specialQuestion->type, [SpecialBet::TYPE_TOP_SCORER, SpecialBet::TYPE_MOST_ASSISTS, SpecialBet::TYPE_MVP])) {
            return PlayerResource::collection(Player::findMany($ids));
        }

        return TeamResource::collection(Team::findMany($ids));
    }
}
