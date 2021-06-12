<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function __construct()
    {
       $this->middleware('auth');
    }

    public function showSetPassword()
    {
        return view('set_password');
    }


    public function setPassword(Request $request){
        $user = Auth::user();
        $id = $user->id;
        $validated = $request->validate([
            'new_password' => 'required|string|min:4|confirmed'
        ]);
        $password = $request->new_password;
        $user->password = Hash::make($password);
        $user->save();
        return response()->json(200);
    }
}