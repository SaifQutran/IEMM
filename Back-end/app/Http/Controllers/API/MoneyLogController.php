<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\MoneyLog;
use Illuminate\Http\Request;

class MoneyLogController extends Controller
{
    public function index()
    {
        $moneyLogs = MoneyLog::with('shop')
            ->orderBy('date', 'desc')
            ->get()
            ->groupBy(function ($log) {
                return $log->shop_id . '-' . date('Y-m', strtotime($log->date));
            })
            ->map(function ($logs) {
                $firstLog = $logs->first();
                return [
                    'shop_id' => $firstLog->shop_id,
                    'shop_name' => $firstLog->shop ? $firstLog->shop->name : null,
                    'month' => date('Y-m', strtotime($firstLog->date)),
                    'electricity' => $logs->where('type_id', 1)->sum('amount'),
                    'water' => $logs->where('type_id', 2)->sum('amount'),
                    'rent' => $logs->where('type_id', 3)->sum('amount'),
                    'remaining_total' => $logs->sum('amount') - $logs->sum('paid_amount'),
                    'total' => $logs->sum('amount')
                ];
            })
            ->values();

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع السجلات المالية بنجاح',
            'data' => $moneyLogs
        ]);
    }

    public function show($id)
    {
        $moneyLog = MoneyLog::find($id);

        if (!$moneyLog) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'السجل المالي غير موجود',
                'data' => null
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع السجل المالي بنجاح',
            'data' => $moneyLog
        ]);
    }

    public function store(Request $request)
    {
        try {
            $moneyLog = MoneyLog::create($request->all());

            return response()->json([
                'status' => 'success',
                'code' => 201,
                'message' => 'تم إنشاء السجل المالي بنجاح',
                'data' => $moneyLog
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'code' => 400,
                'message' => 'فشل في إنشاء السجل المالي',
                'data' => null
            ], 400);
        }
    }

    public function update(Request $request, $id)
    {
        $moneyLog = MoneyLog::find($id);

        if (!$moneyLog) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'السجل المالي غير موجود',
                'data' => null
            ], 404);
        }

        $moneyLog->update($request->all());

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم تعديل السجل المالي بنجاح',
            'data' => $moneyLog->fresh()
        ]);
    }

    public function destroy($id)
    {
        $moneyLog = MoneyLog::find($id);

        if (!$moneyLog) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'السجل المالي غير موجود',
                'data' => null
            ], 404);
        }

        $moneyLog->delete();

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم حذف السجل المالي بنجاح',
            'data' => null
        ]);
    }
}
