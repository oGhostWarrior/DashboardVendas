<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Mensagem extends Model
{
    use HasFactory;
    protected $table = 'Mensagens';
    protected $fillable = [
        'cliente_id',
        'texto_mensagem',
        'remetente',
        'id_whatsapp_msg',
        'tipo_mensagem',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class, 'cliente_id');
    }
}
