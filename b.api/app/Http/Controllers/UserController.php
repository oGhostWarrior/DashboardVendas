<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class UserController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => ['required', 'in:vendedor,gerente,administrador'],
            'whatsapp_number' => ['required', 'string', 'unique:users,whatsapp_number'],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'whatsapp_number' => $request->whatsapp_number,
        ]);

        return response()->json($user, 201);
    }

    public function index()
    {
        $users = User::all();
        return response()->json($users);
    }
}
