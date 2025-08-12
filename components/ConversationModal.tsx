"use client";

import { X, Phone, MessageSquare, Clock, User, Bot } from 'lucide-react';
import { ConversationSummary } from '@/types';
import { useClientMessages } from '@/hooks/useSupabaseData';
import { cn } from '@/lib/utils';

interface ConversationModalProps {
  conversationSummary: ConversationSummary;
  onClose: () => void;
}

export function ConversationModal({ conversationSummary, onClose }: ConversationModalProps) {
  const { messages, loading } = useClientMessages(conversationSummary.cliente.id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'pending': return 'Pendente';
      case 'closed': return 'Fechado';
      default: return 'Desconhecido';
    }
  };

  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-50">
      <div className="rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b ">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold ">{conversationSummary.cliente.nome}</h2>
              <div className="flex items-center space-x-4 text-sm ">
                <div className="flex items-center space-x-1">
                  <Phone className="w-4 h-4" />
                  <span>{conversationSummary.cliente.clienteWhatsapp}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>{conversationSummary.totalMensagens} mensagens</span>
                </div>
                <span className={cn(
                  "px-2 py-1 text-xs font-medium rounded-full",
                  getStatusColor(conversationSummary.status)
                )}>
                  {getStatusText(conversationSummary.status)}
                </span>
                {conversationSummary.analiseVenda && (
                  <div className="flex items-center space-x-1">
                    <Bot className="w-4 h-4" />
                    <span>Score: {conversationSummary.analiseVenda.score_atendimento}/10</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="">Carregando mensagens...</p>
            </div>
          )}

          {!loading && messages.length === 0 && (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 " />
              <p className="">Nenhuma mensagem encontrada</p>
            </div>
          )}

          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.remetente === 'CLIENTE' ? 'justify-start' : 'justify-end'
                )}
              >
                <div className={cn(
                  "max-w-xs md:max-w-md rounded-lg p-3 shadow-sm",
                  message.remetente === 'CLIENTE' 
                    ? 'bg-gray-100 text-gray-900'
                    : 'bg-blue-500 text-white'
                )}>
                  <p className="text-sm">{message.texto_mensagem}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className={cn(
                      "text-xs",
                      message.remetente === 'CLIENTE' ? 'text-gray-500' : 'text-blue-100'
                    )}>
                      {message.remetente === 'CLIENTE' ? 'Cliente' : 'Empresa'}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className={cn(
                        "text-xs",
                        message.remetente === 'CLIENTE' ? 'text-gray-500' : 'text-blue-100'
                      )}>
                        {formatMessageTime(message.created_at)}
                      </span>
                      {message.tipo_mensagem === 'Audio' && (
                        <span className={cn(
                          "text-xs px-1 py-0.5 rounded",
                          message.remetente === 'CLIENTE' ? 'bg-gray-200 text-gray-600' : 'bg-blue-400 text-blue-100'
                        )}>
                          🎵
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t p-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            {conversationSummary.ultimaMensagem && (
              <span>Última mensagem: {formatMessageTime(conversationSummary.ultimaMensagem.created_at)}</span>
            )}
            {conversationSummary.cliente.user && (
              <>
                <span>•</span>
                <span>Empresa: {conversationSummary.cliente.user.name}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}