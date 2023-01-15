<?php

namespace App;

use App\Bets\BetSpecialBets\BetSpecialBetsRequest;
use App\Enums\BetTypes;
use App\Enums\GameSubTypes;
use App\SpecialBets\SpecialBet;
use Exception;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Log;

/**
 * App\TournamentUser
 *
 * @property int $id
 * @property int $user_id
 * @property int $tournament_id
 * @property string $role
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string $name
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Bet[] $bets
 * @property-read int|null $bets_count
 * @property-read \App\Tournament|null $tournament
 * @property-read \App\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder|TournamentUser newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|TournamentUser newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|TournamentUser query()
 * @method static \Illuminate\Database\Eloquent\Builder|TournamentUser whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TournamentUser whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TournamentUser whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TournamentUser whereRole($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TournamentUser whereTournamentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TournamentUser whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TournamentUser whereUserId($value)
 * @mixin \Eloquent
 */
class TournamentUser extends Model
{
    protected $table = 'user_tournament_links';

    protected static $unguarded = true;

    const ROLE_ADMIN = 'admin';
    const ROLE_MANAGER = 'manager';
    const ROLE_CONTESTANT = 'contestant';
    const ROLE_NOT_CONFIRMED = 'not_confirmed';
    const ROLE_MONKEY = 'monkey';
    const ROLE_REJECTED = 'rejected';

    static function permissions(string $role)
    {
        if ($role == self::ROLE_ADMIN){
            return 3;
        } else if ($role == self::ROLE_MANAGER) {
            return 2;
        } else if ($role == self::ROLE_CONTESTANT) {
            return 1;
        } else if ($role == self::ROLE_NOT_CONFIRMED) {
            return 0;
        } else if ($role == self::ROLE_REJECTED) {
            return -1;
        } else if ($role == self::ROLE_MONKEY) {
            return -2;
        }
    }

    public function isAdmin()
    {
        return $this->role == self::ROLE_ADMIN;
    }

    public function isManager()
    {
        return $this->role == self::ROLE_MANAGER;
    }

    public function isContestant()
    {
        return $this->role == self::ROLE_CONTESTANT;
    }

    public function isNotConfirmed()
    {
        return $this->role == self::ROLE_NOT_CONFIRMED;
    }

    public function isRejected()
    {
        return $this->role == self::ROLE_REJECTED;
    }

    public function hasManagerPermissions()
    {
        return static::permissions($this->role) >= static::permissions(self::ROLE_MANAGER);
    }

    public function isConfirmed()
    {
        return static::permissions($this->role) > static::permissions(self::ROLE_NOT_CONFIRMED);
    }
    
    public function isRegistered()
    {
        return static::permissions($this->role) >= static::permissions(self::ROLE_NOT_CONFIRMED);
    }

    public function isMonkey()
    {
        return $this->role == self::ROLE_MONKEY;
    }

    public function isCompeting()
    {
        return $this->isConfirmed() || $this->isMonkey();
    }


    public function tournament(): BelongsTo
    {
        return $this->belongsTo(Tournament::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function bets(): HasMany
    {
        return $this->hasMany(Bet::class, "user_tournament_id");
    }

    public function wasAnActiveUser(): bool
    {
        $gameBets = $this->bets()->where('type', BetTypes::Game)->get();
        $relevantGames = $this->tournament->competition->games()
            ->whereNotIn('sub_type', [GameSubTypes::FINAL, GameSubTypes::THIRD_PLACE, GameSubTypes::SEMI_FINALS])
            ->get();
        $relevantGameIds = $relevantGames->pluck('id');
        return $gameBets->whereIn('type_id', $relevantGameIds)->count() >= ($relevantGameIds->count() - 6);
    }

    public function getGamesMissingBet()
    {
        $upcomingGames = $this->tournament->competition->games
            ->filter(fn($game) => (
                $game->isOpenForBets()
            ));
        $betsByGameId = $this->bets->where('type', BetTypes::Game)
            ->keyBy('type_id')->toArray();
        
        $gamesMissingBet = $upcomingGames->reduce(function ($res, $game) use($betsByGameId) {
            if (!array_key_exists($game->id, $betsByGameId)){
                $res[] = $game;
            }
            return $res;
        }, []);

        return $gamesMissingBet;
    }

    public function getQuestionsMissingBet()
    {
        $specialQuestions = $this->tournament->specialBets
            ->filter(fn(SpecialBet $specialQuestion) => ($specialQuestion->isOn()));
        $betsByQuestionId = $this->bets->where('type', BetTypes::SpecialBet)
            ->keyBy('type_id')->toArray();
        
        $questionsMissingBet = $specialQuestions->reduce(function ($res, $question) use($betsByQuestionId) {
            if (!array_key_exists($question->id, $betsByQuestionId)){
                $res[] = $question;
            }
            return $res;
        }, []);
        return $questionsMissingBet;
    }
    
    public function getGroupsMissingRankBet()
    {
        $groups = $this->tournament->competition->groups;
        $rankBetsByGroupId = $this->bets->where('type', BetTypes::GroupsRank)
            ->keyBy('type_id')->toArray();
        
        $groupsMissingBet = $groups->reduce(function ($res, $group) use($rankBetsByGroupId) {
            if (!array_key_exists($group->id, $rankBetsByGroupId)){
                $res[] = $group;
            }
            return $res;
        }, []);
        return $groupsMissingBet;
    }

    public function getMissingOpenBets()
    {
        $tournamentStarted = $this->tournament->hasStarted();
        
        $games = collect($this->getGamesMissingBet())
            ->filter(fn(Game $game) => $game->isOpenForBets())
            ->pluck('id');
        $questions = $tournamentStarted
            ? []
            : collect($this->getQuestionsMissingBet())
                ->pluck('id');
        $groups = $tournamentStarted
            ? []
            : collect($this->getGroupsMissingRankBet())
                ->pluck('id');

        return [
            "games" => $games,
            "questions" => $questions,
            "groups" => $groups,
        ];
    }

    public function calcScoreGainedForGame(Game $game)
    {
        $score = 0;

        $gameBet = $this->bets->first(fn($bet) => $bet->type == BetTypes::Game && $bet->type_id == $game->id);
        if ($gameBet) {
            $score += $gameBet->score;
        }

        foreach ($this->bets->where("type", BetTypes::SpecialBet) as $questionBet) {
            try {
                $specialQuestion = $this->tournament->specialBets->firstWhere("id", $questionBet->type_id);
                if ($specialQuestion) {
                    $betRequest = new BetSpecialBetsRequest($specialQuestion, $this->tournament, $questionBet->getData() + ["utl" => $this]);
                    $score += $betRequest->calculateScoreForGame($game);
                }
            } catch (Exception $e) {
                Log::debug("[TournamentUser][calcScoreGainedForGame] Error! {$e->getMessage()} - {$e->getTraceAsString()}");
            }
        }

        return $score;
    }

    public function calcScoreGainedForGroupRank(Group $group)
    {
        $bet = $this->bets->first(fn($bet) => $bet->type == BetTypes::GroupsRank && $bet->type_id == $group->id);
        if (!$bet) {
            return 0;
        }
        return $bet->score;
    }
}
