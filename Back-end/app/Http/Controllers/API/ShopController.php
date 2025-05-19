<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Shop;
use Illuminate\Http\Request;

class ShopController extends Controller
{
    public function index()
    {
        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع المتاجر بنجاح',
            'data' => Shop::all()
        ]);
    }

    public function show($id)
    {
        $shop = Shop::find($id);

        if (!$shop) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'المتجر غير موجود',
                'data' => null
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع المتجر بنجاح',
            'data' => $shop
        ]);
    }

    public function store(Request $request)
    {
        try {
            $shop = Shop::create($request->all());

            return response()->json([
                'status' => 'success',
                'code' => 201,
                'message' => 'تم إنشاء المتجر بنجاح',
                'data' => $shop
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'code' => 400,
                'message' => 'فشل في إنشاء المتجر',
                'data' => null
            ], 400);
        }
    }

    public function update(Request $request, $id)
    {
        $shop = Shop::find($id);

        if (!$shop) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'المتجر غير موجود',
                'data' => null
            ], 404);
        }

        $shop->update($request->all());

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم تعديل المتجر بنجاح',
            'data' => $shop->fresh()
        ]);
    }

    public function destroy($id)
    {
        $shop = Shop::find($id);

        if (!$shop) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'المتجر غير موجود',
                'data' => null
            ], 404);
        }

        $shop->delete();

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم حذف المتجر بنجاح',
            'data' => null
        ]);
    }
}
