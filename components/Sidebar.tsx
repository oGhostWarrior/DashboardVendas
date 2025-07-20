"use client";

import { Home, MessageSquare, BarChart3, Settings, Users, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { icon: Home, label: 'Dashboard', href: '/', active: true },
  { icon: MessageSquare, label: 'Conversas', href: '/conversations' },
  { icon: BarChart3, label: 'Relatórios', href: '/reports' },
  { icon: Users, label: 'Equipe', href: '/team' },
  { icon: Settings, label: 'Configurações', href: '/settings' },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Overlay for mobile */}
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
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-gray-900">SalesChat</span>
          </div>
          <button
            onClick={onClose}
            className="md:hidden p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="mt-8">
          {menuItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-4 py-3 text-sm font-medium transition-colors",
                item.active
                  ? "text-blue-600 bg-blue-50 border-r-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </a>
          ))}
        </nav>
        
        <div className="absolute bottom-0 w-full p-4 border-t">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-medium">MS</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Maria Santos</p>
              <p className="text-xs text-gray-500 truncate">Gerente</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}