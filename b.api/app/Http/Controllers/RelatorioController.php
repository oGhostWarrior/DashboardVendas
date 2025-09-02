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

            $endDate = Carbon::now()->endOfDay();
            $startDate = Carbon::now()->subDays(6)->startOfDay();

            $queryVendas = DB::table('AnalisesVendas');
            if ($cliente) {
                $queryVendas->where('cliente_id', $cliente);
            }
            $dadosVendas = $queryVendas->get();

            $totalMensagens = DB::table('Mensagens')->count();
            $totalClientes = DB::table('Clientes')->count();

            $queryClientesAnalisados = DB::table('AnalisesVendas');
            if ($cliente) {
                $queryClientesAnalisados->where('cliente_id', $cliente);
            }
            $totalClientesAnalisados = $queryClientesAnalisados->distinct('cliente_id')->count('cliente_id');

            $queryVendasStatus = DB::table('AnalisesVendas');
            if ($cliente) {
                $queryVendasStatus->where('cliente_id', $cliente);
            }
            $contagemVendas = $queryVendasStatus->select(
                DB::raw('COUNT(CASE WHEN "makeVenda" = true THEN 1 END) as vendas_realizadas')
            )->first();

            $diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
            $conversasPorDia = array_map(function ($dia) {
                return [
                    'dia' => $dia,
                    'total_conversas' => 0
                ];
            }, $diasSemana);

            $resultado = DB::table('Mensagens')
                ->select(
                    DB::raw('EXTRACT(ISODOW FROM created_at) as dia_da_semana'),
                    DB::raw('COUNT(DISTINCT cliente_id) as total_conversas')
                )
                ->whereBetween('created_at', [$startDate, $endDate])
                ->groupBy('dia_da_semana')
                ->get();

            foreach ($resultado as $r) {
                $index = (int)$r->dia_da_semana - 1;
                if (isset($conversasPorDia[$index])) {
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
