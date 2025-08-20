"use client";

import {
  X,
  Bot,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  User,
} from "lucide-react";
import { ScoreRating } from "./ScoreRating";
import { ConversationSummary } from "@/types";
import { useAnaliseVenda } from "@/hooks/useSupabaseData";

interface AnaliseModalProps {
  conversationSummary: ConversationSummary;
  onClose: () => void;
}

export function AnaliseModal({
  conversationSummary,
  onClose,
}: AnaliseModalProps) {
  const { analise, loading } = useAnaliseVenda(conversationSummary.cliente.id);

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-500";
    if (score >= 6) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreText = (score: number) => {
    if (score >= 8) return "Excelente";
    if (score >= 6) return "Bom";
    if (score >= 4) return "Regular";
    return "Precisa Melhorar";
  };

  return (
    <div className="bg-black fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-90">
      <div className="rounded-lg bg-background shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header fixo */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-background z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg">
              <Bot className="w-8 h-8 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold ">Análise da Venda</h2>
              <p className="text-sm ">{conversationSummary.cliente.nome}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors"
          >
            <X className="w-8 h-8 hover:bg-red-600 rounded-xl" />
          </button>
        </div>

        {/* Conteúdo com scroll invisível */}
        <div
          className="p-6 space-y-6 overflow-y-auto flex-1 scrollbar-none"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <style jsx global>{`
            .scrollbar-none::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="">Carregando análise...</p>
            </div>
          )}

          {!loading && !analise && (
            <div className="text-center py-8">
              <Bot className="w-12 h-12 mx-auto mb-4 " />
              <p className="">Análise não disponível para este cliente</p>
            </div>
          )}

          {!loading && analise && (
            <>
              {/* Score de Atendimento */}
              <div className="p-4 rounded-lg flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
                <span className="font-medium text-md">Score de Atendimento:</span>
                <div className="flex items-center space-x-2">
                  <ScoreRating score={analise.score_atendimento} />
                  <span
                    className={`text-sm font-semibold px-2 py-1 rounded ${getScoreColor(
                      analise.score_atendimento
                    )}`}
                  >
                    {getScoreText(analise.score_atendimento)}
                  </span>
                </div>
              </div>

              {/* Resumo da IA */}
              <div className="p-3 rounded-xl bg-gray-200 dark:bg-slate-900">
                <h3 className="text-lg text-orange-600 font-semibold">Resumo da Conversa</h3>
                <div className="p-4">
                  <p className="text-md text-slate-900 dark:text-gray-100">
                    {analise.resumo_ia}
                  </p>
                </div>
              </div>

              {/* Pontos de Melhoria */}
              <div>
                <h3 className="text-lg font-semibold  mb-3">
                  Pontos de Melhoria
                </h3>
                <div className="space-y-2">
                  {analise.pontos_melhoria.map((ponto, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm ">{ponto}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Informações do Cliente */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-3">
                  Informações do Cliente
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5" />
                    <div>
                      <p className="text-sm font-medium ">
                        {conversationSummary.cliente.nome}
                      </p>
                      <p className="text-xs ">
                        {conversationSummary.cliente.clienteWhatsapp}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium ">Total de Mensagens</p>
                    <p className="text-xs ">
                      {conversationSummary.totalMensagens} mensagens
                    </p>
                  </div>
                  {conversationSummary.cliente.user && (
                    <div>
                      <p className="text-sm font-medium ">Empresa</p>
                      <p className="text-xs ">
                        {conversationSummary.cliente.user.name}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium ">Bot Ativo</p>
                    <p className="text-xs ">
                      {conversationSummary.cliente.botAtivo ? "Sim" : "Não"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Informações da análise */}
              <div className="flex pt-4 border-t justify-end">
                <p className="text-xs">
                  Análise gerada em{" "}
                  {new Date(analise.created_at).toLocaleString("pt-BR")}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
