<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index()
    {
        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع التقييمات بنجاح',
            'data' => Review::all()
        ]);
    }

    public function show($id)
    {
        $review = Review::find($id);

        if (!$review) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'التقييم غير موجود',
                'data' => null
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع التقييم بنجاح',
            'data' => $review
        ]);
    }

    public function store(Request $request)
    {
        try {
            $review = Review::create($request->all());

            return response()->json([
                'status' => 'success',
                'code' => 201,
                'message' => 'تم إنشاء التقييم بنجاح',
                'data' => $review
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'code' => 400,
                'message' => 'فشل في إنشاء التقييم',
                'data' => null
            ], 400);
        }
    }

    public function update(Request $request, $id)
    {
        $review = Review::find($id);

        if (!$review) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'التقييم غير موجود',
                'data' => null
            ], 404);
        }

        $review->update($request->all());

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم تعديل التقييم بنجاح',
            'data' => $review->fresh()
        ]);
    }

    public function destroy($id)
    {
        $review = Review::find($id);

        if (!$review) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'التقييم غير موجود',
                'data' => null
            ], 404);
        }

        $review->delete();

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم حذف التقييم بنجاح',
            'data' => null
        ]);
    }
}
