<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Exceptions\JsonException;
use App\Enums\BetTypes;
use App\Nihus;

class NihusimController extends Controller
{
    const ALLOWED_GIFS = [
        'higua.png',
        'kane.jpg',
        'kdb.jpg',
        'lewa.png',
        'mbappe.jpg',
        'vini.jpg',
    ];

    public function seenNihus(Request $request, string $tournamentId)
    {
        $utl = $this->getUser()->getTournamentUser($tournamentId);
        if (!$utl) {
            throw new JsonException("אינך רשום לטורניר זה", 404);
        }
        $nihusId = $request->nihusId;
        if (!$nihusId) {
            throw new JsonException("must provide nihusId", 400);
        }
        $nihus = $utl->nihusimTargeted->first(fn($n) => $n->id == $nihusId);
        if (!$nihus) {
            throw new JsonException("Invalid nihusId", 400);
        }
        $nihus->seen = true;
        $nihus->save();

        return new JsonResponse($nihus, 200);
    }

    public function sendNihus(Request $request, string $tournamentId)
    {
        $utl = $this->getUser()->getTournamentUser($tournamentId);
        if (!$utl) {
            throw new JsonException("אינך רשום לטורניר זה", 404);
        }
        $targetUtlId = $request->targetUtlId;
        $gameId = $request->gameId;
        $text = $request->text;
        $gif = $request->gif;
        if (!$targetUtlId) {
            throw new JsonException("must provide targetUtlId", 400);
        }
        if (!$gameId) {
            throw new JsonException("must provide gameId", 400);
        }
        if (!$gif) {
            throw new JsonException("חייב לבחור gif", 400);
        }
        if (!$text) {
            throw new JsonException("חייב למלא טקסט", 400);
        }

        $targetedUtl = $utl->tournament->competingUtls()->first(fn($u)=>$u->id == $targetUtlId);
        if (!$targetedUtl) {
            throw new JsonException("Invalid targetUtlId", 400);
        }
        $bet = $targetedUtl->bets()->where(['type' => BetTypes::Game, 'type_id' => $gameId])->first();
        if (!$bet) {
            throw new JsonException("המשתמש שבחרת לנאחס לא הימר על המשחק הזה", 400);
        }
        if (!in_array($gif, self::ALLOWED_GIFS)) {
            throw new JsonException("Invalid gif input", 400);
        }
        $len = strlen($text);
        if ($len > 200) {
            throw new JsonException("הודעת ניחוס לא יכולה לכלול מעל 150 תווים", 400);
        }
        if ($len < 4) {
            throw new JsonException("הודעת ניחוס חייבת לכלול לפחות 4 תווים", 400);
        }
        $game = $bet->getRelatedGame();
        if (!$game || !$game->isLive()) {
            throw new JsonException("לא ניתן לשלוח ניחוס למשחק שלא משוחק כרגע", 400);
        }
        $existing = $utl->nihusimSent()->where(['game_id' => $gameId, 'target_utl_id' => $targetUtlId])->first();
        if ($existing) {
            throw new JsonException("שלחת כבר ניחוס עבור הימור זה", 400);
        }
        if (!($utl->getTotalNihusimGranted() > $utl->getTotalNihusimSent())) {
            throw new JsonException("לא נשארו לך ניחוסים...", 403);
        }

        $nihus = Nihus::create([
            'tournament_id' => $tournamentId,
            'game_id' => $gameId,
            'home_score' => $game->result_home ?? 0,
            'away_score' => $game->result_away ?? 0,
            'sender_utl_id' => $utl->id,
            'target_utl_id' => $targetUtlId,
            'text' => $text,
            'gif' => $gif,
            'seen' => false,
        ]);

        return new JsonResponse($nihus, 200);
    }

    public function getNihusimSent(Request $request, string $tournamentId){
        $utl = $this->getUser()->getTournamentUser($tournamentId);
        if (!$utl) {
            throw new JsonException("אינך רשום לטורניר זה", 404);
        }
        $nihusim = $utl->nihusimSent;
        return new JsonResponse($nihusim, 200);
    }
    
    public function getTournamentNihusim(Request $request, string $tournamentId){
        $utl = $this->getUser()->getTournamentUser($tournamentId);
        if (!$utl) {
            throw new JsonException("אינך רשום לטורניר זה", 404);
        }
        $nihusim = $utl->tournament->nihusim;
        return new JsonResponse($nihusim, 200);
    }

    public function getNihusGifs(Request $request, string $tournamentId){
        $utl = $this->getUser()->getTournamentUser($tournamentId);
        if (!$utl) {
            throw new JsonException("אינך רשום לטורניר זה", 404);
        }
        if (!$utl->getTotalNihusimGranted() > 0) {
            throw new JsonException("אין לך הרשאה לגשת למשאב זה", 403);
        }
        return new JsonResponse(self::ALLOWED_GIFS, 200);
    }
}
