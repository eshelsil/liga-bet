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

Route::get('/', function () {
    return redirect('/home');
});
Route::get('/admin', function () {
    return redirect('/admin/index');
});

Auth::routes();
Route::get('logout', 'Auth\LoginController@logout')->name('logout');

Route::post('register-token', 'HomeController@registerFCMToken')->middleware("auth");

Route::get("/home", 'HomeController@index')->middleware("auth")->name('home');
Route::get("/today-matches", 'HomeController@showTodayMatches')->middleware("auth")->middleware("confirmed_user")->name('match-list');
Route::get("/my-bets", 'HomeController@showMyBets')->middleware("auth")->middleware("confirmed_user")->name('my-bets');
Route::get('/open-matches', 'HomeController@showOpenMatches')->middleware("auth")->middleware("confirmed_user")->name('open-matches');
Route::get('/open-group-bets', 'HomeController@showOpenGroupBets')->middleware("auth")->middleware("confirmed_user")->name('open-group-bets');
Route::get('/open-special-bets', 'HomeController@showOpenSpecialBets')->middleware("auth")->middleware("confirmed_user")->name('open-special-bets');
Route::get('/all-group-bets', 'HomeController@showAllGroupBets')->middleware("auth")->middleware("confirmed_user")->middleware("group_bets_closed")->name('all-group-bets');
Route::get('/all-special-bets', 'HomeController@showAllSpecialBets')->middleware("auth")->middleware("confirmed_user")->middleware("group_bets_closed")->name('all-special-bets');
Route::get('/terms', 'HomeController@showTerms')->middleware("auth");
Route::get('/articles', 'HomeController@showArticles')->middleware("auth");
Route::get('/set-password', 'UserController@showSetPassword');
Route::put('/set-password', 'UserController@setPassword');
Route::get('/api-fetch-games', 'ApiFetchController@userUpdateGames');
Route::post('/summary-msg-seen', 'HomeController@summaryMessageSeen')->middleware("auth");

Route::post('/admin/send-global-notification', 'AdminController@sendGlobalNotification');
Route::get('/admin/users-to-confirm', 'AdminController@showUsersToConfirm')->name('users-to-confirm');
Route::get('/admin/confirmed-users', 'AdminController@showConfirmedUsers')->name('confirmed-users');
Route::post('/admin/set-permission', 'AdminController@setPermission');
Route::get('/admin/download-data', 'AdminController@downloadInitialData');
Route::get('/admin/calc-special-bets', 'AdminController@calculateSpecialBets');
Route::get('/admin/calc-special-bet/{name}', 'AdminController@calculateSpecialBet');
Route::get('/admin/index', 'AdminController@showTools');
Route::put('/admin/reset-user-pass/{id}', 'AdminController@resetPass');
Route::get('/admin/remove-irrelevant-scorers', 'AdminController@removeIrrelevantScorers');
Route::get('/admin/add-scorer', 'AdminController@showAddScorer');
Route::post('/admin/add-scorer', 'AdminController@addScorer');
Route::get('/admin/init-scorers', 'AdminController@saveDefaultScorers');
Route::put('/admin/format-custom-answers', 'AdminController@formatSpecialBetsCustomAnswer');
Route::post('/admin/create-rank-row', 'AdminController@createNewRankingRow');
Route::post('/admin/update-last-rank-row', 'AdminController@updateLastRankingRow');
Route::post('/admin/delete-last-rank-row', 'AdminController@removeLastRankingRow');

Route::get('/admin/decomplete-match/{id}', 'AdminController@removeMatchResult');
Route::get('/admin/complete-match/{id}/{scoreHome?}/{scoreAway?}/{isAwayWinner?}', 'AdminController@completeMatch');
Route::get('/admin/switch-bet-match/{fromMatchID}/{toMatchID}', 'AdminController@switchBetMatchIDs');
Route::get('/admin/flip-bets/{matchId}/{userId?}', 'AdminController@flipMatchBet');
Route::get('/admin/danger-switch-groups/{external_id_a}/{external_id_b}', 'AdminController@switchGroups');
Route::get('/admin/delete-match/{matchId}', 'AdminController@deleteMatch');
Route::get('/admin/fetch-games', 'AdminController@fetchGames');
Route::get('/admin/fetch-scorers', 'AdminController@fetchScorers');
Route::get('/admin/fetch-standings', 'AdminController@fetchStandings');
Route::get('/admin/calculate-group-ranks', 'AdminController@calculateGroupRanks');
Route::post('/admin/user-set-name', 'AdminController@setNametoUser');
Route::delete('/admin/delete-user', 'AdminController@deleteUser');
Route::post('/admin/create-monkey-user', 'AdminController@createMonkey');

Route::get('/notifications/send', 'NotificationsController@sendAll');

Route::get('/debug/get-table-ids/{name}', 'DebugController@getTableIds');
Route::get('/debug/get-full-table/{name}', 'DebugController@getFullTable');
Route::get('/debug/scorers-simple-data', 'DebugController@getScorersIntuitiveData');
Route::get('/debug/special-bets-values/{name}', 'DebugController@getSpecialBetsData');

Route::post('/user/update', 'BetsController@submitBets')->middleware("confirmed_user");