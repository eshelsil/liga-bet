<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Notifications\SendCloseCallsMatchBetsNotifications;

class NotificationsController extends Controller
{

    /** @var SendCloseCallsMatchBetsNotifications */
    protected $incomingMatchNotifier;

    public function __construct() {
        $this->incomingMatchNotifier = new SendCloseCallsMatchBetsNotifications();
    }
    
    public function sendAll(Request $request){
        $this->incomingMatchNotifier->sendNotifications();
    }
}
