import React from 'react';
import { Card } from '@/components/ui/organisms/card';
import { AlertCircle, BarChart2, Plus, RefreshCw, AlertTriangle, Users, Shield, Clock, Zap, Activity, BarChart, Rotate3D } from 'lucide-react';
import { Button } from '@/components/ui/organisms/button';
import { INetworkData } from '@/types/hospital-network-types';
import { TMetric } from '@/types/hospital-metrics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/organisms/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/organisms/tooltip';

interface MetricsDashboardProps {
  networkData: INetworkData | null;
  metrics: TMetric[];
  onAddMetric: () => void;
}

export const MetricsDashboard: React.FC<MetricsDashboardProps> = ({
  networkData,
  metrics,
  onAddMetric
}) => {
  // Configurações para alertas principais
  const alertCards = [
    {
      title: "Hospital Crítico",
      subtitle: "Maior Ocupação",
      icon: AlertTriangle,
      value: networkData?.hospitals[0]?.name || "Hospital 4Health - Itaim",
      description: "Próximo ao limiar de alerta. Monitoramento recomendado.",
      gradient: "from-red-900/60 to-red-800/60",
      iconColor: "text-red-500",
      cardType: "hospital-critico",
      valueSize: "small",
      severity: "high",
      status: "Monitoramento Recomendado"
    },
    {
      title: "Déficit de Equipes",
      subtitle: "Dificuldade nas Equipes",
      icon: Users,
      value: 1,
      description: "Dentro dos parâmetros normais de operação.",
      gradient: "from-amber-900/60 to-amber-800/60",
      iconColor: "text-amber-500",
      cardType: "staff",
      severity: "medium",
      status: "Situação Normal"
    },
    {
      title: "Higienização de Equipamentos",
      subtitle: "Higienização Geral",
      icon: Shield,
      value: 2,
      description: "Acima do limiar crítico. Requer atenção imediata.",
      gradient: "from-blue-900/60 to-blue-800/60",
      iconColor: "text-blue-500",
      cardType: "maintenance",
      severity: "high",
      status: "Requer Atenção Imediata"
    },
    {
      title: "Tempo de Espera",
      subtitle: "Espera",
      icon: Clock,
      value: 0,
      description: "Dentro dos parâmetros normais de operação.",
      gradient: "from-purple-900/60 to-purple-800/60",
      iconColor: "text-purple-500",
      cardType: "waiting",
      severity: "low",
      status: "Situação Normal"
    }
  ];
  
  // Métricas operacionais adicionais
  const operationalMetrics = [
    {
      title: "Hospital Crítico",
      subtitle: "Maior Ocupação",
      icon: AlertTriangle,
      value: "Hospital 4Health - Itaim",
      secondaryValue: "↑2.5%",
      description: "Taxa de Ocupação: 85.5%",
      additionalDetails: "Acima da média esperada. Bom desempenho.",
      gradient: "from-red-900/40 to-red-800/40",
      iconColor: "text-red-500"
    },
    {
      title: "Risco de Burnout",
      subtitle: "Nível de Estresse",
      icon: Zap,
      value: "4.5",
      secondaryValue: "↑1.8%",
      description: "Equipes em Alerta: 3 de 8 equipes",
      additionalDetails: "Dentro dos parâmetros normais de operação.",
      gradient: "from-amber-900/40 to-amber-800/40",
      iconColor: "text-amber-500"
    },
    {
      title: "Manutenção",
      subtitle: "Leitos em Manutenção",
      icon: Shield,
      value: "12",
      secondaryValue: "↑0.5%",
      description: "Previsão de Conclusão: 7 dias",
      additionalDetails: "Abaixo da meta estabelecida. Verificar fatores.",
      gradient: "from-blue-900/40 to-blue-800/40",
      iconColor: "text-blue-500"
    },
    {
      title: "Taxa de Giro",
      subtitle: "Rotatividade de Leitos",
      icon: Rotate3D,
      value: "4.2",
      secondaryValue: "↑1.2%",
      description: "Média do Setor: 4.8 pacientes/leito",
      additionalDetails: "Dentro dos parâmetros normais de operação.",
      gradient: "from-purple-900/40 to-purple-800/40",
      iconColor: "text-purple-500"
    },
    {
      title: "Eficiência Operacional",
      subtitle: "Performance Geral",
      icon: Activity,
      value: "85%",
      secondaryValue: "↑3.2%",
      description: "Ranking na Rede: #2 de 3 hospitais",
      additionalDetails: "Acima da média esperada. Bom desempenho.",
      gradient: "from-green-900/40 to-green-800/40",
      iconColor: "text-green-500"
    },
    {
      title: "Ocupação Média",
      subtitle: "Taxa de Ocupação",
      icon: BarChart,
      value: "78.5%",
      secondaryValue: "↑2.3%",
      description: "Leitos Ocupados: 850/1200",
      additionalDetails: "Acima da média esperada. Bom desempenho.",
      gradient: "from-indigo-900/40 to-indigo-800/40",
      iconColor: "text-indigo-500"
    }
  ];
  
  // Combinar métricas personalizadas do usuário
  const customMetrics = metrics?.filter(m => m.createdBy === 'manual' || m.createdBy === 'ai') || [];
  
  const handleRefresh = () => {
    // Simular atualização das métricas
    console.log('Atualizando métricas do dashboard...');
  }
  
  return (
    <div className="space-y-6">
      {/* Cabeçalho do Dashboard */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Dashboard de Métricas</h2>
          <p className="text-gray-400">Visualize e gerencie métricas de desempenho hospitalar</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
            onClick={handleRefresh}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          
          <Button
            className="bg-purple-600 hover:bg-purple-700"
            onClick={onAddMetric}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Métrica
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-gray-800 border border-gray-700 p-1">
          <TabsTrigger 
            value="all" 
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
          >
            Todas as Métricas
          </TabsTrigger>
          <TabsTrigger 
            value="alerts" 
            className="data-[state=active]:bg-red-600 data-[state=active]:text-white"
          >
            Alertas
          </TabsTrigger>
          <TabsTrigger 
            value="operational" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Operacionais
          </TabsTrigger>
          <TabsTrigger 
            value="custom" 
            className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >
            Personalizadas
            {customMetrics.length > 0 && (
              <span className="ml-2 bg-green-700 text-white text-xs rounded-full px-2 py-0.5">
                {customMetrics.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        {/* Todas as Métricas */}
        <TabsContent value="all" className="mt-4">
          <div className="space-y-6">
            {/* Alertas Principais */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <h3 className="text-lg font-semibold text-white">Alertas Principais</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {alertCards.map((alert, index) => {
                  const IconComponent = alert.icon;
                  
                  return (
                    <Card 
                      key={index}
                      className={`relative overflow-hidden border-none bg-gradient-to-br ${alert.gradient}`}
                    >
                      <div className="p-4">
                        <div className="flex items-center mb-2">
                          <div className={`p-2 rounded-full bg-opacity-20 ${alert.iconColor} bg-black/20`}>
                            <IconComponent className={`h-5 w-5 ${alert.iconColor}`} />
                          </div>
                          <h3 className="ml-2 font-medium text-gray-200">{alert.title}</h3>
                        </div>
                        
                        <div className="mb-4">
                          <p className="text-sm text-gray-400">{alert.subtitle}</p>
                          <div className={`text-2xl font-bold text-white ${alert.valueSize === 'small' ? 'text-lg' : ''}`}>
                            {alert.value}
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-200">Análise comparativa</p>
                          <p className="text-xs text-gray-300 mt-1">{alert.description}</p>
                        </div>
                        
                        <div className="mt-4">
                          <div className={`
                            px-3 py-1.5 rounded-full text-xs font-medium inline-flex items-center
                            ${alert.severity === 'high' ? 'bg-red-800/40 text-red-200' : 
                              alert.severity === 'medium' ? 'bg-amber-800/40 text-amber-200' : 
                              'bg-green-800/40 text-green-200'}
                          `}>
                            {alert.severity === 'high' ? 
                              <AlertTriangle className="h-3 w-3 mr-1" /> : 
                              alert.severity === 'medium' ? 
                                <AlertCircle className="h-3 w-3 mr-1" /> : 
                                <Activity className="h-3 w-3 mr-1" />
                            }
                            {alert.status}
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
            
            {/* Métricas Operacionais */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <BarChart2 className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-white">Métricas Operacionais</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {operationalMetrics.map((metric, index) => {
                  const IconComponent = metric.icon;
                  
                  return (
                    <Card 
                      key={index}
                      className={`relative overflow-hidden border-gray-700 bg-gradient-to-br ${metric.gradient}`}
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className={`p-2 rounded-full bg-opacity-20 ${metric.iconColor} bg-black/20`}>
                              <IconComponent className={`h-5 w-5 ${metric.iconColor}`} />
                            </div>
                            <div className="ml-2">
                              <h3 className="font-medium text-gray-200">{metric.title}</h3>
                              <p className="text-xs text-gray-400">{metric.subtitle}</p>
                            </div>
                          </div>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="text-sm font-medium text-gray-300">
                                  {metric.secondaryValue}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="bg-gray-900 border-gray-700 text-white">
                                Variação em relação à semana anterior
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        
                        <div className="mb-3">
                          <div className="text-3xl font-bold text-white">
                            {metric.value}
                          </div>
                          <p className="text-xs text-gray-300 mt-1">{metric.description}</p>
                        </div>
                        
                        <div className="text-xs text-gray-400">
                          {metric.additionalDetails}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
            
            {/* Métricas Personalizadas */}
            {customMetrics.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="h-5 w-5 text-green-500" />
                  <h3 className="text-lg font-semibold text-white">Métricas Personalizadas</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {customMetrics.map((metric, index) => {
                    // Determinar ícone baseado no tipo de métrica
                    let IconComponent = BarChart2;
                    let iconColor = "text-purple-500";
                    let gradientColors = "from-purple-900/40 to-purple-800/40";
                    
                    if (metric.cardType === 'critical-hospital') {
                      IconComponent = AlertTriangle;
                      iconColor = "text-red-500";
                      gradientColors = "from-red-900/40 to-red-800/40";
                    } else if (metric.cardType === 'waiting') {
                      IconComponent = Clock;
                      iconColor = "text-amber-500";
                      gradientColors = "from-amber-900/40 to-amber-800/40";
                    } else if (metric.cardType === 'staff') {
                      IconComponent = Users;
                      iconColor = "text-blue-500";
                      gradientColors = "from-blue-900/40 to-blue-800/40";
                    } else if (metric.cardType === 'maintenance') {
                      IconComponent = Shield;
                      iconColor = "text-green-500";
                      gradientColors = "from-green-900/40 to-green-800/40";
                    }
                    
                    return (
                      <Card 
                        key={index}
                        className={`relative overflow-hidden border-gray-700 bg-gradient-to-br ${gradientColors}`}
                      >
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <div className={`p-2 rounded-full bg-opacity-20 ${iconColor} bg-black/20`}>
                                <IconComponent className={`h-5 w-5 ${iconColor}`} />
                              </div>
                              <div className="ml-2">
                                <h3 className="font-medium text-gray-200">{metric.title}</h3>
                                <p className="text-xs text-gray-400">{metric.subtitle || "Métrica personalizada"}</p>
                              </div>
                            </div>
                            
                            <div className="text-xs font-medium px-2 py-1 rounded-full bg-blue-900/30 border border-blue-800/50 text-blue-300">
                              {metric.createdBy === 'ai' ? "IA" : "Manual"}
                            </div>
                          </div>
                          
                          <div className="mb-3">
                            <div className="text-3xl font-bold text-white">
                              {metric.additionalInfo?.value || "N/A"}
                            </div>
                            <p className="text-xs text-gray-300 mt-1">
                              {metric.additionalInfo?.label || "Valor atual"}
                            </p>
                          </div>
                          
                          <div className="text-xs text-gray-400">
                            {metric.description || "Métrica personalizada gerada pelo usuário"}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                  
                  {/* Card para adicionar nova métrica */}
                  <Card 
                    className="border-dashed border-gray-700 bg-gray-800/50 hover:bg-gray-800 transition-colors cursor-pointer"
                    onClick={onAddMetric}
                  >
                    <div className="p-4 h-full flex flex-col items-center justify-center text-center">
                      <div className="p-3 rounded-full bg-gray-700/50 mb-3">
                        <Plus className="h-6 w-6 text-purple-400" />
                      </div>
                      <h3 className="font-medium text-gray-300 mb-1">Adicionar Nova Métrica</h3>
                      <p className="text-xs text-gray-500">
                        Crie manualmente ou use IA para gerar uma métrica personalizada
                      </p>
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        
        {/* Alertas */}
        <TabsContent value="alerts" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {alertCards.map((alert, index) => {
              const IconComponent = alert.icon;
              
              return (
                <Card 
                  key={index}
                  className={`relative overflow-hidden border-none bg-gradient-to-br ${alert.gradient}`}
                >
                  <div className="p-4">
                    <div className="flex items-center mb-2">
                      <div className={`p-2 rounded-full bg-opacity-20 ${alert.iconColor} bg-black/20`}>
                        <IconComponent className={`h-5 w-5 ${alert.iconColor}`} />
                      </div>
                      <h3 className="ml-2 font-medium text-gray-200">{alert.title}</h3>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-400">{alert.subtitle}</p>
                      <div className={`text-2xl font-bold text-white ${alert.valueSize === 'small' ? 'text-lg' : ''}`}>
                        {alert.value}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-200">Análise comparativa</p>
                      <p className="text-xs text-gray-300 mt-1">{alert.description}</p>
                    </div>
                    
                    <div className="mt-4">
                      <div className={`
                        px-3 py-1.5 rounded-full text-xs font-medium inline-flex items-center
                        ${alert.severity === 'high' ? 'bg-red-800/40 text-red-200' : 
                          alert.severity === 'medium' ? 'bg-amber-800/40 text-amber-200' : 
                          'bg-green-800/40 text-green-200'}
                      `}>
                        {alert.severity === 'high' ? 
                          <AlertTriangle className="h-3 w-3 mr-1" /> : 
                          alert.severity === 'medium' ? 
                            <AlertCircle className="h-3 w-3 mr-1" /> : 
                            <Activity className="h-3 w-3 mr-1" />
                        }
                        {alert.status}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>
        
        {/* Operacionais */}
        <TabsContent value="operational" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {operationalMetrics.map((metric, index) => {
              const IconComponent = metric.icon;
              
              return (
                <Card 
                  key={index}
                  className={`relative overflow-hidden border-gray-700 bg-gradient-to-br ${metric.gradient}`}
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-full bg-opacity-20 ${metric.iconColor} bg-black/20`}>
                          <IconComponent className={`h-5 w-5 ${metric.iconColor}`} />
                        </div>
                        <div className="ml-2">
                          <h3 className="font-medium text-gray-200">{metric.title}</h3>
                          <p className="text-xs text-gray-400">{metric.subtitle}</p>
                        </div>
                      </div>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="text-sm font-medium text-gray-300">
                              {metric.secondaryValue}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="bg-gray-900 border-gray-700 text-white">
                            Variação em relação à semana anterior
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    
                    <div className="mb-3">
                      <div className="text-3xl font-bold text-white">
                        {metric.value}
                      </div>
                      <p className="text-xs text-gray-300 mt-1">{metric.description}</p>
                    </div>
                    
                    <div className="text-xs text-gray-400">
                      {metric.additionalDetails}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>
        
        {/* Personalizadas */}
        <TabsContent value="custom" className="mt-4">
          {customMetrics.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customMetrics.map((metric, index) => {
                // Determinar ícone baseado no tipo de métrica
                let IconComponent = BarChart2;
                let iconColor = "text-purple-500";
                let gradientColors = "from-purple-900/40 to-purple-800/40";
                
                if (metric.cardType === 'critical-hospital') {
                  IconComponent = AlertTriangle;
                  iconColor = "text-red-500";
                  gradientColors = "from-red-900/40 to-red-800/40";
                } else if (metric.cardType === 'waiting') {
                  IconComponent = Clock;
                  iconColor = "text-amber-500";
                  gradientColors = "from-amber-900/40 to-amber-800/40";
                } else if (metric.cardType === 'staff') {
                  IconComponent = Users;
                  iconColor = "text-blue-500";
                  gradientColors = "from-blue-900/40 to-blue-800/40";
                } else if (metric.cardType === 'maintenance') {
                  IconComponent = Shield;
                  iconColor = "text-green-500";
                  gradientColors = "from-green-900/40 to-green-800/40";
                }
                
                return (
                  <Card 
                    key={index}
                    className={`relative overflow-hidden border-gray-700 bg-gradient-to-br ${gradientColors}`}
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className={`p-2 rounded-full bg-opacity-20 ${iconColor} bg-black/20`}>
                            <IconComponent className={`h-5 w-5 ${iconColor}`} />
                          </div>
                          <div className="ml-2">
                            <h3 className="font-medium text-gray-200">{metric.title}</h3>
                            <p className="text-xs text-gray-400">{metric.subtitle || "Métrica personalizada"}</p>
                          </div>
                        </div>
                        
                        <div className="text-xs font-medium px-2 py-1 rounded-full bg-blue-900/30 border border-blue-800/50 text-blue-300">
                          {metric.createdBy === 'ai' ? "IA" : "Manual"}
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="text-3xl font-bold text-white">
                          {metric.additionalInfo?.value || "N/A"}
                        </div>
                        <p className="text-xs text-gray-300 mt-1">
                          {metric.additionalInfo?.label || "Valor atual"}
                        </p>
                      </div>
                      
                      <div className="text-xs text-gray-400">
                        {metric.description || "Métrica personalizada gerada pelo usuário"}
                      </div>
                    </div>
                  </Card>
                );
              })}
              
              {/* Card para adicionar nova métrica */}
              <Card 
                className="border-dashed border-gray-700 bg-gray-800/50 hover:bg-gray-800 transition-colors cursor-pointer"
                onClick={onAddMetric}
              >
                <div className="p-4 h-full flex flex-col items-center justify-center text-center">
                  <div className="p-3 rounded-full bg-gray-700/50 mb-3">
                    <Plus className="h-6 w-6 text-purple-400" />
                  </div>
                  <h3 className="font-medium text-gray-300 mb-1">Adicionar Nova Métrica</h3>
                  <p className="text-xs text-gray-500">
                    Crie manualmente ou use IA para gerar uma métrica personalizada
                  </p>
                </div>
              </Card>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-4 rounded-full bg-gray-800 mb-4">
                <BarChart2 className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-300 mb-2">Nenhuma métrica personalizada</h3>
              <p className="text-sm text-gray-500 max-w-md mb-6">
                Você ainda não criou nenhuma métrica personalizada. Use o assistente IA ou crie manualmente.
              </p>
              <Button 
                className="bg-purple-600 hover:bg-purple-700"
                onClick={onAddMetric}
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Nova Métrica
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};