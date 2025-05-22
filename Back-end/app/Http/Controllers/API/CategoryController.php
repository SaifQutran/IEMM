<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = Category::all();
        return response()->json($categories);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $category = Category::create($validated);
        return response()->json($category, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        return response()->json($category->load('shops', 'products'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $category->update($validated);
        return response()->json($category);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        $category->delete();
        return response()->json(null, 204);
    }

    public function attachShop(Request $request, Category $category)
    {
        $validated = $request->validate([
            'shop_id' => 'required|exists:shops,id'
        ]);

        $category->shops()->attach($validated['shop_id']);
        return response()->json(['message' => 'Shop attached successfully']);
    }

    public function detachShop(Request $request, Category $category)
    {
        $validated = $request->validate([
            'shop_id' => 'required|exists:shops,id'
        ]);

        $category->shops()->detach($validated['shop_id']);
        return response()->json(['message' => 'Shop detached successfully']);
    }

    public function products(Category $category)
    {
        $products = $category->products()->with(['shop', 'manufacturerCountry', 'company'])->get();
        return response()->json($products);
    }
}
