<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Cliente extends Model
{
    use HasFactory;

    /**
     * O nome da tabela associada ao model.
     * O Laravel tentaria adivinhar "clientes" (plural), mas como sua tabela
     * se chama 'Clientes' (com 'C' maiúsculo), é bom especificar.
     *
     * @var string
     */
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
        'IDempresa',
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
     * Define a relação de pertencimento a uma Empresa.
     * Um Cliente pertence a uma Empresa.
     *
     * O Eloquent vai procurar por uma chave estrangeira chamada 'IDempresa'
     * na tabela 'Clientes' para fazer a ligação com a tabela 'Empresa'.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function empresa(): BelongsTo
    {
        return $this->belongsTo(Empresa::class, 'IDempresa');
    }
}
