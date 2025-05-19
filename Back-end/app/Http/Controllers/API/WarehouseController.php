<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Warehouse;
use Illuminate\Http\Request;

class WarehouseController extends Controller
{
    public function index()
    {
        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'Warehouses retrieved successfully',
            'data' => Warehouse::all()
        ]);
    }

    public function show($id)
    {
        $warehouse = Warehouse::find($id);

        if (!$warehouse) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'Warehouse not found',
                'data' => null
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'Warehouse retrieved successfully',
            'data' => $warehouse
        ]);
    }

    public function store(Request $request)
    {
        try {
            $warehouse = Warehouse::create($request->all());

            return response()->json([
                'status' => 'success',
                'code' => 201,
                'message' => 'Warehouse created successfully',
                'data' => $warehouse
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'code' => 400,
                'message' => 'Failed to create warehouse',
                'data' => null
            ], 400);
        }
    }

    public function update(Request $request, $id)
    {
        $warehouse = Warehouse::find($id);

        if (!$warehouse) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'Warehouse not found',
                'data' => null
            ], 404);
        }

        $warehouse->update($request->all());

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'Warehouse updated successfully',
            'data' => $warehouse->fresh()
        ]);
    }

    public function destroy($id)
    {
        $warehouse = Warehouse::find($id);

        if (!$warehouse) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'Warehouse not found',
                'data' => null
            ], 404);
        }

        $warehouse->delete();

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'Warehouse deleted successfully',
            'data' => null
        ]);
    }
}
