<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Cliente extends Model
{
    use HasFactory;

    protected $table = 'Clientes';
    protected $fillable = [
        'nome',
        'clienteWhatsapp',
        'botAtivo',
        'conversationID',
        'user_id',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'botAtivo' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function mensagens()
    {
        return $this->hasMany(Mensagem::class, 'cliente_id');
    }

    public function analisesVenda()
    {
        return $this->hasMany(AnalisesVenda::class, 'cliente_id');
    }
}
