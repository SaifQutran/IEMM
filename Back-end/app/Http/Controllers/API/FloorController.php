<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Floor;
use Illuminate\Http\Request;

class FloorController extends Controller
{
    public function index()
    {
        $floors = Floor::with('mall')->get()->map(function ($floor) {
            return [
                'id' => $floor->id,
                'length' => $floor->length,
                'width' => $floor->width,
                'floor_number' => $floor->floor_number,
                'mall_id' => $floor->mall_id,
                'mall_name' => $floor->mall ? $floor->mall->name : null,
                'area' => $floor->length * $floor->width
            ];
        });

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع الطوابق بنجاح',
            'data' => $floors
        ]);
    }

    public function show($id)
    {
        $floor = Floor::with('mall')->find($id);

        if (!$floor) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'الطابق غير موجود',
                'data' => null
            ], 404);
        }

        $floor->mall_name = $floor->mall ? $floor->mall->name : null;
        $floor->area = $floor->length * $floor->width;

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع الطابق بنجاح',
            'data' => $floor
        ]);
    }

    public function store(Request $request)
    {
        try {
            $floor = Floor::create($request->all());

            return response()->json([
                'status' => 'success',
                'code' => 201,
                'message' => 'تم إنشاء الطابق بنجاح',
                'data' => $floor
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'code' => 400,
                'message' => 'فشل في إنشاء الطابق',
                'data' => null
            ], 400);
        }
    }

    public function update(Request $request, $id)
    {
        $floor = Floor::find($id);

        if (!$floor) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'الطابق غير موجود',
                'data' => null
            ], 404);
        }

        $floor->update($request->all());

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم تعديل الطابق بنجاح',
            'data' => $floor->fresh()
        ]);
    }

    public function destroy($id)
    {
        $floor = Floor::find($id);

        if (!$floor) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'الطابق غير موجود',
                'data' => null
            ], 404);
        }

        $floor->delete();

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم حذف الطابق بنجاح',
            'data' => null
        ]);
    }

    public function shops($id)
    {
        $floor = Floor::with(['mall.shops' => function ($query) use ($id) {
            $query->whereHas('facility', function ($q) use ($id) {
                $q->where('floor_id', $id);
            });
        }])->find($id);

        if (!$floor) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'الطابق غير موجود',
                'data' => null
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع المحلات بنجاح',
            'data' => $floor->mall->shops
        ]);
    }

    public function facilities($id)
    {
        $floor = Floor::with('facilities')->find($id);

        if (!$floor) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'الطابق غير موجود',
                'data' => null
            ], 404);
        }

        $facilities = $floor->facilities->map(function ($facility) {
            return [
                'id' => $facility->id,
                'width' => $facility->width,
                'length' => $facility->length,
                'rent_price' => $facility->rent_price,
                'electricity_id_number' => $facility->electricity_id_number,
                'water_id_number' => $facility->water_id_number,
                'X_Coordinates' => $facility->X_Coordinates,
                'Y_Coordinates' => $facility->Y_Coordinates,
                'status' => $facility->status,
                'shop' => $facility->shop ? [
                    'id' => $facility->shop->id,
                    'name' => $facility->shop->name
                ] : null
            ];
        });

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع المنشآت بنجاح',
            'data' => $facilities
        ]);
    }
}
