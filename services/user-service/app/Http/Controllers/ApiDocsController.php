<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

/**
 * @OA\Info(
 *     title="User Service API",
 *     version="1.0.0",
 *     description="User management microservice"
 * )
 *
 * @OA\Server(
 *     url="http://127.0.0.1:8000/api/v1",
 *     description="Local Development"
 * )
 *
 * @OA\SecurityScheme(
 *     securityScheme="bearerAuth",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="JWT"
 * )
 */
class ApiDocsController extends Controller
{
    /**
     * @OA\Get(
     *     path="/v1/health-check",
     *     tags={"Health"},
     *     summary="Health check",
     *     @OA\Response(response=200, description="OK",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="ok"),
     *             @OA\Property(property="service", type="string", example="user-service")
     *         )
     *     )
     * )
     * @OA\Post(path="/v1/register", tags={"Auth"}, summary="Register new user",
     *     @OA\RequestBody(required=true, @OA\JsonContent(
     *         required={"name","email","password"},
     *         @OA\Property(property="name", type="string", example="John Doe"),
     *         @OA\Property(property="email", type="string", format="email", example="john@example.com"),
     *         @OA\Property(property="password", type="string", format="password", example="password123")
     *     )),
     *     @OA\Response(response=201, description="User created")
     * )
     * @OA\Post(path="/v1/login", tags={"Auth"}, summary="Login",
     *     @OA\RequestBody(required=true, @OA\JsonContent(
     *         required={"email","password"},
     *         @OA\Property(property="email", type="string", format="email"),
     *         @OA\Property(property="password", type="string", format="password")
     *     )),
     *     @OA\Response(response=200, description="Login successful",
     *         @OA\JsonContent(@OA\Property(property="token", type="string"))
     *     )
     * )
     * @OA\Post(path="/v1/logout", tags={"Auth"}, summary="Logout", security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="Logged out")
     * )
     * @OA\Get(path="/v1/users", tags={"Users"}, summary="List all users", security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="Success")
     * )
     * @OA\Get(path="/v1/users/{user}", tags={"Users"}, summary="Get user by ID", security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="user", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Success")
     * )
     * @OA\Patch(path="/v1/users/{user}", tags={"Users"}, summary="Update user", security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="user", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(@OA\JsonContent(
     *         @OA\Property(property="name", type="string"),
     *         @OA\Property(property="email", type="string")
     *     )),
     *     @OA\Response(response=200, description="Updated")
     * )
     * @OA\Delete(path="/v1/users/{user}", tags={"Users"}, summary="Delete user", security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="user", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=204, description="Deleted")
     * )
     */
    public function health()
    {
        return response()->json([
            'status' => 'ok',
            'service' => 'user-service'
        ]);
    }
}
