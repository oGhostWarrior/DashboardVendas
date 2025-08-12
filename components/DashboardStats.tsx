import { useDashboardStats } from '@/hooks/useSupabaseData';
import { MessageSquare, Users, TrendingUp, Bot, Building, UserCheck, SquareUser } from 'lucide-react';

export function DashboardStats() {
  const { stats, loading } = useDashboardStats();

  const statsConfig = [
    {
      name: 'Total Clientes',
      value: stats.totalClientes.toString(),
      icon: Users,
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      name: 'Clientes Ativos',
      value: stats.clientesAtivos.toString(),
      icon: UserCheck,
      change: '+8%',
      changeType: 'positive' as const,
    },
    {
      name: 'Mensagens Hoje',
      value: stats.mensagensHoje.toString(),
      icon: MessageSquare,
      change: '+15%',
      changeType: 'positive' as const,
    },
    {
      name: 'Score Médio',
      value: `${stats.scoreAtendimentoMedio}/10`,
      icon: TrendingUp,
      change: '+5%',
      changeType: 'positive' as const,
    },
    {
      name: 'Com Análise IA',
      value: stats.conversasComAnalise.toString(),
      icon: Bot,
      change: '+25%',
      changeType: 'positive' as const,
    },
    {
      name: 'Vendedores Ativos',
      value: stats.empresasAtivas.toString(),
      icon: SquareUser,
      change: '0%',
      changeType: 'neutral' as const,
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="p-4 rounded-lg shadow-sm border animate-pulse">
            <div className="h-4 rounded mb-2"></div>
            <div className="h-8 rounded mb-2"></div>
            <div className="h-3 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
      {statsConfig.map((stat) => (
        <div key={stat.name} className="p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg">
                <stat.icon className="w-4 h-4 text-orange-600" />
              </div>
            </div>
            <span className={`text-xs font-medium ${
              stat.changeType === 'positive' ? 'text-green-600' : 'text-gray-600'
            }`}>
              {stat.change}
            </span>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm ">{stat.name}</p>
          </div>
        </div>
      ))}
    </div>
  );
}