<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use Illuminate\Http\Request;

class SaleController extends Controller
{
    public function index()
    {
        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'Sales retrieved successfully',
            'data' => Sale::all()
        ]);
    }

    public function show($id)
    {
        $sale = Sale::find($id);

        if (!$sale) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'Sale not found',
                'data' => null
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'Sale retrieved successfully',
            'data' => $sale
        ]);
    }

    public function store(Request $request)
    {
        try {
            $sale = Sale::create($request->all());

            return response()->json([
                'status' => 'success',
                'code' => 201,
                'message' => 'Sale created successfully',
                'data' => $sale
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'code' => 400,
                'message' => 'Failed to create sale',
                'data' => null
            ], 400);
        }
    }

    public function update(Request $request, $id)
    {
        $sale = Sale::find($id);

        if (!$sale) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'Sale not found',
                'data' => null
            ], 404);
        }

        $sale->update($request->all());

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'Sale updated successfully',
            'data' => $sale->fresh()
        ]);
    }

    public function destroy($id)
    {
        $sale = Sale::find($id);

        if (!$sale) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'Sale not found',
                'data' => null
            ], 404);
        }

        $sale->delete();

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'Sale deleted successfully',
            'data' => null
        ]);
    }
}
