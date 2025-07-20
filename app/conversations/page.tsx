"use client";

import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { ConversationsList } from '@/components/ConversationsList';
import { AnaliseModal } from '@/components/AnaliseModal';
import { ConversationModal } from '@/components/ConversationModal';
import { ConversationSummary } from '@/types';
import { useConversations, useAnaliseVenda } from '@/hooks/useSupabaseData';

export default function ConversationsPage() {
  const [selectedConversation, setSelectedConversation] = useState<ConversationSummary | null>(null);
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const [showConversationModal, setShowConversationModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending' | 'closed'>('all');

  // Hooks customizados para integração com Supabase
  const { conversations, loading: conversationsLoading } = useConversations();

  const { analise, loading: analysisLoading } = useAnaliseVenda(
    showAIAnalysis ? selectedConversation?.id || null : null
  );

  const handleConversationClick = (conversation: ConversationSummary) => {
    setSelectedConversation(conversation);
    setShowConversationModal(true);
  };

  const handleAIAnalysisClick = (conversation: ConversationSummary) => {
    setSelectedConversation(conversation);
    setShowAIAnalysis(true);
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
            <h1 className="text-xl font-semibold text-gray-900">Conversas</h1>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">MS</span>
            </div>
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
          analise={analise}
          loading={analysisLoading}
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
  );
}