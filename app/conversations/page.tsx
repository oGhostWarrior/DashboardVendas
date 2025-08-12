"use client";

import { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Sidebar } from '@/components/Sidebar';
import { ConversationsList } from '@/components/ConversationsList';
import { AnaliseModal } from '@/components/AnaliseModal';
import { ConversationModal } from '@/components/ConversationModal';
import { ConversationSummary } from '@/types';
import { useConversations, useAnaliseVenda } from '@/hooks/useSupabaseData';
import { apiClient } from '@/lib/api';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';

export default function ConversationsPage() {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<ConversationSummary | null>(null);
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const [showConversationModal, setShowConversationModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending' | 'closed'>('all');

  const { toast } = useToast();

  // Hooks integração com Supabase
  const { conversations, loading: conversationsLoading } = useConversations(
    user?.role === 'vendedor' ? user.id : undefined,
    searchTerm
  );

  const handleConversationClick = (conversation: ConversationSummary) => {
    setSelectedConversation(conversation);
    setShowConversationModal(true);
  };

  const handleAIAnalysisClick = (conversation: ConversationSummary) => {
    setSelectedConversation(conversation);
    setShowAIAnalysis(true);
  };


  const handleRequestAnalysis = async (clienteId: number) => {
    try {
      await apiClient.requestAIAnalysis(clienteId);
      toast({
        title: "Análise solicitada",
        description: "A análise da conversa foi solicitada com sucesso.",
      });
      
    } catch (error) {
      console.error("Erro ao solicitar análise:", error);
      toast({
        title: "Erro ao solicitar análise",
        description: "Ocorreu um erro ao solicitar a análise da conversa.",
        variant: "destructive",
      });
    }
  };

  return (
    <ProtectedRoute>
    <div className="flex h-screen">
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
            <h1 className="text-xl font-semibold">Conversas</h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4">
          <div className="max-w-7xl mx-auto">
            <ConversationsList 
              conversations={conversations}
              loading={conversationsLoading}
              onConversationClick={handleConversationClick}
              onAIAnalysisClick={handleAIAnalysisClick}
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
      {showAIAnalysis && selectedConversation && (
        <AnaliseModal
          conversationSummary={selectedConversation}
          onClose={() => setShowAIAnalysis(false)}
        />
      )}

      {showConversationModal && selectedConversation && (
        <ConversationModal
          conversationSummary={selectedConversation}
          onClose={() => setShowConversationModal(false)}
        />
      )}
    </div>
    </ProtectedRoute>
  );
}