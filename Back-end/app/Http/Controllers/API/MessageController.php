<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index()
    {
        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع الرسائل بنجاح',
            'data' => Message::all()
        ]);
    }

    public function show($id)
    {
        $message = Message::find($id);

        if (!$message) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'الرسالة غير موجودة',
                'data' => null
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع الرسالة بنجاح',
            'data' => $message
        ]);
    }

    public function store(Request $request)
    {
        try {
            $message = Message::create($request->all());

            return response()->json([
                'status' => 'success',
                'code' => 201,
                'message' => 'تم إنشاء الرسالة بنجاح',
                'data' => $message
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'code' => 400,
                'message' => 'فشل في إنشاء الرسالة',
                'data' => null
            ], 400);
        }
    }

    public function update(Request $request, $id)
    {
        $message = Message::find($id);

        if (!$message) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'الرسالة غير موجودة',
                'data' => null
            ], 404);
        }

        $message->update($request->all());

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم تعديل الرسالة بنجاح',
            'data' => $message->fresh()
        ]);
    }

    public function destroy($id)
    {
        $message = Message::find($id);

        if (!$message) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'الرسالة غير موجودة',
                'data' => null
            ], 404);
        }

        $message->delete();

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم حذف الرسالة بنجاح',
            'data' => null
        ]);
    }
}
