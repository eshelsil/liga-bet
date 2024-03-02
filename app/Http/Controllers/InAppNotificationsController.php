<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Exceptions\JsonException;

class InAppNotificationsController extends Controller
{

    public function seenNotification(Request $request, string $tournamentId)
    {
        $utl = $this->getUser()->getTournamentUser($tournamentId);
        if (!$utl) {
            throw new JsonException("אינך רשום לטורניר זה", 404);
        }
        $notificationId = $request->notificationId;
        if (!$notificationId) {
            throw new JsonException("must provide notificationId", 400);
        }
        $notification = $utl->getNotification($notificationId);
        if (!$notification) {
            throw new JsonException("Invalid notificationId", 400);
        }
        $notification->seen = true;
        $notification->save();

        return new JsonResponse([], 200);
    }

    
    public function getNotifications(Request $request, string $tournamentId){
        $utl = $this->getUser()->getTournamentUser($tournamentId);
        if (!$utl) {
            throw new JsonException("אינך רשום לטורניר זה", 404);
        }
        $notifications = $utl->nihusGrants()->where('seen', false)->get();
        return new JsonResponse($notifications, 200);
    }
}
