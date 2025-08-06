"use client";
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, MessageSquare, BarChart3, Settings, Users, X, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';


interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { icon: Home, label: 'Dashboard', href: '/' },
  { icon: MessageSquare, label: 'Conversas', href: '/conversations' },
  { icon: BarChart3, label: 'Relatórios', href: '/reports' },
  { icon: Users, label: 'Equipe', href: '/team' },
  { icon: Settings, label: 'Configurações', href: '/settings' },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout, canAccessReports, canAccessTeam, canAccessSettings } = useAuth();

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      <div className={cn(
        "fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 md:relative md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-3">
            <Image
              src="/icon.png"
              alt="Logo da Axon"
              width={32}
              height={32}
            />
            <span className="font-semibold text-gray-900">Axon</span>
          </div>
          <button
            onClick={onClose}
            className="md:hidden p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="mt-8">
          {menuItems.filter((item) => {
            // Filtrar itens baseado nas permissões do usuário
            if (item.href === '/reports' && !canAccessReports()) return false;
            if (item.href === '/team' && !canAccessTeam()) return false;
            if (item.href === '/settings' && !canAccessSettings()) return false;
            return true;
          }).map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium transition-colors",
                  isActive
                    ? "text-orange-600 bg-orange-50 border-r-2 border-orange-600"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
          
          <button
            onClick={logout}
            className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sair
          </button>
        </nav>
        
        <div className="absolute bottom-0 w-full p-4 border-t">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-medium">
                {user?.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}