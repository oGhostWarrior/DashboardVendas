<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class IsAdmin
{
    public function handle(Request $request, Closure $next)
    {
        if ($request->user() && $request->user()->role === 'administrador') {
            return $next($request);
        }

        return response()->json(['error' => 'Acesso não autorizado.'], 403);
    }
}
