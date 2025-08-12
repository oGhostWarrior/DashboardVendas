"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home,
  MessageSquare,
  BarChart3,
  Settings,
  Users,
  X,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/theme-toggle";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: MessageSquare, label: "Conversas", href: "/conversations" },
  { icon: BarChart3, label: "Relatórios", href: "/reports" },
  { icon: Users, label: "Equipe", href: "/team" },
  { icon: Settings, label: "Configurações", href: "/settings" },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout, canAccessReports, canAccessTeam, canAccessSettings } =
    useAuth();

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={onClose} />
      )}

      <div
        className={cn(
          "fixed left-0 top-0 h-full bg-theme w-64 border-r rounded-xl shadow-lg z-50 transform transition-transform duration-300 md:relative md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-3 ">
          <div className="flex items-center space-x-3">
            <Image src="icon.png" alt="Logo da Axon" width={32} height={32} />
            <span className="font-semibold">Axon</span>
          </div>
          <ThemeToggle />
        </div>

        <nav className="mt-8">
          {menuItems
            .filter((item) => {
              // Filtrar itens baseado nas permissões do usuário
              if (item.href === "/reports" && !canAccessReports()) return false;
              if (item.href === "/team" && !canAccessTeam()) return false;
              if (item.href === "/settings" && !canAccessSettings())
                return false;
              return true;
            })
            .map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium transition-colors",

                    {
                      "text-orange-600 border-r-2 border-orange-600": isActive,

                      "text-gray-300  hover:text-black dark:text-gray-00 dark:hover:text-gray-200":
                        !isActive,
                    }
                  )}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Link>
              );
            })}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t flex items-center justify-between">
          {/* Bloco da Esquerda: Agrupa o avatar e as informações do usuário */}
          <div className="flex items-center space-x-3">
            {/* Avatar */}
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-medium">
                {user?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </span>
            </div>

            {/* Nome e Função (agora agrupados) */}
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate capitalize">
                {user?.role}
              </p>
            </div>
          </div>

          {/* Bloco da Direita: Botão de Logout */}
          <button
            onClick={logout}
            className="p-2 rounded-lg text-red-500 hover:bg-red-100 hover:text-red-800 dark:red-gray-400 dark:hover:bg-red-800 dark:hover:text-red-200 transition-colors"
            aria-label="Sair"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  );
}
