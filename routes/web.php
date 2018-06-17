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

Route::get("/home", 'HomeController@index')->name('home');
Route::get("/today-matches", 'HomeController@showTodayMatches')->name('match-list');
Route::get("/my-bets", 'HomeController@showMyBets')->name('my-bets');
Route::get('/admin/download-data', 'AdminController@downloadData');
Route::get('/admin/show-home/{id?}', 'AdminController@showHomeA');
Route::get('/admin/save-users', 'AdminController@saveUsers');
Route::get('/admin/parse-bets', 'AdminController@parseBets');
Route::get('/admin/complete-match/{id?}', 'AdminController@completeMatch');
Route::get('/admin/complete-all-matches', 'AdminController@completeAllMatches');
Route::get('/api/get-open-matches', 'APIController@GetOpenMatches');
