<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;

class DBCheckController extends Controller
{
    public function check()
    {
        try {
            if (!env('DB_HOST') || !env('DB_USERNAME') || !env('DB_DATABASE')) {
                return response()->json([
                    'connected' => false,
                    'error' => 'Configuração de banco ausente no .env'
                ]);
            }
            DB::connection()->select('SELECT 1');

            return response()->json([
                'connected' => true
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'connected' => false,
                'error' => $e->getMessage()
            ]);
        }
    }
}
