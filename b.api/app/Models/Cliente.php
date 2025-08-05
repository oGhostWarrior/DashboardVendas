<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Cliente extends Model
{
    use HasFactory;

    protected $table = 'Clientes';

    /**
     * Os atributos que podem ser atribuídos em massa (mass assignable).
     * Isso é uma medida de segurança para evitar que campos sensíveis
     * sejam preenchidos acidentalmente.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nome',
        'clienteWhatsapp',
        'botAtivo',
        'conversationID',
        'user_id',
    ];

    /**
     * Define os tipos de dados dos atributos.
     * Isso ajuda o Eloquent a converter os dados corretamente.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'created_at' => 'datetime',
        'botAtivo' => 'boolean',
    ];
    
    /**
     * Define a relação de pertencimento a um User (vendedor responsável).
     * Um Cliente pertence a um User.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Relacionamento com mensagens
     */
    public function mensagens()
    {
        return $this->hasMany(Mensagem::class, 'cliente_id');
    }

    /**
     * Relacionamento com análises de venda
     */
    public function analisesVenda()
    {
        return $this->hasMany(AnalisesVenda::class, 'cliente_id');
    }
}
