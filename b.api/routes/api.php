<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\MensagemController;
use App\Http\Controllers\AnaliseVendaController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;
use App\Events\Notificacao;
use App\Http\Controllers\RelatorioController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Rotas de autenticação
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Registro de usuários (apenas administradores)
    Route::post('/register', [AuthController::class, 'register'])->middleware('role:administrador');
});

// Rotas protegidas por autenticação
Route::middleware('auth:sanctum')->group(function () {

    // Dashboard
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('/dashboard/charts', [DashboardController::class, 'charts'])->middleware('role:gerente,administrador');

    // Clientes
    Route::get('/clientes', [ClienteController::class, 'index']);
    Route::get('/clientes/{cliente}', [ClienteController::class, 'show']);
    Route::put('/clientes/{cliente}', [ClienteController::class, 'update']);
    Route::post('/clientes/{cliente}/assign', [ClienteController::class, 'assignToUser'])->middleware('role:gerente,administrador');

    // Mensagens
    Route::get('/clientes/{cliente}/mensagens', [MensagemController::class, 'index']);
    Route::get('/mensagens/{mensagem}', [MensagemController::class, 'show']);

    // Análises de IA
    Route::get('/analises', [AnaliseVendaController::class, 'index']);
    Route::get('/clientes/{cliente}/analise', [AnaliseVendaController::class, 'show']);
    Route::post('/clientes/{cliente}/analyze', [AnaliseVendaController::class, 'requestAnalysis']);
});

Route::middleware(['auth:sanctum', 'isAdmin'])->group(function () {
    Route::post('/users', [UserController::class, 'store']);
});
Route::get('/users', [UserController::class, 'index'])
    ->middleware(['auth:sanctum', 'isManagerOrAdmin']);

// Notificacao
Route::get('/teste-notificacao', function () {
    event(new Notificacao('Mensagem de teste'));
    return 'Notificação enviada!';
});

Route::get('/relatorio-vendas', [RelatorioController::class, 'index']);
