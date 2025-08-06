import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

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

      // Clientes ativos
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
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'vendedor');

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
      let query = supabase
        .from('conversation_summaries')
        .select('*')
        .order('ultima_mensagem_criada_em', { ascending: false, nullsFirst: false });

      //FILTRO DE VENDEDOR
      if (userId) {
        query = query.eq('user_id', userId);
      }

      if (search) {
        query = query.or(`cliente_nome.ilike.%${search}%,clienteWhatsapp.ilike.%${search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      const summaries = data.map((row: any) => ({
        cliente: {
          id: row.cliente_id,
          nome: row.cliente_nome,
          clienteWhatsapp: row.clienteWhatsapp,
          botAtivo: row.botAtivo,
          conversationID: row.conversationID,
          user_id: row.user_id,
          user: {
            id: row.user_id,
            name: row.user_name,
            email: row.user_email,
          }
        },
        ultimaMensagem: row.ultima_mensagem_id ? {
          id: row.ultima_mensagem_id,
          texto_mensagem: row.ultima_mensagem_texto,
          remetente: row.ultima_mensagem_remetente,
          tipo_mensagem: row.ultima_mensagem_tipo,
          created_at: row.ultima_mensagem_criada_em,
        } : null,
        totalMensagens: row.total_mensagens,
        analiseVenda: row.analise_id ? {
          id: row.analise_id,
          resumo_ia: row.resumo_ia,
          pontos_melhoria: row.pontos_melhoria,
          score_atendimento: row.score_atendimento,
          created_at: row.analysis_created_at,
        } : null,
        status: 'active',
      }));

      return summaries;

    } catch (error) {
      console.error('Erro ao buscar resumos de conversação:', error);
      throw error;
    }
  }
}