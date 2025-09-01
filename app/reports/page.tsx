"use client";

import { useEffect, useMemo, useState } from "react";
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Sidebar } from "@/components/Sidebar";
import {
  BarChart3,
  TrendingUp,
  Users,
  MessageSquare,
  Calendar,
  Download,
} from "lucide-react";
import { isDateRange } from "react-day-picker";
import { set } from "date-fns";

export default function ReportsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [relatorio, setRelatorio] = useState<any | null>(null);
  
  const fetchRelatorio = async()=>{
    const response = await fetch('http://127.0.0.1:8000/api/relatorio-vendas');
    const relatorioData = await response.json();

    if (relatorioData)
    {
      setRelatorio(relatorioData)
    }
  }
  
  useEffect(()=>
    {
      fetchRelatorio();
  }, [])

   const metricas = useMemo(() => {
    // Se o relatório ainda não chegou, retorna valores zerados.
    if (!relatorio) {
      return {
        totalConversas: '...',
        taxaConversao: 0,
      };
    }

    // Pega os totais diretamente do payload da API. Sem cálculos manuais!
    const totalConversas = relatorio.total_mensagens;
    const totalVendas = relatorio.vendas_realizadas;

    // Calcula a taxa de conversão com os valores corretos.
    const taxaConversao = totalConversas > 0 
      ? Math.round((totalVendas / totalConversas) * 100) 
      : 0;
      
    // Com base no seu payload (2 vendas / 44 conversas), o resultado será 5%.

    return { totalConversas, taxaConversao };

  }, [relatorio]);

  return (
    <ProtectedRoute requiredRoles={['gerente', 'administrador']}>
    <div className="flex h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h1 className="text-xl font-semibold">Relatórios</h1>
          </div>
          <div className="flex text-sm  items-center space-x-2">
            <button className="flex text-gray-100 items-center space-x-2 px-3 py-2 bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Exportar</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main
          className="flex-1 p-4 overflow-y-auto"
          style={{
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <style jsx global>{`
            @media (max-width: 768px) {
              main::-webkit-scrollbar {
          display: none;
              }
              main {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE 10+ */
              }
            }
          `}</style>
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Filtros */}
            <div className="p-4 rounded-lg text-sm shadow-sm max-w-xl ">
              <div className="flex flex-row items-center gap-4">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <Calendar className="w-6 h-6" />
                  <select className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                    <option>Últimos 7 dias</option>
                    <option>Últimos 30 dias</option>
                    <option>Últimos 3 meses</option>
                    <option>Personalizado</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  {/* Ícone de usuário para filtro de vendedores */}
                  <Users className="w-6 h-6" />
                  <select className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                    <option>Todos</option>
                    <option>Maria Santos</option>
                    <option>Carlos Oliveira</option>
                    <option>Ana Costa</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Métricas Principais */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="p-4 rounded-lg shadow-sm border">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="p-2 rounded-lg">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-xs font-medium text-green-600">
                    +15%
                  </span>
                </div>
                <p className="text-2xl font-bold ">{relatorio?.total_mensagens}</p>
                <p className="text-sm ">Total de Conversas</p>
              </div>

              <div className="p-4 rounded-lg shadow-sm border">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="p-2 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-xs font-medium text-green-600">
                    +8%
                  </span>
                </div>
                 <p className="text-2xl font-bold">
  {relatorio ? `${metricas.taxaConversao}%` : '...%'}
</p>
                <p className="text-sm">Taxa de Conversão</p>
              </div>
              <div className="p-4 rounded-lg shadow-sm border">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="p-2 rounded-lg">
                    <Users className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-xs font-medium text-green-600">
                    +12%
                  </span>
                </div>
                <p className="text-2xl font-bold">342</p>
                <p className="text-sm ">Novos Clientes</p>
              </div>

              <div className=" p-4 rounded-lg shadow-sm border">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="p-2 rounded-lg">
                    <BarChart3 className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="text-xs font-medium text-red-600">-5%</span>
                </div>
                <p className="text-2xl font-bold ">2.4h</p>
                <p className="text-sm ">Tempo Médio</p>
              </div>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Conversas por Dia */}
              <div className=" p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">
                  Conversas por Dia
                </h3>
                <div className="h-64 flex items-end justify-between space-x-2">
                  {[65, 45, 78, 52, 89, 67, 94].map((height, index) => (
                    <div
                      key={index}
                      className="flex-1 flex flex-col items-center"
                    >
                      <div
                        className="w-full bg-orange-500 rounded-t"
                        style={{ height: `${height}%` }}
                      ></div>
                      <span className="text-xs mt-2">
                        {
                          ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"][
                            index
                          ]
                        }
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance por Vendedor */}
              <div className=" p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">
                  Performance por Vendedor
                </h3>
                <div className="space-y-4">
                  {[
                    { name: "Maria Santos", conversions: 89, total: 120 },
                    { name: "Carlos Oliveira", conversions: 76, total: 95 },
                    { name: "Ana Costa", conversions: 65, total: 88 },
                    { name: "Pedro Silva", conversions: 54, total: 72 },
                  ].map((seller, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">
                            {seller.name}
                          </span>
                          <span className="text-sm">
                            {Math.round(
                              (seller.conversions / seller.total) * 100
                            )}
                            %
                          </span>
                        </div>
                        <div className="w-fullrounded-full h-2">
                          <div
                            className="bg-orange-600 h-2 rounded-full"
                            style={{
                              width: `${
                                (seller.conversions / seller.total) * 100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
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
