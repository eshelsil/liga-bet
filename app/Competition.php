<?php

namespace App;

use App\DataCrawler\Crawler;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;

/**
 * App\Competition
 *
 * @property int $id
 * @property string $type
 * @property string $name
 * @property string|null $last_registration
 * @property string|null $start_time
 * @property array $config
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Game[] $games
 * @property-read int|null $games_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Group[] $groups
 * @property-read int|null $groups_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Player[] $players
 * @property-read int|null $players_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Team[] $teams
 * @property-read int|null $teams_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Tournament[] $tournaments
 * @property-read int|null $tournaments_count
 * @method static \Illuminate\Database\Eloquent\Builder|Competition newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Competition newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Competition query()
 * @method static \Illuminate\Database\Eloquent\Builder|Competition whereConfig($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Competition whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Competition whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Competition whereLastRegistration($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Competition whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Competition whereStartTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Competition whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Competition whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Competition extends Model
{
    private $sortedGames;
    private $endingGroupGameIds;
    private $lastGroupStageGameId;

    const STATUS_DONE = 'done';
    const STATUS_ONGOING = 'ongoing';
    const STATUS_INITIAL = 'initial';

    const TYPE_WC = 'WC';
    const TYPE_UCL = 'UCL';
    const TYPE_WC_48 = 'WC_48';

    const SOURCE_FOOTBALL_DATA = 'football_data';
    const SOURCE_365 = '365';

    protected $casts = [
        "config" => "array"
    ];

    public function tournaments(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Tournament::class);
    }

    public function games(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Game::class);
    }

    public function bracketGames(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(BracketGame::class);
    }

    public function groups(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Group::class);
    }

    public function players(): \Illuminate\Database\Eloquent\Relations\HasManyThrough
    {
        return $this->hasManyThrough(Player::class, Team::class);
    }

    public function goalsData(): \Illuminate\Database\Eloquent\Relations\HasManyThrough
    {
        return $this->hasManyThrough(GameDataGoal::class, Game::class);
    }

    public function teams(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Team::class);
    }

    public function isClubsCompetition()
    {
        return collect($this->config)->get("isForClubs") ?? false;
    }

    public function supportsBracket(): bool
    {
        return (bool) data_get($this->config, "bracket.enabled", false);
    }

    public function getBracketConfig(): array
    {
        return (array) data_get($this->config, "bracket", []);
    }

    /**
     * The bracket side ("left"|"right") a team occupies, derived from the feed-sourced bracket model
     * (contract H / C). A team's side is constant along its path, so any side-known tie the team is a
     * slot in answers it. Returns null until the team is placed into a resolvable, side-known tie.
     *
     * NOTE: Task 2 was slated to own a richer App\Bracket\BracketTopology; until it lands this is a thin
     * read over BracketGame/BracketSlot. Callers depend only on this signature.
     */
    public function getBracketSide(int $teamId): ?string
    {
        return BracketGame::query()
            ->where('competition_id', $this->id)
            ->whereNotNull('side')
            ->whereHas('slots', fn($q) => $q->where('team_id', $teamId))
            ->value('side');
    }

    /**
     * Team ids that have resolved into a bracket slot (i.e. qualified into the knockout stage), per the
     * feed-sourced bracket model. Authoritative once the feed places a group's qualifiers into the bracket.
     */
    public function getQualifiedTeamIds(): \Illuminate\Support\Collection
    {
        return BracketSlot::query()
            ->whereNotNull('team_id')
            ->whereHas('bracketGame', fn($q) => $q->where('competition_id', $this->id))
            ->pluck('team_id')
            ->unique()
            ->values();
    }

    /**
     * Team ids placed into the FIRST knockout round (group-position slots), optionally limited to one
     * bracket side ("left"|"right"). A team's side is constant along its path, so the side of its
     * first-round tie is its side. Includes teams later eliminated — it reflects who STARTED the bracket,
     * which is what monkey Winner/Runner-Up picks (and the manual fix) select from.
     */
    public function getFirstRoundBracketTeamIds(?string $side = null): \Illuminate\Support\Collection
    {
        return BracketSlot::query()
            ->where('kind', BracketSlot::KIND_GROUP_POSITION)
            ->whereNotNull('team_id')
            ->whereHas('bracketGame', function ($q) use ($side) {
                $q->where('competition_id', $this->id);
                if ($side) {
                    $q->where('side', $side);
                }
            })
            ->pluck('team_id')
            ->unique()
            ->values();
    }

    /**
     * True once every group-sourced first-round bracket slot has a resolved team — i.e. the group
     * stage has fully fed the bracket (all qualifiers, including any best-3rd-place teams, are placed).
     * Until this holds, a team merely being absent from the bracket is not yet conclusive.
     */
    public function isGroupStageBracketSeeded(): bool
    {
        $base = fn() => BracketSlot::query()
            ->where('kind', BracketSlot::KIND_GROUP_POSITION)
            ->whereHas('bracketGame', fn($q) => $q->where('competition_id', $this->id));

        return $base()->exists() && $base()->whereNull('team_id')->doesntExist();
    }

    /**
     * Team ids that failed to qualify into the knockout stage, derived without false positives:
     *  - any team the live feed marks is_eliminated (mathematically out — handles best-3rd-place
     *    formats, where a still-alive 3rd is not flagged), plus
     *  - once the bracket is fully seeded, every group team absent from a bracket slot.
     * The second clause is gated on full seeding (isGroupStageBracketSeeded) and is computed on the
     * fly — it is NOT written back to current_standings.
     */
    public function getNonQualifiedTeamIds(): \Illuminate\Support\Collection
    {
        $groupIds = $this->groups()->pluck('id');

        $nonQualified = CurrentStanding::query()
            ->where('is_eliminated', true)
            ->whereIn('group_id', $groupIds)
            ->pluck('team_id');

        if ($this->isGroupStageBracketSeeded()) {
            $allGroupTeamIds = Team::query()->whereIn('group_id', $groupIds)->pluck('id');
            $nonQualified = $nonQualified->merge($allGroupTeamIds->diff($this->getQualifiedTeamIds()));
        }

        return $nonQualified->unique()->values();
    }

    public function getCompetitionType()
    {
        return collect($this->config)->get("type") ?? false;
    }

    public function getGamesToFixScorers()
    {
        $fromConf = collect($this->config)->get("games_to_fix_scores");
        if ($fromConf){
            return collect(json_decode($fromConf));
        }
        return collect([]);
    }

    public function get365Id()
    {
        return collect($this->config)->get("id_on_365");
    }

    public function isSupports365TeamExtId()
    {
        return !(collect($this->config)->get("ignore365TeamExtId") ?? false);
    }

    /**
     * Which feed supplies this competition's matches/teams/standings. Config-only (no schema change),
     * so it can be flipped per competition and reverted. Results/scorers/bracket are 365 regardless.
     */
    public function getDataSource(): string
    {
        return data_get($this->config, "source", self::SOURCE_FOOTBALL_DATA);
    }

    public function isSourced365(): bool
    {
        return $this->getDataSource() === self::SOURCE_365;
    }

    public function getCrawler()
    {
        return Crawler::getInstance($this->config["external_id"])
            ->withSource($this->getDataSource(), $this->get365Id());
    }

    private function getGamesSorted()
    {
        if (!$this->sortedGames) {
            $this->sortedGames = $this->games()
                ->orderBy('start_time', 'asc')
                ->orderBy('done_time', 'asc')
                ->orderBy('id', 'asc')
                ->get();
        }
        return $this->sortedGames;
    }

    public function getSortedGameIds()
    {
        return $this->getGamesSorted()->pluck('id');
    }

    public function shouldUpdateUpcomingGamesStartTime(){
        return collect($this->config)->get("update_upcoming_games_start_time") ?? false;
    }

    public function resetShouldUpdateUpcomingGamesStartTime(){
        $config = collect($this->config);
        $config->forget("update_upcoming_games_start_time");
        $this->config = $config;
        $this->save();
    }

    public function getIdsOfLastGroupGames()
    {
        if (!$this->endingGroupGameIds) {
            $this->endingGroupGameIds = collect([]);
            foreach ($this->groups->pluck('external_id') as $groupExternalId){
                $lastGame = $this->getGamesSorted()
                    ->where('type', Game::TYPE_GROUP_STAGE)
                    ->where('sub_type', $groupExternalId)
                    ->last();
                if ($lastGame){
                    $this->endingGroupGameIds->add($lastGame->id);
                }
            }
        }

        return $this->endingGroupGameIds;
    }

    public function getLastGroupStageGameId()
    {
        if (!$this->lastGroupStageGameId) {
            $lastGame = $this->getGamesSorted()
                ->where('type', Game::TYPE_GROUP_STAGE)
                ->last();
            if ($lastGame){
                $this->lastGroupStageGameId = $lastGame->id;
            }
        }

        return $this->lastGroupStageGameId;
    }


    public function getFinalGame(): ?Game
    {
        return $this->games->where('type', 'knockout')
                           ->firstWhere('sub_type', 'FINAL');
    }
    public function getKnockoutGames(?int $teamId = null): Collection
    {
        $games = $this->games->where('type', 'knockout');
        if ($teamId) {
            return $games->filter(fn(Game $g) => in_array($teamId, [$g->team_home_id, $g->team_away_id]));
        }
        return $games;
    }

    public function isDone() {
        $final = $this->getFinalGame();
        return $final && $final->is_done;
    }

    public function hasAllGroupsStandings(){
        return !$this->groups()->where('standings', null)->exists();
    }

    public function isGroupStageDone(){
        return $this->getGroupStageGamesIfStageDone() !== null;
    }

    /**
     * @return \Illuminate\Database\Eloquent\Collection<Game>|Game[]
     */
    public function getGroupStageGamesIfStageDone(){
        $games = $this->getGroupStageGames();

        $unfinishedGame = $games->first(fn(Game $game) => !$game->is_done);
        if ($unfinishedGame) {
            return null;
        }

        return $games;
    }

    public function getGroupStageGames()
    {
        return $this->games->where('type', Game::TYPE_GROUP_STAGE);
    }

    public function getTournamentStartTime()
    {
        return $this->games->min("start_time");
    }

    public function getKnockoutStartTime()
    {
        $minKnockoutGame = $this->games()->where('type', Game::TYPE_KNOCKOUT)->min("start_time");
        if ($minKnockoutGame) {
            return $minKnockoutGame;
        }
        return $this->bracketGames()->min("start_time");
    }

    public function getStartTimeForType(?string $tournamentType = null)
    {
        if ($tournamentType === Tournament::TYPE_KNOCKOUT_BRACKET) {
            return $this->getKnockoutStartTime();
        }
        return $this->getTournamentStartTime();
    }

    public function isStarted(?string $tournamentType = null): bool
    {
        $startTime = $this->getStartTimeForType($tournamentType);
        return !is_null($startTime) && time() > $startTime;
    }


    public function getOffensiveTeams(){
        $matches = $this->getGroupStageGamesIfStageDone();
        if (!$matches) {
            return collect();
        }

        $gsByTeamId = [];
        foreach ($matches as $match) {
            foreach($match->getGoalsData() as $teamId => $gs){
                if (!array_key_exists($teamId, $gsByTeamId)){
                    $gsByTeamId[$teamId] = 0;
                }
                $gsByTeamId[$teamId] += $gs;
            }
        }

        $maxGoals = max(array_values($gsByTeamId));

        return collect($gsByTeamId)
            ->filter(fn($goalsScored, $teamId) => $goalsScored == $maxGoals)
            ->keys();
    }

    public function getTopScorersIds($live = false)
    {
        if (!$this->isDone() && !$live) {
            return collect();
        }

        $maxGoals = $this->players->max("goals") ?? -1; // -1 for Empty, means not ready. do not keep null to not try to recalculate?

        return $this->players->where("goals", $maxGoals)->pluck("id");
    }

    public function getMostAssistsIds($live = false)
    {
        if (!$this->isDone() && !$live) {
            return collect();
        }

        $maxAssists = $this->players->max("assists") ?? -1; // -1 for Empty, means not ready. do not keep null to not try to recalculate?

        return $this->players->where("assists", $maxAssists)->pluck("id");
    }

    public function has_started()
    {
        return $this->status != self::STATUS_INITIAL;
    }

    public function finish()
    {
        $this->tournaments->each(fn(Tournament $t) => $t->finish());
        $this->status = self::STATUS_DONE;
        $this->save();
    }

    public function start()
    {
        $this->status = self::STATUS_ONGOING;
        $this->save();
    }

    public function startPendingTournaments()
    {
        $this->tournaments
            ->where('status', Tournament::STATUS_INITIAL)
            ->each(fn(Tournament $t) => $t->start());
    }
}
