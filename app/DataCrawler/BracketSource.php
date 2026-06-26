<?php

namespace App\DataCrawler;

/**
 * Parsed source of a single bracket slot (one participant of a tie), as read from 365scores
 * /brackets. Pure DTO — no DB. The DB-side resolution (group_id / feeds-from / team_id) is done
 * by App\Actions\UpdateCompetitionBracket.
 */
class BracketSource
{
    public const KIND_GROUP_POSITION = 'group_position';
    public const KIND_MATCH_WINNER   = 'match_winner';
    public const KIND_MATCH_LOSER    = 'match_loser';

    public function __construct(
        public readonly int $slotNum,            // 1 = home, 2 = away
        public readonly string $kind,
        public readonly ?int $originStageNum,
        public readonly ?int $originGroupNum,
        public readonly ?int $originPosition,
        public readonly ?string $symbolicName,
        public readonly ?string $allowedGroups,  // "ABCDF" for symbolic 3rd-place slots
        public readonly ?string $groupExternalId, // e.g. "GROUP_A" (kind=group_position), else null
        public readonly ?int $team365Id,          // 365 competitor id when resolved, else null
    ) { }
}
