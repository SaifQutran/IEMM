<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Mall;
use App\Models\Facility;
use App\Models\Shop;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;

class MallController extends Controller
{
    public function index()
    {
        $malls = Mall::with(['owner', 'city', 'floors'])->get()->map(function ($mall) {
            $mall->owner_name = $mall->owner ? $mall->owner->f_name . ' ' . $mall->owner->l_name : null;
            $mall->city_name = $mall->city ? $mall->city->name : null;
            $mall->floors_count = $mall->floors->count();
            unset($mall->owner, $mall->city, $mall->floors);
            return $mall;
        });

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع المولات بنجاح',
            'data' => $malls
        ]);
    }
    public function shops($id)
    {
        $mall = Mall::find($id);

        if (!$mall) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'المول غير موجود',
                'data' => null
            ], 404);
        }
        // Eager load relations for efficiency
        $shops = $mall->shops()->with(['owner', 'facility.floor', 'categories'])->get()->map(function ($shop) {
            // Owner name
            $shop->owner_name = $shop->owner ? $shop->owner->f_name . ' ' . $shop->owner->l_name : null;
            unset($shop->owner);
            // Floor info
            $shop->floor = $shop->facility && $shop->facility->floor ? $shop->facility->floor->floor_number : null;
            $shop->shop_state = $shop->state == 'ture' ? "مفتوح" : "مغلق";
            // Space (area)

            // Categories
            $shop->categories_names = $shop->categories ? $shop->categories->pluck('name')->all() : [];
            unset($shop->categories, $shop->facility);
            return $shop;
        });
        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع المحلات بنجاح',
            'data' => $shops
        ]);
    }
    public function shopsOwners($id)
    {
        $mall = Mall::find($id);

        if (!$mall) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'المول غير موجود',
                'data' => null
            ], 404);
        }

        // Get all shops in the mall with their owners and facilities
        $shops = $mall->shops()
            ->with(['owner', 'facility.floor'])
            ->get();

        // Group shops by owner
        $owners = [];
        foreach ($shops as $shop) {
            if (!$shop->owner) continue;

            $ownerId = $shop->owner->id;
            if (!isset($owners[$ownerId])) {
                $owners[$ownerId] = [
                    'owner_name' => $shop->owner->f_name . ' ' . $shop->owner->l_name,
                    'owner_email' => $shop->owner->email,
                    'phone' => $shop->owner->phone,
                    'facilities' => []
                ];
            }

            // Add facility with floor number if it exists
            if ($shop->facility && $shop->facility->floor) {
                $owners[$ownerId]['facilities'][] = [
                    'facility_id' => $shop->facility->id,
                    'floor_number' => $shop->facility->floor->floor_number
                ];
            }
        }

        // Convert to array and format facilities as requested
        $formattedOwners = array_map(function ($owner) {
            $owner['facilities'] = array_map(
                fn($facility) => "{$facility['facility_id']}({$facility['floor_number']})",
                $owner['facilities']
            );
            return $owner;
        }, array_values($owners));

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع بيانات الملاك بنجاح',
            'data' => $formattedOwners
        ]);
    }
    public function products($id)
    {
        $mall = Mall::find($id);

        if (!$mall) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'المول غير موجودة',
                'data' => null
            ], 404);
        }

        $products = $mall->shops()->with('products')->get()->pluck('products')->flatten();

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع المنتجات بنجاح',
            'data' => $products
        ]);
    }
    public function productsOfShops($id)
    {
        $mall = Mall::find($id);

        if (!$mall) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'المول غير موجودة',
                'data' => null
            ], 404);
        }

        $products = $mall->shops()->with('products')->get();

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع محلات المدينة بنجاح',
            'data' => $products
        ]);
    }

    public function facilities($id)
    {
        $mall = Mall::find($id);
        $facilities = Facility::with(['shop.owner', 'floor'])->where(['mall_id'])->get()->map(function ($facility) {
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
        if (!$mall) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'المول غير موجود',
                'data' => null
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع المنشأت بنجاح',
            'data' => $facilities
        ]);
    }
    public function chats($id)
    {
        $mall = Mall::find($id);

        if (!$mall) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'المول غير موجود',
                'data' => null
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع المنشأت بنجاح',
            'data' => $mall->chats
        ]);
    }

    public function show($id)
    {
        $mall = Mall::find($id);

        if (!$mall) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'المول غير موجود',
                'data' => null
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع المول بنجاح',
            'data' => $mall
        ]);
    }

    public function store(Request $request)
    {
        try {
            // Validate incoming request data
            $validatedData = $request->validate([
                'mall_name' => 'required|string|max:255',
                'owner_name' => 'required|string|max:255',
                'location' => 'required|string|max:255',
                'location_link' => 'nullable|string',
                'floors_count' => 'required|integer|min:1',
                'username' => 'required|string|unique:users',
                'email' => 'required|string|email|unique:users',
                'sex' => 'required|in:true,false',
                'password' => 'required|string|min:8',
                'phone' => 'required|string|max:20',
                'birth_date' => 'required|date',
                'city_id' => 'required|exists:cities,id', // Assuming city_id is provided
            ]);

            // Create the user (owner)
            $user = \App\Models\User::create([
                'f_name' => strtok($validatedData['owner_name'], ' '), // Extract first name
                'l_name' => substr($validatedData['owner_name'], strpos($validatedData['owner_name'], ' ') + 1), // Extract last name
                'username' => $validatedData['username'],
                'email' => $validatedData['email'],
                'sex' => $validatedData['sex'] === 'true', // Convert string to boolean
                'user_type' => 1, // Convert string to boolean
                'password' => bcrypt($validatedData['password']),
                'phone' => $validatedData['phone'],
                'birth_date' => $validatedData['birth_date'],

            ]);

            // TODO: Convert location_link to coordinates (latitude and longitude)
            // For now, let's use placeholder values
            $latitude = 0.0;
            $longitude = 0.0;
            if ($validatedData['location_link']) {
                if (preg_match('/@([-.\d]+),([-.\d]+)/', $validatedData['location_link'], $matches)) {

                    $latitude = floatval($matches[1]);
                    $longitude = floatval($matches[2]);
                }

                // Try to match the "!3dlatitude!4dlongitude" format
                if (preg_match('/!3d([-.\d]+)!4d([-.\d]+)/', $validatedData['location_link'], $matches)) {
                    $latitude = floatval($matches[1]);
                    $longitude = floatval($matches[2]);
                }
            }

            // Create the mall
            $mall = Mall::create([
                'name' => $validatedData['mall_name'],
                'location' => $validatedData['location'],
                'owner_id' => $user->id,
                'city_id' => $validatedData['city_id'],
                'X_Coordinates' => $latitude,
                'Y_Coordinates' => $longitude,
            ]);

            // Create the floors
            for ($i = 1; $i <= $validatedData['floors_count']; $i++) {
                \App\Models\Floor::create([
                    'mall_id' => $mall->id,
                    'floor_number' => $i,

                ]);
            }

            return response()->json([
                'status' => 'success',
                'code' => 201,
                'message' => 'تم إنشاء المجمع والمستخدم والطوابق بنجاح',
                'data' => $mall
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
                'message' => 'حدث خطأ أثناء إنشاء المجمع والمستخدم والطوابق',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function changeTheOwner(Request $request, $id)
    {
        $mall = Mall::find($id);
        if (!$mall) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'المول غير موجود',
                'data' => null
            ]);
        }

        try {
            // Validate incoming request data
            $validatedData = $request->validate([
                'owner_name' => 'required|string|max:255',
                'username' => 'required|string|unique:users',
                'email' => 'required|string|email|unique:users',
                'sex' => 'required|in:true,false',
                'password' => 'required|string|min:8',
                'phone' => 'required|string|max:20',
                'birth_date' => 'required|date',

            ]);
            //  edit the past owner change its user_type or delete the user
            // Create the user (owner)
            $user = \App\Models\User::create([
                'f_name' => strtok($validatedData['owner_name'], ' '), // Extract first name
                'l_name' => substr($validatedData['owner_name'], strpos($validatedData['owner_name'], ' ') + 1), // Extract last name
                'username' => $validatedData['username'],
                'email' => $validatedData['email'],
                'sex' => $validatedData['sex'] === 'true', // Convert string to boolean
                'user_type' => 1, // Convert string to boolean
                'password' => bcrypt($validatedData['password']),
                'phone' => $validatedData['phone'],
                'birth_date' => $validatedData['birth_date'],

            ]);

            $mall->owner_id = $user->id;
            $mall->save();


            return response()->json([
                'status' => 'success',
                'code' => 201,
                'message' => 'تم تعديل المالك بنجاح',
                'data' => $mall
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
                'message' => 'حدث خطأ أثناء تعديل المالك',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $mall = Mall::find($id);

        if (!$mall) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'المول غير موجود',
                'data' => null
            ], 404);
        }

        $mall->update($request->all());

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم تعديل المول بنجاح',
            'data' => $mall->fresh()
        ]);
    }

    public function destroy($id)
    {
        $mall = Mall::find($id);

        if (!$mall) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'المول غير موجود',
                'data' => null
            ], 404);
        }

        $mall->delete();

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم حذف المول بنجاح',
            'data' => null
        ]);
    }

    public function floors($id)
    {
        $mall = Mall::with('floors')->find($id);

        if (!$mall) {
            return response()->json([
                'status' => 'error',
                'code' => 404,
                'message' => 'المول غير موجود',
                'data' => null
            ], 404);
        }

        $floors = $mall->floors->map(function ($floor) {
            return [
                'id' => $floor->id,
                'length' => $floor->length,
                'width' => $floor->width,
                'floor_number' => $floor->floor_number,
                'area' => $floor->length * $floor->width,
                'facilities_count' => $floor->facilities()->count(),
                'shops_count' => $floor->facilities()->whereHas('shop')->count()
            ];
        });

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع الطوابق بنجاح',
            'data' => $floors
        ]);
    }
}
