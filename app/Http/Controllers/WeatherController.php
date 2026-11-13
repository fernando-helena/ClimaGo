<?php

namespace App\Http\Controllers;

use App\Models\WeatherSearch;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class WeatherController extends Controller
{
    public function show(Request $request)
    {
        $request->validate([
            'city' => 'required|string|max:100',
        ]);

        $response = Http::get('https://api.weatherapi.com/v1/forecast.json', [
            'key' => config('services.weatherapi.key'),
            'q' => $request->city,
            'days' => 1,
            'lang' => 'es',
            'aqi' => 'no',
            'alerts' => 'no',
        ]);

        if ($response->failed()) {
            return response()->json([
                'message' => 'No se pudo obtener el clima',
            ], $response->status());
        }

        $weather = $response->json();

        WeatherSearch::create([
            'user_id' => $request->user()->id,
            'city' => $weather['location']['name'],
            'country' => $weather['location']['country'],
            'searched_at' => now(),
        ]);

        return response()->json($weather);
    }
}
