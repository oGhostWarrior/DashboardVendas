"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Sidebar } from "@/components/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { AddUserModal } from "@/components/AddUserModal";
import { useTeam } from "@/hooks/useTeam";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  Mail,
  Phone,
  MessageSquare,
  TrendingUp,
  Award,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TeamPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { team, loading, refetch: refetchTeam } = useTeam();

  const handleUserAdded = () => {
    console.log("Usuário adicionado, recarregando lista...");
    refetchTeam();
  };

  const getAvatarInitials = (name: string = "") => {
    const nameParts = name.split(" ").filter(Boolean); // filter(Boolean) remove espaços extras
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${
        nameParts[nameParts.length - 1][0]
      }`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

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

  return (
    <ProtectedRoute requiredRoles={["gerente", "administrador"]}>
      <div className="flex h-screen">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="shadow-sm px-4 py-4 flex items-center justify-between">
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
              <h1 className="text-xl font-semibold">Equipe de Vendas</h1>
            </div>
            <div className="flex items-center space-x-4">
              {user?.role === "administrador" && (
                <Button onClick={() => setIsModalOpen(true)}>
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Adicionar Vendedor
                </Button>
              )}
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-4">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Team Overview */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className=" p-4 rounded-lg shadow-sm border">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="p-2 rounded-lg">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold">{team.length}</p>
                  <p className="text-sm ">Total de Membros</p>
                </div>

                <div className=" p-4 rounded-lg shadow-sm border">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="p-2 rounded-lg">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold">68%</p>
                  <p className="text-sm">Taxa Média</p>
                </div>

                <div className="p-4 rounded-lg shadow-sm border">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="p-2 rounded-lg">
                      <MessageSquare className="w-4 h-4 text-purple-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold">41</p>
                  <p className="text-sm">Conversas Hoje</p>
                </div>

                <div className="p-4 rounded-lg shadow-sm border">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="p-2 rounded-lg">
                      <Award className="w-4 h-4 text-yellow-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold">R$ 123k</p>
                  <p className="text-sm">Vendas do Mês</p>
                </div>
              </div>

              {/* Team Members */}
              <div className="rounded-lg shadow-sm border">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-semibold">Membros da Equipe</h2>
                </div>

                <div className="divide-y">
                  {loading
                    ? // Estado de Carregamento com Skeletons
                      Array.from({ length: 3 }).map((_, index) => (
                        <div
                          key={index}
                          className="p-4 flex items-start space-x-4"
                        >
                          <Skeleton className="w-12 h-12 rounded-full" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-1/4" />
                            <Skeleton className="h-3 w-1/6" />
                            <Skeleton className="h-3 w-1/2" />
                          </div>
                        </div>
                      ))
                    : // Lista de membros da equipe com dados reais
                      team.map((member) => (
                        <div key={member.id} className="p-4 transition-colors">
                          <div className="flex items-start space-x-4">
                            <div className="relative">
                              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="font-medium">
                                  {getAvatarInitials(member.name)}
                                </span>
                              </div>
                              <div
                                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(
                                  "online"
                                )}`}
                              ></div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium">{member.name}</h3>
                              <p className="text-sm mb-2 capitalize">
                                {member.role}
                              </p>
                              <div className="flex items-center space-x-4 text-sm">
                                <div className="flex items-center space-x-1">
                                  <Mail className="w-4 h-4" />
                                  <span className="hidden sm:inline">
                                    {member.email}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Phone className="w-4 h-4" />
                                  <span className="hidden sm:inline">
                                    {member.whatsapp_number}
                                  </span>
                                </div>
                              </div>
                              {/* As estatísticas por vendedor podem ser adicionadas na API no futuro */}
                            </div>
                          </div>
                        </div>
                      ))}
                </div>
              </div>
            </div>
          </main>
        </div>

        {isModalOpen && (
          <AddUserModal
            onClose={() => setIsModalOpen(false)}
            onUserAdded={handleUserAdded}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
