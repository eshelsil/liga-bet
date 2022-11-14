<?php

namespace App\Http\Controllers\Auth;

use App\User;
use App\Http\Controllers\Controller;
use App\InvitaionsForTournamentAdmin;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Foundation\Auth\RegistersUsers;

class RegisterController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Register Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users as well as their
    | validation and creation. By default this controller uses a trait to
    | provide this functionality without requiring any additional code.
    |
    */

    use RegistersUsers;

    /**
     * Where to redirect users after registration.
     *
     * @var string
     */
    protected $redirectTo = '/home';

    protected $middleware = ['guest'];

    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data)
    {
        return Validator::make($data, [
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:4|confirmed',
        ]);
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return \App\User
     */
    protected function create(array $data)
    {
        $is_first_user = !User::exists();
        $email = $data['email'];
        $permissions = User::TYPE_USER;
        if ($is_first_user){
            $permissions = User::TYPE_ADMIN;
        } elseif (InvitaionsForTournamentAdmin::where('email', $email)->exists()) {
            $permissions = User::TYPE_TOURNAMENT_ADMIN;
            InvitaionsForTournamentAdmin::where('email', $email)->delete();
        }
        $user = User::create([
            'email' => $email,
            'password' => Hash::make($data['password']),
            'permissions' => $permissions
        ]);

        $this->guard()->login($user, true);

        return $user;
    }
}
