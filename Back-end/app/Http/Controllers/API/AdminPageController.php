<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Mall;
use App\Models\Facility;
use App\Models\Sale;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;

class AdminPageController extends Controller
{
    public function index()
    {
        $data = [
            'malls_count' => Mall::count(),
            'malls_count_last_month' => Mall::where('created_at', '>=', now()->subMonth())->count(),
            'sales_count' => Sale::count(),
            'sales_count_last_month' => Sale::where('created_at', '>=', now()->subMonth())->count(),
            'shops_count' => Shop::count(),
            'shops_count_last_month' => Shop::where('created_at', '>=', now()->subMonth())->count(),
            'available_facilities' => Facility::where('status', false)->count(),
            'facilities_count' => Facility::count(),
            'users_count' => User::count(),
            'users_count_last_month' => User::where('created_at', '>=', now()->subMonth())->count(),
            'mall_owners_count' => User::where('user_type', '=', 1)->count(),
            'salesmen_count' => User::where('user_type', '=', 2)->count(),

            'customers_count' => User::where('user_type', '=', 3)->count(),
            'customers_count_last_month' => User::where('user_type', 3)
                ->where('created_at', '>=', now()->subMonth())
                ->count(),



        ];
        return response()->json([
            'status' => 'success',
            'code' => 200,
            'message' => 'تم استرجاع البيانات بنجاح',
            'data' => $data
        ]);
    }
}
