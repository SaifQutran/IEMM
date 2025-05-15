<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Stock;
use Illuminate\Http\Request;

class StockController extends Controller
{
    public function index()
    {
        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع المخزون بنجاح',
            'data' => Stock::all()
        ]);
    }

    public function show($id)
    {
        $stock = Stock::find($id);

        if (!$stock) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'المخزون غير موجود',
                'data' => null
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع المخزون بنجاح',
            'data' => $stock
        ]);
    }

    public function store(Request $request)
    {
        try {
            $stock = Stock::create($request->all());

            return response()->json([
                'status' => 'success',
                'code' => 201,
                'message' => 'تم إنشاء المخزون بنجاح',
                'data' => $stock
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'code' => 400,
                'message' => 'فشل في إنشاء المخزون',
                'data' => null
            ], 400);
        }
    }

    public function update(Request $request, $id)
    {
        $stock = Stock::find($id);

        if (!$stock) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'المخزون غير موجود',
                'data' => null
            ], 404);
        }

        $stock->update($request->all());

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم تعديل المخزون بنجاح',
            'data' => $stock->fresh()
        ]);
    }

    public function destroy($id)
    {
        $stock = Stock::find($id);

        if (!$stock) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'المخزون غير موجود',
                'data' => null
            ], 404);
        }

        $stock->delete();

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم حذف المخزون بنجاح',
            'data' => null
        ]);
    }
}
