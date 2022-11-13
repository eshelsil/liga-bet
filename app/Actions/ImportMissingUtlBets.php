<?php


namespace App\Actions;

use App\Bet;
use App\Bets\BetGroupsRank\BetGroupRank;
use App\Bets\BetGroupsRank\BetGroupRankRequest;
use App\Bets\BetMatch\BetMatch;
use App\Bets\BetMatch\BetMatchRequest;
use App\Bets\BetSpecialBets\BetSpecialBets;
use App\Bets\BetSpecialBets\BetSpecialBetsRequest;
use App\Enums\BetTypes;
use App\Game;
use App\Group;
use App\SpecialBets\SpecialBet;
use App\TournamentUser;
use Error;
use Illuminate\Support\Facades\DB;


class ImportMissingUtlBets
{

    public function handle(TournamentUser $utlFrom, TournamentUser $utlTo)
    {
        $newBets = [];
        DB::transaction(function () use ($newBets, $utlFrom, $utlTo) {
            $bets = $utlFrom->bets;
            $games = Game::whereIn('id', $bets->where('type', BetTypes::Game)->pluck('type_id'))->get();
            $specialQuestions = $utlFrom->tournament->specialBets;
            $groups = Group::whereIn('id', $bets->where('type', BetTypes::GroupsRank)->pluck('type_id'))->get();

            $existingBets = $utlTo->bets;
            $bets->each(function(Bet $bet) use ($newBets, $bets, $groups, $specialQuestions, $games, $existingBets, $utlTo){
                switch ($bet->type) {
                    case BetTypes::Game:
                        if ($existingBets->first(fn(Bet $b) => $b->type == $bet->type && $b->type_id == $bet->type_id)){
                            break;
                        }
                        $game = $games->find($bet->type_id);
                        $betRequest = new BetMatchRequest(
                            $game,
                            $utlTo->tournament,
                            json_decode($bet->data, true)
                        );
                        $newBets[] = BetMatch::save($utlTo, $betRequest);
                        break;
                    case BetTypes::GroupsRank:
                        if ($existingBets->first(fn(Bet $b) => $b->type == $bet->type && $b->type_id == $bet->type_id)){
                            break;
                        }
                        $group = $groups->find($bet->type_id);
                        $betRequest = new BetGroupRankRequest(
                            $group,
                            $utlTo->tournament,
                            json_decode($bet->data, true)
                        );
                        $newBets[] = BetGroupRank::save($utlTo, $betRequest);
                        break;
                    case BetTypes::SpecialBet:
                        $specialBetFrom = $specialQuestions->find($bet->type_id);
                        $specialBet = $utlTo->tournament->specialBets->firstWhere('type', $specialBetFrom->type);
                        if ($existingBets->first(fn(Bet $b) => $b->type == $bet->type && $b->type_id == $specialBet->id)){
                            break;
                        }
                        if ($specialBetFrom->type == SpecialBet::TYPE_RUNNER_UP){
                            $winnerSpecialBet = $specialQuestions->firstWhere('type', SpecialBet::TYPE_WINNER);
                            $winnerBet = $bets->first(fn($bet) => $bet->type == BetTypes::SpecialBet && $bet->type_id == $winnerSpecialBet->id );
                            if ($winnerBet && $winnerBet->data == $bet->data){
                                break;
                            }
                        }
                        $utlData = ["utl" => $utlTo];
                        $betRequestData = array_merge($utlData, json_decode($bet->data, true));
                        $betRequest = new BetSpecialBetsRequest(
                            $specialBet,
                            $utlTo->tournament,
                            $betRequestData
                        );
                        $newBets[] = BetSpecialBets::save($utlTo, $betRequest);
                        break;
                    default:
                        throw new Error('Invalid BetType');
                }
            });
        });
        return $newBets;
    }
}