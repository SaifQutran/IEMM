<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    public function index()
    {
        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع الحجوزات بنجاح',
            'data' => Reservation::all()
        ]);
    }

    public function show($id)
    {
        $reservation = Reservation::find($id);

        if (!$reservation) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'الحجز غير موجود',
                'data' => null
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع الحجز بنجاح',
            'data' => $reservation
        ]);
    }

    public function store(Request $request)
    {
        try {
            $reservation = Reservation::create($request->all());

            return response()->json([
                'status' => 'success',
                'code' => 201,
                'message' => 'تم إنشاء الحجز بنجاح',
                'data' => $reservation
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'code' => 400,
                'message' => 'فشل في إنشاء الحجز',
                'data' => null
            ], 400);
        }
    }

    public function update(Request $request, $id)
    {
        $reservation = Reservation::find($id);

        if (!$reservation) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'الحجز غير موجود',
                'data' => null
            ], 404);
        }

        $reservation->update($request->all());

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم تعديل الحجز بنجاح',
            'data' => $reservation->fresh()
        ]);
    }

    public function destroy($id)
    {
        $reservation = Reservation::find($id);

        if (!$reservation) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'الحجز غير موجود',
                'data' => null
            ], 404);
        }

        $reservation->delete();

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم حذف الحجز بنجاح',
            'data' => null
        ]);
    }
}
