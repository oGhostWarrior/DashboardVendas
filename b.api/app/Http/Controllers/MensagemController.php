<?php

namespace App\Http\Controllers;

use App\Models\Mensagem;
use App\Models\Cliente;
use Illuminate\Http\Request;

class MensagemController extends Controller
{
    /**
     * Lista mensagens de um cliente
     */
    public function index(Request $request, Cliente $cliente)
    {
        $user = $request->user();

        // Vendedores só podem ver mensagens de seus próprios clientes
        if ($user->role === 'vendedor' && $cliente->user_id !== $user->id) {
            return response()->json(['message' => 'Acesso negado'], 403);
        }

        $mensagens = Mensagem::where('cliente_id', $cliente->id)
                            ->orderBy('created_at', 'asc')
                            ->paginate($request->get('per_page', 50));

        return response()->json($mensagens);
    }

    /**
     * Mostra uma mensagem específica
     */
    public function show(Request $request, Mensagem $mensagem)
    {
        $user = $request->user();
        $cliente = $mensagem->cliente;

        // Vendedores só podem ver mensagens de seus próprios clientes
        if ($user->role === 'vendedor' && $cliente->user_id !== $user->id) {
            return response()->json(['message' => 'Acesso negado'], 403);
        }

        return response()->json($mensagem->load('cliente'));
    }
}