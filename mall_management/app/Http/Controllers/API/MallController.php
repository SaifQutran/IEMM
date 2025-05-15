<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Mall;
use Illuminate\Http\Request;

class MallController extends Controller
{
    public function index()
    {
        $malls = Mall::with(['owner', 'city'])->get()->map(function ($mall) {
            $mall->owner_name = $mall->owner ? $mall->owner->f_name . ' ' . $mall->owner->l_name : null;
            $mall->city_name = $mall->city ? $mall->city->name : null;
            unset($mall->owner, $mall->city);
            return $mall;
        });

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع المولات بنجاح',
            'data' => $malls
        ]);
    }
    public function shops($id)
    {
        $mall = Mall::find($id);

        if (!$mall) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'المول غير موجود',
                'data' => null
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع المحلات بنجاح',
            'data' => $mall->shops
        ]);
    }
    public function products($id)
    {
        $mall = Mall::find($id);

        if (!$mall) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'المول غير موجودة',
                'data' => null
            ], 404);
        }

        $products = $mall->shops()->with('products')->get()->pluck('products')->flatten();

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع محلات المدينة بنجاح',
            'data' => $products
        ]);
    }
    public function productsOfShops($id)
    {
        $mall = Mall::find($id);

        if (!$mall) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'المول غير موجودة',
                'data' => null
            ], 404);
        }

        $products = $mall->shops()->with('products')->get();

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع محلات المدينة بنجاح',
            'data' => $products
        ]);
    }

    public function facilities($id)
    {
        $mall = Mall::find($id);

        if (!$mall) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'المول غير موجود',
                'data' => null
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع المنشأت بنجاح',
            'data' => $mall->facilities
        ]);
    }
    public function chats($id)
    {
        $mall = Mall::find($id);

        if (!$mall) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'المول غير موجود',
                'data' => null
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع المنشأت بنجاح',
            'data' => $mall->chats
        ]);
    }

    public function show($id)
    {
        $mall = Mall::find($id);

        if (!$mall) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'المول غير موجود',
                'data' => null
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع المول بنجاح',
            'data' => $mall
        ]);
    }

    public function store(Request $request)
    {
        try {
            $mall = Mall::create($request->all());

            return response()->json([
                'status' => 'success',
                'code' => 201,
                'message' => 'تم إنشاء المول بنجاح',
                'data' => $mall
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'code' => 400,
                'message' => 'فشل في إنشاء المول',
                'data' => null
            ], 400);
        }
    }

    public function update(Request $request, $id)
    {
        $mall = Mall::find($id);

        if (!$mall) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'المول غير موجود',
                'data' => null
            ], 404);
        }

        $mall->update($request->all());

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم تعديل المول بنجاح',
            'data' => $mall->fresh()
        ]);
    }

    public function destroy($id)
    {
        $mall = Mall::find($id);

        if (!$mall) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'المول غير موجود',
                'data' => null
            ], 404);
        }

        $mall->delete();

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم حذف المول بنجاح',
            'data' => null
        ]);
    }
}
