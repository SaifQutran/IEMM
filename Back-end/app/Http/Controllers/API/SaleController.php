<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use App\Models\Stock;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
            // var_dump($sale);
            // Get the primary warehouse for the product's shop
            $primaryWarehouse = Warehouse::where('shop_id', $sale->product->shop_id)
                ->where('is_primary', true)
                ->first(); 
            // var_dump($primaryWarehouse);
            if ($primaryWarehouse) {
                // Update stock quantity in primary warehouse
                Stock::where('product_id', $sale->product_id)
                    ->where('warehouse_id', $primaryWarehouse->id)
                    ->update(['quantity' => DB::raw('quantity - ' . $sale->quantity)]);
            }

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
