"use client";

import { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Sidebar } from '@/components/Sidebar';
import { Settings, Bell, Shield, Database, Webhook, Bot, Save } from 'lucide-react';

export default function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settings, setSettings] = useState({
    notifications: {
      newConversations: true,
      aiAnalysis: true,
      lowPerformance: false,
      dailyReports: true,
    },
    ai: {
      autoAnalysis: true,
      sentimentThreshold: 0.7,
      riskAlerts: true,
      analysisFrequency: 'realtime',
    },
    integration: {
      n8nWebhook: 'https://n8n.local/webhook/whatsapp',
      laravelApi: 'http://localhost:8000/api',
      postgresConnection: 'Connected',
    },
    general: {
      companyName: 'SalesChat',
      timezone: 'America/Sao_Paulo',
      language: 'pt-BR',
      theme: 'Dark',
    },
  });

  const handleSettingChange = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value,
      },
    }));
  };

  const handleSave = () => {
    // Aqui você salvaria as configurações na API Laravel
    console.log('Salvando configurações:', settings);
    // Mostrar toast de sucesso
  };

  return (
    <ProtectedRoute requiredRoles={['administrador']}>
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Configurações</h1>
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
        <main className="flex-1 overflow-y-auto p-4">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Configurações Gerais */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b">
                <div className="flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-gray-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Configurações Gerais</h2>
                </div>
              </div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                </div>
              </div>
            </div>

            {/* Notificações */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b">
                <div className="flex items-center space-x-2">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Notificações</h2>
                </div>
              </div>
              <div className="p-4 space-y-4">
                {Object.entries(settings.notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {key === 'newConversations' && 'Novas Conversas'}
                        {key === 'aiAnalysis' && 'Análises da IA'}
                        {key === 'lowPerformance' && 'Baixa Performance'}
                        {key === 'dailyReports' && 'Relatórios Diários'}
                      </h3>
                      <p className="text-xs text-gray-500">
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
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Configurações da IA */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b">
                <div className="flex items-center space-x-2">
                  <Bot className="w-5 h-5 text-gray-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Inteligência Artificial</h2>
                </div>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Análise Automática</h3>
                    <p className="text-xs text-gray-500">Analisar conversas automaticamente</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.ai.autoAnalysis}
                      onChange={(e) => handleSettingChange('ai', 'autoAnalysis', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Limite de Sentimento ({settings.ai.sentimentThreshold})
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={settings.ai.sentimentThreshold}
                    onChange={(e) => handleSettingChange('ai', 'sentimentThreshold', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Frequência de Análise
                  </label>
                  <select
                    value={settings.ai.analysisFrequency}
                    onChange={(e) => handleSettingChange('ai', 'analysisFrequency', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="realtime">Tempo Real</option>
                    <option value="hourly">A cada hora</option>
                    <option value="daily">Diariamente</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Integrações */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b">
                <div className="flex items-center space-x-2">
                  <Webhook className="w-5 h-5 text-gray-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Integrações</h2>
                </div>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Webhook N8N
                  </label>
                  <input
                    type="url"
                    value={settings.integration.n8nWebhook}
                    onChange={(e) => handleSettingChange('integration', 'n8nWebhook', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://n8n.local/webhook/whatsapp"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    API Laravel
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status PostgreSQL
                  </label>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">{settings.integration.postgresConnection}</span>
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