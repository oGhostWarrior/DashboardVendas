<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use Illuminate\Http\Request;

class ClienteController extends Controller
{
    /**
     * Lista clientes baseado no papel do usuário
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Cliente::with(['empresa', 'user']);

        // Vendedores só veem seus próprios clientes
        if ($user->role === 'vendedor') {
            $query->where('user_id', $user->id);
        }
        // Gerentes e administradores veem todos os clientes

        // Filtros opcionais
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('nome', 'like', "%{$search}%")
                  ->orWhere('clienteWhatsapp', 'like', "%{$search}%");
            });
        }

        if ($request->has('empresa_id')) {
            $query->where('IDempresa', $request->empresa_id);
        }

        $clientes = $query->orderBy('created_at', 'desc')
                         ->paginate($request->get('per_page', 15));

        return response()->json($clientes);
    }

    /**
     * Mostra um cliente específico
     */
    public function show(Request $request, Cliente $cliente)
    {
        $user = $request->user();

        // Vendedores só podem ver seus próprios clientes
        if ($user->role === 'vendedor' && $cliente->user_id !== $user->id) {
            return response()->json(['message' => 'Acesso negado'], 403);
        }

        $cliente->load(['empresa', 'user']);

        return response()->json($cliente);
    }

    /**
     * Atualiza um cliente
     */
    public function update(Request $request, Cliente $cliente)
    {
        $user = $request->user();

        // Vendedores só podem atualizar seus próprios clientes
        if ($user->role === 'vendedor' && $cliente->user_id !== $user->id) {
            return response()->json(['message' => 'Acesso negado'], 403);
        }

        $request->validate([
            'nome' => 'sometimes|string|max:255',
            'clienteWhatsapp' => 'sometimes|string|max:255',
            'botAtivo' => 'sometimes|boolean',
            'conversationID' => 'sometimes|string|max:255',
            'IDempresa' => 'sometimes|exists:Empresa,id',
            'user_id' => 'sometimes|exists:users,id',
        ]);

        // Apenas gerentes e administradores podem alterar o vendedor responsável
        if ($request->has('user_id') && $user->role === 'vendedor') {
            unset($request['user_id']);
        }

        $cliente->update($request->only([
            'nome', 'clienteWhatsapp', 'botAtivo', 'conversationID', 'IDempresa', 'user_id'
        ]));

        return response()->json($cliente->load(['empresa', 'user']));
    }

    /**
     * Atribui um cliente a um vendedor (apenas gerentes e administradores)
     */
    public function assignToUser(Request $request, Cliente $cliente)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $cliente->update(['user_id' => $request->user_id]);

        return response()->json([
            'message' => 'Cliente atribuído com sucesso',
            'cliente' => $cliente->load(['empresa', 'user'])
        ]);
    }
}