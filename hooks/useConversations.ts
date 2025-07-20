import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { Conversation } from '@/types';

interface UseConversationsOptions {
  page?: number;
  perPage?: number;
  status?: string;
  search?: string;
  salespersonId?: string;
  autoFetch?: boolean;
}

interface ConversationsResponse {
  data: Conversation[];
  meta: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
  };
}

export function useConversations(options: UseConversationsOptions = {}) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState({
    currentPage: 1,
    lastPage: 1,
    perPage: 10,
    total: 0,
  });

  const {
    page = 1,
    perPage = 10,
    status,
    search,
    salespersonId,
    autoFetch = true,
  } = options;

  const fetchConversations = async () => {
    setLoading(true);
    setError(null);

    try {
      // Em desenvolvimento, usar dados mockados
      if (process.env.NODE_ENV === 'development') {
        const mockConversations: Conversation[] = [
          {
            id: '1',
            clientName: 'João Silva',
            clientPhone: '+55 11 99999-9999',
            lastMessage: 'Obrigado pela proposta, vou analisar',
            timestamp: new Date('2024-01-15T10:30:00'),
            status: 'pending',
            salesperson: 'Maria Santos',
            messagesCount: 15,
            hasAIAnalysis: true,
          },
          {
            id: '2',
            clientName: 'Ana Costa',
            clientPhone: '+55 11 88888-8888',
            lastMessage: 'Fechado! Vamos prosseguir',
            timestamp: new Date('2024-01-15T09:15:00'),
            status: 'closed',
            salesperson: 'Carlos Oliveira',
            messagesCount: 8,
            hasAIAnalysis: true,
          },
          {
            id: '3',
            clientName: 'Pedro Alves',
            clientPhone: '+55 11 77777-7777',
            lastMessage: 'Preciso de mais informações',
            timestamp: new Date('2024-01-15T08:45:00'),
            status: 'active',
            salesperson: 'Maria Santos',
            messagesCount: 23,
            hasAIAnalysis: false,
          },
        ];

        // Simular filtros
        let filteredConversations = mockConversations;
        
        if (status && status !== 'all') {
          filteredConversations = filteredConversations.filter(conv => conv.status === status);
        }
        
        if (search) {
          filteredConversations = filteredConversations.filter(conv => 
            conv.clientName.toLowerCase().includes(search.toLowerCase()) ||
            conv.clientPhone.includes(search)
          );
        }

        setConversations(filteredConversations);
        setMeta({
          currentPage: page,
          lastPage: 1,
          perPage: perPage,
          total: filteredConversations.length,
        });
      } else {
        // Em produção, usar API Laravel
        const response = await apiClient.getConversations({
          page,
          per_page: perPage,
          status: status !== 'all' ? status : undefined,
          search,
          salesperson_id: salespersonId,
        });

        setConversations(response.data);
        setMeta({
          currentPage: response.meta.current_page,
          lastPage: response.meta.last_page,
          perPage: response.meta.per_page,
          total: response.meta.total,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar conversas');
    } finally {
      setLoading(false);
    }
  };

  const updateConversationStatus = async (id: string, newStatus: string) => {
    try {
      if (process.env.NODE_ENV === 'development') {
        // Em desenvolvimento, atualizar localmente
        setConversations(prev => 
          prev.map(conv => 
            conv.id === id ? { ...conv, status: newStatus as any } : conv
          )
        );
      } else {
        // Em produção, usar API Laravel
        await apiClient.updateConversationStatus(id, newStatus);
        await fetchConversations(); // Recarregar dados
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar status');
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchConversations();
    }
  }, [page, perPage, status, search, salespersonId, autoFetch]);

  return {
    conversations,
    loading,
    error,
    meta,
    fetchConversations,
    updateConversationStatus,
  };
}