"use client";

import { X, Phone, MessageSquare, Clock, User, Star } from "lucide-react";
import { ConversationSummary } from "@/types";
import { useClientMessages } from "@/hooks/useSupabaseData";
import { cn } from "@/lib/utils";
import { ScoreRating } from "@/components/ScoreRating"; // 1. Importar o ScoreRating

interface ConversationModalProps {
  conversationSummary: ConversationSummary;
  onClose: () => void;
}

export function ConversationModal({
  conversationSummary,
  onClose,
}: ConversationModalProps) {
  const { messages, loading } = useClientMessages(
    conversationSummary.cliente.id
  );

  // Função simplificada, igual à da lista
  const getStatusDotColor = (status: string) => {
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

  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header Fixo */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-background z-10 rounded-t-lg">
          {/* 2. Alinhar o layout do cabeçalho */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-7 h-7 text-white" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">
                  {conversationSummary.cliente.nome}
                </h2>
                {/* 3. Implementar o círculo de status com hover */}
                <div className="relative group">
                  <div
                    className={cn(
                      "w-3 h-3 rounded-full cursor-pointer",
                      getStatusDotColor(conversationSummary.status)
                    )}
                  />
                  <div
                    className="
                      absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                      px-2 py-1 rounded-md shadow-lg
                      bg-gray-800 text-white text-xs font-medium capitalize z-10
                      invisible opacity-0 group-hover:visible group-hover:opacity-100
                      transition-opacity duration-300 whitespace-nowrap"
                  >
                    {conversationSummary.status}
                  </div>
                </div>
              </div>
              
              {/* 4. Substituir o texto do score pelo componente ScoreRating */}
              {conversationSummary.analiseVenda && (
                <ScoreRating
                  score={conversationSummary.analiseVenda.score_atendimento}
                />
              )}

              {/* Informações de contato e métricas */}
              <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-2">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4" />
                  <span>{conversationSummary.cliente.clienteWhatsapp}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4" />
                  <span>{conversationSummary.totalMensagens} mensagens</span>
                </div>
              </div>

            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg transition-colors hover:bg-destructive/80 hover:text-destructive-foreground self-start"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo com scroll */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Carregando mensagens...</p>
            </div>
          )}

          {!loading && messages.length === 0 && (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Nenhuma mensagem encontrada</p>
            </div>
          )}

          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.remetente === "CLIENTE"
                    ? "justify-start"
                    : "justify-end"
                )}
              >
                <div
                  className={cn(
                    "max-w-xs md:max-w-md rounded-lg p-3 shadow-sm",
                    message.remetente === "CLIENTE"
                      ? "bg-muted text-foreground"
                      : "bg-primary text-primary-foreground"
                  )}
                >
                  <p className="text-sm">{message.texto_mensagem}</p>
                  <div className="flex items-center justify-end mt-2">
                    <span
                      className={cn(
                        "text-xs",
                        message.remetente === "CLIENTE"
                          ? "text-muted-foreground/80"
                          : "text-primary-foreground/80"
                      )}
                    >
                      {formatMessageTime(message.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rodapé fixo */}
        <div className="border-t p-4 bg-background rounded-b-lg">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            {conversationSummary.ultimaMensagem && (
              <span>
                Última mensagem:{" "}
                {formatMessageTime(
                  conversationSummary.ultimaMensagem.created_at
                )}
              </span>
            )}
            {conversationSummary.cliente.user && (
              <>
                <span>•</span>
                <span>Atendente: {conversationSummary.cliente.user.name}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}