<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Shop;
use App\Models\Mall;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\Rules\Password as PasswordRule;
use Illuminate\Support\Str;

class AuthController extends Controller
{


    public function register(Request $request)
    {
        $request->validate([
            'f_name' => 'required|string|max:50',
            'l_name' => 'required|string|max:50',
            'email' => 'required|email|unique:users',
            'username' => 'required|string|max:50|unique:users',
            'password' => ['required', 'confirmed', PasswordRule::min(8)],
            'phone' => 'required|string|max:12',
            'sex' => 'required|boolean',
            'user_type' => 'required|integer|min:1|max:3',
            'birth_date' => 'nullable|date',
        ]);

        $user = User::create([
            'f_name' => $request->f_name,
            'l_name' => $request->l_name,
            'email' => $request->email,
            'username' => $request->username,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'sex' => $request->sex,
            'user_type' => $request->user_type,
            'birth_date' => $request->birth_date,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'code' => 201,
            'message' => 'تم إنشاء الحساب بنجاح',
            'data' => [
                'user' => $user,
                'token' => $token
            ]
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'login' => 'required|string',
            'password' => 'required|string',
        ]);
        
        $user = User::where('email', $request->login)
            ->orWhere('username', $request->login)
            ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => 'error',
                'code' => 401,
                'message' => 'بيانات الدخول غير صحيحة',
                'data' => null
            ], 401);
        }

        $user->update(['signed_in' => true]);
        $token = $user->createToken('auth_token')->plainTextToken;

        if ($user->user_type == 2) {
            $shop = Shop::find($user->shop_id);
            $shop->update(['state' => true]);
            return response()->json([
                'status' => 'success',
                'code' => 200,
                'message' => 'تم تسجيل الدخول بنجاح',
                'data' => [
                    'user_name' => $user->f_name . ' ' . $user->l_name,
                    'user_id' => $user->id,
                    'token' => $token,
                    'shop_id' => $shop->id,
                    'user_type' => $user->user_type,
                    'is_owner' => $shop->owner_id == $user->id ? true : false
                ]
            ]);
        } else if ($user->user_type == 1) {
            $mall = Mall::where('owner_id', $user->id)->first();

            return response()->json([
                'status' => 'success',
                'code' => 200,
                'message' => 'تم تسجيل الدخول بنجاح',
                'data' => [
                    'user_name' => $user->f_name . ' ' . $user->l_name,
                    'user_id' => $user->id,
                    'token' => $token,
                    'mall_id' => $mall->id,
                    'user_type' => $user->user_type
                ]
            ]);
        } else if ($user->user_type == 3 || $user->user_type == 4) {
            return response()->json([
                'status' => 'success',
                'code' => 200,
                'message' => 'تم تسجيل الدخول بنجاح',
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'f_name' => $user->f_name,
                        'l_name' => $user->l_name,
                        'email' => $user->email,
                        'phone' => $user->phone,
                        'sex' => $user->sex,
                        'created_at' => $user->created_at,
                        'updated_at' => $user->updated_at
                    ],

                    'token' => $token,
                    'user_type' => $user->user_type
                ]
            ]);
        }
    }

    public function logout(Request $request)
    {
        // Verify token and get user
        $user = $request->user();
        if (!$user) {
            return response()->json([
                'status' => 'error',
                'code' => 401,
                'message' => 'غير مصرح',
                'data' => null
            ], 401);
        }

        // Revoke the token that was used to authenticate the current request
        $request->user()->currentAccessToken()->delete();
        $user->remebrer_token = null;
        $user->save();

        if ($user->user_type == 2) {
            $shop = Shop::find($user->shop_id);
            $shop->update(['state' => false]);
        }

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم تسجيل الخروج بنجاح',
            'data' => null
        ]);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email'
        ]);

        $status = Password::sendResetLink($request->only('email'));

        if ($status == Password::RESET_LINK_SENT) {
            return response()->json([
                'status' => 'success',
                'code' => 200,
                'message' => 'تم إرسال رابط إعادة تعيين كلمة المرور',
                'data' => null
            ]);
        }

        return response()->json([
            'status' => 'error',
            'code' => 400,
            'message' => 'فشل في إرسال رابط إعادة تعيين كلمة المرور',
            'data' => null
        ], 400);
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => ['required', 'confirmed', PasswordRule::min(8)],
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->setRememberToken(Str::random(60));
                $user->save();
            }
        );

        if ($status == Password::PASSWORD_RESET) {
            return response()->json([
                'status' => 'success',
                'code' => 200,
                'message' => 'تم تغيير كلمة المرور بنجاح',
                'data' => null
            ]);
        }

        return response()->json([
            'status' => 'error',
            'code' => 400,
            'message' => 'فشل في تغيير كلمة المرور',
            'data' => null
        ], 400);
    }

    // Add a method to verify token
    public function verifyToken(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json([
                'status' => 'error',
                'code' => 401,
                'message' => 'Token غير صالح',
                'data' => null
            ], 401);
        }

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'Token صالح',
            'data' => [
                'user' => $user
            ]
        ]);
    }
}
