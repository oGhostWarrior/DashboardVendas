<?php

namespace App\Http\Controllers;

use App\Models\AnalisesVenda;
use App\Models\Cliente;
use Illuminate\Http\Request;

class AnaliseVendaController extends Controller
{
    /**
     * Lista análises baseado no papel do usuário
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $query = AnalisesVenda::with(['cliente.empresa', 'cliente.user']);

        // Vendedores só veem análises de seus próprios clientes
        if ($user->role === 'vendedor') {
            $query->whereHas('cliente', function($q) use ($user) {
                $q->where('user_id', $user->id);
            });
        }

        $analises = $query->orderBy('created_at', 'desc')
                         ->paginate($request->get('per_page', 15));

        return response()->json($analises);
    }

    /**
     * Mostra análise de um cliente específico
     */
    public function show(Request $request, Cliente $cliente)
    {
        $user = $request->user();

        // Vendedores só podem ver análises de seus próprios clientes
        if ($user->role === 'vendedor' && $cliente->user_id !== $user->id) {
            return response()->json(['message' => 'Acesso negado'], 403);
        }

        $analise = AnalisesVenda::where('cliente_id', $cliente->id)
                               ->with(['cliente.empresa', 'cliente.user'])
                               ->orderBy('created_at', 'desc')
                               ->first();

        if (!$analise) {
            return response()->json(['message' => 'Análise não encontrada'], 404);
        }

        return response()->json($analise);
    }

    /**
     * Solicita análise para um cliente (via N8N)
     */
    public function requestAnalysis(Request $request, Cliente $cliente)
    {
        $user = $request->user();

        // Vendedores só podem solicitar análises de seus próprios clientes
        if ($user->role === 'vendedor' && $cliente->user_id !== $user->id) {
            return response()->json(['message' => 'Acesso negado'], 403);
        }

        // Chama o método do N8nController
        $n8nController = new \App\Http\Controllers\N8nController();
        return $n8nController->requestAnalysis($request, $cliente);
    }
}