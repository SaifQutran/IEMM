<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Facility;
use App\Models\Floor;
use Illuminate\Http\Request;

class FacilityController extends Controller
{
    public function index()
    {
        $facilities = Facility::with(['shop.owner', 'floor'])->get()->map(function ($facility) {
            // Tenant name
            $facility->owner_name = $facility->shop && $facility->shop->owner ? $facility->shop->owner->f_name . ' ' . $facility->shop->owner->l_name : null;
            // Shop name
            $facility->shop_name = $facility->shop ? $facility->shop->name : null;
            // Space
            $facility->space = ($facility->width && $facility->length) ? ($facility->width * $facility->length) : null;
            // Floor number
            $facility->floor_number = $facility->floor ? $facility->floor->floor_number : null;
            $facility->facility_state = $facility->status == 'ture' ? "مستأجر" : "فارغ";
            unset($facility->floor,  $facility->shop);
            return $facility;
        });
        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع المرافق بنجاح',
            'data' => $facilities
        ]);
    }

    public function show($id)
    {
        $facility = Facility::find($id);

        $facility->floor_number = $facility->floor ? $facility->floor->floor_number : null;
        unset($facility->floor);
        if (!$facility) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'المرفق غير موجود',
                'data' => null
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع المرفق بنجاح',
            'data' => $facility
        ]);
    }

    public function store(Request $request)
    {
        $floor = Floor::where(['floor_number' => $request['floor_number'],'mall_id' =>$request['mall_id']])->first();
        $request['floor_id'] = $floor->id;
        unset($request['floor_number']);
        try {
            
            $facility = Facility::create($request->all());
            // var_dump("dsadsadas");

            return response()->json([
                'status' => 'success',
                'code' => 201,
                'message' => 'تم إنشاء المرفق بنجاح',
                'data' => $facility
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'code' => 400,
                'message' => 'فشل في إنشاء المرفق',
                'data' => null,
                'exception' =>$e->getMessage()
            ], 400);
        }
    }

    public function update(Request $request, $id)
    {
        $facility = Facility::find($id);

        if (!$facility) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'المرفق غير موجود',
                'data' => null
            ], 404);
        }

        $facility->update($request->all());

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم تعديل المرفق بنجاح',
            'data' => $facility->fresh()
        ]);
    }

    public function destroy($id)
    {
        $facility = Facility::find($id);

        if (!$facility) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'المرفق غير موجود',
                'data' => null
            ], 404);
        }

        $facility->delete();

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم حذف المرفق بنجاح',
            'data' => null
        ]);
    }
}
