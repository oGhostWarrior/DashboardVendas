<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AnalisesVenda extends Model
{
    use HasFactory;

    protected $table = 'AnalisesVendas';
    protected $fillable = [
        'cliente_id',
        'resumo_ia',
        'pontos_melhoria',
        'score_atendimento',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'pontos_melhoria' => 'array',
        'score_atendimento' => 'integer',
    ];

    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class, 'cliente_id');
    }
}
