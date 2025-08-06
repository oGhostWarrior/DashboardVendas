<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClientesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('Clientes', function (Blueprint $table) {
            $table->id();
            $table->timestamps(); // Corresponde a created_at
            $table->string('nome');
            $table->string('clienteWhatsapp');
            $table->boolean('botAtivo')->default(false);
            $table->string('conversationID');

            // Chave estrangeira para a tabela Empresa
            $table->unsignedBigInteger('IDempresa')->nullable();
            $table->foreign('IDempresa')->references('id')->on('Empresa')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('Clientes');
    }
}
