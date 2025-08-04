"use client";

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { ConversationsList } from '@/components/ConversationsList';
import { DashboardStats } from '@/components/DashboardStats';
import { ConversationSummary } from '@/types';
import { useConversations } from '@/hooks/useSupabaseData';
import { AnaliseModal } from '@/components/AnaliseModal';
import { ConversationModal } from '@/components/ConversationModal';
import { apiClient } from '@/lib/api'; 
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [selectedConversation, setSelectedConversation] = useState<ConversationSummary | null>(null);
  const [showAnalise, setShowAnalise] = useState(false);
  const [showConversationModal, setShowConversationModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending' | 'closed'>('all');

  // Hook para dados do Supabase
  const { toast } = useToast();
  const { conversations, loading: conversationsLoading } = useConversations(
    undefined, // empresaId
    searchTerm
  );

  const handleConversationClick = (conversation: ConversationSummary) => {
    setSelectedConversation(conversation);
    setShowConversationModal(true);
  };

  const handleAnaliseClick = (conversation: ConversationSummary) => {
    setSelectedConversation(conversation);
    setShowAnalise(true);
  };

  const handleRequestAnalysis = async (clienteId: number) => {
    try {
      toast({
        title: "Processando Análise",
        description: "A análise da IA foi solicitada e estará disponível em breve.",
      });
      await apiClient.requestAIAnalysis(clienteId);
    } catch (error) {
      console.error("Erro ao solicitar análise:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível solicitar a análise da IA.",
      });
    }
  };

  

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
            <h1 className="text-xl font-semibold text-gray-900">Dashboard de Vendas</h1>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">MS</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4">
          <div className="max-w-7xl mx-auto space-y-6">
            <DashboardStats />
            <ConversationsList 
              conversations={conversations}
              loading={conversationsLoading}
              onConversationClick={handleConversationClick}
              onAIAnalysisClick={handleAnaliseClick}
              onAnalysisRequest={handleRequestAnalysis}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
            />
          </div>
        </main>
      </div>

      {/* Modals */}
      {showAnalise && selectedConversation && (
        <AnaliseModal
          conversationSummary={selectedConversation}
          onClose={() => setShowAnalise(false)}
        />
      )}

      {showConversationModal && selectedConversation && (
        <ConversationModal
          conversationSummary={selectedConversation}
          onClose={() => setShowConversationModal(false)}
        />
      )}
    </div>
  );
}