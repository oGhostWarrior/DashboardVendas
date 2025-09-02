"use client";

import { useMemo, useState } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Sidebar } from "@/components/Sidebar";
import { useReports } from "@/hooks/useReports";
import {
  BarChart3,
  TrendingUp,
  Users,
  MessageSquare,
  Calendar,
  Download,
  Loader2,
} from "lucide-react";
import jsPDF from "jspdf";

// Interfaces
interface ConversaDiaria {
  dia: string;
  total_conversas: number;
}
interface SellerPerformance {
  name: string;
  conversions: number;
  total: number;
}
interface ReportData {
  total_clientes: number;
  vendas_realizadas: number;
  conversas_por_dia?: ConversaDiaria[];
}

export default function ReportsPage(): JSX.Element {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const { reportData: relatorio, loading } = useReports() as { reportData: ReportData | null, loading: boolean };
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const metricas = useMemo(() => {
    if (!relatorio || loading) return { taxaConversao: 0 };
    const totalClientes = relatorio.total_clientes;
    const totalVendas = relatorio.vendas_realizadas;
    const taxaConversao = totalClientes > 0 ? Math.round((totalVendas / totalClientes) * 100) : 0;
    return { taxaConversao };
  }, [relatorio, loading]);

  const chartData = useMemo(() => {
    if (!relatorio?.conversas_por_dia || relatorio.conversas_por_dia.length === 0) {
      return { data: [], effectiveMaxValue: 1, hasData: false }; 
    }
    const data = relatorio.conversas_por_dia;
    const actualMaxValue = Math.max(...data.map(item => item.total_conversas));
    const totalConversations = data.reduce((sum, item) => sum + item.total_conversas, 0);
    const effectiveMaxValue = Math.max(actualMaxValue, 5);
    return {
      data,
      effectiveMaxValue: effectiveMaxValue > 0 ? effectiveMaxValue : 1,
      hasData: totalConversations > 0
    };
  }, [relatorio]);

  // --- FUNÇÃO handleExportPDF COMPLETA E COM DIAGNÓSTICO ---
  const handleExportPDF = (): void => {
    console.log("Botão 'Exportar' clicado. Verificando dados...");
    console.log("Dados disponíveis no momento do clique (relatorio):", relatorio);
    console.log("Estado de 'loading':", loading);


    if (!relatorio || loading) {
      alert("Os dados do relatório ainda não foram totalmente carregados. Por favor, aguarde um momento e tente novamente.");
      console.error("Exportação cancelada: os dados não estão prontos.");
      return;
    }

    setIsExporting(true);

    try {
      const doc = new jsPDF("p", "pt", "a4");
      const pageHeight = doc.internal.pageSize.height;
      const pageWidth = doc.internal.pageSize.width;
      const margin = 40;

      // 1. Cabeçalho
      doc.setFontSize(20); doc.setFont("helvetica", "bold");
      doc.text("Relatório de Performance de Vendas", margin, 60);
      doc.setFontSize(10); doc.setFont("helvetica", "normal");
      const dataGeracao = new Date().toLocaleDateString("pt-BR", {
        year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
      });
      doc.text(`Gerado em: ${dataGeracao}`, margin, 80);
      doc.setLineWidth(0.5); doc.line(margin, 90, pageWidth - margin, 90);

      // 2. Métricas
      doc.setFontSize(14); doc.setFont("helvetica", "bold");
      doc.text("Resumo Geral", margin, 120);
      const metricasData = [
        { label: "Total de Conversas", value: relatorio.total_clientes },
        { label: "Taxa de Conversão", value: `${metricas.taxaConversao}%` },
        { label: "Novos Clientes", value: "342" },
        { label: "Tempo Médio", value: "2.4h" },
      ];
      let startX = margin;
      metricasData.forEach((metrica) => {
          doc.setFillColor(249, 250, 251);
          doc.roundedRect(startX, 140, 120, 60, 5, 5, "FD");
          doc.setFontSize(16); doc.setFont("helvetica", "bold"); doc.setTextColor(15, 23, 42);
          doc.text(String(metrica.value), startX + 15, 170);
          doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(100, 116, 139);
          doc.text(metrica.label, startX + 15, 185);
          startX += 130;
      });

      // 3. Gráfico de Barras no PDF
      doc.setFontSize(14); doc.setFont("helvetica", "bold"); doc.setTextColor(0, 0, 0);
      doc.text("Conversas por Dia", margin, 250);
      if (chartData.hasData) {
        const chartLabels = chartData.data.map(item => item.dia.substring(0, 3));
        const chartValues = chartData.data.map(item => item.total_conversas);
        const maxValue = chartData.effectiveMaxValue;
        const chartX = margin, chartY = 380, chartWidth = pageWidth - 2 * margin, chartHeight = 100;
        const barWidth = chartWidth / chartValues.length;
        doc.setLineWidth(0.5); doc.line(chartX, chartY, chartX + chartWidth, chartY);
        chartValues.forEach((value, index) => {
          const barX = chartX + index * barWidth;
          if (value > 0) {
            const barHeight = (value / maxValue) * chartHeight;
            doc.setFillColor(234, 88, 12);
            doc.rect(barX + (barWidth * 0.2) / 2, chartY - barHeight, barWidth * 0.8, barHeight, "FD");
            doc.setFontSize(8); doc.setTextColor(0,0,0);
            doc.text(String(value), barX + barWidth / 2, chartY - barHeight - 5, { align: "center" });
          }
          doc.setFontSize(8); doc.setTextColor(100, 116, 139);
          doc.text(chartLabels[index], barX + barWidth / 2, chartY + 15, { align: "center" });
        });
      } else {
        doc.setFontSize(10); doc.setFont("helvetica", "italic"); doc.setTextColor(150, 150, 150);
        doc.text("Sem dados de conversas para exibir no período.", margin, 280);
      }

      // 4. Performance por Vendedor
      doc.setFontSize(14); doc.setFont("helvetica", "bold"); doc.setTextColor(0, 0, 0);
      doc.text("Performance por Vendedor", margin, 440);
      const sellersData: SellerPerformance[] = [
        { name: "Maria Santos", conversions: 89, total: 120 }, { name: "Carlos Oliveira", conversions: 76, total: 95 },
        { name: "Ana Costa", conversions: 65, total: 88 }, { name: "Pedro Silva", conversions: 54, total: 72 },
      ];
      let currentY = 470;
      const progressBarWidth = 250;
      sellersData.forEach((seller) => {
          const percentage = seller.conversions / seller.total;
          doc.setFontSize(10); doc.setFont("helvetica", "normal"); doc.setTextColor(15, 23, 42);
          doc.text(seller.name, margin, currentY);
          doc.setFontSize(10); doc.setFont("helvetica", "bold");
          doc.text(`${Math.round(percentage * 100)}%`, margin + progressBarWidth + 65, currentY);
          doc.setFillColor(229, 231, 235); doc.roundedRect(margin, currentY + 8, progressBarWidth, 8, 4, 4, "F");
          doc.setFillColor(234, 88, 12); doc.roundedRect(margin, currentY + 8, progressBarWidth * percentage, 8, 4, 4, "F");
          currentY += 40;
      });

      // 5. Rodapé
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i); doc.setFontSize(8);
          doc.text(`Página ${i} de ${pageCount} - Relatório de Performance`, pageWidth / 2, pageHeight - 30, { align: "center" });
      }
      
      doc.save(`relatorio-performance-${Date.now()}.pdf`);

    } catch (error) {
      console.error("Ocorreu um erro ao gerar o PDF:", error);
      alert("Ocorreu um erro inesperado ao gerar o relatório. Verifique o console para mais detalhes.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <ProtectedRoute requiredRoles={["gerente", "administrador"]}>
      <div className="flex h-screen">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 rounded-lg transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg></button>
              <h1 className="text-xl font-semibold">Relatórios</h1>
            </div>
            <div className="flex text-sm items-center space-x-2">
              <button onClick={handleExportPDF} disabled={isExporting || loading} className="flex text-gray-100 items-center space-x-2 px-3 py-2 bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors disabled:bg-orange-400 disabled:cursor-not-allowed">
                {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                <span className="hidden sm:inline">{isExporting ? "Exportando..." : "Exportar"}</span>
              </button>
            </div>
          </header>

          <main className="flex-1 p-4 overflow-y-auto" style={{ WebkitOverflowScrolling: "touch" }}>
            <style jsx global>{` @media (max-width: 768px) { main::-webkit-scrollbar { display: none; } main { scrollbar-width: none; -ms-overflow-style: none; } } `}</style>
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="p-4 rounded-lg text-sm shadow-sm max-w-xl "><div className="flex flex-row items-center gap-4"><div className="flex items-center space-x-2 flex-1 min-w-0"><Calendar className="w-6 h-6" /><select className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"><option value="hoje">Hoje</option><option value="7dias">Últimos 7 dias</option><option value="30dias">Últimos 30 dias</option></select></div><div className="flex items-center space-x-2 flex-1 min-w-0"><Users className="w-6 h-6" /><select className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"><option value="todos">Todos</option><option value="1">Maria Santos</option><option value="2">Carlos Oliveira</option><option value="3">Ana Costa</option><option value="4">Pedro Silva</option></select></div></div></div>
              
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="p-4 rounded-lg shadow-sm border"><div className="flex items-center space-x-2 mb-2"><div className="p-2 rounded-lg"><MessageSquare className="w-4 h-4 text-blue-600" /></div><span className="text-xs font-medium text-green-600">+15%</span></div><p className="text-2xl font-bold">{relatorio?.total_clientes}</p><p className="text-sm">Total de Conversas</p></div>
                <div className="p-4 rounded-lg shadow-sm border"><div className="flex items-center space-x-2 mb-2"><div className="p-2 rounded-lg"><TrendingUp className="w-4 h-4 text-green-600" /></div><span className="text-xs font-medium text-green-600">+8%</span></div><p className="text-2xl font-bold">{relatorio ? `${metricas.taxaConversao}%` : "...%"}</p><p className="text-sm">Taxa de Conversão</p></div>
                <div className="p-4 rounded-lg shadow-sm border"><div className="flex items-center space-x-2 mb-2"><div className="p-2 rounded-lg"><Users className="w-4 h-4 text-purple-600" /></div><span className="text-xs font-medium text-green-600">+12%</span></div><p className="text-2xl font-bold">342</p><p className="text-sm ">Novos Clientes</p></div>
                <div className="p-4 rounded-lg shadow-sm border"><div className="flex items-center space-x-2 mb-2"><div className="p-2 rounded-lg"><BarChart3 className="w-4 h-4 text-orange-600" /></div><span className="text-xs font-medium text-red-600">-5%</span></div><p className="text-2xl font-bold ">2.4h</p><p className="text-sm ">Tempo Médio</p></div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold mb-4">Conversas por Dia</h3>
                  <div className="h-64 flex items-end justify-between space-x-2">
                    {loading ? ( <div className="w-full flex items-center justify-center text-center text-gray-500"><p>Carregando dados...</p></div> ) : 
                     chartData.hasData ? ( chartData.data.map((item, index) => {
                        const barHeightPercentage = (item.total_conversas / chartData.effectiveMaxValue) * 100;
                        const finalHeight = barHeightPercentage > 0 ? Math.max(barHeightPercentage, 4) : 0;
                        return (
                          <div key={index} className="flex-1 h-full flex flex-col justify-end items-center">
                            <div className="w-full flex flex-col items-center" style={{ height: `${finalHeight}%` }}>
                                {item.total_conversas > 0 && (
                                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                        {item.total_conversas}
                                    </span>
                                )}
                                <div className="w-full flex-1 bg-orange-500 rounded-t mt-1"></div>
                            </div>
                            <span className="text-xs mt-2">{item.dia.substring(0, 3)}</span>
                          </div>
                        );
                      })
                    ) : ( <div className="w-full flex items-center justify-center text-center text-gray-500"><p>Sem dados para exibir no período.</p></div> )}
                  </div>
                </div>
                
                <div className="p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold mb-4">Performance por Vendedor</h3>
                  <div className="space-y-4">
                    {[ { name: "Maria Santos", conversions: 89, total: 120 }, { name: "Carlos Oliveira", conversions: 76, total: 95 },
                       { name: "Ana Costa", conversions: 65, total: 88 }, { name: "Pedro Silva", conversions: 54, total: 72 },
                    ].map((seller: SellerPerformance, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex-1"><div className="flex items-center justify-between mb-1"><span className="text-sm font-medium">{seller.name}</span><span className="text-sm">{Math.round((seller.conversions / seller.total) * 100)}%</span></div><div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-orange-600 h-2 rounded-full" style={{ width: `${(seller.conversions / seller.total) * 100}%` }}></div></div></div>
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