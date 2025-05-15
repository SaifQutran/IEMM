<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index()
    {
        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع الإشعارات بنجاح',
            'data' => Notification::all()
        ]);
    }

    public function show($id)
    {
        $notification = Notification::find($id);

        if (!$notification) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'الإشعار غير موجود',
                'data' => null
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع الإشعار بنجاح',
            'data' => $notification
        ]);
    }

    public function store(Request $request)
    {
        try {
            $notification = Notification::create($request->all());

            return response()->json([
                'status' => 'success',
                'code' => 201,
                'message' => 'تم إنشاء الإشعار بنجاح',
                'data' => $notification
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'code' => 400,
                'message' => 'فشل في إنشاء الإشعار',
                'data' => null
            ], 400);
        }
    }

    public function update(Request $request, $id)
    {
        $notification = Notification::find($id);

        if (!$notification) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'الإشعار غير موجود',
                'data' => null
            ], 404);
        }

        $notification->update($request->all());

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم تعديل الإشعار بنجاح',
            'data' => $notification->fresh()
        ]);
    }

    public function destroy($id)
    {
        $notification = Notification::find($id);

        if (!$notification) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'الإشعار غير موجود',
                'data' => null
            ], 404);
        }

        $notification->delete();

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم حذف الإشعار بنجاح',
            'data' => null
        ]);
    }
}
