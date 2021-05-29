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

Route::get("/home", 'HomeController@index')->middleware("auth")->name('home');
Route::get("/today-matches", 'HomeController@showTodayMatches')->middleware("auth")->middleware("confirmed_user")->name('match-list');
Route::get("/my-bets", 'HomeController@showMyBets')->middleware("auth")->middleware("confirmed_user")->name('my-bets');
Route::get('/open-matches', 'HomeController@showOpenMatches')->middleware("auth")->middleware("confirmed_user")->name('open-matches');
Route::get('/open-group-bets', 'HomeController@showOpenGroupBets')->middleware("auth")->middleware("confirmed_user")->name('open-group-bets');
Route::get('/open-special-bets', 'HomeController@showOpenSpecialBets')->middleware("auth")->middleware("confirmed_user")->name('open-special-bets');
Route::get('/all-group-bets', 'HomeController@showAllGroupBets')->middleware("auth")->middleware("confirmed_user")->middleware("group_bets_closed")->name('all-group-bets');
Route::get('/all-special-bets', 'HomeController@showAllSpecialBets')->middleware("auth")->middleware("confirmed_user")->middleware("group_bets_closed")->name('all-special-bets');
Route::get('/terms', 'HomeController@showTerms');
Route::get('/admin/users-to-confirm', 'AdminController@showUsersToConfirm')->name('users-to-confirm');
Route::get('/admin/confirmed-users', 'AdminController@showConfirmedUsers')->name('confirmed-users');
Route::get('/admin/index', 'AdminController@showTools');
Route::get('/admin/reset-password/{id}', 'AdminController@showResetPassword');
Route::post('/admin/set-permission', 'AdminController@setPermission');
Route::post('/admin/set-password', 'AdminController@setPassword');
Route::get('/admin/download-data', 'AdminController@downloadData');
Route::get('/admin/download-knockout-matches', 'AdminController@downloadKnockoutMatches');
Route::get('/admin/show-home/{id?}', 'AdminController@showHomeA');
Route::get('/admin/save-users', 'AdminController@saveUsers');
Route::get('/admin/reset-user-pass/{id}', 'AdminController@resetPass');
Route::get('/admin/parse-bets/{userId?}/{fixMatchIds?}', 'AdminController@parseGroupBets');
Route::get('/admin/complete-match/{id}/{scoreHome?}/{scoreAway?}', 'AdminController@completeMatch');
Route::get('/admin/decomplete-match/{id}', 'AdminController@removeMatchResult');
Route::get('/admin/complete-all-matches', 'AdminController@completeAllMatches');
Route::get('/admin/calc-special-bets', 'AdminController@calculateSpecialBets');

Route::get('/admin/switch-bet-match/{fromMatchID}/{toMatchID}', 'AdminController@switchBetMatchIDs');
Route::get('/admin/fix-bets/{matchId}/{userId?}', 'AdminController@fixMatchBet');
Route::get('/admin/delete-match/{matchId}', 'AdminController@deleteMatch');
Route::get('/admin/parse-group-rank-bets', 'AdminController@parseGroupRankBets');
Route::get('/admin/parse-special-bets/{userId?}', 'AdminController@parseSpecialBets');
Route::get('/admin/fetch_games', 'AdminController@fetchGames');
Route::get('/admin/fetch_scorers', 'AdminController@fetchScorers');
Route::get('/admin/fetch_standings', 'AdminController@fetchStandings');
Route::get('/admin/calculate-group-ranks', 'AdminController@calculateGroupRanks');
Route::get('/admin/remove-irrelevant-scorers', 'AdminController@removeIrrelevantScorers');
Route::get('/admin/init-scorers', 'AdminController@saveDefaultScorers');
Route::get('/admin/add-scorer', 'AdminController@showAddScorer');
Route::post('/admin/add-scorer', 'AdminController@addScorer');
Route::get('/admin/print-custom-scorers', 'AdminController@printCustomScorerBets');

Route::post('/user/update', 'BetsController@submitBets')->middleware("confirmed_user");