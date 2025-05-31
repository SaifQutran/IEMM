<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\CountryController;
use App\Http\Controllers\API\AdminPageController;
use App\Http\Controllers\API\GovernorateController;
use App\Http\Controllers\API\CityController;
use App\Http\Controllers\API\CompanyController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\MallController;
use App\Http\Controllers\API\FacilityController;
use App\Http\Controllers\API\ShopController;
use App\Http\Controllers\API\MoneyLogController;
use App\Http\Controllers\API\ProductController;
use App\Http\Controllers\API\WarehouseController;
use App\Http\Controllers\API\StockController;
use App\Http\Controllers\API\BillController;
use App\Http\Controllers\API\SaleController;
use App\Http\Controllers\API\ReviewController;
use App\Http\Controllers\API\ChatController;
use App\Http\Controllers\API\MessageController;
use App\Http\Controllers\API\NotificationController;
use App\Http\Controllers\API\ReservationController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\FloorController;
use App\Http\Controllers\API\CategoryController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public API Routes (no authentication required)

// Countries
// get : /countries
// get : /countries/{id}
// post : /countries
// delete : /countries/{id}
// put : /countries/{id}

Route::apiResource('countries', CountryController::class);

// Governorates  
// get : /governorates
// get : /governorates/{id}
// post : /governorates
// delete : /governorates/{id}
// put : /governorates/{id}

Route::apiResource('governorates', GovernorateController::class);
//categories
// get : /categories
// get : /categories/{id}
// post : /categories
// delete : /categories/{id}
// put : /categories/{id}

Route::apiResource('categories', CategoryController::class);
Route::get('/categories/{category}/products', [CategoryController::class, 'pro
ducts']);
// For Admin Page
Route::get('/admin', [AdminPageController::class, 'index']);

// Cities
// get : /cities
// get : /cities/{id}
// get : /cities/{id}/malls
// get : /cities/{id}/malls/shops
// post : /cities
// delete : /cities/{id}
// put : /cities/{id}

Route::apiResource('cities', CityController::class);
Route::get('/cities/{id}/malls', [CityController::class, 'malls']);
Route::get('/cities/{id}/malls/shops', [CityController::class, 'shops']);




// Companies
// get : /companies
// get : /companies/{id}
// post : /companies
// delete : /companies/{id}
// put : /companies/{id}
Route::apiResource('companies', CompanyController::class);

// Users
Route::get('/user', function (Request $request) {
    return response()->json([
        'status' => 'success',
        'code' => 200,
        'message' => 'User retrieved successfully',
        'data' => $request->user()
    ]);
})->middleware('auth:sanctum');

// Malls
// get : /malls
// get : /malls/{id}
// get : /malls/{id}/admin
// post : /malls
// delete : /malls/{id}
// put : /malls/{id}
// get : /malls/{id}/shops
// get : /malls/{id}/facilities
// get : /malls/{id}/chats
// get : /malls/{id}/shops/owners
// get : /malls/{id}/products
// get : /malls/{id}/all_products
//put : /malls/${mallId}/owner
Route::apiResource('malls', MallController::class);
Route::get('/malls/{id}/shops', [MallController::class, 'shops']);
Route::get('/malls/{id}/shops/owners', [MallController::class, 'shopsOwners']);
Route::get('/malls/{id}/facilities', [MallController::class, 'facilities']);
Route::get('/malls/{id}/floors', [MallController::class, 'floors']);
Route::get('/malls/{id}/chats', [MallController::class, 'facilities']);
Route::get('/malls/{id}/products', [MallController::class, 'products']);
Route::get('/malls/{id}/all_products', [MallController::class, 'products']);
Route::put('/malls/{id}/owner', [MallController::class, 'changeTheOwner']);
Route::get('/malls/{id}/admin', [MallController::class, 'admin']);

// Facilities
// get : /facilities
// get : /facilities/{id}
// post : /facilities
// delete : /facilities/{id}
// put : /facilities/{id}
Route::apiResource('facilities', FacilityController::class);

// Shops
// get : /shops
// get : /shops/{id}
// get : /shops/{id}/users
// get : /shops/{id}/products
// get : /shops/{id}/bills
// post : /shops
// delete : /shops/{id}
// put : /shops/{id}
Route::apiResource('shops', ShopController::class);
Route::get('/shops/{id}/users', [ShopController::class, 'shopUsers']);
Route::get('/shops/{id}/products', [ShopController::class, 'shopProducts']);
Route::get('/shops/{id}/bills', [ShopController::class, 'shopBills']);

// Money Logs
// get : /money-logs
// post : /money-logs
// delete : /money-logs/{id}
// put : /money-logs/{id}
Route::apiResource('money-logs', MoneyLogController::class);

// Floors
// get : /floors
// get : /floors/{id}
// post : /floors
// delete : /floors/{id}
// put : /floors/{id}
Route::apiResource('floors', FloorController::class);
Route::get('/floors/{id}/shops', [FloorController::class, 'shops']);
Route::get('/floors/{id}/facilities', [FloorController::class, 'facilities']);

// Products
// get : /products
// get : /products/{id}
// post : /products
// delete : /products/{id}
// put : /products/{id}
Route::apiResource('products', ProductController::class);
Route::post('/products/{id}/add-image', [ProductController::class, 'addImage']);
Route::delete('/products/{id}/delete-image', [ProductController::class, 'deleteImage']);

// Warehouses
// get : /warehouses
// get : /warehouses/{id}
// post : /warehouses
// delete : /warehouses/{id}
// put : /warehouses/{id}
Route::apiResource('warehouses', WarehouseController::class);

// Stocks
// get : /stocks
// get : /stocks/{id}
// post : /stocks
// delete : /stocks/{id}
// put : /stocks/{id}
Route::apiResource('stocks', StockController::class);

// Bills
// get : /bills
// get : /bills/{id}
// post : /bills
// delete : /bills/{id}
// put : /bills/{id}
Route::apiResource('bills', BillController::class);

// Sales
// get : /sales
// get : /sales/{id}
// post : /sales
// delete : /sales/{id}
// put : /sales/{id}
Route::apiResource('sales', SaleController::class);

// Reviews
// get : /reviews
// get : /reviews/{id}
// post : /reviews
// delete : /reviews/{id}
// put : /reviews/{id}
Route::apiResource('reviews', ReviewController::class);

// Chats
// get : /chats
// get : /chats/{id}
// get : /chats/{id}/messages
// post : /chats
// delete : /chats/{id}
// put : /chats/{id}
Route::apiResource('chats', ChatController::class);
Route::get('/chats/{id}/messages', [ChatController::class, 'messages']);
// Messages
// get : /messages
// get : /messages/{id}
// post : /messages
// delete : /messages/{id}
// put : /messages/{id}
Route::apiResource('messages', MessageController::class);

// Notifications
// get : /notifications
// get : /notifications/{id}
// post : /notifications
// delete : /notifications/{id}
// put : /notifications/{id}
Route::apiResource('notifications', NotificationController::class);

// Reservations
// get : /reservations
// post : /reservations
// delete : /reservations/{id}
// put : /reservations/{id}
Route::apiResource('reservations', ReservationController::class);

// Authentication routes
// post : /auth/register
// post : /auth/login
// post : /auth/logout
// post : /auth/reset-password
// post : /auth/update-password
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
    Route::post('/update-password', [AuthController::class, 'updatePassword']);
});

// Protected user routes
// get : /users
// get : /users/{id}
// post : /users
// delete : /users/{id}
// put : /users/{id}
Route::apiResource('users', UserController::class);
// Route::middleware('auth:sanctum')->group(function () {
//     Route::apiResource('users', UserController::class);
// });

/*
Note: apiResource automatically creates the following routes for each resource:
- GET /resource - index (get all)
- POST /resource - store (create new)
- GET /resource/{id} - show (get single)
- PUT/PATCH /resource/{id} - update (update existing)
- DELETE /resource/{id} - destroy (delete)
*/

// Protected Routes (Authentication Required)
// Route::middleware('auth:sanctum')->group(function () {
//     // Auth Routes
//     Route::prefix('auth')->group(function () {
//         Route::post('/logout', [AuthController::class, 'logout']);
//         Route::get('/verify-token', [AuthController::class, 'verifyToken']);
//     });

//     // User Routes
//     Route::get('/user', function (Request $request) {
//         return response()->json([
//             'status' => 'success',
//             'code' => 200,
//             'message' => 'User retrieved successfully',
//             'data' => $request->user()
//         ]);
//     });

//     // Admin Routes
//     Route::get('/admin', [AdminPageController::class, 'index']);

//     // Resource Routes
//     Route::apiResource('countries', CountryController::class);
//     Route::apiResource('governorates', GovernorateController::class);
//     Route::apiResource('categories', CategoryController::class);
//     Route::apiResource('cities', CityController::class);
//     Route::apiResource('companies', CompanyController::class);
//     Route::apiResource('malls', MallController::class);
//     Route::apiResource('facilities', FacilityController::class);
//     Route::apiResource('shops', ShopController::class);
//     Route::apiResource('money-logs', MoneyLogController::class);
//     Route::apiResource('floors', FloorController::class);
//     Route::apiResource('products', ProductController::class);
//     Route::apiResource('warehouses', WarehouseController::class);
//     Route::apiResource('stocks', StockController::class);
//     Route::apiResource('bills', BillController::class);
//     Route::apiResource('sales', SaleController::class);
//     Route::apiResource('reviews', ReviewController::class);
//     Route::apiResource('chats', ChatController::class);
//     Route::apiResource('messages', MessageController::class);
//     Route::apiResource('notifications', NotificationController::class);
//     Route::apiResource('reservations', ReservationController::class);
//     Route::apiResource('users', UserController::class);

//     // Additional Routes
//     Route::get('/categories/{category}/products', [CategoryController::class, 'products']);
//     Route::get('/cities/{id}/malls', [CityController::class, 'malls']);
//     Route::get('/cities/{id}/malls/shops', [CityController::class, 'shops']);
//     Route::get('/malls/{id}/shops', [MallController::class, 'shops']);
//     Route::get('/malls/{id}/shops/owners', [MallController::class, 'shopsOwners']);
//     Route::get('/malls/{id}/facilities', [MallController::class, 'facilities']);
//     Route::get('/malls/{id}/floors', [MallController::class, 'floors']);
//     Route::get('/malls/{id}/chats', [MallController::class, 'facilities']);
//     Route::get('/malls/{id}/products', [MallController::class, 'products']);
//     Route::get('/malls/{id}/all_products', [MallController::class, 'products']);
//     Route::put('/malls/{id}/owner', [MallController::class, 'changeTheOwner']);
//     Route::get('/shops/{id}/users', [ShopController::class, 'shopUsers']);
//     Route::get('/shops/{id}/products', [ShopController::class, 'shopProducts']);
//     Route::get('/shops/{id}/bills', [ShopController::class, 'shopBills']);
//     Route::get('/floors/{id}/shops', [FloorController::class, 'shops']);
//     Route::get('/floors/{id}/facilities', [FloorController::class, 'facilities']);
//     Route::post('/products/{id}/add-image', [ProductController::class, 'addImage']);
//     Route::delete('/products/{id}/delete-image', [ProductController::class, 'deleteImage']);
//     Route::get('/chats/{id}/messages', [ChatController::class, 'messages']);
// });
