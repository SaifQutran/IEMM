<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Bill;
use Illuminate\Http\Request;

class BillController extends Controller
{

    public function index()
    {
        $data = Bill::with(['shop', 'user', 'customer', 'sales'])->get()->map(function ($data) {
            $data->shop_name = $data->shop ? $data->shop->name  : null;
            $data->user_name = $data->user ? $data->user->f_name . ' ' . $data->user->l_name : null;
            $data->customer_name = $data->customer ? $data->customer->f_name . ' ' . $data->customer->l_name : null;
            $data->sales = $data->sales->map(function ($sale) {
                $sale->product_name = $sale->product ? $sale->product->name : null;
                $sale->total = $sale->quantity * $sale->unit_price;
                unset($sale->product);
                return $sale;
            });

            unset($data->shop, $data->user, $data->customer);
            return $data;
        });
        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع الفواتير بنجاح',
            'data' => $data
        ]);
    }

    public function show($id)
    {
        $bill = Bill::find($id);

        if (!$bill) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'الفاتورة غير موجودة',
                'data' => null
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع الفاتورة بنجاح',
            'data' => $bill
        ]);
    }

    public function store(Request $request)
    {
        try {
            $bill = Bill::create($request->all());

            return response()->json([
                'status' => 'success',
                'code' => 201,
                'message' => 'تم إنشاء الفاتورة بنجاح',
                'data' => $bill
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'code' => 400,
                'message' => 'فشل في إنشاء الفاتورة',
                'data' => null
            ], 400);
        }
    }

    public function update(Request $request, $id)
    {
        $bill = Bill::find($id);

        if (!$bill) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'الفاتورة غير موجودة',
                'data' => null
            ], 404);
        }

        $bill->update($request->all());

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم تعديل الفاتورة بنجاح',
            'data' => $bill->fresh()
        ]);
    }

    public function destroy($id)
    {
        $bill = Bill::find($id);

        if (!$bill) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'الفاتورة غير موجودة',
                'data' => null
            ], 404);
        }

        $bill->delete();

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم حذف الفاتورة بنجاح',
            'data' => null
        ]);
    }
}
