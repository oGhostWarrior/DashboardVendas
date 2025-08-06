"use client";

import { useState } from 'react';
import { Search, Bot, MessageSquare, Clock, Phone, User } from 'lucide-react';
import { ConversationSummary } from '@/types';
import { cn } from '@/lib/utils';

interface ConversationsListProps {
  conversations: ConversationSummary[];
  loading?: boolean;
  onConversationClick: (conversation: ConversationSummary) => void;
  onAIAnalysisClick: (conversation: ConversationSummary) => void;
  searchTerm: string;
  onSearchChange: (search: string) => void;
  statusFilter: 'all' | 'active' | 'pending' | 'closed';
  onStatusFilterChange: (status: 'all' | 'active' | 'pending' | 'closed') => void;

  onAnalysisRequest: (clienteId: number) => void;
}

export function ConversationsList({ 
  conversations, 
  loading = false,
  onConversationClick, 
  onAIAnalysisClick,
  onAnalysisRequest,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: ConversationsListProps) {

  // Filtrar conversações por status
  const filteredConversations = conversations.filter(conv => {
    if (statusFilter === 'all') return true;
    return conv.status === statusFilter;
  });

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

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (hours > 24) {
      return date.toLocaleDateString('pt-BR');
    } else if (hours > 0) {
      return `${hours}h atrás`;
    } else {
      return `${minutes}min atrás`;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-50';
    if (score >= 6) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <h2 className="text-lg font-semibold text-gray-900">Conversas Recentes</h2>
          
          <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0 md:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar cliente..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm w-full md:w-64"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value as any)}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
            >
              <option value="all">Todos os Status</option>
              <option value="active">Ativo</option>
              <option value="pending">Pendente</option>
              <option value="closed">Fechado</option>
            </select>
          </div>
        </div>
      </div>

      <div className="divide-y">
        {loading && (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Carregando conversas...</p>
          </div>
        )}
        
        {filteredConversations.map((conversation) => (
          <div
            key={conversation.cliente.id}
            className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => onConversationClick(conversation)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">

                  {conversation.analiseVenda ? (
                    // Se já existe análise, mostra o botão para visualizá-la
                    <button onClick={(e) => {
                        e.stopPropagation();
                        onAIAnalysisClick(conversation);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Ver análise da IA">
                      <Bot className="w-4 h-4" />
                    </button>
                  ) : (
                      // Se não existe, mostra o botão para solicitar uma nova
                      <button onClick={(e) => {
                          e.stopPropagation();
                          onAnalysisRequest(conversation.cliente.id);
                        }}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Analisar conversa com I.A">
                        <Bot className="w-4 h-4" />
                      </button>
                    )}
                    
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-gray-900 truncate">{conversation.cliente.nome}</h3>
                      <span className={cn(
                        "px-2 py-1 text-xs font-medium rounded-full",
                        getStatusColor(conversation.status)
                      )}>
                        {getStatusText(conversation.status)}
                      </span>
                      {conversation.analiseVenda && (
                        <span className={cn(
                          "px-2 py-1 text-xs font-medium rounded-full",
                          getScoreColor(conversation.analiseVenda.score_atendimento)
                        )}>
                          Score: {conversation.analiseVenda.score_atendimento}/10
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2 ml-12">
                  <div className="flex items-center space-x-1">
                    <Phone className="w-4 h-4" />
                    <span>{conversation.cliente.clienteWhatsapp}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>{conversation.totalMensagens} mensagens</span>
                  </div>
                  {conversation.cliente.user && (
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {conversation.cliente.user.name}
                    </span>
                  )}
                </div>
                
                {conversation.ultimaMensagem && (
                  <>
                    <p className="text-sm text-gray-600 truncate mb-2 ml-12">
                      <span className="font-medium">
                        {conversation.ultimaMensagem.remetente === 'CLIENTE' ? 'Cliente' : 'Empresa'}:
                      </span> {conversation.ultimaMensagem.texto_mensagem}
                    </p>
                    
                    <div className="flex items-center justify-between ml-12">
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimestamp(conversation.ultimaMensagem.created_at)}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {conversation.ultimaMensagem.tipo_mensagem}
                      </span>
                    </div>
                  </>
                )}
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                {conversation.analiseVenda && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAIAnalysisClick(conversation);
                    }}
                    className="p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors"
                    title="Ver análise da IA"
                  >
                    <Bot className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {!loading && filteredConversations.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>Nenhuma conversa encontrada</p>
        </div>
      )}
    </div>
  );
}