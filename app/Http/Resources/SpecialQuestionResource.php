<?php

namespace App\Http\Resources;

use App\SpecialBets\SpecialBet;
use Illuminate\Http\Resources\Json\JsonResource;

class SpecialQuestionResource extends JsonResource
{

    static $typeToAttribute = [
        'runner_up' => 'runnerUp',
        'top_scorer' => 'topScorer',
        'most_assists' => 'topAssists',
        'offensive_team' => 'offensiveTeam',
    ];

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        /** @var SpecialBet $specialQuestions */
        $specialQuestions = $this->resource;
        $type = $specialQuestions->type;

        $answerType = "team"; // "player" switch
        return [
            "id"              => $specialQuestions->id,
            "type"            => static::$typeToAttribute[$type] ?? $type,
            "tournament_id"   => $specialQuestions->tournament_id,
            "answer"          => $specialQuestions->answer ? collect(explode(",", $specialQuestions->answer))
                ->map(fn (int $id) => ["id" => $id, "type" => $answerType]) : null
        ];
    }
}
