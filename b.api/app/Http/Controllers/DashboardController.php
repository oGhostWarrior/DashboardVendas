<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use App\Models\Mensagem;
use App\Models\AnalisesVenda;
use App\Models\Empresa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Estatísticas do dashboard baseado no papel do usuário
     */
    public function stats(Request $request)
    {
        $user = $request->user();
        $period = $request->get('period', 'today');

        // Define filtros baseado no papel do usuário
        $clienteQuery = Cliente::query();
        $mensagemQuery = Mensagem::query();
        $analiseQuery = AnalisesVenda::query();

        if ($user->role === 'vendedor') {
            $clienteQuery->where('user_id', $user->id);
            $mensagemQuery->whereHas('cliente', function($q) use ($user) {
                $q->where('user_id', $user->id);
            });
            $analiseQuery->whereHas('cliente', function($q) use ($user) {
                $q->where('user_id', $user->id);
            });
        }

        // Total de clientes
        $totalClientes = $clienteQuery->count();

        // Clientes ativos (com bot ativo)
        $clientesAtivos = (clone $clienteQuery)->where('botAtivo', true)->count();

        // Mensagens baseado no período
        $mensagensQuery = clone $mensagemQuery;
        switch ($period) {
            case 'today':
                $mensagensQuery->whereDate('created_at', today());
                break;
            case 'week':
                $mensagensQuery->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()]);
                break;
            case 'month':
                $mensagensQuery->whereMonth('created_at', now()->month);
                break;
        }
        $mensagensHoje = $mensagensQuery->count();

        // Score médio de atendimento
        $scoreAtendimentoMedio = (clone $analiseQuery)->avg('score_atendimento') ?? 0;

        // Conversas com análise
        $conversasComAnalise = $analiseQuery->count();

        // Empresas ativas (apenas para gerentes e administradores)
        $empresasAtivas = 0;
        if ($user->role !== 'vendedor') {
            $empresasAtivas = Empresa::where('status', 'Ativo')->count();
        }

        return response()->json([
            'totalClientes' => $totalClientes,
            'clientesAtivos' => $clientesAtivos,
            'mensagensHoje' => $mensagensHoje,
            'scoreAtendimentoMedio' => round($scoreAtendimentoMedio, 1),
            'conversasComAnalise' => $conversasComAnalise,
            'empresasAtivas' => $empresasAtivas,
        ]);
    }

    /**
     * Dados para gráficos (apenas gerentes e administradores)
     */
    public function charts(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'vendedor') {
            return response()->json(['message' => 'Acesso negado'], 403);
        }

        // Conversas por dia (últimos 7 dias)
        $conversasPorDia = Mensagem::select(
                DB::raw('DATE(created_at) as data'),
                DB::raw('COUNT(DISTINCT cliente_id) as total')
            )
            ->whereBetween('created_at', [now()->subDays(7), now()])
            ->groupBy('data')
            ->orderBy('data')
            ->get();

        // Performance por vendedor
        $performancePorVendedor = DB::table('users')
            ->select(
                'users.name',
                DB::raw('COUNT(DISTINCT Clientes.id) as total_clientes'),
                DB::raw('COUNT(DISTINCT AnalisesVendas.id) as total_analises'),
                DB::raw('AVG(AnalisesVendas.score_atendimento) as score_medio')
            )
            ->leftJoin('Clientes', 'users.id', '=', 'Clientes.user_id')
            ->leftJoin('AnalisesVendas', 'Clientes.id', '=', 'AnalisesVendas.cliente_id')
            ->where('users.role', 'vendedor')
            ->where('users.active', true)
            ->groupBy('users.id', 'users.name')
            ->get();

        return response()->json([
            'conversasPorDia' => $conversasPorDia,
            'performancePorVendedor' => $performancePorVendedor,
        ]);
    }
}