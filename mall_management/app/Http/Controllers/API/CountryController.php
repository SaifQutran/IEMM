<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Country;
use Illuminate\Http\Request;

class CountryController extends Controller
{
    public function index()
    {
        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع البلدان بنجاح',
            'data' => Country::all()
        ]);
    }

    public function show($id)
    {
        $country = Country::find($id);

        if (!$country) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'البلد غير موجود',
                'data' => null
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع البلد بنجاح',
            'data' => $country
        ]);
    }

    public function store(Request $request)
    {
        try {
            $country = Country::create($request->all());

            return response()->json([
                'status' => 'success',
                'code' => 201,
                'message' => 'تم إنشاء البلد بنجاح',
                'data' => $country
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'code' => 400,
                'message' => 'فشل في إنشاء البلد',
                'data' => null
            ], 400);
        }
    }

    public function update(Request $request, $id)
    {
        $country = Country::find($id);

        if (!$country) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'البلد غير موجود',
                'data' => null
            ], 404);
        }

        $country->update($request->all());

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم تعديل البلد بنجاح',
            'data' => $country->fresh()
        ]);
    }

    public function destroy($id)
    {
        $country = Country::find($id);

        if (!$country) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'البلد غير موجود',
                'data' => null
            ], 404);
        }

        $country->delete();

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم حذف البلد بنجاح',
            'data' => null
        ]);
    }
}
