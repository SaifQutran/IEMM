<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Shop;
use App\Models\Mall;
use App\Models\Warehouse;
use App\Models\Bill;
use App\Models\Sale;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;

class ShopController extends Controller
{
    public function index()
    {
        $shops = Shop::all()->map(function ($shop) {
            // Add image URL
            $shop->image_url = null;
            $imagePath = storage_path('app/public/shops/' . $shop->id . ' image.png');
            if (file_exists($imagePath)) {
                $shop->image_url = 'shops/' . $shop->id . ' image.png';
            }
            return $shop;
        });

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع المتاجر بنجاح',
            'data' => $shops
        ]);
    }

    public function show($id)
    {
        $shop = Shop::find($id);

        if (!$shop) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'المتجر غير موجود',
                'data' => null
            ], 404);
        }

        // Add image URL
        $shop->image_url = null;
        $imagePath = storage_path('app/public/shops/' . $shop->id . ' image.png');
        if (file_exists($imagePath)) {
            $shop->image_url = 'shops/' . $shop->id . ' image.png';
        }

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع المتجر بنجاح',
            'data' => $shop
        ]);
    }

    public function store(Request $request)
    {
        try {
            // Validate incoming request data
            $validatedData = $request->validate([
                'shop_name' => 'required|string|max:255',
                'mall_id' => 'required|exists:malls,id',
                'owner_name' => 'required|string|max:255',
                'image' => 'required|image|mimes:jpeg,png,jpg',
                'facility_id' => 'required|exists:facilities,id',
                'work_times' => 'required|string|max:255',
                'username' => 'required|string|unique:users',
                'email' => 'required|string|email|unique:users',
                'sex' => 'required|in:true,false',
                'password' => 'required|string|min:8',
                'phone' => 'required|string|max:20',
                'birth_date' => 'required|date',
            ]);

            // Create the user (owner)
            $user = \App\Models\User::create([
                'f_name' => strtok($validatedData['owner_name'], ' '),
                'l_name' => substr($validatedData['owner_name'], strpos($validatedData['owner_name'], ' ') + 1),
                'username' => $validatedData['username'],
                'email' => $validatedData['email'],
                'sex' => $validatedData['sex'] === 'true',
                'user_type' => 1,
                'password' => bcrypt($validatedData['password']),
                'phone' => $validatedData['phone'],
                'birth_date' => $validatedData['birth_date'],
            ]);

            // Create the shop
            $shop = Shop::create([
                'name' => $validatedData['shop_name'],
                'work_times' => $validatedData['work_times'],
                'facility_id' => $validatedData['facility_id'],
                'rent_began_At' => now(),
                'mall_id' => $validatedData['mall_id'],
                'owner_id' => $user->id,
            ]);

            // Handle image upload
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $path = storage_path('app/public/shops/');
                if (!file_exists($path)) {
                    mkdir($path, 0777, true);
                }
                $image->move($path, $shop->id . ' image.png');
            }

            $user->shop_id = $shop->id;
            $user->save();

            // Create the warehouse
            $mall = Mall::find($validatedData['mall_id']);
            $warehouse = Warehouse::create([
                'shop_id' => $shop->id,
                'name' => "المحل",
                'city_id' => $mall->city_id,
                'location' => "مخزن المحل",
                'is_primary' => true,
            ]);

            return response()->json([
                'status' => 'success',
                'code' => 201,
                'message' => 'تم إنشاء المتجر والمستخدم المخزن الئيسي بنجاح',
                'data' => $shop
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'code' => 422,
                'message' => 'خطأ في التحقق من البيانات',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'code' => 500,
                'message' => 'حدث خطأ أثناء إنشاء المتجر والمستخدم والمخزن الئيسي',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function shopUsers($id)
    {
        $shop = Shop::find($id);
        $users = User::where('shop_id', $shop->id)->get();
        foreach ($users as $user) {
            $user->name = $user->f_name . ' ' . $user->l_name;
            if ($user->id == $shop->owner_id) {
                $user->name = $user->name . ' -  ' . 'مالك المتجر';
            }
        }
        if (!$users) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'لا يوجد مستخدمين لهذا المتجر',
                'data' => null
            ], 404);
        }
        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع المستخدمين بنجاح',
            'data' => $users
        ]);
    }

    public function shopProducts($id)
    {
        $shop = Shop::find($id);
        $products = Product::where('shop_id', $shop->id)->get();
        if (!$products) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'لا يوجد منتجات لهذا المتجر',
                'data' => null
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع المنتجات بنجاح',
            'data' => $products
        ]);
    }

    public function shopBills($id)
    {
        $shop = Shop::find($id);
        $data = Bill::with(['shop', 'user', 'customer', 'sales'])->where('shop_id', $shop->id)->get()->map(function ($data) {
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
        if (!$data) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'لا يوجد حسابات لهذا المتجر',
                'data' => null
            ], 404);
        }
        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع الحسابات بنجاح',
            'data' => $data
        ]);
    }

    public function update(Request $request, $id)
    {
        $shop = Shop::find($id);

        if (!$shop) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'المتجر غير موجود',
                'data' => null
            ], 404);
        }

        // Handle image update if provided
        if ($request->hasFile('image')) {
            $request->validate([
                'image' => 'image|mimes:jpeg,png,jpg'
            ]);

            $image = $request->file('image');
            $path = storage_path('app/public/shops/');
            if (!file_exists($path)) {
                mkdir($path, 0777, true);
            }

            // Delete old image if exists
            $oldImagePath = $path . $shop->id . ' image.png';
            if (file_exists($oldImagePath)) {
                unlink($oldImagePath);
            }

            // Store new image
            $image->move($path, $shop->id . ' image.png');
        }

        $shop->update($request->except('image'));

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم تعديل المتجر بنجاح',
            'data' => $shop->fresh()
        ]);
    }

    public function destroy($id)
    {
        $shop = Shop::find($id);

        if (!$shop) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'المتجر غير موجود',
                'data' => null
            ], 404);
        }

        // Delete shop image if exists
        $imagePath = storage_path('app/public/shops/' . $shop->id . ' image.png');
        if (file_exists($imagePath)) {
            unlink($imagePath);
        }

        $shop->delete();

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم حذف المتجر بنجاح',
            'data' => null
        ]);
    }
}
