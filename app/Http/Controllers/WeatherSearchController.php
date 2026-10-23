<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class WeatherSearchController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(
            $request->user()->weatherSearches()->latest('searched_at')->get()
        );
    }
}
