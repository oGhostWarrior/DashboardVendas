import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://panbogpfdmskwdaonuki.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhbmJvZ3BmZG1za3dkYW9udWtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MjMwNDQsImV4cCI6MjA2NzM5OTA0NH0.41eFwxKjbp0caCTRuW7o7tnra7bmu727hILGTvHIdCU";

export const supabase = createClient(supabaseUrl, supabaseKey);

// Funções para interagir com as tabelas do seu schema
export class SupabaseService {
  
  // Empresas
  static async getEmpresas() {
    const { data, error } = await supabase
      .from('Empresa')
      .select('*')
      .eq('status', 'ativo');
    
    if (error) throw error;
    return data;
  }

  // Clientes
  static async getClientes(userId?: number, search?: string) {
    let query = supabase
      .from('Clientes')
      .select(`
        *,
        user:users(*)
      `)
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('IDempresa', userId);
    }

    if (search) {
      query = query.or(`nome.ilike.%${search}%,clienteWhatsapp.ilike.%${search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async getClienteById(id: number) {
    const { data, error } = await supabase
      .from('Clientes')
      .select(`
        *,
        empresa:Empresa(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  // Mensagens
  static async getMensagensByCliente(clienteId: number) {
    const { data, error } = await supabase
      .from('Mensagens')
      .select(`
        *,
        cliente:Clientes(*)
      `)
      .eq('cliente_id', clienteId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  }

  static async getUltimaMensagemPorCliente() {
    const { data, error } = await supabase
      .from('Mensagens')
      .select(`
        *,
        cliente:Clientes(
          *,
          empresa:Empresa(*)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Agrupar por cliente e pegar a última mensagem
    const ultimasPorCliente = new Map();
    data?.forEach(mensagem => {
      const clienteId = mensagem.cliente_id;
      if (!ultimasPorCliente.has(clienteId)) {
        ultimasPorCliente.set(clienteId, mensagem);
      }
    });

    return Array.from(ultimasPorCliente.values());
  }

  static async getMensagensHoje() {
    const hoje = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('Mensagens')
      .select('*')
      .gte('created_at', `${hoje}T00:00:00`)
      .lt('created_at', `${hoje}T23:59:59`);

    if (error) throw error;
    return data;
  }

  // Análises de Vendas
  static async getAnaliseByCliente(clienteId: number) {
    const { data, error } = await supabase
      .from('AnalisesVendas')
      .select(`
        *,
        cliente:Clientes(
          *,
          empresa:Empresa(*)
        )
      `)
      .eq('cliente_id', clienteId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async getAnalises(limit = 50) {
    const { data, error } = await supabase
      .from('AnalisesVendas')
      .select(`
        *,
        cliente:Clientes(
          *,
          empresa:Empresa(*)
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }

  // Dashboard Stats
  static async getDashboardStats() {
    try {
      // Total de clientes
      const { count: totalClientes } = await supabase
        .from('Clientes')
        .select('*', { count: 'exact', head: true });

      // Clientes ativos (com bot ativo)
      const { count: clientesAtivos } = await supabase
        .from('Clientes')
        .select('*', { count: 'exact', head: true })
        .eq('botAtivo', true);

      // Mensagens hoje
      const hoje = new Date().toISOString().split('T')[0];
      const { count: mensagensHoje } = await supabase
        .from('Mensagens')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', `${hoje}T00:00:00`)
        .lt('created_at', `${hoje}T23:59:59`);

      // Score médio de atendimento
      const { data: scores } = await supabase
        .from('AnalisesVendas')
        .select('score_atendimento');

      const scoreAtendimentoMedio = scores && scores.length > 0
        ? scores.reduce((acc, curr) => acc + curr.score_atendimento, 0) / scores.length
        : 0;

      // Conversas com análise
      const { count: conversasComAnalise } = await supabase
        .from('AnalisesVendas')
        .select('*', { count: 'exact', head: true });

      // Empresas ativas
      const { count: empresasAtivas } = await supabase
        .from('Empresa')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Ativo');

      return {
        totalClientes: totalClientes || 0,
        clientesAtivos: clientesAtivos || 0,
        mensagensHoje: mensagensHoje || 0,
        scoreAtendimentoMedio: Math.round(scoreAtendimentoMedio * 10) / 10,
        conversasComAnalise: conversasComAnalise || 0,
        empresasAtivas: empresasAtivas || 0,
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      throw error;
    }
  }

  // Conversação resumida
  static async getConversationSummaries(userId?: number, search?: string) {
    try {
      const clientes = await this.getClientes(userId, search);
      const summaries = [];

      for (const cliente of clientes) {
        // Buscar última mensagem
        const { data: ultimaMensagem } = await supabase
          .from('Mensagens')
          .select('*')
          .eq('cliente_id', cliente.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        // Contar total de mensagens
        const { count: totalMensagens } = await supabase
          .from('Mensagens')
          .select('*', { count: 'exact', head: true })
          .eq('cliente_id', cliente.id);

        // Buscar análise de venda
        const analiseVenda = await this.getAnaliseByCliente(cliente.id);

        // Determinar status baseado na última atividade
        let status: 'active' | 'pending' | 'closed' = 'pending';
        if (ultimaMensagem) {
          const ultimaAtividade = new Date(ultimaMensagem.created_at);
          const agora = new Date();
          const diferencaHoras = (agora.getTime() - ultimaAtividade.getTime()) / (1000 * 60 * 60);
          
          if (diferencaHoras < 24) {
            status = 'active';
          } else if (analiseVenda && analiseVenda.score_atendimento >= 8) {
            status = 'closed';
          }
        }

        summaries.push({
          cliente,
          ultimaMensagem,
          totalMensagens: totalMensagens || 0,
          analiseVenda,
          status,
        });
      }

      return summaries.sort((a, b) => {
        if (!a.ultimaMensagem) return 1;
        if (!b.ultimaMensagem) return -1;
        return new Date(b.ultimaMensagem.created_at).getTime() - new Date(a.ultimaMensagem.created_at).getTime();
      });
    } catch (error) {
      console.error('Erro ao buscar resumos de conversação:', error);
      throw error;
    }
  }
}