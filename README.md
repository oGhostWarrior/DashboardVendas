🚀 Funcionalidades:
*    Autenticação Baseada em Papéis: Sistema de login seguro para Vendedores, Gerentes e Administradores, cada um com suas permissões.
*    Dashboard de Métricas: Visualização de estatísticas de performance da equipe.
*    Gerenciamento de Conversas: Lista de conversas com busca e filtros, respeitando a visibilidade de cada usuário (vendedor vê apenas o seu, gerente/admin veem todos).
*    Visuualização de Histórico: Modal para visualização completa do histórico de mensagens de uma conversa.
*    Análise com I.A. sob Demanda: Aciona um fluxo no N8N para analisar a qualidade do atendimento e fornecer insights, salvando o resultado no banco de dados.
*    Gerenciamento de Equipe: Administradores podem visualizar, criar e gerenciar usuários (vendedores/gerentes) diretamente pela interface.
*    Interface Responsiva: Design moderno e adaptável para desktop e dispositivos móveis.

🛠️ Tecnologias Utilizadas
*    Frontend: Next.js 13 (App Router), React, TypeScript, Tailwind CSS.
*    Backend: Laravel 8+ (API RESTful).
*    Banco de Dados: Supabase (PostgreSQL).
*    Autenticação: Laravel Sanctum para autenticação de API.
*    Automação e Integração: N8N para receber mensagens do WhatsApp (via Evolution API) e orquestrar as análises de I.A.
*    UI Components: shadcn/ui e Lucide React para uma interface moderna e consistente.

⚙️ Configuração e Instalação
Pré-requisitos:
*    Node.js (v18+)
*    PHP (v8.0+) e Composer
*    Um projeto Supabase configurado
*    Uma instância do N8N

1. Backend (Laravel)
Bash
# Navegue até a pasta do seu backend
cd b.api

# Instale as dependências do PHP
composer install

# Copie o arquivo de ambiente e configure-o
cp .env.example .env

# Gere a chave da aplicação
php artisan key:generate

# Execute as migrations para criar as tabelas no banco de dados
php artisan migrate
Importante: Configure suas credenciais do Supabase no arquivo .env do Laravel (DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD).
2. Frontend (Next.js)
Bash
# Navegue até a pasta do frontend
cd ../

# Instale as dependências do Node.js
npm install

# Copie o arquivo de ambiente
cp .env.example .env.local
Abra o arquivo .env.local e configure as seguintes variáveis:
Snippet de código
# URL da sua API Laravel
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Credenciais do seu projeto Supabase (para o cliente frontend)
NEXT_PUBLIC_SUPABASE_URL=URL_DO_SEU_PROJETO_SUPABASE
NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_CHAVE_ANON_SUPABASE
3. Executando o Projeto
Bash
# Em um terminal, inicie o servidor do Laravel
cd b.api
php artisan serve

# Em outro terminal, inicie o servidor do Next.js
npm run dev

🔄 Fluxo de Dados com N8N
O N8N é o coração da integração em tempo real com o WhatsApp.
1.	Recebimento de Mensagens: Um webhook no N8N recebe cada nova mensagem da Evolution API. O fluxo identifica o vendedor (User) pelo número de telefone, encontra ou cria o cliente (Cliente) e salva a mensagem no banco de dados Supabase, associando-a ao cliente correto.
2.	Análise de I.A.: Quando um usuário clica em "Analisar Conversa", o frontend chama a API Laravel, que por sua vez aciona um segundo webhook no N8N. Este fluxo busca todo o histórico da conversa, envia para uma I.A. (como o Gemini) para análise e salva o resultado na tabela AnalisesVendas.

## 🏛️ Estrutura do Projeto

A aplicação é dividida em um backend Laravel e um frontend Next.js.

```
├── app/                  # Páginas do Next.js (App Router)
│   ├── (auth)/           # Rotas de autenticação (Login)
│   ├── (main)/           # Rotas protegidas (Dashboard, Conversas, etc.)
│   └── layout.tsx
├── components/           # Componentes React
│   ├── ui/               # Componentes do Shadcn (Button, Card, etc.)
│   └── AddUserModal.tsx  # Componentes específicos da aplicação
├── contexts/             # Contextos React (Ex: AuthContext)
├── hooks/                # Hooks customizados (Ex: useTeam, useSupabaseData)
├── lib/                  # Utilitários, API e clientes de serviços (api.ts, supabase.ts)
├── types/                # Definições de tipos TypeScript (index.ts)
└── b.api/                # Aplicação Backend Laravel
    ├── app/
    ├── database/
    └── routes/
```

## 📄 Licença

Este projeto está sob a licença MIT.

```
```
back:
composer require pusher/pusher-php-server
composer require beyondcode/laravel-websockets

front:
npm install laravel-echo pusher-js

depois: php artisan vendor:publish --provider="BeyondCode\LaravelWebSockets\WebSocketsServiceProvider"
depois: php artisan make:event Notificacao

dps isso: php artisan websockets:serve
dps disso: composer require doctrine/dbal


front:
npm install @supabase/supabase-js
