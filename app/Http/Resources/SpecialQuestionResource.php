<?php

namespace App\Http\Resources;

use App\SpecialBets\SpecialBet;
use Illuminate\Http\Resources\Json\JsonResource;

class SpecialQuestionResource extends JsonResource
{
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

        return [
            "id"              => $specialQuestions->id,
            "type"            => $specialQuestions->type,
            "tournament_id"           => $specialQuestions->tournament_id,
            "answer"           => $specialQuestions->answer,
        ];
    }
}
