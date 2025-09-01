"use client";

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Sidebar } from '@/components/Sidebar';
import { Settings, Bell, Shield, Webhook, Save } from 'lucide-react';

export default function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settings, setSettings] = useState({
    notifications: {
      newConversations: true,
      aiAnalysis: true,
      lowPerformance: false,
      dailyReports: true,
    },
    integration: {
      n8nWebhook: 'https://sua-webhook-n8n-url.com/webhook-test/mensagens',
      laravelApi: 'http://localhost:8000/api',
      supabaseConnection: 'Verificando...', // Valor inicial
    },
    general: {
      companyName: 'Sua Empresa',
      timezone: 'America/Sao_Paulo',
      language: 'pt-BR',
      theme: 'Light',
      maxConversationsPerPage: 15,
    },
    security: {
      sessionTimeout: 24,
      requirePasswordChange: false,
      loginAttempts: 5,
    },
  });

  const [isSupabaseLoading, setIsSupabaseLoading] = useState(true);

  const handleSettingChange = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value,
      },
    }));
  };

  useEffect(() => {
    const checkDbStatus = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/db-check');
        const isConnected = await response.json();

        if (isConnected) {
          handleSettingChange('integration', 'supabaseConnection', 'Connected');
        } else {
          handleSettingChange('integration', 'supabaseConnection', 'Disconnected');
        }
      } catch (error) {
        console.error("Erro ao verificar status do banco de dados:", error);
        handleSettingChange('integration', 'supabaseConnection', 'Disconnected');
      } finally {
        setIsSupabaseLoading(false);
      }
    };

    checkDbStatus();
  }, []);


  const handleSave = () => {
    console.log('Salvando configurações:', settings);
  };

  return (
    <ProtectedRoute requiredRoles={['administrador']}>
      <div className="flex h-screen ">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="shadow-sm border-b px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-xl font-semibold ">Configurações</h1>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">Salvar</span>
              </button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-4"> {/* AQUI: Removida a classe bg-gray-50 */}
            <div className="max-w-4xl mx-auto space-y-6">

              {/* Configurações Gerais */}
              <div className="rounded-lg shadow-sm border"> {/* AQUI: Removida a classe bg-white */}
                <div className="p-4 border-b">
                  <div className="flex items-center space-x-2">
                    <Settings className="w-5 h-5" /> {/* AQUI: Removida a classe text-gray-600 */}
                    <h2 className="text-lg font-semibold">Configurações Gerais</h2>
                  </div>
                </div>
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Nome da Empresa
                      </label>
                      <input
                        type="text"
                        value={settings.general.companyName}
                        onChange={(e) => handleSettingChange('general', 'companyName', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Fuso Horário
                      </label>
                      <select
                        value={settings.general.timezone}
                        onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                        <option value="America/New_York">New York (GMT-5)</option>
                        <option value="Europe/London">London (GMT+0)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Idioma
                      </label>
                      <select
                        value={settings.general.language}
                        onChange={(e) => handleSettingChange('general', 'language', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="pt-BR">Português (Brasil)</option>
                        <option value="en-US">English (US)</option>
                        <option value="es-ES">Español</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Conversas por Página
                      </label>
                      <select
                        value={settings.general.maxConversationsPerPage}
                        onChange={(e) => handleSettingChange('general', 'maxConversationsPerPage', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notificações */}
              <div className="rounded-lg shadow-sm border"> {/* AQUI: Removida a classe bg-white */}
                <div className="p-4 border-b">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-5 h-5" /> {/* AQUI: Removida a classe text-gray-600 */}
                    <h2 className="text-lg font-semibold">Notificações</h2>
                  </div>
                </div>
                <div className="p-4 space-y-4">
                  {Object.entries(settings.notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium">
                          {key === 'newConversations' && 'Novas Conversas'}
                          {key === 'aiAnalysis' && 'Análises da IA'}
                          {key === 'lowPerformance' && 'Baixa Performance'}
                          {key === 'dailyReports' && 'Relatórios Diários'}
                        </h3>
                        <p className="text-xs "> {/* AQUI: Removida a classe text-gray-500 */}
                          {key === 'newConversations' && 'Receber notificações de novas conversas'}
                          {key === 'aiAnalysis' && 'Notificar quando análises estiverem prontas'}
                          {key === 'lowPerformance' && 'Alertas de performance baixa'}
                          {key === 'dailyReports' && 'Receber relatórios diários por email'}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => handleSettingChange('notifications', key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Segurança */}
              <div className="rounded-lg shadow-sm border"> {/* AQUI: Removida a classe bg-white */}
                <div className="p-4 border-b">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5" /> {/* AQUI: Removida a classe text-gray-600 */}
                    <h2 className="text-lg font-semibold ">Segurança</h2>
                  </div>
                </div>
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Timeout da Sessão (horas)
                      </label>
                      <select
                        value={settings.security.sessionTimeout}
                        onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value={1}>1 hora</option>
                        <option value={8}>8 horas</option>
                        <option value={24}>24 horas</option>
                        <option value={168}>7 dias</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Tentativas de Login
                      </label>
                      <select
                        value={settings.security.loginAttempts}
                        onChange={(e) => handleSettingChange('security', 'loginAttempts', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value={3}>3 tentativas</option>
                        <option value={5}>5 tentativas</option>
                        <option value={10}>10 tentativas</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">Exigir Troca de Senha</h3>
                      <p className="text-xs">Forçar usuários a trocar senha periodicamente</p> {/* AQUI: Removida a classe text-gray-500 */}
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.security.requirePasswordChange}
                        onChange={(e) => handleSettingChange('security', 'requirePasswordChange', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Integrações */}
              <div className="rounded-lg shadow-sm border"> {/* AQUI: Removida a classe bg-white */}
                <div className="p-4 border-b">
                  <div className="flex items-center space-x-2">
                    <Webhook className="w-5 h-5" /> {/* AQUI: Removida a classe text-gray-600 */}
                    <h2 className="text-lg font-semibold">Integrações</h2>
                  </div>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Webhook N8N
                    </label>
                    <input
                      type="url"
                      value={settings.integration.n8nWebhook}
                      onChange={(e) => handleSettingChange('integration', 'n8nWebhook', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://sua-webhook-n8n-url.com/webhook-test/mensagens"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Backend Laravel
                    </label>
                    <input
                      type="url"
                      value={settings.integration.laravelApi}
                      onChange={(e) => handleSettingChange('integration', 'laravelApi', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="http://localhost:8000/api"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Status Supabase
                    </label>
                    <div className="flex items-center space-x-2">
                      {isSupabaseLoading ? (
                        <>
                          <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse"></div>
                          <span className="text-sm text-gray-500">Verificando...</span>
                        </>
                      ) : (
                        <>
                          <div className={`w-3 h-3 rounded-full ${settings.integration.supabaseConnection === 'Connected' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className="text-sm">{settings.integration.supabaseConnection}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}