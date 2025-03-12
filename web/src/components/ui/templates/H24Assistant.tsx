/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  X, 
  ChevronRight, 
  Ambulance, 
  Layers, 
  Users, 
  AlertTriangle, 
  ArrowRight, 
  Check, 
  Calendar, 
  Lightbulb, 
  LineChart,
  BellRing
} from 'lucide-react';
import { useNetworkData } from '@/services/hooks/network-hospital/useNetworkData';
import { useStaffData } from '@/services/hooks/staffs/useStaffData';
import { useAmbulanceData } from '@/services/hooks/ambulance/useAmbulanceData';
import { useAlerts } from './chat/integration-hub/alerts/AlertsProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { IRecommendation, IStatistics } from '@/types/ai-assistant-types';

// Props para o componente
interface H24AssistantProps {
    userId?: string;
    hospitalId?: string;
    onRecommendationApply?: (recommendation: IRecommendation) => void;
    onViewAllAlerts?: () => void;
    onShowChat?: () => void;
}

export const H24Assistant: React.FC<H24AssistantProps> = ({
    userId = 'current-user',
    hospitalId,
    onRecommendationApply,
    onViewAllAlerts,
    onShowChat
  }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [hasBeenSeen, setHasBeenSeen] = useState(false);
    const [recommendations, setRecommendations] = useState<IRecommendation[]>([]);
    const [statistics, setStatistics] = useState<IStatistics | null>(null);
    const [currentView, setCurrentView] = useState<'welcome' | 'recommendations' | 'alerts'>('welcome');
    const modalRef = useRef<HTMLDivElement>(null);
    
    // Hooks para dados
    const { networkData, currentUser } = useNetworkData();
    const { staffData } = useStaffData(hospitalId || (networkData?.hospitals[0]?.id || ''));
    const { ambulanceData } = useAmbulanceData(hospitalId || (networkData?.hospitals[0]?.id || ''));
    const { alerts, unreadCount, highPriorityCount, getFilteredAlerts } = useAlerts();
    
    const selectedHospitalId = hospitalId || networkData?.hospitals[0]?.id || 'RD4H-SP-ITAIM';
    const hospital = networkData?.hospitals.find(h => h.id === selectedHospitalId);
    
    // Efeito para mostrar o modal automaticamente ao carregar (primeira vez)
    useEffect(() => {
      // Verificar se é a primeira vez que o usuário está vendo (em uma implementação real, 
      // você pode verificar isso com localStorage ou uma API)
      const checkFirstVisit = () => {
        // Se não foi visto antes, abre o modal automaticamente
        if (!hasBeenSeen) {
          setTimeout(() => {
            setIsModalOpen(true);
            setHasBeenSeen(true);
          }, 1000); // Atraso de 1 segundo para permitir que a página carregue primeiro
        }
      };
      
      checkFirstVisit();
    }, [hasBeenSeen]);
    
    // Efeito para fechar o modal ao clicar fora dele
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
          setIsModalOpen(false);
        }
      };
      
      if (isModalOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isModalOpen]);
    
    // Efeito para gerar recomendações com base nos dados disponíveis
    useEffect(() => {
      if (networkData && staffData && ambulanceData && alerts) {
        generateRecommendations();
        generateStatistics();
      }
    }, [networkData, staffData, ambulanceData, alerts]);
    
    // Função para gerar recomendações com base na análise dos dados
    const generateRecommendations = () => {
      const newRecommendations: IRecommendation[] = [];
      
      // Exemplo: Recomendação baseada em alta ocupação de UTI
      const hospital = networkData?.hospitals.find(h => h.id === selectedHospitalId);
      if (hospital && hospital.metrics && hospital.metrics.departmental?.uti?.occupancy > 85) {
        newRecommendations.push({
          id: `rec-${Date.now()}-1`,
          type: 'bed-management',
          title: 'Ocupação crítica de UTI',
          description: `A UTI está com ${hospital.metrics.departmental.uti.occupancy}% de ocupação. Considere redistribuir pacientes ou ativar leitos adicionais.`,
          priority: 'high',
          actionText: 'Ver leitos disponíveis',
          timestamp: new Date(),
          confidence: 0.92,
          applied: false
        });
      }
      
      // Recomendação baseada em ambulâncias a caminho
      const incomingAmbulances = ambulanceData?.routes[selectedHospitalId]?.filter(route => 
        route.status === 'in_progress' && 
        route.destination.hospitalId === selectedHospitalId
      );
      
      if (incomingAmbulances && incomingAmbulances.length > 0) {
        const criticalCount = incomingAmbulances.filter(route => 
          route.patient?.emergencyLevel === 'critical' || 
          route.patient?.emergencyLevel === 'high'
        ).length;
        
        if (criticalCount > 0) {
          newRecommendations.push({
            id: `rec-${Date.now()}-2`,
            type: 'ambulance-dispatch',
            title: `${criticalCount} ambulância${criticalCount > 1 ? 's' : ''} com casos críticos a caminho`,
            description: `Prepare equipe de emergência e recursos para receber ${criticalCount} paciente${criticalCount > 1 ? 's' : ''} crítico${criticalCount > 1 ? 's' : ''} nos próximos 30 minutos.`,
            priority: 'high',
            actionText: 'Preparar recepção',
            timestamp: new Date(),
            confidence: 0.95,
            applied: false
          });
        }
      }
      
      // Recomendação baseada na análise de equipes e escalas
      const teamUTI = staffData?.staffTeams[selectedHospitalId]?.find(team => 
        team.department.toLowerCase() === 'uti' && 
        team.shift === 'Manhã'
      );
      
      if (teamUTI && (teamUTI.capacityStatus === 'high_demand' || teamUTI.metrics.taskCompletion < 85)) {
        newRecommendations.push({
          id: `rec-${Date.now()}-3`,
          type: 'staff-allocation',
          title: 'Equipe de UTI sobrecarregada',
          description: 'A equipe da UTI manhã está com sobrecarga de trabalho. Considere redistribuir tarefas ou alocar membros adicionais para equilibrar a demanda.',
          priority: 'medium',
          actionText: 'Reorganizar escala',
          timestamp: new Date(),
          confidence: 0.85,
          applied: false
        });
      }
      
      // Recomendação baseada em análise preditiva (simulação)
      newRecommendations.push({
        id: `rec-${Date.now()}-4`,
        type: 'ai-prediction',
        title: 'Previsão de alta demanda',
        description: 'Nosso modelo preditivo indica aumento de 23% na demanda de leitos para os próximos 3 dias. Recomendamos preparação prévia de recursos e equipes.',
        priority: 'medium',
        actionText: 'Ver previsão detalhada',
        timestamp: new Date(),
        confidence: 0.88,
        applied: false
      });
      
      // Ordenar recomendações por prioridade e confiança
      const sortedRecommendations = newRecommendations.sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
        
        if (priorityDiff === 0) {
          return b.confidence - a.confidence;
        }
        
        return priorityDiff;
      });
      
      setRecommendations(sortedRecommendations);
    };
    
    // Função para gerar estatísticas
    const generateStatistics = () => {
      const hospital = networkData?.hospitals.find(h => h.id === selectedHospitalId);
      
      if (hospital && hospital.metrics) {
        setStatistics({
          bedOccupancy: hospital.metrics.overall.occupancyRate,
          averageWaitTime: 35.2, // Exemplo (em minutos)
          criticalResourcesNeeded: 3,
          staffEfficiency: 87.5,
          patientFlow: 12.3, // Pacientes/hora
          emergencyResponseTime: 7.8 // Minutos
        });
      }
    };
    
    // Função para lidar com a aplicação de uma recomendação
    const handleApplyRecommendation = (recommendation: IRecommendation) => {
      // Atualizar o estado local para marcar como aplicada
      setRecommendations(prev => 
        prev.map(rec => 
          rec.id === recommendation.id 
            ? { ...rec, applied: true } 
            : rec
        )
      );
      
      // Chamar callback se fornecido
      if (onRecommendationApply) {
        onRecommendationApply(recommendation);
      }
    };
    
    // Obter o nome e a função do usuário atual
    const userGreeting = () => {
      const userName = currentUser?.name || 'Administrador';
      const userRole = currentUser?.role || 'Administrador';
      const period = getPeriodOfDay();
      
      return `${period}, ${userName}! Como ${userRole} do H24, hoje temos:`
    };
    
    // Determinar o período do dia
    const getPeriodOfDay = () => {
      const hour = new Date().getHours();
      
      if (hour < 12) {
        return 'Bom dia';
      } else if (hour < 18) {
        return 'Boa tarde';
      } else {
        return 'Boa noite';
      }
    };
    
    // Obter a data formatada
    const getFormattedDate = () => {
      return new Date().toLocaleDateString('pt-BR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    };
    
    // Obter alertas de alta prioridade
    const highPriorityAlerts = getFilteredAlerts(undefined, 'high').slice(0, 3);
    
    return (
      <div className="relative">
        {/* Botão do assistente */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 
          bg-gradient-to-r from-indigo-600 to-cyan-600 
          hover:from-indigo-700 hover:to-cyan-700 
          text-white rounded-full shadow-md transition-all duration-300 hover:shadow-lg 
          dark:from-indigo-700 dark:to-cyan-700 dark:hover:from-indigo-800 dark:hover:to-cyan-800"
          aria-label="Assistente H24"
        >
          <Sparkles className="h-5 w-5" />
          <span>Assistente IA</span>
          
          {/* Bolha de notificação para alertas não lidos */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
        
        {/* Modal do assistente */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              className="fixed inset-0 z-50 flex items-start justify-end p-4 mr-4 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                ref={modalRef}
                className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden pointer-events-auto"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              >
                {/* Cabeçalho do modal */}
                <div className="bg-gradient-to-r from-indigo-600 to-cyan-600 dark:from-indigo-700 dark:to-cyan-700 p-4 text-white">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <Sparkles className="h-6 w-6 mr-2" />
                      <h2 className="text-xl font-semibold">Assistente H24</h2>
                    </div>
                    <button 
                      onClick={() => setIsModalOpen(false)} 
                      className="p-1 rounded-full hover:bg-white/10 transition-colors text-white"
                      aria-label="Fechar"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="text-sm text-indigo-100 dark:text-indigo-200 mt-1">
                    Sua assistente inteligente para gestão hospitalar
                  </p>
                </div>
                
                {/* Corpo do modal - Alternância entre visualizações */}
                <div className="max-h-[70vh] overflow-y-auto">
                  {/* Visualização de boas-vindas */}
                  {currentView === 'welcome' && (
                    <div className="p-4">
                      <div className="mb-4">
                        <p className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-1">
                          {userGreeting()}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {getFormattedDate()}
                        </p>
                      </div>
                      
                      {/* Card de estatísticas */}
                      {statistics && (
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 mb-4 border border-indigo-100 dark:border-indigo-800">
                          <h3 className="font-medium text-indigo-800 dark:text-indigo-300 flex items-center mb-3">
                            <LineChart className="h-4 w-4 mr-1" />
                            Visão Geral de {hospital?.name || 'Hospital'}
                          </h3>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600 dark:text-gray-400">Ocupação:</span>
                              <span className={`font-medium ${
                                statistics.bedOccupancy > 90 
                                  ? 'text-red-600 dark:text-red-400' 
                                  : statistics.bedOccupancy > 80 
                                    ? 'text-amber-600 dark:text-amber-400' 
                                    : 'text-green-600 dark:text-green-400'
                              }`}>
                                {statistics.bedOccupancy.toFixed(1)}%
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600 dark:text-gray-400">Tempo médio:</span>
                              <span className="font-medium text-gray-800 dark:text-gray-200">
                                {statistics.averageWaitTime} min
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600 dark:text-gray-400">Recursos críticos:</span>
                              <span className="font-medium text-gray-800 dark:text-gray-200">
                                {statistics.criticalResourcesNeeded}
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600 dark:text-gray-400">Fluxo de pacientes:</span>
                              <span className="font-medium text-gray-800 dark:text-gray-200">
                                {statistics.patientFlow}/hora
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Alertas de alta prioridade */}
                      {highPriorityAlerts.length > 0 && (
                        <div className="mb-4">
                          <h3 className="font-medium text-gray-800 dark:text-gray-200 flex items-center mb-2">
                            <AlertTriangle className="h-4 w-4 mr-1 text-red-500" />
                            Alertas Prioritários
                          </h3>
                          
                          <div className="space-y-2">
                            {highPriorityAlerts.map(alert => (
                              <div 
                                key={alert.id}
                                className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                              >
                                <div className="flex items-start">
                                  <div className="flex-shrink-0 w-8 h-8 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 mr-2">
                                    {alert.type === 'ambulance' ? (
                                      <Ambulance className="h-4 w-4" />
                                    ) : alert.type === 'resource' ? (
                                      <Layers className="h-4 w-4" />
                                    ) : alert.type === 'patient-arrival' ? (
                                      <Users className="h-4 w-4" />
                                    ) : (
                                      <AlertTriangle className="h-4 w-4" />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                      {alert.title}
                                    </h4>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                                      {alert.message}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {unreadCount > highPriorityAlerts.length && (
                            <button 
                              className="w-full mt-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                              onClick={() => setCurrentView('alerts')}
                            >
                              Ver todos os {unreadCount} alertas
                            </button>
                          )}
                        </div>
                      )}
                      
                      {/* Recomendações principais */}
                      {recommendations.length > 0 && (
                        <div className="mb-4">
                          <h3 className="font-medium text-gray-800 dark:text-gray-200 flex items-center mb-2">
                            <Lightbulb className="h-4 w-4 mr-1 text-amber-500" />
                            Recomendações Inteligentes
                          </h3>
                          
                          <div className="space-y-2">
                            {recommendations.slice(0, 2).map(recommendation => (
                              <div 
                                key={recommendation.id}
                                className={`p-3 ${
                                  recommendation.applied 
                                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                                    : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
                                } border rounded-lg`}
                              >
                                <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 flex items-start">
                                  {recommendation.applied ? (
                                    <Check className="h-4 w-4 text-green-500 dark:text-green-400 mr-1 flex-shrink-0 mt-0.5" />
                                  ) : (
                                    <Lightbulb className="h-4 w-4 text-amber-500 dark:text-amber-400 mr-1 flex-shrink-0 mt-0.5" />
                                  )}
                                  <span>{recommendation.title}</span>
                                </h4>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 ml-5">
                                  {recommendation.description}
                                </p>
                                
                                {!recommendation.applied && (
                                  <button 
                                    className="mt-2 ml-5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center"
                                    onClick={() => handleApplyRecommendation(recommendation)}
                                  >
                                    {recommendation.actionText}
                                    <ArrowRight className="h-3 w-3 ml-1" />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                          
                          {recommendations.length > 2 && (
                            <button 
                              className="w-full mt-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                              onClick={() => setCurrentView('recommendations')}
                            >
                              Ver todas as {recommendations.length} recomendações
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Visualização de recomendações */}
                  {currentView === 'recommendations' && (
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-gray-800 dark:text-gray-200 flex items-center">
                          <Lightbulb className="h-5 w-5 mr-1 text-amber-500" />
                          Recomendações Inteligentes
                        </h3>
                        <button 
                          className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                          onClick={() => setCurrentView('welcome')}
                        >
                          Voltar
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        {recommendations.map(recommendation => (
                          <div 
                            key={recommendation.id}
                            className={`p-3 ${
                              recommendation.applied 
                                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                                : recommendation.priority === 'high'
                                  ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                                  : recommendation.priority === 'medium'
                                    ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
                                    : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                            } border rounded-lg`}
                          >
                            <div className="flex items-start justify-between">
                              <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 flex items-center">
                                {recommendation.applied ? (
                                  <Check className="h-4 w-4 text-green-500 dark:text-green-400 mr-1.5 flex-shrink-0" />
                                ) : recommendation.priority === 'high' ? (
                                  <AlertTriangle className="h-4 w-4 text-red-500 dark:text-red-400 mr-1.5 flex-shrink-0" />
                                ) : (
                                  <Lightbulb className="h-4 w-4 text-amber-500 dark:text-amber-400 mr-1.5 flex-shrink-0" />
                                )}
                                {recommendation.title}
                              </h4>
                              
                              <div className="flex items-center text-xs">
                                <span className={`
                                  px-1.5 py-0.5 rounded-full 
                                  ${recommendation.priority === 'high' 
                                    ? 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300' 
                                    : recommendation.priority === 'medium'
                                      ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300'
                                      : 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300'
                                  }
                                `}>
                                  {recommendation.priority === 'high' ? 'Alta' : recommendation.priority === 'medium' ? 'Média' : 'Baixa'}
                                </span>
                              </div>
                            </div>
                            
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                              {recommendation.description}
                            </p>
                            
                            <div className="flex justify-between items-center mt-3">
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                Confiança: {Math.round(recommendation.confidence * 100)}%
                              </div>
                              
                              {!recommendation.applied && (
                                <button 
                                  className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center"
                                  onClick={() => handleApplyRecommendation(recommendation)}
                                >
                                  {recommendation.actionText}
                                  <ArrowRight className="h-3 w-3 ml-1" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Visualização de alertas */}
                  {currentView === 'alerts' && (
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-gray-800 dark:text-gray-200 flex items-center">
                          <BellRing className="h-5 w-5 mr-1 text-red-500" />
                          Alertas Ativos
                        </h3>
                        <button 
                          className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                          onClick={() => setCurrentView('welcome')}
                        >
                          Voltar
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        {alerts.length > 0 ? (
                          alerts.map(alert => (
                            <div 
                              key={alert.id}
                              className={`p-3 ${
                                alert.priority === 'high'
                                  ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                                  : alert.priority === 'medium'
                                    ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
                                    : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                              } border rounded-lg ${alert.read ? 'opacity-75' : ''}`}
                            >
                              <div className="flex items-start">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 
                                  ${alert.type === 'ambulance' 
                                    ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300' 
                                    : alert.type === 'resource'
                                      ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300'
                                      : alert.type === 'patient-arrival'
                                        ? 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-300'
                                        : 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300'
                                  }"
                                >
                                  {alert.type === 'ambulance' ? (
                                    <Ambulance className="h-4 w-4" />
                                  ) : alert.type === 'resource' ? (
                                    <Layers className="h-4 w-4" />
                                  ) : alert.type === 'patient-arrival' ? (
                                    <Users className="h-4 w-4" />
                                  ) : (
                                    <AlertTriangle className="h-4 w-4" />
                                  )}
                                </div>
                                
                                <div className="flex-1">
                                  <div className="flex justify-between items-start">
                                    <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                      {alert.title}
                                    </h4>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>
                                  
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {alert.message}
                                  </p>
                                  
                                  {alert.actionRequired && (
                                    <div className="mt-2 flex justify-between items-center">
                                      <span className={`
                                        text-xs px-1.5 py-0.5 rounded
                                        ${alert.priority === 'high' 
                                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
                                          : alert.priority === 'medium'
                                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                        }
                                      `}>
                                        {alert.priority === 'high' ? 'Urgente' : alert.priority === 'medium' ? 'Importante' : 'Informativo'}
                                      </span>
                                      
                                      <button 
                                        className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center"
                                        onClick={() => onViewAllAlerts?.()}
                                      >
                                        Ver detalhes
                                        <ChevronRight className="h-3 w-3 ml-0.5" />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center p-6 text-gray-500 dark:text-gray-400">
                            <div className="w-12 h-12 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3">
                              <BellRing className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                            </div>
                            <p>Nenhum alerta ativo no momento</p>
                            <p className="text-xs mt-1">Você será notificado quando surgirem novos alertas</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Rodapé com ações */}
                <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <div className="flex space-x-2">
                    <button
                      className="flex-1 py-2 px-3 bg-indigo-600 dark:bg-indigo-700 hover:bg-indigo-700 dark:hover:bg-indigo-800 text-white rounded-lg text-sm font-medium transition-colors"
                      onClick={onShowChat}
                    >
                      Abrir Chat
                    </button>
                    
                    <button
                      className="py-2 px-3 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
};