"use client";

import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { BarChart3, TrendingUp, Users, MessageSquare, Calendar, Download } from 'lucide-react';

export default function ReportsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
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
            <h1 className="text-xl font-semibold text-gray-900">Relatórios</h1>
          </div>
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Exportar</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Filtros */}
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <select className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Últimos 7 dias</option>
                    <option>Últimos 30 dias</option>
                    <option>Últimos 3 meses</option>
                    <option>Personalizado</option>
                  </select>
                </div>
                <select className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Todos os vendedores</option>
                  <option>Maria Santos</option>
                  <option>Carlos Oliveira</option>
                  <option>Ana Costa</option>
                </select>
              </div>
            </div>

            {/* Métricas Principais */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-xs font-medium text-green-600">+15%</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">1,247</p>
                <p className="text-sm text-gray-500">Total de Conversas</p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-xs font-medium text-green-600">+8%</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">68%</p>
                <p className="text-sm text-gray-500">Taxa de Conversão</p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Users className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-xs font-medium text-green-600">+12%</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">342</p>
                <p className="text-sm text-gray-500">Novos Clientes</p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="p-2 bg-orange-50 rounded-lg">
                    <BarChart3 className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="text-xs font-medium text-red-600">-5%</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">2.4h</p>
                <p className="text-sm text-gray-500">Tempo Médio</p>
              </div>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Conversas por Dia */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversas por Dia</h3>
                <div className="h-64 flex items-end justify-between space-x-2">
                  {[65, 45, 78, 52, 89, 67, 94].map((height, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-blue-500 rounded-t"
                        style={{ height: `${height}%` }}
                      ></div>
                      <span className="text-xs text-gray-500 mt-2">
                        {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'][index]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance por Vendedor */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance por Vendedor</h3>
                <div className="space-y-4">
                  {[
                    { name: 'Maria Santos', conversions: 89, total: 120 },
                    { name: 'Carlos Oliveira', conversions: 76, total: 95 },
                    { name: 'Ana Costa', conversions: 65, total: 88 },
                    { name: 'Pedro Silva', conversions: 54, total: 72 },
                  ].map((seller, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900">{seller.name}</span>
                          <span className="text-sm text-gray-500">
                            {Math.round((seller.conversions / seller.total) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(seller.conversions / seller.total) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Análises da IA */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Insights da IA</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">Sentimento Positivo</h4>
                  <p className="text-2xl font-bold text-green-600">74%</p>
                  <p className="text-sm text-green-600">das conversas</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-2">Risco Médio</h4>
                  <p className="text-2xl font-bold text-yellow-600">23%</p>
                  <p className="text-sm text-yellow-600">precisam atenção</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Alta Intenção</h4>
                  <p className="text-2xl font-bold text-blue-600">67%</p>
                  <p className="text-sm text-blue-600">probabilidade de compra</p>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}