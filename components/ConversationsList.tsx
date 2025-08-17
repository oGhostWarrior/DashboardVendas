"use client";

import { useState } from "react";
// Adicione 'Star' à sua importação de lucide-react
import {
  Search,
  Bot,
  MessageSquare,
  Clock,
  Phone,
  User,
  Star,
} from "lucide-react";
import { ConversationSummary } from "@/types";
import { cn } from "@/lib/utils";
import { ScoreRating } from "@/components/ScoreRating"; // IMPORTAR NOVO COMPONENTE

interface ConversationsListProps {
  conversations: ConversationSummary[];
  loading?: boolean;
  onConversationClick: (conversation: ConversationSummary) => void;
  onAIAnalysisClick: (conversation: ConversationSummary) => void;
  searchTerm: string;
  onSearchChange: (search: string) => void;
  statusFilter: "all" | "active" | "pending" | "closed";
  onStatusFilterChange: (
    status: "all" | "active" | "pending" | "closed"
  ) => void;

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
  const filteredConversations = conversations.filter((conv) => {
    if (statusFilter === "all") return true;
    return conv.status === statusFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "closed":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (hours > 24) {
      return date.toLocaleDateString("pt-BR");
    } else if (hours > 0) {
      return `${hours}h atrás`;
    } else {
      return `${minutes}min atrás`;
    }
  };

  // Esta função não é mais necessária aqui, pois foi movida para dentro do ScoreRating.tsx
  // const getScoreColor = (score: number) => { ... };

  return (
    <div className="rounded-lg shadow-sm">
      <div className="p-4">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <h2 className="text-lg font-semibold ">Conversas Recentes</h2>

          <div className="flex items-center gap-2 ">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
              <input
                type="text"
                placeholder="Buscar cliente..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 pr-4 py-2 border bg-gray-200 dark:bg-gray-900 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm w-full"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value as any)}
              className="px-3 py-2 border rounded-lg bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
            >
              <option value="all">Todos</option>
              <option value="active">Ativo</option>
              <option value="pending">Pendente</option>
              <option value="closed">Fechado</option>
            </select>
          </div>
        </div>
      </div>

      <div className="">
        {loading && (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="">Carregando conversas...</p>
          </div>
        )}

        {filteredConversations.map((conversation) => (
          <div
            key={conversation.cliente.id}
            className="p-4 transition-colors border mb-4 rounded-lg bg-white dark:bg-gray-950 hover:shadow-md"
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              {/* Avatar e nome */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium truncate max-w-[140px] md:max-w-[180px]">
                      {conversation.cliente.nome}
                    </h3>
                    <div className="relative group">
                      <div
                        className={cn(
                          "w-3 h-3 rounded-full cursor-pointer",
                          getStatusColor(conversation.status)
                        )}
                      ></div>
                      <div
                        className="
                          absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                          px-2 py-1 rounded-md shadow-lg
                          bg-gray-800 text-white text-xs font-medium capitalize z-10
                          invisible opacity-0 group-hover:visible group-hover:opacity-100
                          transition-opacity duration-300 whitespace-nowrap"
                      >
                        {conversation.status}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {/* SUBSTITUIR O ANTIGO SPAN DO SCORE POR ISTO */}
                    {conversation.analiseVenda && (
                      <ScoreRating
                        score={conversation.analiseVenda.score_atendimento}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Informações principais */}
              <div className="flex-1 flex flex-col gap-2 min-w-0">
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    <span className="truncate">
                      {conversation.cliente.clienteWhatsapp}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>{conversation.totalMensagens} mensagens</span>
                  </div>
                  {conversation.cliente.user && (
                    <span className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800">
                      {conversation.cliente.user.name}
                    </span>
                  )}
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>
                      {formatTimestamp(conversation.ultimaMensagem.created_at)}
                    </span>
                  </div>
                </div>

                {conversation.ultimaMensagem && (
                  <div className="flex flex-col gap-1">
                    <p className="text-sm truncate">
                      <span className="font-medium">
                        {conversation.ultimaMensagem.remetente === "CLIENTE"
                          ? "Cliente"
                          : "Empresa"}
                        :
                      </span>{" "}
                      {conversation.ultimaMensagem.texto_mensagem}
                    </p>
                    <span className="text-xs text-gray-400">
                      {conversation.ultimaMensagem.tipo_mensagem}
                    </span>
                  </div>
                )}
              </div>

              {/* Botão de análise */}
              <div className="flex items-center mx-auto justify-end md:justify-center mt-2 md:mt-0 min-w-[180px]">
                {conversation.analiseVenda ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAIAnalysisClick(conversation);
                    }}
                    className="p-2 bg-orange-700 dark:bg-orange-800 text-slate-100 shadow-md items-center flex border gap-2 rounded-full transition-colors hover:text-slate-200 hover:bg-orange-900"
                    title="Ver análise da IA"
                  >
                    <Bot className="w-6 h-6" /> Analise da conversa
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAnalysisRequest(conversation.cliente.id);
                    }}
                    className="p-2 text-slate-100 bg-orange-500 flex hover:bg-orange-600 shadow-md hover:text-slate-200 items-center border gap-2 rounded-full transition-colors"
                    title="Analisar conversa com I.A"
                  >
                    <Bot className="w-6 h-6" /> Analisar conversa
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {!loading && filteredConversations.length === 0 && (
        <div className="p-8 text-center ">
          <MessageSquare className="w-12 h-12 mx-auto mb-4" />
          <p>Nenhuma conversa encontrada</p>
        </div>
      )}
    </div>
  );
}
