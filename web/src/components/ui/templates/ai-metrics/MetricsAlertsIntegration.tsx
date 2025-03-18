import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, 
  AlertTriangle, 
  Bell, 
  BellOff, 
  Settings, 
  Zap, 
  Edit,
  Eye,
  X,
  Ambulance,
  User,
  Package,
  Bed,
  Users,
  Info,
  CheckCircle,
  XCircle,
  Wrench,
} from 'lucide-react';
import { Button } from "@/components/ui/organisms/button";
import { Switch } from "@/components/ui/organisms/switch";
import { Input } from "@/components/ui/organisms/input";
import { Badge } from "@/components/ui/organisms/badge";
import { ScrollArea } from "@/components/ui/organisms/scroll-area";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/organisms/accordion";
import { TAlertPriority, TAlertType } from '@/types/alert-types';
import { INetworkData } from '@/types/hospital-network-types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/organisms/tabs";
import { useAlerts } from '../providers/alerts/AlertsProvider';
import { Separator } from '../../organisms/Separator';

interface MetricsAlertsIntegrationProps {
  networkData: INetworkData;
  selectedHospital: string | null;
  currentMetrics: {
    totalBeds: number;
    totalPatients: number;
    averageOccupancy: number;
  };
}

// Interface para regras de alerta
interface IAlertRule {
  id: string;
  metricId: string;
  metricName: string;
  metricType: string;
  condition: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
  threshold: number;
  priority: TAlertPriority;
  alertType: TAlertType;
  enabled: boolean;
  message: string;
  lastTriggered?: Date;
}

// Mapear condições para texto legível
const conditionMap = {
  gt: 'maior que',
  lt: 'menor que',
  eq: 'igual a',
  gte: 'maior ou igual a',
  lte: 'menor ou igual a'
};

// Mapear tipos de alerta para ícones e cores
const alertTypeMap: Record<TAlertType, { icon: React.ReactNode; color: string }> = {
    'ambulance': { icon: <Ambulance className="h-4 w-4" />, color: 'text-red-500 bg-red-950' },
    'patient-arrival': { icon: <User className="h-4 w-4" />, color: 'text-blue-500 bg-blue-950' },
    'resource': { icon: <Package className="h-4 w-4" />, color: 'text-amber-500 bg-amber-950' },
    'emergency': { icon: <AlertTriangle className="h-4 w-4" />, color: 'text-red-600 bg-red-950' },
    'occupancy': { icon: <Bed className="h-4 w-4" />, color: 'text-red-500 bg-red-950' },
    'staff': { icon: <Users className="h-4 w-4" />, color: 'text-amber-500 bg-amber-950' },
    'operational': { icon: <Settings className="h-4 w-4" />, color: 'text-purple-500 bg-purple-950' },
    'equipment': { icon: <Wrench className="h-4 w-4" />, color: 'text-blue-500 bg-blue-950' },
    'warning': { icon: <AlertTriangle className="h-4 w-4" />, color: 'text-amber-500 bg-amber-950' },
    'info': { icon: <Info className="h-4 w-4" />, color: 'text-blue-500 bg-blue-950' },
    'success': { icon: <CheckCircle className="h-4 w-4" />, color: 'text-green-500 bg-green-950' },
    'error': { icon: <XCircle className="h-4 w-4" />, color: 'text-red-500 bg-red-950' }
};

export const MetricsAlertsIntegration: React.FC<MetricsAlertsIntegrationProps> = ({
  networkData,
  selectedHospital,
  currentMetrics
}) => {
  // Acesso ao contexto de alertas
  const { 
    unreadCount, 
    highPriorityCount, 
    addCustomAlert, 
    getFilteredAlerts,
    updateAlertStatus,
    markAsRead
  } = useAlerts();
  
  // Estado para regras de alerta
  const [alertRules, setAlertRules] = useState<IAlertRule[]>([
    {
      id: 'rule-1',
      metricId: 'critical-hospital',
      metricName: 'Taxa de Ocupação',
      metricType: 'main',
      condition: 'gt',
      threshold: 85,
      priority: 'high',
      alertType: 'occupancy',
      enabled: true,
      message: 'Taxa de ocupação acima do limite crítico'
    },
    {
      id: 'rule-2',
      metricId: 'staff',
      metricName: 'Déficit de Equipes',
      metricType: 'main',
      condition: 'gt',
      threshold: 2,
      priority: 'medium',
      alertType: 'staff',
      enabled: true,
      message: 'Déficit de equipes acima do limite aceitável'
    },
    {
      id: 'rule-3',
      metricId: 'waiting',
      metricName: 'Tempo de Espera',
      metricType: 'main',
      condition: 'gt',
      threshold: 4,
      priority: 'medium',
      alertType: 'operational',
      enabled: true,
      message: 'Tempo de espera acima do limite recomendado'
    },
    {
      id: 'rule-4',
      metricId: 'burnout',
      metricName: 'Risco de Burnout',
      metricType: 'additional',
      condition: 'gt',
      threshold: 7,
      priority: 'high',
      alertType: 'staff',
      enabled: true,
      message: 'Risco de burnout da equipe em nível crítico'
    }
  ]);
  
  // Estado para a regra de alerta sendo editada
  const [editingRule, setEditingRule] = useState<IAlertRule | null>(null);
  
  // Estado para a aba ativa
  const [activeTab, setActiveTab] = useState('active-alerts');
  
  // Estado para filtro de alertas
  const [alertFilter, setAlertFilter] = useState<TAlertType | 'all'>('all');
  
  // Filtrar alertas com base no filtro selecionado
  const filteredAlerts = alertFilter === 'all'
    ? getFilteredAlerts()
    : getFilteredAlerts(alertFilter);

  // Efeito para verificar regras de alerta e gerar alertas automaticamente
  useEffect(() => {
    // Apenas para simulação - em um ambiente real, isso seria baseado em dados reais
    const checkAlertRules = () => {
      const enabledRules = alertRules.filter(rule => rule.enabled);
      const now = new Date();
      
      enabledRules.forEach(rule => {
        // Verificar se a regra foi acionada recentemente (evitar spam)
        if (rule.lastTriggered && (now.getTime() - rule.lastTriggered.getTime() < 300000)) {
          return; // Evitar gerar alertas mais de uma vez a cada 5 minutos
        }
        
        // Obter valor atual da métrica
        let metricValue = 0;
        
        // Simular valores com base em dados da rede (em um ambiente real, esses seriam dados reais)
        if (rule.metricId === 'critical-hospital') {
          metricValue = currentMetrics.averageOccupancy;
        } else if (rule.metricId === 'staff') {
          metricValue = networkData.hospitals.filter(h => 
            h.metrics?.overall?.totalPatients / h.metrics?.overall?.totalBeds < 0.6
          ).length;
        } else if (rule.metricId === 'waiting') {
          metricValue = networkData.hospitals.reduce((avg, h) => 
            avg + (h.metrics?.networkEfficiency?.avgWaitTime || 0), 0
          ) / (networkData.hospitals.length || 1);
        } else if (rule.metricId === 'burnout') {
          metricValue = 6.8; // Valor simulado
        }
        
        // Verificar se a condição é atendida
        let conditionMet = false;
        
        switch (rule.condition) {
          case 'gt':
            conditionMet = metricValue > rule.threshold;
            break;
          case 'lt':
            conditionMet = metricValue < rule.threshold;
            break;
          case 'eq':
            conditionMet = metricValue === rule.threshold;
            break;
          case 'gte':
            conditionMet = metricValue >= rule.threshold;
            break;
          case 'lte':
            conditionMet = metricValue <= rule.threshold;
            break;
        }
        
        // Se a condição for atendida, gerar um alerta
        if (conditionMet) {
          addCustomAlert({
              title: `Alerta: ${rule.metricName}`,
              message: `${rule.message} - Valor atual: ${metricValue.toFixed(1)}`,
              type: rule.alertType,
              priority: rule.priority,
              sourceId: rule.id,
              hospitalId: selectedHospital || '',
              actionRequired: false
          });
          
          // Atualizar a última vez que a regra foi acionada
          setAlertRules(prev => 
            prev.map(r => 
              r.id === rule.id ? { ...r, lastTriggered: now } : r
            )
          );
        }
      });
    };
    
    // Verificar regras a cada 30 segundos
    const intervalId = setInterval(checkAlertRules, 30000);
    
    // Verificar uma vez imediatamente
    checkAlertRules();
    
    return () => clearInterval(intervalId);
  }, [addCustomAlert, alertRules, currentMetrics, networkData, selectedHospital]);

  // Função para adicionar/editar regra de alerta
  const saveAlertRule = () => {
    if (!editingRule) return;
    
    if (editingRule.id.startsWith('new-')) {
      // Adicionar nova regra
      const newRule = {
        ...editingRule,
        id: `rule-${Date.now()}`,
      };
      
      setAlertRules(prev => [...prev, newRule]);
    } else {
      // Atualizar regra existente
      setAlertRules(prev => 
        prev.map(rule => 
          rule.id === editingRule.id ? editingRule : rule
        )
      );
    }
    
    setEditingRule(null);
  };
  
  // Função para remover regra de alerta
  const removeAlertRule = (ruleId: string) => {
    setAlertRules(prev => prev.filter(rule => rule.id !== ruleId));
  };
  
  // Função para iniciar a edição de uma regra
  const startEditRule = (rule: IAlertRule) => {
    setEditingRule({...rule});
  };
  
  // Função para criar nova regra
  const createNewRule = () => {
    setEditingRule({
      id: `new-${Date.now()}`,
      metricId: '',
      metricName: '',
      metricType: 'main',
      condition: 'gt',
      threshold: 80,
      priority: 'medium',
      alertType: 'warning',
      enabled: true,
      message: ''
    });
  };
  
  // Função para atualizar o estado de ativação de uma regra
  const toggleRuleEnabled = (ruleId: string, enabled: boolean) => {
    setAlertRules(prev => 
      prev.map(rule => 
        rule.id === ruleId ? { ...rule, enabled } : rule
      )
    );
  };
  
  // Função para lidar com alertas
  const handleAlert = (alertId: string, action: 'acknowledge' | 'dismiss') => {
    markAsRead(alertId);
    updateAlertStatus(alertId, action === 'acknowledge' ? 'acknowledged' : 'dismissed');
  };

  return (
    <div className="flex flex-col h-full bg-gray-950 text-gray-200 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-amber-700 flex items-center justify-center">
            <Bell className="h-6 w-6 text-amber-200" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Alertas de Métricas</h2>
            <p className="text-sm text-gray-400">Configure e gerencie alertas baseados em métricas</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Badge className="bg-red-900 text-red-300 border-red-700">
            {highPriorityCount} alta prioridade
          </Badge>
          <Badge className="bg-amber-900 text-amber-300 border-amber-700">
            {unreadCount} não lido{unreadCount !== 1 ? 's' : ''}
          </Badge>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col h-full">
        <div className="p-2 bg-gray-900 border-b border-gray-800">
          <TabsList className="w-full bg-gray-800">
            <TabsTrigger 
              value="active-alerts" 
              className="flex-1 py-3 data-[state=active]:bg-amber-700 data-[state=active]:text-white"
            >
              Alertas Ativos ({filteredAlerts.length})
            </TabsTrigger>
            <TabsTrigger 
              value="alert-rules" 
              className="flex-1 py-3 data-[state=active]:bg-amber-700 data-[state=active]:text-white"
            >
              Regras de Alerta ({alertRules.filter(r => r.enabled).length}/{alertRules.length})
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="active-alerts" className="flex overflow-hidden flex-col">
          <div className="p-3 bg-gray-900 border-b border-gray-800 flex justify-between items-center">
            <h3 className="text-base font-medium text-white">Alertas Ativos</h3>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                className={`h-8 text-xs ${
                  alertFilter === 'all' 
                    ? 'bg-amber-900/30 text-amber-300 border-amber-700' 
                    : 'bg-gray-800 border-gray-700'
                }`}
                onClick={() => setAlertFilter('all')}
              >
                Todos
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className={`h-8 text-xs ${
                  alertFilter === 'occupancy' 
                    ? 'bg-red-900/30 text-red-300 border-red-700' 
                    : 'bg-gray-800 border-gray-700'
                }`}
                onClick={() => setAlertFilter('occupancy')}
              >
                Ocupação
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className={`h-8 text-xs ${
                  alertFilter === 'staff' 
                    ? 'bg-amber-900/30 text-amber-300 border-amber-700' 
                    : 'bg-gray-800 border-gray-700'
                }`}
                onClick={() => setAlertFilter('staff')}
              >
                Equipes
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className={`h-8 text-xs ${
                  alertFilter === 'operational' 
                    ? 'bg-purple-900/30 text-purple-300 border-purple-700' 
                    : 'bg-gray-800 border-gray-700'
                }`}
                onClick={() => setAlertFilter('operational')}
              >
                Operacional
              </Button>
            </div>
          </div>
          
          <ScrollArea className="flex" style={{ minHeight: '60vh' }}>
            {filteredAlerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center p-8">
                <BellOff className="h-16 w-16 text-gray-700 mb-4" />
                <h3 className="text-lg font-medium text-gray-400 mb-2">Nenhum alerta ativo</h3>
                <p className="text-sm text-gray-500 max-w-md">
                  Não há alertas ativos no momento. As regras de alerta continuarão monitorando suas métricas.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-800">
                {filteredAlerts.map((alert) => {
                  const alertTypeInfo = alertTypeMap[alert.type] || alertTypeMap.info;
                  
                  return (
                    <div 
                      key={alert.id} 
                      className={`p-4 hover:bg-gray-900/50 ${!alert.read ? 'bg-gray-900/30' : ''}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${alertTypeInfo.color}`}>
                            {alertTypeInfo.icon}
                          </div>
                          <div>
                            <h4 className="text-base font-medium text-white flex items-center">
                              {alert.title}
                              {!alert.read && (
                                <Badge className="ml-2 bg-amber-700 text-white text-xs">
                                  Novo
                                </Badge>
                              )}
                              {alert.priority === 'high' && (
                                <Badge className="ml-2 bg-red-700 text-white text-xs">
                                  Alta prioridade
                                </Badge>
                              )}
                            </h4>
                            <p className="text-sm text-gray-400 mt-1">
                              {alert.message}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="h-8 bg-gray-800 border-gray-700 hover:bg-gray-700 text-xs"
                            onClick={() => handleAlert(alert.id, 'acknowledge')}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            {alert.status === 'acknowledged' ? 'Visto' : 'Visualizar'}
                          </Button>
                          
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="h-8 bg-gray-800 border-gray-700 hover:bg-gray-700 text-xs"
                            onClick={() => handleAlert(alert.id, 'dismiss')}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Descartar
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <div>
                          {alert.hospitalId ? (
                            <span>
                              Hospital: {
                                networkData.hospitals.find(h => h.id === alert.hospitalId)?.name || alert.hospitalId
                              }
                            </span>
                          ) : (
                            <span>Todos os hospitais</span>
                          )}
                        </div>
                        
                        <div>
                          {new Intl.DateTimeFormat('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          }).format(alert.timestamp)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="alert-rules" className="flex-1 overflow-hidden flex flex-col">
          <div className="p-3 bg-gray-900 border-b border-gray-800 flex justify-between items-center">
            <h3 className="text-base font-medium text-white">Regras de Alerta</h3>
            
            <Button 
              size="sm"
              onClick={createNewRule}
              className="h-8 bg-amber-700 hover:bg-amber-800 text-white text-xs"
            >
              <Zap className="h-4 w-4 mr-1" />
              Nova Regra
            </Button>
          </div>
          
          <ScrollArea className="flex-1 p-4" style={{ minHeight: '60vh' }}>
            {alertRules.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center p-8">
                <Settings className="h-16 w-16 text-gray-700 mb-4" />
                <h3 className="text-lg font-medium text-gray-400 mb-2">Nenhuma regra configurada</h3>
                <p className="text-sm text-gray-500 max-w-md mb-4">
                  Configure regras de alerta para ser notificado quando suas métricas atingirem valores específicos.
                </p>
                <Button 
                  onClick={createNewRule}
                  className="bg-amber-700 hover:bg-amber-800 text-white"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Criar Primeira Regra
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Accordion type="multiple" className="w-full">
                  {alertRules.map((rule) => (
                    <AccordionItem 
                      key={rule.id} 
                      value={rule.id}
                      className="border-gray-800 focus-within:border-amber-800"
                    >
                      <AccordionTrigger className="hover:bg-gray-900/50 p-4 text-left">
                        <div className="flex items-center justify-between w-full pr-4">
                          <div className="flex items-center space-x-3">
                            <Switch 
                              checked={rule.enabled} 
                              onCheckedChange={(checked) => toggleRuleEnabled(rule.id, checked)}
                              className="data-[state=checked]:bg-amber-700"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <div>
                              <h4 className="text-base font-medium text-white flex items-center">
                                {rule.metricName}
                                <Badge 
                                  className={`ml-2 ${
                                    rule.priority === 'high' 
                                      ? 'bg-red-900 text-red-300 border-red-700' 
                                      : rule.priority === 'medium'
                                        ? 'bg-amber-900 text-amber-300 border-amber-700'
                                        : 'bg-blue-900 text-blue-300 border-blue-700'
                                  }`}
                                >
                                  {rule.priority === 'high' ? 'Alta' : rule.priority === 'medium' ? 'Média' : 'Baixa'}
                                </Badge>
                              </h4>
                              <p className="text-sm text-gray-400">
                                Alertar quando {rule.metricName.toLowerCase()} for {conditionMap[rule.condition]} {rule.threshold}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {rule.enabled ? (
                              <Badge className="bg-green-900/40 text-green-400 border-green-800">
                                Ativo
                              </Badge>
                            ) : (
                              <Badge className="bg-gray-800 text-gray-400 border-gray-700">
                                Inativo
                              </Badge>
                            )}
                          </div>
                        </div>
                      </AccordionTrigger>
                      
                      <AccordionContent className="px-4 pb-4">
                        <div className="bg-gray-900 p-4 rounded-lg space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-400 mb-1">Tipo de Métrica</p>
                              <Badge 
                                className="bg-gray-800 text-gray-300 border-gray-700"
                              >
                                {rule.metricType === 'main' ? 'Principal' : 'Adicional'}
                              </Badge>
                            </div>
                            
                            <div>
                              <p className="text-sm text-gray-400 mb-1">Tipo de Alerta</p>
                              <div className="flex items-center space-x-2">
                                <Badge 
                                  className={`${alertTypeMap[rule.alertType].color} border-none`}
                                >
                                  {rule.alertType}
                                </Badge>
                              </div>
                            </div>
                            
                            <div>
                              <p className="text-sm text-gray-400 mb-1">Condição</p>
                              <div className="text-white">
                                {conditionMap[rule.condition]} {rule.threshold}
                              </div>
                            </div>
                            
                            <div>
                              <p className="text-sm text-gray-400 mb-1">Última Ativação</p>
                              <div className="text-white">
                                {rule.lastTriggered 
                                  ? new Intl.DateTimeFormat('pt-BR', {
                                      day: '2-digit',
                                      month: '2-digit',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    }).format(rule.lastTriggered)
                                  : 'Nunca ativado'}
                              </div>
                            </div>
                          </div>
                          
                          <Separator className="bg-gray-800" />
                          
                          <div>
                            <p className="text-sm text-gray-400 mb-1">Mensagem do Alerta</p>
                            <p className="text-white text-sm bg-gray-800 p-2 rounded">
                              {rule.message}
                            </p>
                          </div>
                          
                          <div className="flex justify-end space-x-2 pt-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => removeAlertRule(rule.id)}
                              className="h-8 bg-gray-800 border-gray-700 hover:bg-red-900/30 hover:text-red-400 hover:border-red-800 text-xs"
                            >
                              <X className="h-4 w-4 mr-1" />
                              Remover
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => startEditRule(rule)}
                              className="h-8 bg-gray-800 border-gray-700 hover:bg-amber-900/30 hover:text-amber-400 hover:border-amber-800 text-xs"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Editar
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
      
      {/* Modal de edição de regra */}
      {editingRule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-950 border border-gray-800 rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold text-white mb-4">
              {editingRule.id.startsWith('new-') ? 'Nova Regra de Alerta' : 'Editar Regra de Alerta'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 block mb-1">Nome da Métrica</label>
                <Input 
                  value={editingRule.metricName}
                  onChange={(e) => setEditingRule({...editingRule, metricName: e.target.value})}
                  className="bg-gray-900 border-gray-800 text-white"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Tipo de Métrica</label>
                  <select 
                    value={editingRule.metricType}
                    onChange={(e) => setEditingRule({...editingRule, metricType: e.target.value as 'main' | 'additional'})}
                    className="w-full bg-gray-900 border border-gray-800 rounded-md px-3 py-2 text-white"
                  >
                    <option value="main">Principal</option>
                    <option value="additional">Adicional</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Prioridade</label>
                  <select 
                    value={editingRule.priority}
                    onChange={(e) => setEditingRule({...editingRule, priority: e.target.value as TAlertPriority})}
                    className="w-full bg-gray-900 border border-gray-800 rounded-md px-3 py-2 text-white"
                  >
                    <option value="high">Alta</option>
                    <option value="medium">Média</option>
                    <option value="low">Baixa</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="text-sm text-gray-400 block mb-1">Tipo de Alerta</label>
                <select 
                  value={editingRule.alertType}
                  onChange={(e) => setEditingRule({...editingRule, alertType: e.target.value as TAlertType})}
                  className="w-full bg-gray-900 border border-gray-800 rounded-md px-3 py-2 text-white"
                >
                  <option value="occupancy">Ocupação</option>
                  <option value="staff">Equipes</option>
                  <option value="equipment">Equipamentos</option>
                  <option value="operational">Operacional</option>
                  <option value="warning">Aviso</option>
                  <option value="error">Erro</option>
                  <option value="info">Informação</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm text-gray-400 block mb-1">Condição</label>
                <div className="flex items-center space-x-3">
                  <select 
                    value={editingRule.condition}
                    onChange={(e) => setEditingRule({...editingRule, condition: e.target.value as 'gt' | 'lt' | 'eq' | 'gte' | 'lte'})}
                    className="bg-gray-900 border border-gray-800 rounded-md px-3 py-2 text-white w-40"
                  >
                    <option value="gt">maior que</option>
                    <option value="lt">menor que</option>
                    <option value="eq">igual a</option>
                    <option value="gte">maior ou igual a</option>
                    <option value="lte">menor ou igual a</option>
                  </select>
                  
                  <Input 
                    type="number"
                    value={editingRule.threshold}
                    onChange={(e) => setEditingRule({...editingRule, threshold: parseFloat(e.target.value)})}
                    className="bg-gray-900 border-gray-800 text-white"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm text-gray-400 block mb-1">Mensagem de Alerta</label>
                <Input 
                  value={editingRule.message}
                  onChange={(e) => setEditingRule({...editingRule, message: e.target.value})}
                  className="bg-gray-900 border-gray-800 text-white"
                />
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={editingRule.enabled} 
                    onCheckedChange={(checked) => setEditingRule({...editingRule, enabled: checked})}
                    className="data-[state=checked]:bg-amber-700"
                  />
                  <span className="text-sm text-gray-400">Regra ativa</span>
                </div>
                
                <div className="flex space-x-3">
                  <Button 
                    variant="outline"
                    onClick={() => setEditingRule(null)}
                    className="bg-gray-900 border-gray-800 hover:bg-gray-800 text-white"
                  >
                    Cancelar
                  </Button>
                  
                  <Button 
                    onClick={saveAlertRule}
                    className="bg-amber-700 hover:bg-amber-800 text-white"
                  >
                    Salvar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};