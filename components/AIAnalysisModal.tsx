"use client";

import { X, Bot, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { AIAnalysis, Conversation } from '@/types';
import { cn } from '@/lib/utils';

interface AIAnalysisModalProps {
  conversation: Conversation;
  analysis: AIAnalysis | null;
  loading?: boolean;
  onClose: () => void;
}

export function AIAnalysisModal({ conversation, analysis, loading = false, onClose }: AIAnalysisModalProps) {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-50';
      case 'negative': return 'text-red-600 bg-red-50';
      case 'neutral': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getSentimentText = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'Positivo';
      case 'negative': return 'Negativo';
      case 'neutral': return 'Neutro';
      default: return 'Desconhecido';
    }
  };

  const getRiskLevelText = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'Baixo';
      case 'medium': return 'Médio';
      case 'high': return 'Alto';
      default: return 'Desconhecido';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Bot className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Análise da IA</h2>
              <p className="text-sm text-gray-500">{conversation.clientName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-500">Carregando análise da IA...</p>
            </div>
          )}

          {!loading && !analysis && (
            <div className="text-center py-8">
              <Bot className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">Análise não disponível</p>
            </div>
          )}

          {!loading && analysis && (
            <>
          {/* Métricas principais */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Sentimento</span>
                <span className={cn(
                  "px-2 py-1 text-xs font-medium rounded-full",
                  getSentimentColor(analysis.sentiment)
                )}>
                  {getSentimentText(analysis.sentiment)}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Intenção de Compra</span>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-bold text-blue-600">
                    {Math.round(analysis.intentProbability * 100)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg col-span-2 md:col-span-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Risco</span>
                <span className={cn(
                  "px-2 py-1 text-xs font-medium rounded-full",
                  getRiskLevelColor(analysis.riskLevel)
                )}>
                  {getRiskLevelText(analysis.riskLevel)}
                </span>
              </div>
            </div>
          </div>

          {/* Tópicos-chave */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Tópicos-chave</h3>
            <div className="flex flex-wrap gap-2">
              {analysis.keyTopics.map((topic, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>

          {/* Recomendações */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Recomendações</h3>
            <div className="space-y-2">
              {analysis.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Próximas ações */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Próximas Ações</h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-yellow-800">{analysis.nextActions}</p>
              </div>
            </div>
          </div>

          {/* Informações da análise */}
          <div className="pt-4 border-t">
            <p className="text-xs text-gray-500">
              Análise gerada em {analysis.generatedAt.toLocaleString('pt-BR')}
            </p>
          </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}