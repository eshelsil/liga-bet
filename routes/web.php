<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

use App\Http\Controllers\AdminController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\BetsController;
use App\Http\Controllers\DebugController;
use App\Http\Controllers\GroupsController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LeaderboardController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TournamentUserController;
use App\Http\Controllers\TeamsController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

// Route::get('/', function () {
//     return redirect('/home');
// });

// Route::get('/react', function () {
//     return view('layouts.react');
// });
Route::get('/admin', function () {
    return redirect('/admin/index');
});

Auth::routes();
Route::get('logout', [LoginController::class, 'logout'])->name('logout');


Route::post('register-token', [HomeController::class, 'registerFCMToken'])->middleware("auth");

// Route::get("/home", [HomeController::class, 'index'])->middleware("auth")->name('home');
// Route::get("/today-matches", [HomeController::class, 'showTodayMatches'])->middleware("auth")->middleware("confirmed_user")->name('match-list');
// Route::get("/my-bets", [HomeController::class, 'showMyBets'])->middleware("auth")->middleware("confirmed_user")->name('my-bets');
// Route::get('/open-matches', [HomeController::class, 'showOpenMatches'])->middleware("auth")->middleware("confirmed_user")->name('open-matches');
// Route::get('/all-group-bets', [HomeController::class, 'showAllGroupBets'])->middleware("auth")->middleware("confirmed_user")->middleware("group_bets_closed")->name('all-group-bets');
Route::get('/terms', [HomeController::class, 'showTerms'])->middleware("auth");
Route::get('/articles', [HomeController::class, 'showArticles'])->middleware("auth");
Route::get('/set-password', [UserController::class, 'showSetPassword']);
Route::put('/set-password', [UserController::class, 'setPassword']);
Route::get('/api-fetch-games', [\App\Http\Controllers\ApiFetchController::class, 'userUpdateGames']);
Route::post('/summary-msg-seen', [HomeController::class, 'summaryMessageSeen'])->middleware("auth");

Route::post('/admin/send-global-notification', [AdminController::class, 'sendGlobalNotification']);
Route::get('/admin/users-to-confirm', [AdminController::class, 'showUsersToConfirm'])->name('users-to-confirm');
Route::get('/admin/confirmed-users', [AdminController::class, 'showConfirmedUsers'])->name('confirmed-users');
Route::post('/admin/set-permission', [AdminController::class, 'setPermission']);
Route::get('/admin/download-data', [AdminController::class, 'downloadInitialData']);
Route::get('/admin/calc-special-bets', [AdminController::class, 'calculateSpecialBets']);
Route::get('/admin/calc-special-bet/{name}', [AdminController::class, 'calculateSpecialBet']);
Route::get('/admin/index', [AdminController::class, 'showTools']);
Route::put('/admin/reset-user-pass/{id}', [AdminController::class, 'resetPass']);
Route::get('/admin/remove-irrelevant-scorers', [AdminController::class, 'removeIrrelevantScorers']);
Route::get('/admin/add-scorer', [AdminController::class, 'showAddScorer']);
Route::post('/admin/add-scorer', [AdminController::class, 'addScorer']);
Route::get('/admin/init-scorers', [AdminController::class, 'saveDefaultScorers']);
Route::put('/admin/format-custom-answers', [AdminController::class, 'formatSpecialBetsCustomAnswer']);
Route::post('/admin/create-rank-row', [AdminController::class, 'createNewRankingRow']);
Route::post('/admin/update-last-rank-row', [AdminController::class, 'updateLastRankingRow']);
Route::post('/admin/delete-last-rank-row', [AdminController::class, 'removeLastRankingRow']);

Route::get('/admin/decomplete-match/{id}', [AdminController::class, 'removeMatchResult']);
Route::get('/admin/complete-match/{id}/{scoreHome?}/{scoreAway?}/{isAwayWinner?}', [AdminController::class, 'completeMatch']);
Route::get('/admin/switch-bet-match/{fromMatchID}/{toMatchID}', [AdminController::class, 'switchBetMatchIDs']);
Route::get('/admin/flip-bets/{matchId}/{userId?}', [AdminController::class, 'flipMatchBet']);
Route::get('/admin/danger-switch-groups/{external_id_a}/{external_id_b}', [AdminController::class, 'switchGroups']);
Route::get('/admin/delete-match/{matchId}', [AdminController::class, 'deleteMatch']);
Route::get('/admin/calculate-group-ranks', [AdminController::class, 'calculateGroupRanks']);
Route::post('/admin/user-set-name', [AdminController::class, 'setNametoUser']);
Route::delete('/admin/delete-user', [AdminController::class, 'deleteUser']);
Route::post('/admin/create-monkey-user', [AdminController::class, 'createMonkey']);

Route::get('/notifications/send', [AdminController::class, 'sendAll']);

Route::get('/debug/get-table-ids/{name}', [DebugController::class, 'getTableIds']);
Route::get('/debug/get-full-table/{name}', [DebugController::class, 'getFullTable']);
Route::get('/debug/scorers-simple-data', [DebugController::class, 'getScorersIntuitiveData']);
Route::get('/debug/special-bets-values/{name}', [DebugController::class, 'getSpecialBetsData']);

// Route::post('/user/update', [BetsController::class, 'submitBets'])->middleware("confirmed_user");
Route::prefix("/api/tournaments/{tournamentId}/")->middleware("confirmed_user")
     ->group(function () {
         Route::post('bets', [BetsController::class, 'submitBets']);
         Route::get('bets', [BetsController::class, 'index']);
         Route::get('bets/closed-games', [BetsController::class, 'openGames']);
         Route::get('groups', [GroupsController::class, 'index']);
         Route::get('games', [\App\Http\Controllers\GamesController::class, 'index']);
         Route::get("leaderboards", [LeaderboardController::class, 'index']);
         Route::get("utls", [UserController::class, 'getTournamentUTLs']);
        //  Route::get("utls", [TournamentUserController::class, 'index']);
         Route::get("teams", [TeamsController::class, 'index']);
    });
Route::get('/api/user', [UserController::class, 'getUser']);
Route::get('/api/user/utls', [UserController::class, 'getUserUTLs']);

Route::fallback(function () {
    return view('react-app.index');
})->middleware("auth");
 