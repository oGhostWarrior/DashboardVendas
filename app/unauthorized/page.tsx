"use client";

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UnauthorizedPage() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full  rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold  mb-2">
          Acesso Negado
        </h1>
        
        <p className="mb-6">
          Você não tem permissão para acessar esta página.
          {user && (
            <span className="block mt-2 text-sm">
              Seu nível de acesso: <strong>{user.role}</strong>
            </span>
          )}
        </p>
        
        <Button 
          onClick={() => router.push('/')}
          className="bg-orange-600 hover:bg-orange-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao Dashboard
        </Button>
      </div>
    </div>
  );
}