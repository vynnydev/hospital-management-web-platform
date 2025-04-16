'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart2, 
  Users, 
  CreditCard, 
  Activity,
  User,
  RefreshCw,
  HardDrive,
  Cpu,
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react'
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useSubscription } from '@/hooks/subscription/useSubscription'
import { Button } from '@/components/ui/organisms/button'

interface UsageStatisticsTabProps {
  hospitalId?: string
}

// Dados de uso simulados
interface UsageData {
  totalUsers: number
  activeUsers: number
  totalPatients: number
  totalStorage: number
  apiCalls: number
  aiQueries: number
  moduleUsage: {
    name: string
    value: number
    color: string
  }[]
  userActivity: {
    name: string
    admin: number
    doctor: number
    nurse: number
    attendant: number
  }[]
  resourceUsage: {
    name: string
    value: number
    limit: number
  }[]
}

export const UsageStatisticsTab = ({ hospitalId }: UsageStatisticsTabProps) => {
  const { 
    currentPlan, 
    availableModules,
    loading,
    refreshData
  } = useSubscription(hospitalId)
  
  const [usageData, setUsageData] = useState<UsageData | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')
  
  // Simular carregamento de dados
  useEffect(() => {
    if (!currentPlan) return
    
    const fetchUsageData = () => {
      // Dados simulados - em uma implementação real, você carregaria estes dados da API
      const mockData: UsageData = {
        totalUsers: Math.floor(Math.random() * (currentPlan.limits.users * 0.9)) + 1,
        activeUsers: Math.floor(Math.random() * (currentPlan.limits.users * 0.7)) + 1,
        totalPatients: Math.floor(Math.random() * (currentPlan.limits.patients * 0.8)) + 100,
        totalStorage: Math.floor(Math.random() * (currentPlan.limits.storage * 0.75)) + 1,
        apiCalls: Math.floor(Math.random() * (currentPlan.limits.apiCalls * 0.6)) + 100,
        aiQueries: currentPlan.limits.aiAssistantQueries > 0 
          ? Math.floor(Math.random() * (currentPlan.limits.aiAssistantQueries * 0.8)) 
          : 0,
        
        // Dados de uso por módulo
        moduleUsage: availableModules.map((module, index) => ({
          name: module.name,
          value: Math.floor(Math.random() * 100) + 20,
          color: [
            '#4f46e5', '#7c3aed', '#2563eb', '#0891b2', '#0d9488', 
            '#059669', '#65a30d', '#ca8a04', '#d97706', '#dc2626',
            '#e11d48', '#9333ea', '#3b82f6', '#06b6d4', '#10b981'
          ][index % 15]
        })),
        
        // Dados de atividade de usuários
        userActivity: [
          { name: 'Seg', admin: 20, doctor: 45, nurse: 28, attendant: 17 },
          { name: 'Ter', admin: 15, doctor: 50, nurse: 35, attendant: 20 },
          { name: 'Qua', admin: 22, doctor: 55, nurse: 30, attendant: 25 },
          { name: 'Qui', admin: 18, doctor: 48, nurse: 25, attendant: 19 },
          { name: 'Sex', admin: 25, doctor: 52, nurse: 32, attendant: 22 },
          { name: 'Sáb', admin: 10, doctor: 30, nurse: 20, attendant: 15 },
          { name: 'Dom', admin: 5, doctor: 15, nurse: 10, attendant: 8 }
        ],
        
        // Dados de uso de recursos
        resourceUsage: [
          {
            name: 'Usuários',
            value: Math.floor(Math.random() * (currentPlan.limits.users * 0.9)) + 1,
            limit: currentPlan.limits.users
          },
          {
            name: 'Pacientes',
            value: Math.floor(Math.random() * (currentPlan.limits.patients * 0.8)) + 100,
            limit: currentPlan.limits.patients
          },
          {
            name: 'Armazenamento (GB)',
            value: Math.floor(Math.random() * (currentPlan.limits.storage * 0.75)) + 1,
            limit: currentPlan.limits.storage
          },
          {
            name: 'Chamadas API',
            value: Math.floor(Math.random() * (currentPlan.limits.apiCalls * 0.6)) + 100,
            limit: currentPlan.limits.apiCalls
          },
          {
            name: 'Consultas IA',
            value: currentPlan.limits.aiAssistantQueries > 0 
              ? Math.floor(Math.random() * (currentPlan.limits.aiAssistantQueries * 0.8)) 
              : 0,
            limit: currentPlan.limits.aiAssistantQueries
          }
        ]
      };
      
      setUsageData(mockData);
    };
    
    fetchUsageData();
  }, [currentPlan, availableModules, timeRange]);
  
  // Função para atualizar os dados
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    
    // Simular tempo de carregamento
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };
  
  // Função para formatar percentuais
  const formatPercentage = (value: number, limit: number) => {
    if (limit === 0) return '0%';
    const percentage = Math.round((value / limit) * 100);
    return `${percentage}%`;
  };
  
  // Função para obter cor com base no percentual de uso
  const getUsageColor = (value: number, limit: number) => {
    if (limit === 0) return 'text-gray-400 dark:text-gray-500';
    const percentage = (value / limit) * 100;
    
    if (percentage < 50) return 'text-green-500 dark:text-green-400';
    if (percentage < 75) return 'text-yellow-500 dark:text-yellow-400';
    return 'text-red-500 dark:text-red-400';
  };
  
  // Função para obter ícone com base no percentual de uso
  const getUsageIcon = (value: number, limit: number) => {
    if (limit === 0) return <AlertTriangle className="h-4 w-4 text-gray-400 dark:text-gray-500" />;
    const percentage = (value / limit) * 100;
    
    if (percentage < 50) return <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400" />;
    if (percentage < 75) return <Clock className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />;
    return <AlertTriangle className="h-4 w-4 text-red-500 dark:text-red-400" />;
  };
  
  // Renderizar componente de carregamento
  if (loading || !usageData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div>
      {/* Cabeçalho com filtros */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-white">
            Estatísticas de Uso
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Visualize dados de utilização da sua plataforma
          </p>
        </div>
        
        <div className="flex space-x-2">
          {/* Seletor de período */}
          <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-200 dark:border-gray-700 flex">
            <button 
              className={`px-3 py-1.5 text-xs font-medium rounded-l-md ${
                timeRange === '7d' 
                  ? 'bg-indigo-500 text-white' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              onClick={() => setTimeRange('7d')}
            >
              7 dias
            </button>
            <button 
              className={`px-3 py-1.5 text-xs font-medium ${
                timeRange === '30d' 
                  ? 'bg-indigo-500 text-white' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              onClick={() => setTimeRange('30d')}
            >
              30 dias
            </button>
            <button 
              className={`px-3 py-1.5 text-xs font-medium rounded-r-md ${
                timeRange === '90d' 
                  ? 'bg-indigo-500 text-white' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              onClick={() => setTimeRange('90d')}
            >
              90 dias
            </button>
          </div>
          
          {/* Botão de atualizar */}
          <Button
            variant="outline"
            size="sm"
            className="border-gray-300 dark:border-gray-700"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </div>
      
      {/* Cards de métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="rounded-full bg-indigo-100 dark:bg-indigo-900/20 p-2 mr-3">
              <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Usuários Ativos</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{usageData.activeUsers}</p>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span className="text-green-500 dark:text-green-400 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              {formatPercentage(usageData.activeUsers, usageData.totalUsers)}
            </span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 dark:bg-blue-900/20 p-2 mr-3">
              <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total de Usuários</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{usageData.totalUsers}</p>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span className={`flex items-center ${currentPlan ? getUsageColor(usageData.totalUsers, currentPlan.limits.users) : ''}`}>
              {currentPlan && getUsageIcon(usageData.totalUsers, currentPlan.limits.users)}
              <span className="ml-1">
                {currentPlan ? formatPercentage(usageData.totalUsers, currentPlan.limits.users) : 'N/A'} do limite
              </span>
            </span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-2 mr-3">
              <CreditCard className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Pacientes</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{usageData.totalPatients}</p>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span className={`flex items-center ${currentPlan ? getUsageColor(usageData.totalPatients, currentPlan.limits.patients) : ''}`}>
              {currentPlan && getUsageIcon(usageData.totalPatients, currentPlan.limits.patients)}
              <span className="ml-1">
                {currentPlan ? formatPercentage(usageData.totalPatients, currentPlan.limits.patients) : 'N/A'} do limite
              </span>
            </span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="rounded-full bg-purple-100 dark:bg-purple-900/20 p-2 mr-3">
              <HardDrive className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Armazenamento</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{usageData.totalStorage} GB</p>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span className={`flex items-center ${currentPlan ? getUsageColor(usageData.totalStorage, currentPlan.limits.storage) : ''}`}>
              {currentPlan && getUsageIcon(usageData.totalStorage, currentPlan.limits.storage)}
              <span className="ml-1">
                {currentPlan ? formatPercentage(usageData.totalStorage, currentPlan.limits.storage) : 'N/A'} do limite
              </span>
            </span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="rounded-full bg-pink-100 dark:bg-pink-900/20 p-2 mr-3">
              <Activity className="h-5 w-5 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Chamadas API</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{usageData.apiCalls}</p>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span className={`flex items-center ${currentPlan ? getUsageColor(usageData.apiCalls, currentPlan.limits.apiCalls) : ''}`}>
              {currentPlan && getUsageIcon(usageData.apiCalls, currentPlan.limits.apiCalls)}
              <span className="ml-1">
                {currentPlan ? formatPercentage(usageData.apiCalls, currentPlan.limits.apiCalls) : 'N/A'} do limite
              </span>
            </span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="rounded-full bg-yellow-100 dark:bg-yellow-900/20 p-2 mr-3">
              <Cpu className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Consultas IA</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {currentPlan?.limits.aiAssistantQueries ?? 0 > 0 ? usageData.aiQueries : 'N/A'}
              </p>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {(currentPlan?.limits.aiAssistantQueries ?? 0) > 0 ? (
              <span className={`flex items-center ${currentPlan ? getUsageColor(usageData.aiQueries, currentPlan.limits.aiAssistantQueries) : ''}`}>
                {currentPlan && getUsageIcon(usageData.aiQueries, currentPlan.limits.aiAssistantQueries)}
                <span className="ml-1">
                  {currentPlan ? formatPercentage(usageData.aiQueries, currentPlan.limits.aiAssistantQueries) : 'N/A'} do limite
                </span>
              </span>
            ) : (
              <span className="text-gray-500 dark:text-gray-400">
                Não disponível no plano
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Gráfico de uso por módulo */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Utilização por Módulo
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={usageData.moduleUsage}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {usageData.moduleUsage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value} acessos`, 'Uso']}
                  labelFormatter={(name) => `${name}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Gráfico de atividade por tipo de usuário */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Atividade por Tipo de Usuário
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={usageData.userActivity}
                margin={{
                  top: 5,
                  right: 30,
                  left: 5,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(17, 24, 39, 0.8)', 
                    borderColor: '#374151',
                    color: '#F9FAFB'
                  }}
                />
                <Bar dataKey="admin" name="Administradores" fill="#818CF8" />
                <Bar dataKey="doctor" name="Médicos" fill="#34D399" />
                <Bar dataKey="nurse" name="Enfermeiros" fill="#F87171" />
                <Bar dataKey="attendant" name="Atendentes" fill="#FBBF24" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Gráfico de barras de uso de recursos */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          Uso de Recursos do Plano
        </h4>
        <div className="space-y-4">
          {usageData.resourceUsage.map((resource, index) => (
            <div key={index}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">{resource.name}</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {resource.value} / {resource.limit === 0 ? '∞' : resource.limit}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${
                    (resource.value / (resource.limit || 1)) * 100 < 50
                      ? 'bg-green-500'
                      : (resource.value / (resource.limit || 1)) * 100 < 75
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{
                    width: resource.limit === 0 ? '5%' : `${Math.min(
                      (resource.value / resource.limit) * 100,
                      100
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Botão para relatório detalhado */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          className="border-indigo-500 text-indigo-600 dark:border-indigo-600 dark:text-indigo-400"
        >
          <BarChart2 className="h-4 w-4 mr-2" />
          Gerar Relatório Detalhado
        </Button>
      </div>
    </div>
  );
};