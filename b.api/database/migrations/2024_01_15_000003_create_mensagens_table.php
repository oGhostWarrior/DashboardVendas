<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMensagensTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasTable('Mensagens')) {
            Schema::create('Mensagens', function (Blueprint $table) {
                $table->id();
                $table->timestamps(); // Corresponde a created_at

                $table->unsignedBigInteger('cliente_id');
                $table->foreign('cliente_id')->references('id')->on('Clientes')->onDelete('cascade');

                $table->text('texto_mensagem');
                $table->string('remetente');
                $table->string('id_whatsapp_msg');
                $table->string('tipo_mensagem');
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
        Schema::dropIfExists('Mensagens');
    }
}
