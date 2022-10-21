<?php

namespace App\Http\Controllers;

use App\Exceptions\JsonException;
use App\User;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Request;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    protected $user = null;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        Log::debug("[Controller][".static::class."][__construct] Received request!");
        $this->middleware('auth');
    }

    /**
     * @return User
     * @throws JsonException
     */
    protected function getUser()
    {
        $request = Request::instance();
        if (!$this->user) {
            Log::debug("[Controller][".static::class."][__construct] Received request {{$request->get("id")}}{{$request->get("remember")}}!");

            $this->user = Auth::user();
            Log::debug("[Controller][".static::class."][__construct] still here!");
            if (!$this->user) {
                $this->user = User::where("id", "=", $request->get("id"))
                                  ->where("remember_token", "=", $request->get("remember"))
                                  ->first();
            }
        }

        if (!$this->user) {
            throw new JsonException("לא מאומת", 403);
        }

        return $this->user;
    }
}
