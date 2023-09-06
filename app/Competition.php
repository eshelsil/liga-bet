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
        return collect($this->config)->get("isForClubs") || false;
    }

    public function getCrawler()
    {
        return Crawler::getInstance($this->config["external_id"]);
    }

    private function getGamesSorted()
    {
        // TODO: save game's finish_time on db when marking [is_done=true] & use it to sort
        if (!$this->sortedGames) {
            $this->sortedGames = $this->games()
                ->orderBy('start_time', 'asc')
                ->orderBy('id', 'asc')
                ->get();
        }
        return $this->sortedGames;
    }

    public function getSortedGameIds()
    {
        return $this->getGamesSorted()->pluck('id');
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

    public function areBetsOpen()
    {
        $startTime = $this->getTournamentStartTime();
        $lockBeforeSecs = config('bets.lockBetsBeforeTournamentSeconds');
        return $startTime - $lockBeforeSecs > time();
    }

    public function isStarted()
    {
        return time() > $this->getTournamentStartTime();
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

    public function start()
    {
        $this->tournaments->each(fn(Tournament $t) => $t->start());
    }
}
