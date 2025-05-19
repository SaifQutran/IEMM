<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Governorate;
use Illuminate\Http\Request;

class GovernorateController extends Controller
{
    public function index()
    {
        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع المحافظات بنجاح',
            'data' => Governorate::all()
        ]);
    }

    public function show($id)
    {
        $governorate = Governorate::find($id);

        if (!$governorate) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'المحافظة غير موجودة',
                'data' => null
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع المحافظة بنجاح',
            'data' => $governorate
        ]);
    }

    public function store(Request $request)
    {
        try {
            $governorate = Governorate::create($request->all());

            return response()->json([
                'status' => 'success',
                'code' => 201,
                'message' => 'تم إنشاء المحافظة بنجاح',
                'data' => $governorate
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'code' => 400,
                'message' => 'فشل في إنشاء المحافظة',
                'data' => null
            ], 400);
        }
    }

    public function update(Request $request, $id)
    {
        $governorate = Governorate::find($id);

        if (!$governorate) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'المحافظة غير موجودة',
                'data' => null
            ], 404);
        }

        $governorate->update($request->all());

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم تعديل المحافظة بنجاح',
            'data' => $governorate->fresh()
        ]);
    }

    public function destroy($id)
    {
        $governorate = Governorate::find($id);

        if (!$governorate) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'المحافظة غير موجودة',
                'data' => null
            ], 404);
        }

        $governorate->delete();

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم حذف المحافظة بنجاح',
            'data' => null
        ]);
    }
}
