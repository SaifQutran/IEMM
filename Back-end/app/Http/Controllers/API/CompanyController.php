<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\Request;

class CompanyController extends Controller
{
    public function index()
    {
        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع الشركات بنجاح',
            'data' => Company::all()
        ]);
    }

    public function show($id)
    {
        $company = Company::find($id);

        if (!$company) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'الشركة غير موجودة',
                'data' => null
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع الشركة بنجاح',
            'data' => $company
        ]);
    }
    public function products($id)
    {
        $company = Company::find($id);

        if (!$company) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'الشركة غير موجودة',
                'data' => null
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع منتجات الشركة بنجاح',
            'data' => $company->products
        ]);
    }

    public function store(Request $request)
    {
        try {
            $company = Company::create($request->all());

            return response()->json([
                'status' => 'success',
                'code' => 201,
                'message' => 'تم إنشاء الشركة بنجاح',
                'data' => $company
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'code' => 400,
                'message' => 'فشل في إنشاء الشركة',
                'data' => null
            ], 400);
        }
    }

    public function update(Request $request, $id)
    {
        $company = Company::find($id);

        if (!$company) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'الشركة غير موجودة',
                'data' => null
            ], 404);
        }

        $company->update($request->all());

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم تعديل الشركة بنجاح',
            'data' => $company->fresh()
        ]);
    }

    public function destroy($id)
    {
        $company = Company::find($id);

        if (!$company) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'الشركة غير موجودة',
                'data' => null
            ], 404);
        }

        $company->delete();

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم حذف الشركة بنجاح',
            'data' => null
        ]);
    }
}
