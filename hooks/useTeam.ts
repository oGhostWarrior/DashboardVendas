import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { User } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export function useTeam() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [team, setTeam] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const users = await apiClient.getUsers();
      setTeam(users);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar a equipe');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      fetchTeam();
    } else if (!authLoading) {
      setTeam([]);
      setLoading(false);
    }
  }, [isAuthenticated, authLoading]);

  return { team, loading, error, refetch: fetchTeam };
}