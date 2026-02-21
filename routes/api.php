<?php

use App\Http\Controllers\TelemetryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/telemetry', [TelemetryController::class, 'store']);
Route::get('/getIp', [TelemetryController::class, 'getIp']);
Route::get('/stats', [TelemetryController::class, 'stats']);
