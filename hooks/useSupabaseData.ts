import { useState, useEffect } from 'react';
import { SupabaseService } from '@/lib/supabase';
import { ConversationSummary, DashboardStats, Mensagem, AnalisesVenda } from '@/types';

// Hook para estatísticas do dashboard
export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    totalClientes: 0,
    clientesAtivos: 0,
    mensagensHoje: 0,
    scoreAtendimentoMedio: 0,
    conversasComAnalise: 0,
    empresasAtivas: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await SupabaseService.getDashboardStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar estatísticas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, error, refetch: fetchStats };
}

// Hook para conversações
export function useConversations(empresaId?: number, search?: string) {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const data = await SupabaseService.getConversationSummaries(empresaId, search);
      setConversations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar conversações');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [empresaId, search]);

  return { conversations, loading, error, refetch: fetchConversations };
}

// Hook para mensagens de um cliente
export function useClientMessages(clienteId: number | null) {
  const [messages, setMessages] = useState<Mensagem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async (id: number) => {
    try {
      setLoading(true);
      const data = await SupabaseService.getMensagensByCliente(id);
      setMessages(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar mensagens');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (clienteId) {
      fetchMessages(clienteId);
    } else {
      setMessages([]);
    }
  }, [clienteId]);

  return { messages, loading, error, refetch: () => clienteId && fetchMessages(clienteId) };
}

// Hook para análise de vendas
export function useAnaliseVenda(clienteId: number | null) {
  const [analise, setAnalise] = useState<AnalisesVenda | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalise = async (id: number) => {
    try {
      setLoading(true);
      const data = await SupabaseService.getAnaliseByCliente(id);
      setAnalise(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar análise');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (clienteId) {
      fetchAnalise(clienteId);
    } else {
      setAnalise(null);
    }
  }, [clienteId]);

  return { analise, loading, error, refetch: () => clienteId && fetchAnalise(clienteId) };
}