<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع المنتجات بنجاح',
            'data' => Product::all()
        ]);
    }

    public function show($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'المنتج غير موجود',
                'data' => null
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع المنتج بنجاح',
            'data' => $product
        ]);
    }

    public function store(Request $request)
    {
        try {
            $product = Product::create($request->all());

            return response()->json([
                'status' => 'success',
                'code' => 201,
                'message' => 'تم إنشاء المنتج بنجاح',
                'data' => $product
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'code' => 400,
                'message' => 'فشل في إنشاء المنتج',
                'data' => null
            ], 400);
        }
    }

    public function update(Request $request, $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'المنتج غير موجود',
                'data' => null
            ], 404);
        }

        $product->update($request->all());

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم تعديل المنتج بنجاح',
            'data' => $product->fresh()
        ]);
    }

    public function destroy($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'المنتج غير موجود',
                'data' => null
            ], 404);
        }

        $product->delete();

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم حذف المنتج بنجاح',
            'data' => null
        ]);
    }
}
