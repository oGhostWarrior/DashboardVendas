import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';

interface DashboardStats {
  conversationsToday: number;
  activeClients: number;
  conversionRate: number;
  averageResponseTime: string;
}

export function useDashboardStats(period: string = 'today') {
  const [stats, setStats] = useState<DashboardStats>({
    conversationsToday: 0,
    activeClients: 0,
    conversionRate: 0,
    averageResponseTime: '0h',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);

    try {
      if (process.env.NODE_ENV === 'development') {
        // Dados mockados para desenvolvimento
        const mockStats = {
          conversationsToday: 23,
          activeClients: 48,
          conversionRate: 67,
          averageResponseTime: '2.3h',
        };
        
        // Simular delay da API
        await new Promise(resolve => setTimeout(resolve, 500));
        setStats(mockStats);
      } else {
        // Em produção, usar API Laravel
        const response = await apiClient.getDashboardStats(period);
        setStats({
          conversationsToday: response.conversations_today,
          activeClients: response.active_clients,
          conversionRate: response.conversion_rate,
          averageResponseTime: response.average_response_time,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar estatísticas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [period]);

  return {
    stats,
    loading,
    error,
    fetchStats,
  };
}