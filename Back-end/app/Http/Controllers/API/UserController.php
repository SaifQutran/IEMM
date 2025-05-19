<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع المستخدمين بنجاح',
            'data' => User::all()
        ]);
    }

    public function show($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'المستخدم غير موجود',
                'data' => null
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع المستخدم بنجاح',
            'data' => $user
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'f_name' => 'required|string|max:50',
            'l_name' => 'required|string|max:50',
            'email' => 'required|email|unique:users',
            'username' => 'required|string|max:50|unique:users',
            'password' => 'required|string|min:8',
            'phone' => 'required|string|max:12',
            'sex' => 'required|boolean',
            'user_type' => 'required|integer|min:1|max:3',
        ]);

        try {
            $user = User::create($request->all());

            return response()->json([
                'status' => 'success',
                'code' => 201,
                'message' => 'تم إنشاء المستخدم بنجاح',
                'data' => $user
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'code' => 400,
                'message' => 'فشل في إنشاء المستخدم',
                'data' => null
            ], 400);
        }
    }

    public function update(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'المستخدم غير موجود',
                'data' => null
            ], 404);
        }

        $user->update($request->all());

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم تعديل المستخدم بنجاح',
            'data' => $user->fresh()
        ]);
    }

    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'المستخدم غير موجود',
                'data' => null
            ], 404);
        }

        $user->delete();

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم حذف المستخدم بنجاح',
            'data' => null
        ]);
    }
}
