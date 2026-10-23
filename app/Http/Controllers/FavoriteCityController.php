<?php

namespace App\Http\Controllers;

use App\Models\FavoriteCity;
use Illuminate\Http\Request;

class FavoriteCityController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(
            $request->user()->favoriteCities()->latest()->get()
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'city' => 'required|string|max:100',
            'country' => 'nullable|string|max:100',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        $existingFavorite = $request->user()->favoriteCities()
            ->where('city', $request->city)
            ->where('country', $request->country)
            ->first();

        if ($existingFavorite) {
            return response()->json([
                'message' => 'Esta ciudad ya está en favoritos',
                'favorite' => $existingFavorite,
            ], 409);
        }

        $favorite = $request->user()->favoriteCities()->create([
            'city' => $request->city,
            'country' => $request->country,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
        ]);

        return response()->json([
            'message' => 'Ciudad agregada a favoritos',
            'favorite' => $favorite,
        ], 201);
    }

    public function destroy(Request $request, $id)
    {
        $favorite = $request->user()->favoriteCities()->findOrFail($id);

        $favorite->delete();

        return response()->json([
            'message' => 'Ciudad eliminada de favoritos',
        ]);
    }
}
