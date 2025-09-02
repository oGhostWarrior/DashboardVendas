<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class RelatorioController extends Controller
{
    /**
     * Gera um relatório consolidado de vendas e conversas.
     */
    public function index(Request $request)
    {
        try {
            $cliente = $request->query('cliente');

            // Período de análise definido para os últimos 7 dias (hoje + 6 dias anteriores)
            // Esta abordagem é mais robusta que "startOfWeek"
            $endDate = Carbon::now()->endOfDay();
            $startDate = Carbon::now()->subDays(6)->startOfDay();

            // --- Dados de Vendas ---
            $queryVendas = DB::table('AnalisesVendas');
            if ($cliente) {
                $queryVendas->where('cliente_id', $cliente);
            }
            $dadosVendas = $queryVendas->get();

            // --- Métricas Gerais ---
            $totalMensagens = DB::table('Mensagens')->count();
            $totalClientes = DB::table('Clientes')->count();

            // Contagem de clientes únicos que foram analisados
            $queryClientesAnalisados = DB::table('AnalisesVendas');
            if ($cliente) {
                $queryClientesAnalisados->where('cliente_id', $cliente);
            }
            $totalClientesAnalisados = $queryClientesAnalisados->distinct('cliente_id')->count('cliente_id');

            // Contagem de vendas realizadas
            $queryVendasStatus = DB::table('AnalisesVendas');
            if ($cliente) {
                $queryVendasStatus->where('cliente_id', $cliente);
            }
            $contagemVendas = $queryVendasStatus->select(
                DB::raw('COUNT(CASE WHEN "makeVenda" = true THEN 1 END) as vendas_realizadas')
            )->first();


            // --- Lógica do Gráfico de Conversas por Dia ---

            // 1. Prepara um array base com todos os dias da semana e contagem zerada
            $diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
            $conversasPorDia = array_map(function ($dia) {
                return [
                    'dia' => $dia,
                    'total_conversas' => 0
                ];
            }, $diasSemana);

            // 2. Busca no banco de dados a contagem de clientes únicos (conversas) por dia da semana
            $resultado = DB::table('Mensagens')
                ->select(
                    DB::raw('EXTRACT(ISODOW FROM created_at) as dia_da_semana'), // Extrai o dia como número (1=Segunda)
                    DB::raw('COUNT(DISTINCT cliente_id) as total_conversas')    // Conta clientes únicos
                )
                ->whereBetween('created_at', [$startDate, $endDate]) // Filtra pelos últimos 7 dias
                ->groupBy('dia_da_semana')
                ->get();

            // 3. Preenche o array base com os dados do banco
            foreach ($resultado as $r) {
                $index = (int)$r->dia_da_semana - 1; // Ajusta índice (1-7 para 0-6)
                if (isset($conversasPorDia[$index])) {
                    $conversasPorDia[$index]['total_conversas'] = (int) $r->total_conversas;
                }
            }

            // --- Resposta Final da API ---
            return response()->json([
                'analises_vendas' => $dadosVendas,
                'total_mensagens' => $totalMensagens,
                'total_clientes' => $totalClientes,
                'total_clientes_analisados' => $totalClientesAnalisados,
                'conversas_por_dia' => $conversasPorDia,
                'vendas_realizadas' => $contagemVendas->vendas_realizadas ?? 0,
            ]);

        } catch (\Exception $e) {
            // Tratamento de erro
            return response()->json([
                'erro' => $e->getMessage()
            ], 500);
        }
    }
}
