<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;
use Tymon\JWTAuth\Exceptions\TokenBlacklistedException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Exceptions\JWTException;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array
     */
    protected $dontFlash = [
        'password',
        'password_confirmation',
    ];

    /**
     * Report or log an exception.
     *
     * This is a great spot to send exceptions to Sentry, Bugsnag, etc.
     *
     * @param  \Exception  $exception
     * @return void
     */
    public function report(Exception $exception)
    {
        parent::report($exception);
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Exception  $exception
     * @return \Illuminate\Http\Response
     */
    public function render($request, Exception $exception)
    {
         if ($exception instanceof UnauthorizedHttpException) {
            if($exception->getMessage() == 'Token not provided'){
                return response()->json(['status' => 'error', 'message' => 'The token has not been provided.'], $exception->getStatusCode());
            } else if($exception->getMessage() == 'Credentials Invalid'){
                return response()->json(['status' => 'error', 'message' => 'The credentials are invalid'], $exception->getStatusCode());
            } else if ($exception->getPrevious() instanceof TokenExpiredException) {
                return response()->json(['status'=>'error', 'message' => 'The token has expired.'], $exception->getStatusCode());
            } else if ($exception->getPrevious() instanceof TokenInvalidException) {
                return response()->json(['status'=>'error', 'message' => 'The token is invalid.'], $exception->getStatusCode());
            } else if ($exception->getPrevious() instanceof TokenBlacklistedException) {
                return response()->json(['status'=>'error', 'message' => 'The token has been blacklisted.'], $exception->getStatusCode());
            }
        }

        return parent::render($request, $exception);
    }
}
