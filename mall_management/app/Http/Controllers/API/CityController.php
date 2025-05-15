<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\City;
use Illuminate\Http\Request;

class CityController extends Controller
{
    public function index()
    {
        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع المدن بنجاح',
            'data' => City::all()
        ]);
    }

    public function show($id)
    {
        $city = City::find($id);

        if (!$city) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'المدينة غير موجودة',
                'data' => null
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع المدينة بنجاح',
            'data' => $city
        ]);
    }
    public function malls($id)
    {
        $city = City::find($id);

        if (!$city) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'المدينة غير موجودة',
                'data' => null
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع مولات المدينة بنجاح',
            'data' => $city->malls
        ]);
    }
    public function shops($id)
    {
        $city = City::find($id);

        if (!$city) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'المدينة غير موجودة',
                'data' => null
            ], 404);
        }

        $shops = $city->malls()->with('shops')->get()->pluck('shops')->flatten();

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع محلات المدينة بنجاح',
            'data' => $shops
        ]);
    }

    public function store(Request $request)
    {
        try {
            $city = City::create($request->all());

            return response()->json([
                'status' => 'success',
                'code' => 201,
                'message' => 'تم إنشاء المدينة بنجاح',
                'data' => $city
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'code' => 400,
                'message' => 'فشل في إنشاء المدينة',
                'data' => null
            ], 400);
        }
    }

    public function update(Request $request, $id)
    {
        $city = City::find($id);

        if (!$city) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'المدينة غير موجودة',
                'data' => null
            ], 404);
        }

        $city->update($request->all());

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم تعديل المدينة بنجاح',
            'data' => $city->fresh()
        ]);
    }

    public function destroy($id)
    {
        $city = City::find($id);

        if (!$city) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'المدينة غير موجودة',
                'data' => null
            ], 404);
        }

        $city->delete();

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم حذف المدينة بنجاح',
            'data' => null
        ]);
    }
}
