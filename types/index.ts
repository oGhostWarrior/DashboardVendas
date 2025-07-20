// Tipos baseados no schema Supabase real
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
  IDempresa: number;
  empresa?: Empresa;
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
  cliente?: Cliente;
}

// Tipos para o dashboard (adaptados)
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
  cliente: Cliente;
  ultimaMensagem: Mensagem;
  totalMensagens: number;
  analiseVenda?: AnalisesVenda;
  status: 'active' | 'pending' | 'closed';
}