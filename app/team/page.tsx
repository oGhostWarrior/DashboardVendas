"use client";

import { useState } from "react";
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Sidebar } from "@/components/Sidebar";
import {
  Users,
  Mail,
  Phone,
  MessageSquare,
  TrendingUp,
  Award,
} from "lucide-react";

export default function TeamPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const teamMembers = [
    {
      id: "1",
      name: "Maria Santos",
      email: "maria@empresa.com",
      phone: "+55 11 99999-1111",
      role: "Gerente de Vendas",
      avatar: "MS",
      stats: {
        conversationsToday: 15,
        conversionRate: 78,
        averageResponseTime: "1.2h",
        totalSales: "R$ 45.000",
      },
      status: "online",
    },
    {
      id: "2",
      name: "Carlos Oliveira",
      email: "carlos@empresa.com",
      phone: "+55 11 99999-2222",
      role: "Vendedor",
      avatar: "CO",
      stats: {
        conversationsToday: 12,
        conversionRate: 65,
        averageResponseTime: "2.1h",
        totalSales: "R$ 32.000",
      },
      status: "online",
    },
    {
      id: "3",
      name: "Ana Costa",
      email: "ana@empresa.com",
      phone: "+55 11 99999-3333",
      role: "Vendedora",
      avatar: "AC",
      stats: {
        conversationsToday: 8,
        conversionRate: 72,
        averageResponseTime: "1.8h",
        totalSales: "R$ 28.500",
      },
      status: "away",
    },
    {
      id: "4",
      name: "Pedro Silva",
      email: "pedro@empresa.com",
      phone: "+55 11 99999-4444",
      role: "Vendedor Junior",
      avatar: "PS",
      stats: {
        conversationsToday: 6,
        conversionRate: 58,
        averageResponseTime: "3.2h",
        totalSales: "R$ 18.000",
      },
      status: "offline",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "offline":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "online": {
        return "Online";
      }
      case "away":
        return "Ausente";
      case "offline":
        return "Offline";
      default:
        return "Desconhecido";
    }
  };

  return (
    <ProtectedRoute requiredRoles={['gerente', 'administrador']}>
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
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
            <h1 className="text-xl font-semibold text-gray-900">
              Equipe de Vendas
            </h1>
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
            {/* Team Overview */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">4</p>
                <p className="text-sm text-gray-500">Total de Vendedores</p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">68%</p>
                <p className="text-sm text-gray-500">Taxa Média</p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <MessageSquare className="w-4 h-4 text-purple-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">41</p>
                <p className="text-sm text-gray-500">Conversas Hoje</p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="p-2 bg-orange-50 rounded-lg">
                    <Award className="w-4 h-4 text-yellow-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">R$ 123k</p>
                <p className="text-sm text-gray-500">Vendas do Mês</p>
              </div>
            </div>

            {/* Team Members */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">
                  Membros da Equipe
                </h2>
              </div>

              <div className="divide-y">
                {teamMembers.map((member) => {
                  const statusColorClass = getStatusColor(member.status);
                  const statusText = getStatusText(member.status);

                  return (
                    <div
                      key={member.id}
                      className="p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start space-x-4">
                        {/* Avatar and Status */}
                        <div className="relative">
                          <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium">
                              {member.avatar}
                            </span>
                          </div>
                          <div
                            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(
                              member.status
                            )}`}
                          ></div>
                        </div>

                        {/* Member Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium text-gray-900">
                              {member.name}
                            </h3>
                            <span
                              className={`text-xs text-white px-2 py-1 rounded-full ${statusColorClass}`}
                            >
                              {statusText}
                            </span>
                          </div>

                          <p className="text-sm text-gray-600 mb-2">
                            {member.role}
                          </p>

                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                            <div className="flex items-center space-x-1">
                              <Mail className="w-4 h-4" />
                              <span className="hidden sm:inline">
                                {member.email}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Phone className="w-4 h-4" />
                              <span className="hidden sm:inline">
                                {member.phone}
                              </span>
                            </div>
                          </div>

                          {/* Performance Stats */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-2 bg-gray-50 rounded">
                              <p className="text-lg font-semibold text-gray-900">
                                {member.stats.conversationsToday}
                              </p>
                              <p className="text-xs text-gray-500">
                                Conversas Hoje
                              </p>
                            </div>
                            <div className="text-center p-2 bg-gray-50 rounded">
                              <p className="text-lg font-semibold text-gray-900">
                                {member.stats.conversionRate}%
                              </p>
                              <p className="text-xs text-gray-500">
                                Taxa Conversão
                              </p>
                            </div>
                            <div className="text-center p-2 bg-gray-50 rounded">
                              <p className="text-lg font-semibold text-gray-900">
                                {member.stats.averageResponseTime}
                              </p>
                              <p className="text-xs text-gray-500">
                                Tempo Médio
                              </p>
                            </div>
                            <div className="text-center p-2 bg-gray-50 rounded">
                              <p className="text-lg font-semibold text-gray-900">
                                {member.stats.totalSales}
                              </p>
                              <p className="text-xs text-gray-500">
                                Vendas Mês
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
    </ProtectedRoute>
  );
}
