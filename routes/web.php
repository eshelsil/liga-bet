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
    return view('welcome');
});

Auth::routes();
Route::get('logout', 'Auth\LoginController@logout')->name('logout');

Route::get("/home", 'HomeController@index')->middleware("auth")->name('home');
Route::get("/today-matches", 'HomeController@showTodayMatches')->middleware("auth")->name('match-list');
Route::get("/my-bets", 'HomeController@showMyBets')->middleware("auth")->name('my-bets');
Route::get('/open-matches', 'HomeController@showOpenMatches')->middleware("auth")->name('open-matches');
Route::get('/admin/users-to-confirm', 'AdminController@showUsersToConfirm');
Route::get('/admin/confirmed-users', 'AdminController@showConfirmedUsers');
Route::post('/admin/set-permission', 'AdminController@setPermission');
Route::get('/admin/download-data', 'AdminController@downloadData');
Route::get('/admin/download-knockout-matches', 'AdminController@downloadKnockoutMatches');
Route::get('/admin/show-home/{id?}', 'AdminController@showHomeA');
Route::get('/admin/save-users', 'AdminController@saveUsers');
Route::get('/admin/reset-user-pass/{id}', 'AdminController@resetPass');
Route::get('/admin/parse-bets/{userId?}/{fixMatchIds?}', 'AdminController@parseGroupBets');
Route::get('/admin/complete-match/{id}/{scoreHome?}/{scoreAway?}', 'AdminController@completeMatch');
Route::get('/admin/complete-all-matches', 'AdminController@completeAllMatches');
Route::get('/admin/complete-group-rank/{groupID}', 'AdminController@completeGroupRank');
Route::get('/admin/complete-special-bet/{specialBetID}', 'AdminController@completeSpecialBet');

Route::get('/admin/switch-bet-match/{fromMatchID}/{toMatchID}', 'AdminController@switchBetMatchIDs');
Route::get('/admin/fix-bets/{matchId}/{userId?}', 'AdminController@fixMatchBet');
Route::get('/admin/delete-match/{matchId}', 'AdminController@deleteMatch');
Route::get('/admin/parse-group-rank-bets', 'AdminController@parseGroupRankBets');
Route::get('/admin/parse-special-bets/{userId?}', 'AdminController@parseSpecialBets');

Route::post('/user/update', 'BetsController@submitBets');