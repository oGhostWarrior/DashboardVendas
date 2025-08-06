import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { User } from '@/types'; // Supondo que você tenha um tipo User em types/index.ts

export function useTeam() {
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
    fetchTeam();
  }, []);

  return { team, loading, error, refetch: fetchTeam };
}