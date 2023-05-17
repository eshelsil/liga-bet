<?php

namespace App;

use App\Enums\BetTypes;
use App\SpecialBets\SpecialBet;
use DB;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Tournament
 *
 * @property int $id
 * @property int $competition_id
 * @property string $name
 * @property array $config
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int $creator_user_id
 * @property string $code
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Bet[] $bets
 * @property-read int|null $bets_count
 * @property-read \App\Competition|null $competition
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\LeaderboardsVersion[] $leaderboardVersions
 * @property-read int|null $leaderboard_versions_count
 * @property-read \App\LeaderboardsVersion|null $leaderboardVersionsLatest
 * @property-read \Illuminate\Database\Eloquent\Collection|SpecialBet[] $specialBets
 * @property-read int|null $special_bets_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\TournamentUser[] $utls
 * @property-read int|null $utls_count
 * @method static \Illuminate\Database\Eloquent\Builder|Tournament newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Tournament newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Tournament query()
 * @method static \Illuminate\Database\Eloquent\Builder|Tournament whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Tournament whereCompetitionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Tournament whereConfig($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Tournament whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Tournament whereCreatorUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Tournament whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Tournament whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Tournament whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Tournament whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Tournament extends Model
{

    const STATUS_DONE = 'done';
    const STATUS_ONGOING = 'ongoing';
    const STATUS_INITIAL = 'initial';

    protected $casts = [
        "config" => "array"
    ];

    protected static $unguarded = true;

    public function competition(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Competition::class);
    }

    public function preferences(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(TournamentPreferences::class);
    }

    public function bets(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Bet::class);
    }

    public function utls(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(TournamentUser::class);
    }

    public function specialBets(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(SpecialBet::class);
    }

    public function leaderboardVersions(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(LeaderboardsVersion::class);
    }

    public function leaderboardVersionsLatest(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(LeaderboardsVersion::class)->latestOfMany();
    }

    public function confirmedUtls()
    {
        return $this->utls->filter(fn(TournamentUser $utl) => $utl->isConfirmed());
    }

    public function competingUtls()
    {
        return $this->utls->filter(fn(TournamentUser $utl) => $utl->isCompeting());
    }

    public function getUtlOfUser(User $user)
    {
        return $this->utls->firstWhere('user_id', $user->id);
    }

    public function shouldAutoConfirmNewUtls()
    {
        return $this->preferences->isAutoConfirmUtlsOn();
    }

    public function hasStarted()
    {
        return $this->status != static::STATUS_INITIAL;
    }

    public function start()
    {
        $this->status = static::STATUS_ONGOING;
        $this->save();
    }

    public function getMvpId()
    {
        $specialQuestion = $this->specialBets()->where('type', SpecialBet::TYPE_MVP)->first();
        if (!$specialQuestion) {
            return null;
        }
        $mvpId = $specialQuestion->answer;
        if (!$mvpId){
            return null;
        }
        return (int) $mvpId;
    }

    public function get2LatestRelevantVersions()
    {
        $versionsDesc = $this->leaderboardVersions()
            ->orderBy('created_at', 'desc')
            ->orderBy('id', 'desc')
            ->get();
        $latestVersion = $versionsDesc->first();
        $lastGameVersion = $versionsDesc->first(fn(LeaderboardsVersion $v) => !is_null($v->game_id));
        if (!$lastGameVersion){
            return collect([]);
        }
        $lastGameStartTime = Game::find($lastGameVersion->game_id)->start_time;
        $latestGameIds =  $this->competition->games()->where('start_time', $lastGameStartTime)->get()->pluck('id');
        $versionsAsc = collect($versionsDesc->reverse())->values();
        $indexOfversionBeforeLatestGames = $versionsAsc->search(
            fn($v) => !is_null($v->game_id) && $latestGameIds->contains($v->game_id)
        ) - 1;
        if ($indexOfversionBeforeLatestGames < 0){
            return collect([$latestVersion]);
        }
        $versionBeforeLastGame = $versionsAsc[$indexOfversionBeforeLatestGames];
        return collect([$latestVersion, $versionBeforeLastGame]);
    }

    public function getLatestGameScore()
    {
        $doneGames = $this->competition->games->filter(fn($g) => $g->is_done);
        $latestStartTime = $doneGames->max('start_time');
        $games = $doneGames->where('start_time', $latestStartTime);
        $relevantGroupIds = collect([]);
        foreach ($games as $game) {
            if ($game->isGroupStage() && !$relevantGroupIds->contains($game->sub_type)){
                $relevantGroupIds->add($game->sub_type);
            }
        }
        $relevantGroups = $this->competition->groups->whereIn('external_id', $relevantGroupIds)->filter(fn($group) => $group->isComplete());

        $scoreGainedPerUtl = [];
        if ($games->count() > 0) {
            foreach ($this->competingUtls() as $utl) {
                $scoreGainedPerUtl[$utl->id] = 0;
                foreach ($games as $game) {
                    $scoreGainedPerUtl[$utl->id] += $utl->calcScoreGainedForGame($game);
                }
                foreach ($relevantGroups as $group) {
                    $scoreGainedPerUtl[$utl->id] += $utl->calcScoreGainedForGroupRank($group);
                }
            }
        }
        return $scoreGainedPerUtl;
    }

    public function getGameScorePerUtl(int $gameId)
    {
        $game = $this->competition->games()->where('id', $gameId)->first();
        if (!$game){
            throw new \RuntimeException("Cannot find game with id $gameId on this tournament (id: $this->id)");
        }

        $scoreGainedPerUtl = $this->competingUtls()->keyBy('id')
            ->map(fn(TournamentUser $utl) => $game->is_done ? $utl->calcScoreGainedForGame($game) : 0);
        return $scoreGainedPerUtl;
    }

    public function getLatestLeaderboard()
    {
        $betsScoreSum = $this->bets()
                     ->select(["user_tournament_id", DB::raw("COALESCE(sum(bets.score), 0) as total_score")])
                     ->groupBy(["user_tournament_id"])
                     ->orderBy("total_score", "desc")
                     ->get();
        $version1 = new LeaderboardsVersion();
        $version1->id = 1;
        $version1->tournament_id = $this->id;
        $version1->description = "";
        $version1->leaderboards = $this->calcRanks($betsScoreSum, $version1->id);

        $latestGameScoreByUtlId = $this->getLatestGameScore();
        $prevVersionScoreSum = $betsScoreSum->map(function($utlScore) use ($latestGameScoreByUtlId){
            $res = $utlScore->replicate();
            $res->total_score = $utlScore->total_score - ($latestGameScoreByUtlId[$utlScore->user_tournament_id] ?? 0);
            return $res;
        });

        $version2 = new LeaderboardsVersion();
        $version2->id = 2;
        $version2->tournament_id = $this->id;
        $version2->description = "";
        $version2->leaderboards = $this->calcRanks($prevVersionScoreSum, $version1->id);
        
        return collect([$version1, $version2]);
    }

    public function calcRanks($betsScoreSum, $versionId)
    {
        $orderedScores = collect($betsScoreSum->sortByDesc('total_score')->values());

        $lastScore = null;
        $rank = null;
        $leaderboardRows = collect([]);
        foreach ($orderedScores as $i => $userScore) {
            if ($lastScore != $userScore->total_score) {
                $rank = $i + 1;
            }

            $leader = new Leaderboard();
            $leader->id                 = $i + $versionId;
            $leader->tournament_id      = $this->id;
            $leader->user_tournament_id = $userScore->user_tournament_id;
            $leader->version_id         = $versionId;
            $leader->rank               = $rank;
            $leader->score = $lastScore = 0 + $userScore->total_score;
            $leaderboardRows->push($leader);
        }
        return $leaderboardRows;
    }

    public function getRelevantPlayerIds()
    {
        $playerSpecialQuestionIds = $this->specialBets()
            ->whereIn("type", [SpecialBet::TYPE_TOP_SCORER, SpecialBet::TYPE_MOST_ASSISTS, SpecialBet::TYPE_MVP])
            ->get()->pluck("id");
        $relevantBets = $this->bets()
            ->where("type", BetTypes::SpecialBet)->whereIn("type_id", $playerSpecialQuestionIds)
            ->get();
        // TODO: add players from actual answers
        return $relevantBets->map(fn($b) => $b->getAnswer())->unique();
    }

    public function hasValidScoreConfig()
    {
        return array_key_exists('scores', $this->config);
    }

    public function createUTL(User $user, string $name)
    {
        $role = TournamentUser::ROLE_NOT_CONFIRMED;
        if ($this->creator_user_id == $user->id){
            $role = TournamentUser::ROLE_ADMIN;
        } elseif ($user->isMonkey()){
            $role = TournamentUser::ROLE_MONKEY;
        } elseif ($this->shouldAutoConfirmNewUtls()) {
            $role = TournamentUser::ROLE_CONTESTANT;
        }

        return TournamentUser::create([
            'user_id' => $user->id,
            'tournament_id' => $this->id,
            'name' => $name,
            'role' => $role
        ]);
    }
}
