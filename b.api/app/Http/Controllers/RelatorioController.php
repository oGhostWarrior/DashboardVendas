<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class RelatorioController extends Controller
{
    public function index(Request $request)
    {
        try {
            $cliente = $request->query('cliente');

            $query = DB::table('AnalisesVendas');
            if ($cliente) {
                $query->where('cliente_id', $cliente);
            }
            $dadosVendas = $query->get();
            $totalMensagens = DB::table('Mensagens')->count();
            $totalClientes = DB::table('Clientes')->count();
            $totalClientesAnalisados = DB::table('AnalisesVendas')->count();


            // Cria uma query base para contar as vendas, respeitando o filtro de cliente
            $queryVendasStatus = DB::table('AnalisesVendas');
            if ($cliente) {
                $queryVendasStatus->where('cliente_id', $cliente);
            }

            // Executa a contagem condicional em uma única consulta ao banco de dados
            $contagemVendas = $queryVendasStatus->select(
                DB::raw('COUNT(CASE WHEN "makeVenda" = true THEN 1 END) as vendas_realizadas'),
            )->first();

            $diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

            $conversasPorDia = collect($diasSemana)->map(function ($dia) {
                return [
                    'dia' => $dia,
                    'total_conversas' => 0
                ];
            });

            $resultado = DB::table('Mensagens')
                ->select(
                    DB::raw('TRIM(TO_CHAR(created_at::timestamp, \'Day\')) as dia'),
                    DB::raw('COUNT(*) as total_conversas')
                )
                ->whereBetween('created_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])
                ->groupBy(DB::raw('TRIM(TO_CHAR(created_at::timestamp, \'Day\'))'))
                ->get();

            foreach ($resultado as $r) {
                $index = $conversasPorDia->search(fn($d) => stripos($d['dia'], $r->dia) !== false);
                if ($index !== false) {
                    $conversasPorDia[$index]['total_conversas'] = (int) $r->total_conversas;
                }
            }

            return response()->json([
                'analises_vendas' => $dadosVendas,
                'total_mensagens' => $totalMensagens,
                'total_clientes' => $totalClientes,
                'total_clientes_analisados' => $totalClientesAnalisados,
                'conversas_por_dia' => $conversasPorDia,
                'vendas_realizadas' => $contagemVendas->vendas_realizadas ?? 0,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'erro' => $e->getMessage()
            ], 500);
        }
    }
}
