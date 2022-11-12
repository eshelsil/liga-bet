<?php

namespace App;

use App\Enums\BetTypes;
use App\SpecialBets\SpecialBet;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

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

    public function getGamesMissingBet()
    {
        $upcomingGames = $this->tournament->competition->games
            ->filter(fn($game) => (
                $game->isOpenForBets() && $game->start_time - time() < (60 * 60 * 24 * 2)
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

    public function getMissingBets()
    {
        $games = collect($this->getGamesMissingBet())->pluck('id');
        $questions = collect($this->getQuestionsMissingBet())->pluck('id');
        $groups = collect($this->getGroupsMissingRankBet())->pluck('id');

        return [
            "games" => $games,
            "questions" => $questions,
            "groups" => $groups,
        ];
    }
}
