<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class IsManagerOrAdmin
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();
        if ($user && ($user->role === 'gerente' || $user->role === 'administrador')) {
            return $next($request);
        }

        return response()->json(['error' => 'Acesso não autorizado.'], 403);
    }
}
