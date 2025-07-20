// Configuração da API para integração com Laravel
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Recupera token do localStorage se disponível
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Métodos de autenticação
  async login(email: string, password: string) {
    const response = await this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    this.token = response.token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', response.token);
    }
    
    return response;
  }

  async logout() {
    await this.request('/auth/logout', { method: 'POST' });
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  // Métodos para conversas
  async getConversations(params?: {
    page?: number;
    per_page?: number;
    status?: string;
    search?: string;
    salesperson_id?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return this.request<{
      data: any[];
      meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
      };
    }>(`/conversations?${queryParams}`);
  }

  async getConversation(id: string) {
    return this.request<any>(`/conversations/${id}`);
  }

  async getConversationMessages(id: string) {
    return this.request<{ data: any[] }>(`/conversations/${id}/messages`);
  }

  // Métodos para análises da IA
  async getAIAnalysis(conversationId: string) {
    return this.request<any>(`/conversations/${conversationId}/ai-analysis`);
  }

  async generateAIAnalysis(conversationId: string) {
    return this.request<any>(`/conversations/${conversationId}/ai-analysis`, {
      method: 'POST',
    });
  }

  // Métodos para dashboard
  async getDashboardStats(period?: string) {
    const queryParams = period ? `?period=${period}` : '';
    return this.request<{
      conversations_today: number;
      active_clients: number;
      conversion_rate: number;
      average_response_time: string;
    }>(`/dashboard/stats${queryParams}`);
  }

  // Métodos para vendedores
  async getSalespeople() {
    return this.request<{ data: any[] }>('/salespeople');
  }

  async getSalesperson(id: string) {
    return this.request<any>(`/salespeople/${id}`);
  }

  // Método para atualizar status da conversa
  async updateConversationStatus(id: string, status: string) {
    return this.request<any>(`/conversations/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;