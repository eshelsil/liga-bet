<?php 
  
namespace App\Http\Controllers\Auth; 
  
use App\Http\Controllers\Controller;
use App\PasswordResetToken;
use Illuminate\Http\Request; 
use Carbon\Carbon; 
use App\User;
use Auth;
use Mail; 
use Hash;
use Illuminate\Support\Str;

class CustomResetPasswordController extends Controller
{

    public function __construct()
    {
        $this->middleware('guest');
    }

    public function submitForgetPasswordForm(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users',
        ]);
        $email = $request->email;
        $token = Str::random(64);

        PasswordResetToken::updateOrInsert(
            ['email' => $email],
            ['token' => $token, 'created_at' => Carbon::now()],
        );

        Mail::send('email.reset-password', ['token' => $token], function($message) use($email){
            $message->to($email);
            $message->subject('Reset Your Liga-ב\' Password');
        });

        return back()->with('message', 'שלחנו לך לינק לאיפוס הסיסמה!');
    }
  
    public function resetPasswordUsingToken(Request $request, string $token)
    {
        $tokenRow = PasswordResetToken::where(['token' => $token])
            ->first();
        if (!$tokenRow){
            return 'Invalid Token!';
        }
        $createdAt = $tokenRow->created_at;
        if (!(Carbon::now()->diffInMinutes($createdAt) < 60)){
            return 'Token expired!';
        }
        $email = $tokenRow->email;
        $newPass = $token = Str::random(10);

        $user = User::where('email', $email)
            ->update(['password' => Hash::make($newPass)]);

        PasswordResetToken::where('email', $email)->delete();
        Auth::guard()->attempt(
            ['password' => $newPass, 'email' => $email], false
        );
  
        return redirect('/?reset-password');
    }
}