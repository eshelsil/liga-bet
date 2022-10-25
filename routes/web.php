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
use App\Http\Controllers\CompetitionController;
use App\Http\Controllers\DebugController;
use App\Http\Controllers\GamesController;
use App\Http\Controllers\GroupsController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LeaderboardController;
use App\Http\Controllers\PlayersController;
use App\Http\Controllers\SpecialQuestionsController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TournamentUserController;
use App\Http\Controllers\TeamsController;
use App\Http\Controllers\TournamentController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

// Route::get('/admin', function () {
//     return redirect('/admin/index');
// });

Auth::routes();
Route::get('logout', [LoginController::class, 'logout'])->name('logout');


Route::post('register-token', [HomeController::class, 'registerFCMToken'])->middleware("auth");

Route::get('/terms', [HomeController::class, 'showTerms'])->middleware("auth");
Route::get('/articles', [HomeController::class, 'showArticles'])->middleware("auth");
Route::get('/set-password', [UserController::class, 'showSetPassword']);
Route::get('/api-fetch-games', [\App\Http\Controllers\ApiFetchController::class, 'userUpdateGames']);
Route::post('/summary-msg-seen', [HomeController::class, 'summaryMessageSeen'])->middleware("auth");

Route::post('/admin/send-global-notification', [AdminController::class, 'sendGlobalNotification']);
Route::get('/admin/users-to-confirm', [AdminController::class, 'showUsersToConfirm'])->name('users-to-confirm');
Route::get('/admin/confirmed-users', [AdminController::class, 'showConfirmedUsers'])->name('confirmed-users');
Route::post('/admin/set-permission', [AdminController::class, 'setPermission']);
Route::get('/admin/calc-special-bets', [AdminController::class, 'calculateSpecialBets']);
Route::get('/admin/calc-special-bet/{name}', [AdminController::class, 'calculateSpecialBet']);
Route::get('/admin/index', [AdminController::class, 'showTools']);
Route::put('/admin/reset-user-pass/{id}', [AdminController::class, 'resetPass']);
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

Route::prefix("/api/tournaments/{tournamentId}/")->middleware("confirmed_user")
    ->group(function () {
        Route::post('bets', [BetsController::class, 'submitBets']);
        Route::get('bets', [BetsController::class, 'index']);
        Route::get('bets/games', [BetsController::class, 'visibleGameBets']);
        Route::get('bets/primal', [BetsController::class, 'visiblePrimalBets']);
        Route::get('groups', [GroupsController::class, 'index']);
        Route::get('games', [GamesController::class, 'index']);
        Route::get('players', [PlayersController::class, 'index']);
        Route::get("leaderboards", [LeaderboardController::class, 'index']);
        Route::get("contestants", [UserController::class, 'getTournamentUTLs']);
        Route::get("teams", [TeamsController::class, 'index']);
        Route::get("special-questions", [SpecialQuestionsController::class, 'index']);
        Route::prefix("manage/utls")->middleware("tournament_manager")
        ->group(function () {
            Route::get("/", [TournamentUserController::class, 'index']);
            Route::put("/{utlId}", [TournamentUserController::class, 'update']);
            Route::delete("/{utlId}", [TournamentUserController::class, 'delete']);
        });
        Route::prefix("admin")->middleware("tournament_admin")
        ->group(function () {
            // Route::get("/config", [TournamentController::class, 'index']);
            // Route::post("/config", [TournamentController::class, 'update']);
        });
    });
Route::prefix("/api/users")->middleware("admin")
    ->group(function () {
        Route::get('/', [UserController::class, 'index']);
        Route::put('/{userId}', [UserController::class, 'update']);
    });
Route::post('/api/tournaments', [TournamentController::class, 'createTournament']);
Route::put('/api/tournaments/{id}/prizes', [TournamentController::class, 'updateTournamentPrizes']);
Route::put('/api/tournaments/{id}/scores', [TournamentController::class, 'updateTournamentScores']);
Route::put('/api/tournaments/{id}/status', [TournamentController::class, 'updateTournamentStatus']);
Route::get('/api/competitions', [CompetitionController::class, 'index']);
Route::get('/api/user/utls', [UserController::class, 'getUserUTLs']);
Route::post('/api/user/utls', [UserController::class, 'joinTournament']);
Route::delete('/api/user/utls/{tournamentId}', [UserController::class, 'leaveTournament']);
Route::put('/api/user/utls/{tournamentId}', [UserController::class, 'updateUTL']);
Route::get('/api/user', [UserController::class, 'getUser']);
Route::put('/api/user', [UserController::class, 'updateUser']);
Route::get('/api/user/tournaments', [UserController::class, 'getOwnedTournaments']);
Route::put('api/user/set-password', [UserController::class, 'setPassword']);

Route::fallback(function () {
    return view('react-app.index');
})->middleware("auth");
 