import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { AIAnalysis } from '@/types';

export function useAIAnalysis(conversationId: string | null) {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalysis = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      if (process.env.NODE_ENV === 'development') {
        // Dados mockados para desenvolvimento
        const mockAnalysis: AIAnalysis = {
          conversationId: id,
          sentiment: 'neutral',
          intentProbability: 0.75,
          keyTopics: ['proposta', 'preço', 'prazo'],
          recommendations: [
            'Cliente demonstrou interesse no produto',
            'Sugere-se follow-up em 24h',
            'Reforçar benefícios do produto',
          ],
          riskLevel: 'medium',
          nextActions: 'Agendar reunião para apresentação detalhada',
          generatedAt: new Date('2024-01-15T10:35:00'),
        };
        
        // Simular delay da API
        await new Promise(resolve => setTimeout(resolve, 1000));
        setAnalysis(mockAnalysis);
      } else {
        // Em produção, usar API Laravel
        const response = await apiClient.getAIAnalysis(id);
        setAnalysis(response);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar análise da IA');
    } finally {
      setLoading(false);
    }
  };

  const generateAnalysis = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      if (process.env.NODE_ENV === 'development') {
        // Em desenvolvimento, simular geração
        await new Promise(resolve => setTimeout(resolve, 2000));
        await fetchAnalysis(id);
      } else {
        // Em produção, usar API Laravel
        await apiClient.generateAIAnalysis(id);
        await fetchAnalysis(id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao gerar análise da IA');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (conversationId) {
      fetchAnalysis(conversationId);
    } else {
      setAnalysis(null);
    }
  }, [conversationId]);

  return {
    analysis,
    loading,
    error,
    fetchAnalysis,
    generateAnalysis,
  };
}