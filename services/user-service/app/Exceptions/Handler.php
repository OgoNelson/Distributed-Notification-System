<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class Handler extends ExceptionHandler
{
    /**
     * A list of exception types that are not reported.
     *
     * @var array<int, class-string<Throwable>>
     */
    protected $dontReport = [
        //
    ];

    /**
     * Render an exception into an HTTP response.
     */
    public function render($request, Throwable $exception)
    {
        // Force JSON for API routes
        if ($request->is('api/*') || $request->expectsJson()) {
            $status = 500;
            $message = 'Server Error';
            $details = [];

            if ($exception instanceof HttpExceptionInterface) {
                $status = $exception->getStatusCode();
                $message = $exception->getMessage() ?: $message;
            } elseif ($exception instanceof ValidationException) {
                $status = 422;
                $message = 'Validation failed';
                $details = $exception->errors();
            } elseif ($exception instanceof AuthenticationException) {
                $status = 401;
                $message = 'Unauthenticated';
            } elseif ($exception instanceof NotFoundHttpException) {
                $status = 404;
                $message = 'Resource not found';
            } elseif ($exception->getMessage()) {
                $message = $exception->getMessage();
            }

            return response()->json([
                'success' => false,
                'data' => null,
                'message' => $message,
                'error' => [
                    'type' => get_class($exception),
                    'code' => $status,
                    'details' => $details,
                ],
            ], $status);
        }

        // Default behavior for non-API requests
        return parent::render($request, $exception);
    }

    /**
     * Convert an authentication exception into a response.
     */
    protected function unauthenticated($request, AuthenticationException $exception)
    {
        if ($request->is('api/*') || $request->expectsJson()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated',
            ], 401);
        }

        return redirect()->guest(route('login'));
    }
}
