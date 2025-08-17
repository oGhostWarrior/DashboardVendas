<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAnalisesVendasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasTable('AnalisesVendas')) {
            Schema::create('AnalisesVendas', function (Blueprint $table) {
                $table->id();
                $table->timestamps(); // Corresponde a created_at

                $table->unsignedBigInteger('cliente_id');
                $table->foreign('cliente_id')->references('id')->on('Clientes')->onDelete('cascade');

                $table->text('resumo_ia');
                $table->json('pontos_melhoria');
                $table->integer('score_atendimento');
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('AnalisesVendas');
    }
}
