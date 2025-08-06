import { apiClient } from './api';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'vendedor' | 'gerente' | 'administrador';
}

export interface AuthResponse {
  user: User;
  token: string;
}

class AuthService {
  private user: User | null = null;
  private token: string | null = null;

  constructor() {
    // Recuperar dados do localStorage no cliente
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('auth_token');
      const savedUser = localStorage.getItem('auth_user');
      
      if (savedToken && savedUser) {
        this.token = savedToken;
        this.user = JSON.parse(savedUser);
        // Configurar token no apiClient
        apiClient.setToken(savedToken);
      }
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.login(email, password);
      
      this.user = response.user;
      this.token = response.token;
      
      // Salvar no localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('auth_user', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await apiClient.logout();
    } catch (error) {
      // Continuar com logout local mesmo se a API falhar
      console.error('Erro ao fazer logout na API:', error);
    } finally {
      this.user = null;
      this.token = null;
      
      // Limpar localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
      
      // Limpar token do apiClient
      apiClient.setToken(null);
    }
  }

  getUser(): User | null {
    return this.user;
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return this.user !== null && this.token !== null;
  }

  hasRole(role: string): boolean {
    return this.user?.role === role;
  }

  hasAnyRole(roles: string[]): boolean {
    return this.user ? roles.includes(this.user.role) : false;
  }

  canAccessSettings(): boolean {
    return this.hasRole('administrador');
  }

  canAccessReports(): boolean {
    return this.hasAnyRole(['gerente', 'administrador']);
  }

  canAccessTeam(): boolean {
    return this.hasAnyRole(['gerente', 'administrador']);
  }

  canViewAllConversations(): boolean {
    return this.hasAnyRole(['gerente', 'administrador']);
  }
}

export const authService = new AuthService();