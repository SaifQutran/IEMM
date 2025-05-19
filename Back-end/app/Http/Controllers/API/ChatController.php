<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Chat;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function index()
    {
        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع المحادثات بنجاح',
            'data' => Chat::all()
        ]);
    }

    public function show($id)
    {
        $chat = Chat::find($id);

        if (!$chat) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'المحادثة غير موجودة',
                'data' => null
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع المحادثة بنجاح',
            'data' => $chat
        ]);
    }
    public function messages($id)
    {
        $chat = Chat::find($id);

        if (!$chat) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'المحادثة غير موجودة',
                'data' => null
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع المحادثة بنجاح',
            'data' => $chat->messages
        ]);
    }

    public function store(Request $request)
    {
        try {
            $chat = Chat::create($request->all());

            return response()->json([
                'status' => 'success',
                'code' => 201,
                'message' => 'تم إنشاء المحادثة بنجاح',
                'data' => $chat
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'code' => 400,
                'message' => 'فشل في إنشاء المحادثة',
                'data' => null
            ], 400);
        }
    }

    public function update(Request $request, $id)
    {
        $chat = Chat::find($id);

        if (!$chat) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'المحادثة غير موجودة',
                'data' => null
            ], 404);
        }

        $chat->update($request->all());

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم تعديل المحادثة بنجاح',
            'data' => $chat->fresh()
        ]);
    }

    public function destroy($id)
    {
        $chat = Chat::find($id);

        if (!$chat) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'المحادثة غير موجودة',
                'data' => null
            ], 404);
        }

        $chat->delete();

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم حذف المحادثة بنجاح',
            'data' => null
        ]);
    }
}
