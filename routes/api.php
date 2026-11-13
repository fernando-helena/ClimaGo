<?php

use App\Http\Controllers\WeatherController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FavoriteCityController;
use App\Http\Controllers\WeatherSearchController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::post('/logout', [AuthController::class, 'logout'])
    ->middleware('auth:sanctum');

Route::get('/weather', [WeatherController::class, 'show'])
->middleware('auth:sanctum');

Route::get('/favorites', [FavoriteCityController::class, 'index'])
    ->middleware('auth:sanctum');

Route::post('/favorites', [FavoriteCityController::class, 'store'])
    ->middleware('auth:sanctum');

Route::delete('/favorites/{id}', [FavoriteCityController::class, 'destroy'])
    ->middleware('auth:sanctum');

Route::get('/history', [WeatherSearchController::class, 'index'])
    ->middleware('auth:sanctum');


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
