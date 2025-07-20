# Dashboard de Vendas WhatsApp

Sistema de gerenciamento de conversas de vendas integrado com WhatsApp, N8N e análise de IA.

## 🚀 Funcionalidades

- **Dashboard Responsivo**: Interface otimizada para mobile e desktop
- **Gerenciamento de Conversas**: Lista, filtros e busca de conversas
- **Análise de IA**: Insights automáticos sobre conversas e clientes
- **Integração Laravel**: Preparado para backend Laravel
- **Real-time**: Suporte para atualizações em tempo real

## 🛠️ Tecnologias

- **Frontend**: Next.js 13, React, TypeScript, Tailwind CSS
- **Backend**: Preparado para Laravel (API REST)
- **Banco de Dados**: PostgreSQL (via Laravel)
- **Automação**: N8N para integração WhatsApp
- **UI Components**: shadcn/ui, Lucide React

## 📦 Instalação

```bash
# Clone o repositório
git clone <repository-url>

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local

# Execute o projeto
npm run dev
```

## ⚙️ Configuração

### Variáveis de Ambiente

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_LARAVEL_URL=http://localhost:8000

# Environment
NODE_ENV=development
```

### Integração com Laravel

O projeto está preparado para integração com Laravel. Estrutura esperada da API:

#### Endpoints Principais

```
GET /api/conversations - Lista conversas
GET /api/conversations/{id} - Detalhes da conversa
GET /api/conversations/{id}/messages - Mensagens da conversa
GET /api/conversations/{id}/ai-analysis - Análise da IA
POST /api/conversations/{id}/ai-analysis - Gerar análise
PATCH /api/conversations/{id}/status - Atualizar status
GET /api/dashboard/stats - Estatísticas do dashboard
```

#### Estrutura do Banco (Laravel Migrations)

```sql
-- Conversas
CREATE TABLE conversations (
    id UUID PRIMARY KEY,
    client_name VARCHAR(255),
    client_phone VARCHAR(20),
    last_message TEXT,
    last_message_at TIMESTAMP,
    status ENUM('active', 'pending', 'closed'),
    salesperson_id UUID,
    messages_count INTEGER DEFAULT 0,
    has_ai_analysis BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Mensagens
CREATE TABLE messages (
    id UUID PRIMARY KEY,
    conversation_id UUID,
    text TEXT,
    sender_type ENUM('client', 'salesperson'),
    sender_name VARCHAR(255),
    whatsapp_message_id VARCHAR(255),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Análises da IA
CREATE TABLE ai_analyses (
    id UUID PRIMARY KEY,
    conversation_id UUID,
    sentiment ENUM('positive', 'neutral', 'negative'),
    intent_probability DECIMAL(3,2),
    key_topics JSON,
    recommendations JSON,
    risk_level ENUM('low', 'medium', 'high'),
    next_actions TEXT,
    confidence_score DECIMAL(3,2),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

## 🔧 Desenvolvimento

### Hooks Customizados

- `useConversations`: Gerencia lista de conversas
- `useAIAnalysis`: Carrega análises da IA
- `useDashboardStats`: Estatísticas do dashboard

### Componentes Principais

- `ConversationsList`: Lista de conversas com filtros
- `AIAnalysisModal`: Modal com análise detalhada da IA
- `ConversationModal`: Visualização de mensagens
- `DashboardStats`: Métricas e estatísticas

### Estrutura de Pastas

```
├── app/                 # Pages (App Router)
├── components/          # Componentes React
├── hooks/              # Hooks customizados
├── lib/                # Utilitários e configurações
├── types/              # Definições TypeScript
└── public/             # Assets estáticos
```

## 🔄 Integração N8N

O sistema está preparado para receber dados do N8N via webhooks Laravel:

1. **Webhook de Mensagens**: Recebe mensagens do WhatsApp
2. **Processamento IA**: Analisa conversas automaticamente
3. **Notificações**: Atualiza dashboard em tempo real

## 📱 Mobile First

Interface otimizada para webview mobile:

- Sidebar colapsável
- Touch-friendly components
- Responsive design
- Otimização de performance

## 🚀 Deploy

```bash
# Build para produção
npm run build

# Iniciar servidor
npm start
```

## 📄 Licença

Este projeto está sob a licença MIT.