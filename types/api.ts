// Tipos para integração com API Laravel

export interface ApiResponse<T> {
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface LaravelConversation {
  id: string;
  client_name: string;
  client_phone: string;
  last_message: string;
  last_message_at: string;
  status: 'active' | 'pending' | 'closed';
  salesperson_id: string;
  salesperson: {
    id: string;
    name: string;
    email: string;
  };
  messages_count: number;
  has_ai_analysis: boolean;
  created_at: string;
  updated_at: string;
}

export interface LaravelMessage {
  id: string;
  conversation_id: string;
  text: string;
  sender_type: 'client' | 'salesperson';
  sender_name: string;
  whatsapp_message_id?: string;
  created_at: string;
  updated_at: string;
}

export interface LaravelAIAnalysis {
  id: string;
  conversation_id: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  intent_probability: number;
  key_topics: string[];
  recommendations: string[];
  risk_level: 'low' | 'medium' | 'high';
  next_actions: string;
  confidence_score: number;
  created_at: string;
  updated_at: string;
}

export interface LaravelDashboardStats {
  conversations_today: number;
  active_clients: number;
  conversion_rate: number;
  average_response_time: string;
  total_messages_today: number;
  pending_conversations: number;
}

// Funções de transformação para converter dados Laravel para tipos locais
export function transformConversation(laravel: LaravelConversation): import('./index').Conversation {
  return {
    id: laravel.id,
    clientName: laravel.client_name,
    clientPhone: laravel.client_phone,
    lastMessage: laravel.last_message,
    timestamp: new Date(laravel.last_message_at),
    status: laravel.status,
    salesperson: laravel.salesperson.name,
    messagesCount: laravel.messages_count,
    hasAIAnalysis: laravel.has_ai_analysis,
  };
}

export function transformMessage(laravel: LaravelMessage): import('./index').Message {
  return {
    id: laravel.id,
    text: laravel.text,
    timestamp: new Date(laravel.created_at),
    sender: laravel.sender_type,
    senderName: laravel.sender_name,
  };
}

export function transformAIAnalysis(laravel: LaravelAIAnalysis): import('./index').AIAnalysis {
  return {
    conversationId: laravel.conversation_id,
    sentiment: laravel.sentiment,
    intentProbability: laravel.intent_probability,
    keyTopics: laravel.key_topics,
    recommendations: laravel.recommendations,
    riskLevel: laravel.risk_level,
    nextActions: laravel.next_actions,
    generatedAt: new Date(laravel.created_at),
  };
}