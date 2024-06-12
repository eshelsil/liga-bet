<?php

namespace App;

use App\Enums\BetTypes;
use App\SpecialBets\SpecialBet;
use Illuminate\Database\Eloquent\Collection;
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

    public function sideTournaments(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(SideTournament::class);
    }

    public function nihusim(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Nihus::class);
    }

    public function confirmedUtls()
    {
        return $this->utls->filter(fn(TournamentUser $utl) => $utl->isConfirmed());
    }

    public function competingUtls()
    {
        return $this->utls->filter(fn(TournamentUser $utl) => $utl->isCompeting());
    }

    public function getSideTournamentGames()
    {
        $config = $this->config;
        if (array_key_exists('sideTournamentGames', $config)){
            return collect($config['sideTournamentGames']);
        }
        return collect();
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
        try {
            $this->updateToNumeralScoreConfig();
        } catch (\Throwable $e) {
            \Log::error("Got error while trying to update score config to numeral on tournament {$this->id}");
        }
        $this->save();
    }

    public function finish()
    {
        $this->status = static::STATUS_DONE;
        $this->save();
    }

    public static function mapScoreConfigToNumeral(array $config)
    {
        function updateToNumber(&$array) {
            foreach ($array as $key => &$value) {
                if (is_array($value)) {
                    updateToNumber($value);
                } else {
                    $value = (int)$value;
                }
            }
        }

        if (isset($config['scores']) && is_array($config['scores'])) {
            updateToNumber($config['scores']['gameBets']);
            updateToNumber($config['scores']['specialBets']);
            updateToNumber($config['scores']['groupRankBets']);
        }
        return $config;
    }

    public function updateToNumeralScoreConfig(){
        $config = $this->config;
        $numeralEnforcedConfig = static::mapScoreConfigToNumeral($config);
        $this->config = $numeralEnforcedConfig;
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

    public function getBetsScorePerUtlForGame(int $gameId, ?int $sideTournamentId)
    {
        $game = $this->competition->games()->where('id', $gameId)->first();
        if (!$game){
            throw new \RuntimeException("Cannot find game with id $gameId on this tournament (id: $this->id)");
        }

        $competingUtls = $this->competingUtls();
        if ($sideTournamentId){
            $competingUtls = SideTournament::find($sideTournamentId)->competingUtls();
        }
        $betsWithScoreGainedPerUtl = $competingUtls->keyBy('id')
            ->map(fn(TournamentUser $utl) => $game->is_done ? $utl->getBetsWithScoreGainedForGame($game, $sideTournamentId) : new Collection());
        return $betsWithScoreGainedPerUtl;
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

    public function deprecatedQuestionBets()
    {
        $flaggedOffQuestions = collect($this->config["scores"]["specialQuestionFlags"])->filter(fn($isOn) => !$isOn)->keys()->toArray();
        $deprecatedSpecialQuestionIds = $this->specialBets->filter(fn($sq) => in_array($sq->getFlagName(), $flaggedOffQuestions))->pluck('id');
        \Log::debug("Found {$deprecatedSpecialQuestionIds->count()} deprecated specialQuestions for tournament {$this->id}");
        return $this->bets()
            ->where("type", BetTypes::SpecialBet)->whereIn("type_id", $deprecatedSpecialQuestionIds)
            ->get();
    }

    public function deleteDeprecatedQuestionBets()
    {
        $betIds = $this->deprecatedQuestionBets()->pluck('id');
        $this->bets()->whereIn("id", $betIds)->delete();
        \Log::debug("deleted {$betIds->count()} bets");
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
