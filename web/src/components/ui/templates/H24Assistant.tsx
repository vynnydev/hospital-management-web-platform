/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Sparkles, X, Minimize2, BellRing } from 'lucide-react';
import { useNetworkData } from '@/services/hooks/network-hospital/useNetworkData';
import { useStaffData } from '@/services/hooks/staffs/useStaffData';
import { useAmbulanceData } from '@/services/hooks/ambulance/useAmbulanceData';
import { useAlertsProvider } from './providers/alerts/AlertsProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { IRecommendation, IStatistics } from '@/types/ai-assistant-types';
import { eventService } from '@/services/events/EventService';
import { LOGIN_SUCCESS_EVENT } from '@/services/hooks/auth/useAuth';

// Componentes importados
import { WelcomeView } from './ai-assistant/views/WelcomeView';
import { RecommendationsView } from './ai-assistant/views/RecommendationsView';
import { AlertsView } from './ai-assistant/views/AlertsView';
import { MinimizedAssistant } from './ai-assistant/MinimizedAssistant';
import { userPreferencesService } from '@/services/preferences/userPreferencesService';

// Props para o componente
interface H24AssistantProps {
    userId?: string;
    hospitalId?: string;
    onRecommendationApply?: (recommendation: IRecommendation) => void;
    onViewAllAlerts?: () => void;
    onShowChat?: () => void;
    autoOpenOnLogin?: boolean; // Nova prop para controlar abertura automática
}

// Métodos que serão expostos pela ref
export interface H24AssistantHandle {
  openAssistant: () => void;
}

export const H24Assistant = forwardRef<H24AssistantHandle, H24AssistantProps>(({
  userId = 'current-user',
  hospitalId,
  onRecommendationApply,
  onViewAllAlerts,
  onShowChat,
  autoOpenOnLogin = true
}, ref) => {
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [isMinimized, setIsMinimized] = useState(false);
    const [hasBeenSeen, setHasBeenSeen] = useState(false);
    const [recommendations, setRecommendations] = useState<IRecommendation[]>([]);
    const [statistics, setStatistics] = useState<IStatistics | null>(null);
    const [currentView, setCurrentView] = useState<'welcome' | 'recommendations' | 'alerts'>('welcome');
    const [inactivityTimer, setInactivityTimer] = useState<NodeJS.Timeout | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    // Expor métodos para a ref
    useImperativeHandle(ref, () => ({
      openAssistant: () => {
        setIsModalOpen(true);
        setIsMinimized(false);
      }
    }));
    
    // Hooks para dados
    const { networkData, currentUser } = useNetworkData();
    const { staffData } = useStaffData(hospitalId || (networkData?.hospitals[0]?.id || ''));
    const { ambulanceData } = useAmbulanceData(hospitalId || (networkData?.hospitals[0]?.id || ''));
    const { alerts, unreadCount, highPriorityCount, getFilteredAlerts } = useAlertsProvider();
    
    const selectedHospitalId = hospitalId || networkData?.hospitals[0]?.id || 'RD4H-SP-ITAIM';
    const hospital = networkData?.hospitals.find(h => h.id === selectedHospitalId);
    
    // Inicializar estado com base nas preferências salvas
    useEffect(() => {
      const loadUserPreferences = () => {
        // Verificar se o assistente foi minimizado
        const wasMinimized = userPreferencesService.getMinimizedState(userId);
        
        // O serviço já vai retornar false se o login foi recente
        setIsMinimized(wasMinimized);
        
        // Verificar se já foi visto antes
        const firstVisit = userPreferencesService.isFirstVisit(userId);
        setHasBeenSeen(!firstVisit);
        
        // Carregar preferências
        const preferences = userPreferencesService.getUserPreferences(userId);
        setCurrentView(preferences.defaultView);
      };
      
      loadUserPreferences();
    }, [userId]);
    
    // Salvar o estado de minimização quando mudar
    useEffect(() => {
      userPreferencesService.saveMinimizedState(userId, isMinimized);
    }, [isMinimized, userId]);
    
    // Efeito para mostrar o modal automaticamente ao carregar (primeira vez)
    useEffect(() => {
      // Verificar se é a primeira vez
      if (!hasBeenSeen) {
        // Obter as preferências do usuário
        const preferences = userPreferencesService.getUserPreferences(userId);
        
        // Só abrir automaticamente se o usuário tiver configurado para mostrar no startup
        if (preferences.showOnStartup) {
          setTimeout(() => {
            setIsModalOpen(true);
            setHasBeenSeen(true);
          }, 1000); // Atraso de 1 segundo para permitir que a página carregue primeiro
        }
      }
    }, [hasBeenSeen, userId]);
    
  // Escutar evento de login bem-sucedido
  useEffect(() => {
    // Só registra o listener se autoOpenOnLogin for true
    if (autoOpenOnLogin) {
      const unsubscribe = eventService.subscribe(LOGIN_SUCCESS_EVENT, (user) => {
        // Abre o assistente quando o login for bem-sucedido
        setTimeout(() => {
          setIsModalOpen(true);
          setIsMinimized(false); // Explicitamente define como não minimizado
          setCurrentView('welcome'); // Reset para a view de boas-vindas
        }, 1000); // Pequeno atraso para dar tempo à navegação
      });
      
      // Limpar o listener quando o componente for desmontado
      return () => {
        unsubscribe();
      };
    }
  }, [autoOpenOnLogin]);
    
    // Efeito para fechar o modal ao clicar fora dele (apenas quando não estiver minimizado)
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && 
            !modalRef.current.contains(event.target as Node) && 
            isModalOpen && 
            !isMinimized) {
          setIsModalOpen(false);
        }
      };
      
      if (isModalOpen && !isMinimized) {
        document.addEventListener('mousedown', handleClickOutside);
      }
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isModalOpen, isMinimized]);
    
    
    // Efeito para lidar com inatividade
    useEffect(() => {
      const preferences = userPreferencesService.getUserPreferences(userId);
      
      // Verificar se o auto-minimizar está ativado
      if (isModalOpen && !isMinimized && preferences.autoMinimizeAfterInactivity) {
        // Limpar o timer anterior, se existir
        if (inactivityTimer) {
          clearTimeout(inactivityTimer);
        }
        
        // Configurar novo timer
        const timer = setTimeout(() => {
          setIsMinimized(true);
        }, preferences.inactivityTimeout * 1000);
        
        setInactivityTimer(timer);
      }
      
      // Limpar o timer quando o componente for desmontado
      return () => {
        if (inactivityTimer) {
          clearTimeout(inactivityTimer);
        }
      };
    }, [isModalOpen, isMinimized, userId, inactivityTimer]);
    
    // Resetar o timer de inatividade quando houver interação com o modal
    const resetInactivityTimer = () => {
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
        setInactivityTimer(null);
        
        // Reiniciar o timer
        const preferences = userPreferencesService.getUserPreferences(userId);
        if (preferences.autoMinimizeAfterInactivity) {
          const timer = setTimeout(() => {
            setIsMinimized(true);
          }, preferences.inactivityTimeout * 1000);
          
          setInactivityTimer(timer);
        }
      }
    };
    
    // Efeito para gerar recomendações com base nos dados disponíveis
    useEffect(() => {
      // Função para gerar recomendações com base na análise dos dados
      const generateRecommendations = () => {
        const newRecommendations: IRecommendation[] = [];
        
        // Exemplo: Recomendação baseada em alta ocupação de UTI
        const hospital = networkData?.hospitals.find(h => h.id === selectedHospitalId);
        if (hospital && hospital.metrics && hospital.metrics.departmental?.uti?.occupancy > 85) {
          const recId = `rec-bed-${Date.now()}`;
          
          // Verificar se a recomendação já foi aplicada pelo usuário
          const applied = userPreferencesService.isRecommendationApplied(userId, recId);
          
          newRecommendations.push({
            id: recId,
            type: 'bed-management',
            title: 'Ocupação crítica de UTI',
            description: `A UTI está com ${hospital.metrics.departmental.uti.occupancy}% de ocupação. Considere redistribuir pacientes ou ativar leitos adicionais.`,
            priority: 'high',
            actionText: 'Ver leitos disponíveis',
            timestamp: new Date(),
            confidence: 0.92,
            applied
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
            const recId = `rec-ambulance-${Date.now()}`;
            
            // Verificar se a recomendação já foi aplicada pelo usuário
            const applied = userPreferencesService.isRecommendationApplied(userId, recId);
            
            newRecommendations.push({
              id: recId,
              type: 'ambulance-dispatch',
              title: `${criticalCount} ambulância${criticalCount > 1 ? 's' : ''} com casos críticos a caminho`,
              description: `Prepare equipe de emergência e recursos para receber ${criticalCount} paciente${criticalCount > 1 ? 's' : ''} crítico${criticalCount > 1 ? 's' : ''} nos próximos 30 minutos.`,
              priority: 'high',
              actionText: 'Preparar recepção',
              timestamp: new Date(),
              confidence: 0.95,
              applied
            });
          }
        }
        
        // Recomendação baseada na análise de equipes e escalas
        const teamUTI = staffData?.staffTeams[selectedHospitalId]?.find(team => 
          team.department.toLowerCase() === 'uti' && 
          team.shift === 'Manhã'
        );
        
        if (teamUTI && (teamUTI.capacityStatus === 'high_demand' || teamUTI.metrics.taskCompletion < 85)) {
          const recId = `rec-staff-${Date.now()}`;
          
          // Verificar se a recomendação já foi aplicada pelo usuário
          const applied = userPreferencesService.isRecommendationApplied(userId, recId);
          
          newRecommendations.push({
            id: recId,
            type: 'staff-allocation',
            title: 'Equipe de UTI sobrecarregada',
            description: 'A equipe da UTI manhã está com sobrecarga de trabalho. Considere redistribuir tarefas ou alocar membros adicionais para equilibrar a demanda.',
            priority: 'medium',
            actionText: 'Reorganizar escala',
            timestamp: new Date(),
            confidence: 0.85,
            applied
          });
        }
        
        // Recomendação baseada em análise preditiva (simulação)
        const recId = `rec-prediction-${Date.now()}`;
        
        // Verificar se a recomendação já foi aplicada pelo usuário
        const applied = userPreferencesService.isRecommendationApplied(userId, recId);
        
        newRecommendations.push({
          id: recId,
          type: 'ai-prediction',
          title: 'Previsão de alta demanda',
          description: 'Nosso modelo preditivo indica aumento de 23% na demanda de leitos para os próximos 3 dias. Recomendamos preparação prévia de recursos e equipes.',
          priority: 'medium',
          actionText: 'Ver previsão detalhada',
          timestamp: new Date(),
          confidence: 0.88,
          applied
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
      
      if (networkData && staffData && ambulanceData && alerts) {
        generateRecommendations();
        generateStatistics();
      }
    }, [networkData, staffData, ambulanceData, alerts, selectedHospitalId, userId]);
    
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
      
      // Salvar a ação nas preferências do usuário
      userPreferencesService.markRecommendationAsApplied(userId, recommendation.id);
      
      // Chamar callback se fornecido
      if (onRecommendationApply) {
        onRecommendationApply(recommendation);
      }
      
      // Resetar o timer de inatividade
      resetInactivityTimer();
    };
    
    // Obter o nome e a função do usuário atual
    const userGreeting = () => {
      const userName = currentUser?.name || 'Administrador';
      const userRole = currentUser?.role || 'Administrador';
      const period = getPeriodOfDay();
      
      return `${period}, ${userName}! Como ${userRole} do Cognitiva, hoje temos:`
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

    // Alternar entre minimizado e maximizado
    const toggleMinimize = () => {
      setIsMinimized(!isMinimized);
    };
    
    // Fechar o assistente completamente
    const closeAssistant = () => {
      setIsModalOpen(false);
      setIsMinimized(false);
      
      // Limpar o timer de inatividade
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
        setInactivityTimer(null);
      }
    };
    
    // Handler para quando o usuário interage com qualquer parte do assistente
    const handleInteraction = () => {
      resetInactivityTimer();
    };
    
    // Método público para abrir o assistente programaticamente
    const openAssistant = () => {
      setIsModalOpen(true);
      setIsMinimized(false);
    };
    
    // Conteúdo compartilhado entre as visualizações
    const sharedProps = {
      userGreeting: userGreeting(),
      formattedDate: getFormattedDate(),
      statistics,
      recommendations,
      alerts,
      highPriorityAlerts: getFilteredAlerts(undefined, 'high').slice(0, 3),
      unreadCount,
      highPriorityCount,
      onApplyRecommendation: handleApplyRecommendation,
      setCurrentView,
      hospital
    };
    
    return (
      <div className="relative" onMouseMove={handleInteraction} onClick={handleInteraction}>
        {/* Botão do assistente */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 
          bg-gradient-to-r from-indigo-600 to-cyan-600 
          hover:from-indigo-700 hover:to-cyan-700 
          text-white rounded-full shadow-md transition-all duration-300 hover:shadow-lg 
          dark:from-indigo-800 dark:to-cyan-800 dark:hover:from-indigo-800 dark:hover:to-cyan-800"
          aria-label="Assistente Cognitiva"
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
        
        {/* Assistente Minimizado */}
        {isModalOpen && isMinimized && (   
            <MinimizedAssistant 
              onMaximize={() => setIsMinimized(false)}
              onClose={closeAssistant}
              unreadCount={unreadCount}
            />
        )}
        
        {/* Modal do assistente (expandido) */}
        <AnimatePresence>
          {isModalOpen && !isMinimized && (
            <motion.div
              className="fixed inset-0 z-50 flex items-start justify-end p-4 mr-16 top-4 pointer-events-none"
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
                      <h2 className="text-xl font-semibold">Assistente Cognitiva</h2>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button 
                        onClick={toggleMinimize} 
                        className="p-1 rounded-full hover:bg-white/10 transition-colors text-white"
                        aria-label="Minimizar"
                      >
                        <Minimize2 className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={closeAssistant} 
                        className="p-1 rounded-full hover:bg-white/10 transition-colors text-white"
                        aria-label="Fechar"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-indigo-100 dark:text-indigo-200 mt-1">
                    Sua assistente inteligente para gestão hospitalar
                  </p>
                </div>
                
                {/* Corpo do modal - Alternância entre visualizações */}
                <div className="max-h-[70vh] overflow-y-auto">
                  {currentView === 'welcome' && (
                    <WelcomeView {...sharedProps} />
                  )}
                  
                  {currentView === 'recommendations' && (
                    <RecommendationsView {...sharedProps} />
                  )}
                  
                  {currentView === 'alerts' && (
                    <AlertsView {...sharedProps} onViewAllAlerts={onViewAllAlerts} />
                  )}
                </div>
                
                {/* Rodapé com ações */}
                <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <div className="flex space-x-2">
                    <button
                      className="flex-1 py-2 px-3 bg-indigo-600 dark:bg-indigo-700 hover:bg-indigo-700 dark:hover:bg-indigo-800 text-white rounded-lg text-sm font-medium transition-colors"
                      onClick={() => {
                        resetInactivityTimer();
                        onShowChat && onShowChat();
                      }}
                    >
                      Abrir Chat
                    </button>
                    
                    <button
                      className="py-2 px-3 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
                      onClick={closeAssistant}
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
});

// Adiciona método para abrir o assistente externamente
// Isso permite que outros componentes possam abrir o assistente programaticamente
export const assistantController = {
  // Referência para a função openAssistant
  _openAssistant: null as null | (() => void),
  
  // Método para registrar a função
  registerOpenFunction(openFn: () => void) {
    this._openAssistant = openFn;
  },
  
  // Método para abrir o assistente
  openAssistant() {
    if (this._openAssistant) {
      this._openAssistant();
    } else {
      console.warn('Função de abertura do assistente não registrada');
    }
  }
};