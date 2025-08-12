"use client";

import { X, Bot, TrendingUp, AlertTriangle, CheckCircle, User } from 'lucide-react';
import { ConversationSummary } from '@/types';
import { useAnaliseVenda } from '@/hooks/useSupabaseData';

interface AnaliseModalProps {
  conversationSummary: ConversationSummary;
  onClose: () => void;
}

export function AnaliseModal({ conversationSummary, onClose }: AnaliseModalProps) {
  const { analise, loading } = useAnaliseVenda(conversationSummary.cliente.id);

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-50';
    if (score >= 6) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getScoreText = (score: number) => {
    if (score >= 8) return 'Excelente';
    if (score >= 6) return 'Bom';
    if (score >= 4) return 'Regular';
    return 'Precisa Melhorar';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 b bg-opacity-50">
      <div className="rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg">
              <Bot className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Análise de Vendas</h2>
              <p className="text-sm ">{conversationSummary.cliente.nome}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
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
              <div className=" p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium ">Score de Atendimento</span>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span className={`px-3 py-1 text-sm font-bold rounded-full ${getScoreColor(analise.score_atendimento)}`}>
                      {analise.score_atendimento}/10 - {getScoreText(analise.score_atendimento)}
                    </span>
                  </div>
                </div>
                <div className="w-full rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(analise.score_atendimento / 10) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Resumo da IA */}
              <div>
                <h3 className="text-lg font-semibold  mb-3">Resumo da Conversa</h3>
                <div className=" border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">{analise.resumo_ia}</p>
                </div>
              </div>

              {/* Pontos de Melhoria */}
              <div>
                <h3 className="text-lg font-semibold  mb-3">Pontos de Melhoria</h3>
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
                <h3 className="text-lg font-semibold mb-3">Informações do Cliente</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5" />
                    <div>
                      <p className="text-sm font-medium ">{conversationSummary.cliente.nome}</p>
                      <p className="text-xs ">{conversationSummary.cliente.clienteWhatsapp}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium ">Total de Mensagens</p>
                    <p className="text-xs ">{conversationSummary.totalMensagens} mensagens</p>
                  </div>
                  {conversationSummary.cliente.user && (
                    <div>
                      <p className="text-sm font-medium ">Empresa</p>
                      <p className="text-xs ">{conversationSummary.cliente.user.name}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium ">Bot Ativo</p>
                    <p className="text-xs ">
                      {conversationSummary.cliente.botAtivo ? 'Sim' : 'Não'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Informações da análise */}
              <div className="pt-4 border-t">
                <p className="text-xs ">
                  Análise gerada em {new Date(analise.created_at).toLocaleString('pt-BR')}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}