<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Facility;
use Illuminate\Http\Request;

class FacilityController extends Controller
{
    public function index()
    {
        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع المرافق بنجاح',
            'data' => Facility::all()
        ]);
    }

    public function show($id)
    {
        $facility = Facility::find($id);

        if (!$facility) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'المرفق غير موجود',
                'data' => null
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع المرفق بنجاح',
            'data' => $facility
        ]);
    }

    public function store(Request $request)
    {
        try {
            $facility = Facility::create($request->all());

            return response()->json([
                'status' => 'success',
                'code' => 201,
                'message' => 'تم إنشاء المرفق بنجاح',
                'data' => $facility
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'code' => 400,
                'message' => 'فشل في إنشاء المرفق',
                'data' => null
            ], 400);
        }
    }

    public function update(Request $request, $id)
    {
        $facility = Facility::find($id);

        if (!$facility) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'المرفق غير موجود',
                'data' => null
            ], 404);
        }

        $facility->update($request->all());

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم تعديل المرفق بنجاح',
            'data' => $facility->fresh()
        ]);
    }

    public function destroy($id)
    {
        $facility = Facility::find($id);

        if (!$facility) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'المرفق غير موجود',
                'data' => null
            ], 404);
        }

        $facility->delete();

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم حذف المرفق بنجاح',
            'data' => null
        ]);
    }
}
