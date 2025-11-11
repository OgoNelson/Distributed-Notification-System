<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB; // For DB connection
use Illuminate\Support\Facades\Redis; // For Redis ping

class HealthController extends Controller
{
    /**
     * Health check endpoint. Returns standard response format.
     */
    public function index()
    {
        $dbStatus = 'connected';
        try {
            \Illuminate\Support\Facades\DB::connection()->getPdo();
        } catch (\Exception $e) {
            $dbStatus = 'disconnected';
        }
        $isHealthy = $dbStatus === 'connected';
        return response()->json([
            'success' => $isHealthy,
            'data' => [
                'status' => $isHealthy ? 'ok' : 'error',
                'db' => $dbStatus,
                'timestamp' => now()->toIso8601String(),
            ],
            'message' => $isHealthy ? 'Service is healthy' : 'Service is unhealthy',
        ], $isHealthy ? 200 : 503);
    }
}
