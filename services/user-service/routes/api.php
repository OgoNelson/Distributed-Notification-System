<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\HealthController;
use App\Http\Controllers\ApiDocsController;

Route::prefix('v1')->group(function () {

    // Health check
    Route::get('/health', [HealthController::class, 'index']);

    // swagger docs
    Route::get('/health-check', [ApiDocsController::class, 'health']);
    // the above is not the real swagger route, just a health check example for the swagger command to work
    // here is the real swagger route which is auto-generated baseurl/api/documentation

    // Public routes
    Route::post('/register', [UserController::class, 'store']);
    Route::post('/login', [AuthController::class, 'login']);

    // Protected routes using Sanctum
    Route::middleware(['auth:sanctum'])->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);

        Route::get('/users', [UserController::class, 'index'])->middleware('throttle:60,1');
        Route::get('/users/{user}', [UserController::class, 'show'])->middleware('throttle:60,1');
        Route::patch('/users/{user}', [UserController::class, 'update'])->middleware('throttle:60,1');
        Route::delete('/users/{user}', [UserController::class, 'destroy'])->middleware('throttle:60,1');
    });
});
