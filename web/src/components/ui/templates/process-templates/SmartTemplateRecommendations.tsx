/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/organisms/card';
import { BarChart3, AlertCircle, Ambulance, Activity, User } from 'lucide-react';
import { workflowTemplates } from '@/utils/workflowTemplates';
import { IWorkflowTemplate } from '@/types/workflow/customize-process-by-workflow-types';
import { EnhancedTemplateCarousel } from './EnhancedTemplateCarousel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/organisms/tabs';
import { Badge } from '@/components/ui/organisms/badge';
import { IAmbulanceData } from '@/types/ambulance-types';
import { IAlert } from '@/types/alert-types';
import { INetworkData } from '@/types/hospital-network-types';
import { IStaffData, IStaffTeam } from '@/types/staff-types';

interface ISmartTemplateRecommendationsProps {
    networkData: INetworkData | null;
    ambulanceData: {
      ambulanceData: IAmbulanceData | null;
      loading: boolean;
      error: string | null;
    };
    staffData: {
      staffData: IStaffData | null; 
      loading: boolean;
    };
    alerts: IAlert[];
    onTemplateSelect: (templateId: string) => void;
  }

export const SmartTemplateRecommendations: React.FC<ISmartTemplateRecommendationsProps> = ({
    networkData,
    ambulanceData,
    staffData,
    alerts,
    onTemplateSelect
}) => {
    const [recommendations, setRecommendations] = useState<{
      emergencyTemplates: IWorkflowTemplate[];
      occupancyTemplates: IWorkflowTemplate[];
      staffTemplates: IWorkflowTemplate[];
      ambulanceTemplates: IWorkflowTemplate[];
    }>({
      emergencyTemplates: [],
      occupancyTemplates: [],
      staffTemplates: [],
      ambulanceTemplates: []
    });
    
    const [insightTexts, setInsightTexts] = useState<{
      emergencyInsight: string;
      occupancyInsight: string;
      staffInsight: string;
      ambulanceInsight: string;
    }>({
      emergencyInsight: "Analisando dados de emergência...",
      occupancyInsight: "Analisando dados de ocupação...",
      staffInsight: "Analisando dados de equipe...",
      ambulanceInsight: "Analisando dados de ambulâncias..."
    });
    
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('emergency');
  
  // Classificar templates em categorias relevantes para análise
  useEffect(() => {
    if (!networkData || ambulanceData.loading || staffData.loading) {
      setLoading(true);
      return;
    }
  
    setLoading(true);
    
    try {
      // Preparar recomendações baseadas em dados hospitalares
      const emergencyTemplates = analyzeEmergencyNeeds(alerts, networkData);
      const occupancyTemplates = analyzeOccupancyNeeds(networkData);
      const staffTemplates = analyzeStaffNeeds(staffData.staffData);
      const ambulanceTemplates = analyzeAmbulanceNeeds(ambulanceData.ambulanceData);
      
      setRecommendations({
        emergencyTemplates,
        occupancyTemplates,
        staffTemplates,
        ambulanceTemplates
      });
      
      // Gerar insights com base nos dados analisados
      generateInsights(networkData, ambulanceData.ambulanceData, staffData.staffData, alerts);
    } catch (error) {
      console.error("Erro ao analisar dados para recomendações:", error);
      
      // Definir recomendações padrão em caso de erro
      setRecommendations({
        emergencyTemplates: filterTemplatesByCategory('emergência'),
        occupancyTemplates: filterTemplatesByCategory('geral'),
        staffTemplates: filterTemplatesByCategory('geral'),
        ambulanceTemplates: filterTemplatesByCategory('emergência')
      });
    } finally {
      setLoading(false);
    }
  }, [networkData, ambulanceData.ambulanceData, staffData.staffData, alerts, ambulanceData.loading, staffData.loading]);
  
  // Filtrar templates por categoria
  const filterTemplatesByCategory = (category: string): IWorkflowTemplate[] => {
    return workflowTemplates.filter(template => template.category === category);
  };
  
  // Analisar necessidades de emergência
  const analyzeEmergencyNeeds = (alerts: IAlert[], networkData: INetworkData | null): IWorkflowTemplate[] => {
    // Verificar se há alertas críticos
    const criticalAlerts = alerts.filter(alert => 
      alert.priority === 'high' && 
      (alert.type === 'emergency' || alert.type === 'patient-arrival')
    );
    
    // Verificar se há alta ocupação em UTI
    const highICUOccupancy = networkData?.hospitals.some(hospital => {
      const utiMetrics = hospital.metrics?.departmental?.uti;
      return utiMetrics && utiMetrics.occupancy > 85;
    });
    
    // Baseado nas condições, recomendar templates apropriados
    if (criticalAlerts.length > 2 || highICUOccupancy) {
      // Recomendar templates de emergência e protocolos de crise
      setInsightTexts(prev => ({
        ...prev,
        emergencyInsight: `Detectados ${criticalAlerts.length} alertas críticos${highICUOccupancy ? ' e alta ocupação em UTI' : ''}. Recomendamos protocolos de emergência e gestão de crise.`
      }));
      
      // Priorizar o template de Protocolo de Emergência
      return workflowTemplates.filter(template => 
        template.category === 'emergência' || 
        template.id === '5' || // Protocolo de Emergência
        template.name.toLowerCase().includes('emergência')
      );
    }
    
    // Caso contrário, recomendar templates gerais
    setInsightTexts(prev => ({
      ...prev,
      emergencyInsight: "Níveis de alerta normais. Considere revisões periódicas dos protocolos de emergência."
    }));
    
    return workflowTemplates.filter(template => 
      template.category === 'geral' && 
      (template.name.includes('Admissão') || template.name.includes('Alta'))
    );
  };
  
  // Analisar necessidades de ocupação
  const analyzeOccupancyNeeds = (networkData: INetworkData | null): IWorkflowTemplate[] => {
    if (!networkData) return [];
    
    // Verificar taxa de ocupação geral
    const highOccupancy = networkData.hospitals.some(hospital => {
      return hospital.metrics?.overall?.occupancyRate > 80;
    });
    
    // Verificar eficiência (turnover)
    const lowTurnover = networkData.hospitals.some(hospital => {
      return hospital.metrics?.overall?.turnoverRate < 3;
    });
    
    if (highOccupancy) {
      setInsightTexts(prev => ({
        ...prev,
        occupancyInsight: `Taxa de ocupação elevada detectada (>80%). Recomendamos processos de alta hospitalar otimizados e gestão eficiente de admissões.`
      }));
      
      return workflowTemplates.filter(template => 
        template.name.includes('Alta') || 
        template.name.includes('Admissão') ||
        template.category === 'geral'
      );
    }
    
    if (lowTurnover) {
      setInsightTexts(prev => ({
        ...prev,
        occupancyInsight: `Taxa de rotatividade de leitos baixa (<3). Considere revisar processos de alta e alocação de leitos.`
      }));
      
      return workflowTemplates.filter(template => 
        template.name.includes('Alta') || 
        template.name.includes('Leito')
      );
    }
    
    setInsightTexts(prev => ({
      ...prev,
      occupancyInsight: "Níveis de ocupação dentro dos parâmetros normais. Mantenha os processos atuais."
    }));
    
    return workflowTemplates.filter(template => 
      template.category === 'geral'
    );
  };
  
  // Analisar necessidades de equipe
  const analyzeStaffNeeds = (staffDataParam: IStaffData | null): IWorkflowTemplate[] => {
    if (!staffDataParam) return [];
    
    // Verificar equipes sob alta demanda
    const teamsUnderPressure: IStaffTeam[] = [];
    
    for (const hospitalId in staffDataParam.staffTeams) {
      const teams = staffDataParam.staffTeams[hospitalId];
      const highDemandTeams = teams.filter(team => 
        team.capacityStatus === 'high_demand' || 
        team.metrics.taskCompletion < 75
      );
      
      if (highDemandTeams.length > 0) {
        // Usar forEach para evitar problemas com o spread operator
        highDemandTeams.forEach(team => teamsUnderPressure.push(team));
      }
    }
    
    if (teamsUnderPressure.length > 0) {
      // Converter explicitamente para Array
      const departmentsUnderPressure: string[] = Array.from(
        new Set(teamsUnderPressure.map(team => team.department))
      );
      
      setInsightTexts(prev => ({
        ...prev,
        staffInsight: `${teamsUnderPressure.length} equipes com alta demanda detectadas nos departamentos: ${departmentsUnderPressure.join(', ')}. Considere otimizar fluxos de trabalho.`
      }));
      
      // Encontrar templates relacionados ao departamento com problemas
      if (departmentsUnderPressure.some(dept => dept.toLowerCase().includes('cirurgia'))) {
        return workflowTemplates.filter(template => 
          template.category === 'cirurgias' || 
          template.name.includes('Cirúrgico')
        );
      }
      
      if (departmentsUnderPressure.some(dept => dept.toLowerCase().includes('exame'))) {
        return workflowTemplates.filter(template => 
          template.category === 'diagnósticos' || 
          template.name.includes('Laboratoriais')
        );
      }
    }
    
    setInsightTexts(prev => ({
      ...prev,
      staffInsight: "Equipes operando em níveis normais de capacidade. Nenhuma otimização urgente necessária."
    }));
    
    return workflowTemplates.filter(template => 
      template.category === 'geral'
    ).slice(0, 3);
  };
  
  // Analisar necessidades de ambulâncias
  const analyzeAmbulanceNeeds = (ambulanceData: IAmbulanceData | null): IWorkflowTemplate[] => {
    if (!ambulanceData) return [];
    
    let pendingRequestsCount = 0;
    let criticalRequestsCount = 0;
    
    // Contar solicitações pendentes e críticas
    for (const hospitalId in ambulanceData.requests) {
      const requests = ambulanceData.requests[hospitalId];
      pendingRequestsCount += requests.filter(req => req.status === 'pending').length;
      
      criticalRequestsCount += requests.filter(req => 
        req.status === 'pending' && 
        req.patientInfo.emergencyLevel === 'critical'
      ).length;
    }
    
    if (criticalRequestsCount > 0) {
      setInsightTexts(prev => ({
        ...prev,
        ambulanceInsight: `${criticalRequestsCount} solicitações críticas de ambulância pendentes. Recomendamos protocolos de emergência e priorização.`
      }));
      
      return workflowTemplates.filter(template => 
        template.category === 'emergência' || 
        template.id === '5' // Protocolo de Emergência
      );
    }
    
    if (pendingRequestsCount > 2) {
      setInsightTexts(prev => ({
        ...prev,
        ambulanceInsight: `${pendingRequestsCount} solicitações de ambulância pendentes. Considere otimizar o fluxo de atendimento pré-hospitalar.`
      }));
      
      return workflowTemplates.filter(template => 
        template.id === '1' || // Admissão de Paciente
        template.category === 'emergência'
      );
    }
    
    setInsightTexts(prev => ({
      ...prev,
      ambulanceInsight: "Operações de ambulância em níveis normais de demanda."
    }));
    
    return workflowTemplates.filter(template => 
      template.category === 'geral'
    ).slice(0, 2);
  };
  
  // Gerar insights baseados em todos os dados
  const generateInsights = (
    networkData: INetworkData | null, 
    ambulanceData: IAmbulanceData | null, 
    staffData: IStaffData | null,
    alerts: IAlert[]
  ) => {
    // Insights já são gerados nas funções de análise acima
    // Esta função pode ser expandida para análises mais complexas se necessário
  };
  
  // Renderização da interface com tabs para diferentes categorias de recomendações
  return (
    <Card className="w-full bg-gradient-to-r from-gray-900 to-indigo-950 border-none shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-800 to-indigo-800 p-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 rounded-full p-2">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-white text-xl flex items-center gap-2">
              Recomendações Baseadas em Dados
              {loading && <span className="animate-pulse ml-2">•••</span>}
            </CardTitle>
            <p className="text-blue-200 text-sm mt-1">
              Sugestões de processos com base na análise da operação hospitalar atual
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <Tabs 
          defaultValue="emergency" 
          className="w-full"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="w-full mb-4 bg-gray-800 p-1 grid grid-cols-4 gap-2">
            <TabsTrigger 
              value="emergency" 
              className="flex items-center gap-1"
              data-state={activeTab === "emergency" ? "active" : ""}
            >
              <AlertCircle className="h-4 w-4" />
              <span>Emergência</span>
              {recommendations.emergencyTemplates.length > 0 && (
                <Badge variant="secondary" className="ml-1 px-1.5 text-xs">
                  {recommendations.emergencyTemplates.length}
                </Badge>
              )}
            </TabsTrigger>
            
            <TabsTrigger 
              value="occupancy" 
              className="flex items-center gap-1"
              data-state={activeTab === "occupancy" ? "active" : ""}
            >
              <Activity className="h-4 w-4" />
              <span>Ocupação</span>
              {recommendations.occupancyTemplates.length > 0 && (
                <Badge variant="secondary" className="ml-1 px-1.5 text-xs">
                  {recommendations.occupancyTemplates.length}
                </Badge>
              )}
            </TabsTrigger>
            
            <TabsTrigger 
              value="staff" 
              className="flex items-center gap-1"
              data-state={activeTab === "staff" ? "active" : ""}
            >
              <User className="h-4 w-4" />
              <span>Equipe</span>
              {recommendations.staffTemplates.length > 0 && (
                <Badge variant="secondary" className="ml-1 px-1.5 text-xs">
                  {recommendations.staffTemplates.length}
                </Badge>
              )}
            </TabsTrigger>
            
            <TabsTrigger 
              value="ambulance" 
              className="flex items-center gap-1"
              data-state={activeTab === "ambulance" ? "active" : ""}
            >
              <Ambulance className="h-4 w-4" />
              <span>Ambulância</span>
              {recommendations.ambulanceTemplates.length > 0 && (
                <Badge variant="secondary" className="ml-1 px-1.5 text-xs">
                  {recommendations.ambulanceTemplates.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-2">
            <TabsContent value="emergency" className="mt-0">
              <div className="bg-red-950/30 border border-red-900/50 rounded-md p-4 mb-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-6 w-6 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-red-200 mb-1">Análise de Emergências</h3>
                    <p className="text-red-300/80 text-sm">{insightTexts.emergencyInsight}</p>
                  </div>
                </div>
              </div>
              {loading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="animate-pulse text-gray-400">Analisando dados de emergência...</div>
                </div>
              ) : (
                <EnhancedTemplateCarousel 
                  templates={recommendations.emergencyTemplates} 
                  onSelectTemplate={onTemplateSelect}
                  maxVisibleItems={3}
                  isRecommendation
                />
              )}
            </TabsContent>
            
            <TabsContent value="occupancy" className="mt-0">
              <div className="bg-blue-950/30 border border-blue-900/50 rounded-md p-4 mb-4">
                <div className="flex items-start gap-3">
                  <Activity className="h-6 w-6 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-200 mb-1">Análise de Ocupação</h3>
                    <p className="text-blue-300/80 text-sm">{insightTexts.occupancyInsight}</p>
                  </div>
                </div>
              </div>
              {loading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="animate-pulse text-gray-400">Analisando dados de ocupação...</div>
                </div>
              ) : (
                <EnhancedTemplateCarousel 
                  templates={recommendations.occupancyTemplates} 
                  onSelectTemplate={onTemplateSelect}
                  maxVisibleItems={3}
                  isRecommendation
                />
              )}
            </TabsContent>
            
            <TabsContent value="staff" className="mt-0">
              <div className="bg-green-950/30 border border-green-900/50 rounded-md p-4 mb-4">
                <div className="flex items-start gap-3">
                  <User className="h-6 w-6 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-green-200 mb-1">Análise de Equipes</h3>
                    <p className="text-green-300/80 text-sm">{insightTexts.staffInsight}</p>
                  </div>
                </div>
              </div>
              {loading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="animate-pulse text-gray-400">Analisando dados de equipe...</div>
                </div>
              ) : (
                <EnhancedTemplateCarousel 
                  templates={recommendations.staffTemplates} 
                  onSelectTemplate={onTemplateSelect}
                  maxVisibleItems={3}
                  isRecommendation
                />
              )}
            </TabsContent>
            
            <TabsContent value="ambulance" className="mt-0">
              <div className="bg-amber-950/30 border border-amber-900/50 rounded-md p-4 mb-4">
                <div className="flex items-start gap-3">
                  <Ambulance className="h-6 w-6 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-amber-200 mb-1">Análise de Ambulâncias</h3>
                    <p className="text-amber-300/80 text-sm">{insightTexts.ambulanceInsight}</p>
                  </div>
                </div>
              </div>
              {loading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="animate-pulse text-gray-400">Analisando dados de ambulâncias...</div>
                </div>
              ) : (
                <EnhancedTemplateCarousel 
                  templates={recommendations.ambulanceTemplates} 
                  onSelectTemplate={onTemplateSelect}
                  maxVisibleItems={3}
                  isRecommendation
                />
              )}
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};