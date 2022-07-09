<?php

namespace App\Http\Controllers;

use App\Ranks;
use Illuminate\Http\Request;

class LeaderboardController extends Controller
{
    public function index(Request $request)
    {
        return Ranks::query()->latest()->first()->getData();
    }
}
