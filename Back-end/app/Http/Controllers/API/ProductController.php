<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Stock;
use App\Models\Warehouse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        $data = Product::with(['stocks.warehouse', 'stocks'])->get();
        $data = $data->map(function ($product) {
            $product->total_stock = $product->stocks->sum('quantity');
            $product->image_urls = [];
            $productPath = storage_path('app/public/products/' . $product->id);
            if (file_exists($productPath)) {
                $files = scandir($productPath);
                foreach ($files as $file) {
                    if ($file != '.' && $file != '..') {
                        $product->image_urls[] = storage_path('app/public/products/' . $product->id . '/' . $file);
                    }
                }
            }


            $product->in_primary_stock = $product->stocks->filter(function ($stock) {
                if (Warehouse::find($stock->warehouse_id)->is_primary) {
                    return $stock->quantity;
                }
                return 0;
            })->sum('quantity');
            $product->in_secondary_stock = $product->stocks->filter(function ($stock) {
                if (!Warehouse::find($stock->warehouse_id)->is_primary) {
                    return $stock->quantity;
                }
                return 0;
            })->sum('quantity');

            // Get secondary warehouse stock


            return $product;
        });

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع المنتجات بنجاح',
            'data' => $data
        ]);
    }

    public function show($id)
    {
        $product = Product::find($id);
        $product->image_urls = [];
        $productPath = storage_path('app/public/products/' . $product->id);
        if (file_exists($productPath)) {
            $files = scandir($productPath);
            foreach ($files as $file) {
                if ($file != '.' && $file != '..') {
                    $product->image_urls[] = storage_path('app/public/products/' . $product->id . '/' . $file);
                }
            }
        }


        if (!$product) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'المنتج غير موجود',
                'data' => null
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع المنتج بنجاح',
            'data' => $product
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'images.*' => 'required|image|mimes:jpeg,png,jpg',
            'category_id' => 'required|exists:categories,id',
            'shop_id' => 'required|exists:shops,id'
        ]);

        try {
            // Create product first
            $product = Product::create($request->all());

            // Handle multiple images
            if ($request->hasFile('images')) {
                $path = storage_path('app/public/products/' . $product->id);
                if (!file_exists($path)) {
                    mkdir($path, 0777, true);
                }

                $imagePaths = [];
                foreach ($request->file('images') as $index => $image) {
                    $imageName = 'image_' . ($index + 1) . '.png';
                    $image->move($path, $imageName);
                    $imagePaths[] = 'products/' . $product->id . '/' . $imageName;
                }

                // Update product with image paths

            }

            return response()->json([
                'status' => 'success',
                'code' => 201,
                'message' => 'تم إنشاء المنتج بنجاح',
                'data' => $product
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'code' => 400,
                'message' => 'فشل في إنشاء المنتج',
                'data' => null
            ], 400);
        }
    }

    public function update(Request $request, $id)
    {
        $product = Product::find($id);
        $product->update($request->all());
        if (!$product) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'المنتج غير موجود',
                'data' => null
            ], 404);
        }



        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم تعديل المنتج بنجاح',
            'data' => $product->fresh()
        ]);
    }
    public function addImage(Request $request, $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'المنتج غير موجود',
                'data' => null
            ], 404);
        }

        try {
            $request->validate([
                'image' => 'required|image|mimes:png'
            ]);

            $path = storage_path('app/public/products/' . $product->id);
            if (!file_exists($path)) {
                mkdir($path, 0777, true);
            }

            $image = $request->file('image');
            $imageName = 'image_' . (count(glob($path . '/*')) + 1) . '.png';
            $image->move($path, $imageName);

            return response()->json([
                'status' => 'success',
                'code' => 200,
                'message' => 'تم إضافة الصورة بنجاح',
                'data' => $product->fresh()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'code' => 400,
                'message' => 'فشل في إضافة الصورة',
                'data' => null
            ], 400);
        }
    }

    public function deleteImage(Request $request, $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'المنتج غير موجود',
                'data' => null
            ], 404);
        }

        try {
            $request->validate([
                'image_name' => 'required|string'
            ]);

            $path = storage_path('app/public/products/' . $product->id . '/' . $request->image_name);

            if (file_exists($path)) {
                unlink($path);
                return response()->json([
                    'status' => 'success',
                    'code' => 200,
                    'message' => 'تم حذف الصورة بنجاح',
                    'data' => $product->fresh()
                ]);
            } else {
                return response()->json([
                    'status' => 'error',
                    'code' => 404,
                    'message' => 'الصورة غير موجودة',
                    'data' => null
                ], 404);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'code' => 400,
                'message' => 'فشل في حذف الصورة',
                'data' => null
            ], 400);
        }
    }
    public function destroy($id)
    {
        $product = Product::find($id);
        if ($product) {
            $path = storage_path('app/public/products/' . $product->id);
            if (file_exists($path)) {
                $files = glob($path . '/*');
                foreach ($files as $file) {
                    unlink($file);
                }
                rmdir($path);
            }
        }
        if (!$product) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'المنتج غير موجود',
                'data' => null
            ], 404);
        }

        $product->delete();

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم حذف المنتج بنجاح',
            'data' => null
        ]);
    }
}
