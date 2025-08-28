import { ReactNode } from "react";

export interface User {
  role: 'vendedor' | 'gerente' | 'administrador';
  whatsapp_number: string;
  id: number;
  name: string;
  email: string;
  total_clients: number;
  messages_today: number;
  average_score: number;
}

export interface Empresa {
  id: number;
  created_at: string;
  nome: string;
  empresaWhatsapp: string;
  tokenInstance: string;
  status: string;
}

export interface Cliente {
  id: number;
  created_at: string;
  nome: string;
  clienteWhatsapp: string;
  botAtivo: boolean;
  conversationID: string;
  user_id: number;
  user?: User;
}

export interface Mensagem {
  id: number;
  created_at: string;
  cliente_id: number;
  texto_mensagem: string;
  remetente: 'CLIENTE' | 'EMPRESA';
  id_whatsapp_msg: string;
  tipo_mensagem: 'Texto' | 'Audio';
  cliente?: Cliente;
}

export interface AnalisesVenda {
  id: number;
  created_at: string;
  cliente_id: number;
  resumo_ia: string;
  pontos_melhoria: string[];
  score_atendimento: number;
  makeVenda: boolean;
  cliente?: Cliente;
}

export interface ConversationSummary {
  cliente: Cliente;
  ultimaMensagem: Mensagem;
  totalMensagens: number;
  analiseVenda?: AnalisesVenda;
  status: 'active' | 'pending' | 'closed';
}

export interface DashboardStats {
  totalClientes: number;
  clientesAtivos: number;
  mensagensHoje: number;
  scoreAtendimentoMedio: number;
  conversasComAnalise: number;
  empresasAtivas: number;
}

export interface Conversation {
  clientName: ReactNode;
  cliente: Cliente;
  ultimaMensagem: Mensagem;
  totalMensagens: number;
  analiseVenda?: AnalisesVenda;
  status: 'active' | 'pending' | 'closed';
}