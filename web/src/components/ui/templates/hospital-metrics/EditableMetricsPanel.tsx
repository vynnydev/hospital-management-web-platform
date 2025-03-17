/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { X, Plus, ChevronUp, ChevronDown } from 'lucide-react';
import { IHospital, INetworkData } from '@/types/hospital-network-types';
import { Button } from "@/components/ui/organisms/button";
import { MetricSelectorModal } from './MetricSelectorModal';
import { authService } from '@/services/auth/AuthService';
import { Alert } from "@/components/ui/organisms/alert";
import { AlertCircle } from 'lucide-react';
import { usePermissions } from '@/services/hooks/auth/usePermissions';
import { useUserMetrics } from '@/services/hooks/user/metrics/useUserMetrics';
import { MainHospitalAlertMetrics } from '@/app/(administrator)/overview/components/MainHospitalAlertMetrics';
import { AdditionalHospitalMetrics } from '@/app/(administrator)/overview/components/AdditionalHospitalMetrics';
import { userMetricsService } from '@/services/general/user/userMetricsService';
import { motion, AnimatePresence } from 'framer-motion';

interface ICurrentMetrics {
  totalBeds: number;
  totalPatients: number;
  averageOccupancy: number;
}

interface EditableMetricsPanelProps {
  networkData: INetworkData;
  currentMetrics: ICurrentMetrics;
  selectedRegion: string;
  selectedHospital: string | null;
  isEditMode: boolean;
  onExitEditMode: () => void;
  getFilteredHospitals?: () => IHospital[];
}

export const EditableMetricsPanel: React.FC<EditableMetricsPanelProps> = ({
  networkData,
  currentMetrics,
  selectedRegion,
  selectedHospital,
  isEditMode,
  onExitEditMode,
  getFilteredHospitals
}) => {
  // Estado para o modal de adicionar métricas
  const [isAddMetricModalOpen, setIsAddMetricModalOpen] = useState(false);
  const [expandedAdditionalMetrics, setExpandedAdditionalMetrics] = useState(true);
  
  // Estado para verificar estado de autenticação
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  
  // Hook para permissões do usuário
  const { isAdmin, isHospitalManager } = usePermissions();
  
  // Hook para métricas do usuário
  const {
    allMetrics,
    panelMetrics,
    isLoading,
    error,
    isAuthenticated,
    addToPanel,
    removeFromPanel,
    isInPanel,
    refreshMetrics
  } = useUserMetrics('default');
  
  // Verificar estado de autenticação
  useEffect(() => {
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      setIsUserLoggedIn(isAuth);
    };
    
    checkAuth();
    
    // Listener para mudanças de autenticação
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);
  
  // Atualizar métricas quando mudar o estado de edição
  useEffect(() => {
    if (isEditMode) {
      refreshMetrics();
    }
  }, [isEditMode, refreshMetrics]);
  
  // Filtrar métricas por tipo
  const mainMetrics = panelMetrics.filter(metric => metric.type === 'main');
  const additionalMetrics = panelMetrics.filter(metric => metric.type === 'additional');

  useEffect(() => {
    if (!isLoading && mainMetrics.length === 0 && isAuthenticated) {
      // Se as métricas não foram encontradas, mas o usuário está autenticado,
      // tentar carregar métricas padrão
      userMetricsService.addDefaultMetricsToUserPanel()
        .then(() => refreshMetrics())
        .catch((error) => console.error('Erro ao adicionar métricas padrão:', error));
    }
  }, [isLoading, mainMetrics.length, isAuthenticated, refreshMetrics]);
  
  
  // IDs de métricas no painel para serem usados na renderização
  const visibleMainMetrics = mainMetrics.map(metric => {
    // Se o ID já contém o prefixo, use-o diretamente, caso contrário adicione
    return metric.id.includes('main-') ? metric.id : metric.cardType;
  });
  const visibleAdditionalMetrics = additionalMetrics.map(metric => metric.id);
  
  // Função para remover uma métrica principal
  const removeMainMetric = async (metricId: string) => {
    await removeFromPanel(metricId);
  };

  // Função para remover uma métrica adicional
  const removeAdditionalMetric = async (metricId: string) => {
    await removeFromPanel(metricId);
  };
  
  // Função para adicionar uma métrica pelo ID
  const addMetricById = async (metricId: string) => {
    await addToPanel(metricId);
  };
  
  // Função para filtrar hospitais com base na seleção atual
  const getFilteredHospitalsData = () => {
    if (!networkData || !networkData.hospitals) return [];
    
    if (selectedHospital) {
      // Se um hospital específico foi selecionado, filtre apenas esse hospital
      return networkData.hospitals.filter(hospital => hospital.id === selectedHospital);
    } else if (selectedRegion && selectedRegion !== 'all') {
      // Se uma região específica foi selecionada, filtre pelos hospitais dessa região
      return networkData.hospitals.filter(hospital => hospital.unit?.state === selectedRegion);
    } else {
      // Se "Todas as Regiões" foi selecionado, use todos os hospitais
      return networkData.hospitals;
    }
  };
  
  // Renderizar mensagem quando não houver métricas
  const renderEmptyState = (type: 'main' | 'additional') => {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center justify-center p-10 bg-gray-800/30 rounded-xl border border-gray-700/30 text-center my-4"
      >
        <div className="w-20 h-20 rounded-full bg-gray-700/50 flex items-center justify-center mb-6">
          <Plus className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-medium text-gray-300 mb-3">
          {type === 'main' 
            ? 'Nenhuma métrica principal selecionada' 
            : 'Nenhuma métrica adicional selecionada'}
        </h3>
        <p className="text-sm text-gray-400 mb-6 max-w-lg">
          {type === 'main'
            ? 'Adicione métricas principais para monitorar os indicadores mais importantes do hospital'
            : 'Adicione métricas adicionais para visualizar mais informações sobre o desempenho do hospital'}
        </p>
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2"
          onClick={() => setIsAddMetricModalOpen(true)}
        >
          <Plus className="w-5 h-5" />
          Adicionar Métricas
        </Button>
      </motion.div>
    );
  };
  
  // Renderizar estado de carregamento
  const renderLoadingState = () => {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-14 h-14 rounded-full border-4 border-t-blue-500 border-b-blue-500 border-r-transparent border-l-transparent animate-spin mb-4"></div>
        <p className="text-gray-400 text-lg">Carregando métricas...</p>
      </div>
    );
  };
  
  // Renderizar erro
  const renderErrorState = () => {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertCircle className="h-5 w-5 mr-2" />
        <span>Erro ao carregar métricas: {error}</span>
      </Alert>
    );
  };
  
  // Renderizar mensagem de login necessário
  const renderLoginRequired = () => {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center justify-center p-10 bg-gray-800/30 rounded-xl border border-gray-700/30 text-center my-4"
      >
        <div className="w-20 h-20 rounded-full bg-gray-700/50 flex items-center justify-center mb-6">
          <AlertCircle className="w-10 h-10 text-amber-500" />
        </div>
        <h3 className="text-xl font-medium text-gray-300 mb-3">
          Login necessário
        </h3>
        <p className="text-sm text-gray-400 mb-6 max-w-lg">
          Faça login para visualizar e personalizar suas métricas
        </p>
      </motion.div>
    );
  };

  // Obter hospitais filtrados
  const filteredHospitals = getFilteredHospitalsData();

  return (
    <>    
      {/* Blur para o restante da página quando estiver no modo de edição */}
      {isEditMode && (
        <div 
          className="fixed inset-x-0 bottom-0 bg-black/30 backdrop-blur-sm z-30 pointer-events-none w-full h-screen"
        />
      )}
      <div className={`
        relative transition-all duration-500 ease-in-out
        ${isEditMode ? 'z-50 scale-105 transform translate-y-3 shadow-2xl p-6' : 'z-10'}
      `}>

        {/* Barra superior em modo de edição */}
        <AnimatePresence>
          {isEditMode && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute -top-16 left-0 right-0 bg-blue-600 dark:bg-blue-800 rounded-t-xl p-4 flex flex-col md:flex-row justify-between items-center shadow-lg z-20"
            >
              <div className="flex items-center space-x-2 mb-3 md:mb-0">
                <span className="text-white font-semibold">Modo de Edição de Métricas</span>
                <div className="px-2 py-1 bg-blue-700 dark:bg-blue-900 rounded-md">
                  <span className="text-xs text-blue-100">
                    {visibleMainMetrics.length + visibleAdditionalMetrics.length} métricas visíveis
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  className="bg-blue-700 hover:bg-blue-800 text-white border-blue-500"
                  onClick={() => setIsAddMetricModalOpen(true)}
                  disabled={!isAuthenticated}
                >
                  <Plus size={16} className="mr-1" /> Adicionar Métrica
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-blue-700 hover:bg-blue-800 text-white border-blue-500"
                  onClick={onExitEditMode}
                >
                  Concluir
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Componente de Métricas Principais */}
        <motion.div
          layout
          className={`
            relative rounded-3xl overflow-hidden transition-all duration-500
            ${isEditMode ? 'shadow-2xl ring-4 ring-blue-400 dark:ring-blue-600 p-4 mt-4' : ''}
          `}
        >
          <div className="relative z-10">
            {isLoading ? (
              renderLoadingState()
            ) : error ? (
              renderErrorState()
            ) : !isAuthenticated ? (
              renderLoginRequired()
            ) : mainMetrics.length === 0 ? (
              renderEmptyState('main')
            ) : (
              <MainHospitalAlertMetrics 
                networkData={networkData}
                currentMetrics={currentMetrics}
                selectedRegion={selectedRegion}
                selectedHospital={selectedHospital}
                visibleMetrics={visibleMainMetrics}
                isMainSection={true}
                filteredHospitals={filteredHospitals}
              />
            )}
            
            {/* Sobreposição com botões de remover em modo de edição */}
            <AnimatePresence>
              {isEditMode && isAuthenticated && mainMetrics.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pointer-events-none"
                >
                  {mainMetrics.map((metric) => (
                    <div key={metric.id} className="relative h-full">
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute top-0 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 z-50 pointer-events-auto shadow-md"
                        onClick={() => removeMainMetric(metric.id)}
                      >
                        <X size={16} />
                      </motion.button>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Componente de Métricas Adicionais */}
        <motion.div
          layout
          className={`
            relative mt-8 transition-all duration-500
            ${isEditMode ? 'shadow-2xl ring-4 ring-blue-400 dark:ring-blue-600 rounded-3xl overflow-hidden mt-4' : ''}
          `}
        >
          <div className="relative z-10">
            <div className="flex justify-between items-center mt-8 mb-8 bg-gray-900/40 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/30 hover:bg-gray-800/40 transition-all duration-200">
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-semibold bg-gradient-to-r from-gray-100 to-gray-300 dark:from-gray-100 dark:to-blue-200 bg-clip-text text-transparent">
                  Métricas do Hospital
                </h2>
                <p className="text-base text-gray-400">
                  Clique para {expandedAdditionalMetrics ? 'ocultar' : 'visualizar'} todas as métricas
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className={`
                  w-2 h-2 rounded-full
                  ${expandedAdditionalMetrics ? 'bg-green-500' : 'bg-blue-500'}
                  animate-pulse
                `} />
                
                <button 
                  onClick={() => setExpandedAdditionalMetrics(!expandedAdditionalMetrics)}
                  className="
                    flex items-center gap-2 px-4 py-2
                    bg-gray-800/40 hover:bg-gray-700/40
                    dark:bg-gray-800/40 dark:hover:bg-gray-700/40
                    rounded-xl transition-all duration-200
                    border border-gray-700/30
                  "
                >
                  <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                    {expandedAdditionalMetrics ? 'Ocultar' : 'Mostrar'} Métricas
                  </span>
                  <div className="w-5 h-5 rounded-full bg-gray-700/50 flex items-center justify-center">
                    {expandedAdditionalMetrics ? (
                      <ChevronUp className="w-4 h-4 text-gray-300 group-hover:text-white transition-colors" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-300 group-hover:text-white transition-colors" />
                    )}
                  </div>
                </button>
              </div>
            </div>

            <AnimatePresence>
              {expandedAdditionalMetrics && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  {isLoading ? (
                    renderLoadingState()
                  ) : error ? (
                    renderErrorState()
                  ) : !isAuthenticated && isEditMode ? (
                    renderLoginRequired()
                  ) : additionalMetrics.length === 0 ? (
                    renderEmptyState('additional')
                  ) : (
                    <AdditionalHospitalMetrics 
                      networkData={networkData}
                      currentMetrics={currentMetrics}
                      selectedHospital={selectedHospital}
                      selectedRegion={selectedRegion}
                      visibleMetrics={visibleAdditionalMetrics}
                      filteredHospitals={filteredHospitals}
                    />
                  )}
                  
                  {/* Sobreposição com botões de remover em modo de edição */}
                  <AnimatePresence>
                    {isEditMode && isAuthenticated && additionalMetrics.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pointer-events-none"
                      >
                        {additionalMetrics.map((metric) => (
                          <div key={metric.id} className="relative h-full">
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="absolute top-0 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 z-50 pointer-events-auto shadow-md"
                              onClick={() => removeAdditionalMetric(metric.id)}
                            >
                              <X size={16} />
                            </motion.button>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Botão flutuante para sair do modo de edição */}
        <AnimatePresence>
          {isEditMode && (
            <motion.div 
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="fixed bottom-8 right-8 z-50"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={{ y: [0, -8, 0] }}
                transition={{ 
                  y: { 
                    repeat: Infinity, 
                    duration: 1.5,
                    ease: "easeInOut" 
                  }
                }}
                onClick={onExitEditMode}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-16 h-16 shadow-lg flex items-center justify-center"
              >
                <X size={24} />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Modal para adicionar métricas */}
        <MetricSelectorModal
          isOpen={isAddMetricModalOpen}
          onClose={() => setIsAddMetricModalOpen(false)}
          onSelectMetric={addMetricById}
          visibleMainMetrics={visibleMainMetrics}
          visibleAdditionalMetrics={visibleAdditionalMetrics}
          allMetrics={allMetrics}
        />
      </div>
    </>
  );
};