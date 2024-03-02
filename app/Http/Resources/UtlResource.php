<?php

namespace App\Http\Resources;

use App\TournamentUser;
use Illuminate\Http\Resources\Json\JsonResource;

class UtlResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        /** @var TournamentUser $utl */
        $utl = $this->resource;
        $nihusim = 0;
        $nihusimGranted = 0;
        $nihusimUsed = 0;
        try {
            $nihusim = $utl->getAvailabileNihusim();
            $nihusimGranted = $utl->getTotalNihusimGranted();
            $nihusimUsed = $utl->getTotalNihusimSent();
        } catch (\Throwable $e) {
            \Log::error("Error getting nihusim for utl: " . $utl->id);
        }
        return [
            "id"              => $utl->id,
            "user_id"         => $utl->user_id,
            "tournament"      => new TournamentResource($utl->tournament),
            "role"            => $utl->role,
            "name"            => $utl->name,
            "createdAt"       => $utl->created_at,
            "updatedAt"       => $utl->updated_at,
            "nihusimLeft"     => $nihusim,
            "nihusimGranted"  => $nihusimGranted,
            "nihusimUsed"     => $nihusimUsed,
        ];
    }
}
