<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class N8nController extends Controller
{
    /**
     * Solicita uma análise de IA para um cliente específico via webhook do N8N.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Cliente  $cliente
     * @return \Illuminate\Http\JsonResponse
     */
    public function requestAnalysis(Request $request, Cliente $cliente)
    {
        $webhookUrl = env('N8N_ANALYSIS_WEBHOOK_URL');

        if (!$webhookUrl) {
            return response()->json(['error' => 'A URL do webhook de análise não está configurada.'], 500);
        }
        $response = Http::post($webhookUrl, [
            'cliente_id' => $cliente->id,

        ]);
        if ($response->successful()) {
            return response()->json(['message' => 'Solicitação de análise enviada com sucesso.'], 200);
        }
        return response()->json(['error' => 'Falha ao acionar o webhook do N8N.'], $response->status());
    }
}
