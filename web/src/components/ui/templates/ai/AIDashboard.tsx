/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNetworkData } from '@/services/hooks/network-hospital/useNetworkData';
import { useAmbulanceData } from '@/services/hooks/ambulance/useAmbulanceData';
import { 
  Sparkles, 
  AlertTriangle, 
  Activity, 
  Users, 
  Bed, 
  Bot, 
  RefreshCw,
  Building2,
  ChevronDown,
  Check,
  X
} from 'lucide-react';
import { useAlerts } from '../providers/alerts/AlertsProvider';
import { useStaffData } from '@/services/hooks/staffs/useStaffData';
import { IntelligentRecommendations } from './IntelligentRecommendations';
import { PredictiveAnalysis } from './PredictiveAnalysis';
import { AlertsNotifications } from '../alerts/AlertsNotifications';
import { ResourceInsights } from '../resources/ResourceInsights';

// Importação dos componentes

interface AIDashboardProps {
  preSelectedHospitalId?: string;
  className?: string;
}

export const AIDashboard: React.FC<AIDashboardProps> = ({ preSelectedHospitalId, className }) => {
  const [activeTab, setActiveTab] = useState<'recommendations' | 'predictive' | 'alerts' | 'resources'>('recommendations');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(preSelectedHospitalId || null);
  const [isHospitalSelectorOpen, setIsHospitalSelectorOpen] = useState(false);
  
  const { networkData, loading: networkLoading } = useNetworkData();
  const { alerts, highPriorityCount } = useAlerts();
  const { ambulanceData } = useAmbulanceData(selectedHospitalId);
  const { staffData } = useStaffData(selectedHospitalId ? selectedHospitalId : '');
  
  const selectedHospital = selectedHospitalId ? networkData?.hospitals.find(h => h.id === selectedHospitalId) : null;
  
  // Efeito para definir o hospital padrão quando os dados são carregados
  useEffect(() => {
    if (!selectedHospitalId && networkData?.hospitals && networkData.hospitals.length > 0) {
      setSelectedHospitalId(networkData.hospitals[0].id);
    }
  }, [selectedHospitalId, networkData]);
  
  // Função para simular a atualização dos dados de IA
  const refreshData = () => {
    setIsRefreshing(true);
    
    // Simulação de tempo de atualização
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdate(new Date());
    }, 1500);
  };
  
  useEffect(() => {
    // Atualizar dados a cada 5 minutos
    const interval = setInterval(() => {
      refreshData();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Função auxiliar para renderizar o seletor de hospital
  const renderHospitalSelector = () => {
    return (
      <div className="mb-6">
        <h3 className="text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">Selecione um hospital para análise</h3>
        <div className="relative">
          <button
            onClick={() => setIsHospitalSelectorOpen(!isHospitalSelectorOpen)}
            className="flex items-center justify-between w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-left shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            <div className="flex items-center">
              <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="text-gray-800 dark:text-gray-200 font-medium truncate">
                {selectedHospital ? selectedHospital.name : networkLoading ? 'Carregando hospitais...' : 'Selecione um hospital'}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </button>
          
          {isHospitalSelectorOpen && !networkLoading && (
            <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {networkData?.hospitals && networkData.hospitals.length > 0 ? (
                networkData.hospitals.map(hospital => (
                  <button
                    key={hospital.id}
                    className={`flex items-center justify-between w-full text-left p-3 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors ${
                      selectedHospitalId === hospital.id ? 'bg-blue-50 dark:bg-blue-900/30' : ''
                    }`}
                    onClick={() => {
                      setSelectedHospitalId(hospital.id);
                      setIsHospitalSelectorOpen(false);
                    }}
                  >
                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                      <div>
                        <p className="text-gray-800 dark:text-gray-200 font-medium">{hospital.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {hospital.unit.city}, {hospital.unit.state}
                        </p>
                      </div>
                    </div>
                    
                    {selectedHospitalId === hospital.id && (
                      <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    )}
                  </button>
                ))
              ) : (
                <div className="p-3 text-gray-500 dark:text-gray-400 text-center">
                  Nenhum hospital disponível
                </div>
              )}
              
              <button 
                className="w-full flex justify-center items-center p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 border-t border-gray-200 dark:border-gray-600"
                onClick={() => setIsHospitalSelectorOpen(false)}
              >
                <X className="h-4 w-4 mr-1" />
                Fechar
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // Tabs
  const renderTabs = () => {
    return (
      <div className="border-b border-gray-200 dark:border-gray-700 px-4 mb-6">
        <nav className="flex space-x-4">
          <button
            className={`py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'recommendations'
                ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('recommendations')}
          >
            <div className="flex items-center">
              <Sparkles className="h-4 w-4 mr-1" />
              Recomendações
            </div>
          </button>
          
          <button
            className={`py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'predictive'
                ? 'border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('predictive')}
          >
            <div className="flex items-center">
              <Activity className="h-4 w-4 mr-1" />
              Análise Preditiva
            </div>
          </button>
          
          <button
            className={`py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'alerts'
                ? 'border-red-600 dark:border-red-400 text-red-600 dark:text-red-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('alerts')}
          >
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1" />
              Alertas
              {highPriorityCount > 0 && (
                <span className="ml-2 bg-red-600 dark:bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                  {highPriorityCount}
                </span>
              )}
            </div>
          </button>
          
          <button
            className={`py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'resources'
                ? 'border-emerald-600 dark:border-emerald-400 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('resources')}
          >
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              Recursos
            </div>
          </button>
        </nav>
      </div>
    );
  };
  
  // Estado de carregamento para a tela inteira
  const renderLoading = () => (
    <div className="flex items-center justify-center h-64 p-6">
      <div className="text-center">
        <RefreshCw className="h-12 w-12 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Carregando dados de análise de IA...</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Estamos processando informações para gerar insights e recomendações.
        </p>
      </div>
    </div>
  );
  
  // Componente para quando nenhum hospital está selecionado
  const NoHospitalSelectedState = () => (
    <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg p-8 text-center">
      <Building2 className="h-16 w-16 text-blue-200 dark:text-blue-900 mb-4" />
      <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">Selecione um hospital</h3>
      <p className="text-gray-500 dark:text-gray-400 max-w-md">
        Para visualizar análises de IA, recomendações e insights, selecione um hospital no menu acima.
      </p>
    </div>
  );
  
  // Renderizar tab content
  const renderTabContent = () => {
    if (!selectedHospitalId) {
      return <NoHospitalSelectedState />;
    }
  
    switch (activeTab) {
      case 'recommendations':
        return <IntelligentRecommendations hospitalId={selectedHospitalId} />;
      case 'predictive':
        return <PredictiveAnalysis hospitalId={selectedHospitalId} />;
      case 'alerts':
        return <AlertsNotifications hospitalId={selectedHospitalId} />;
      case 'resources':
        return <ResourceInsights hospitalId={selectedHospitalId} />;
      default:
        return <IntelligentRecommendations hospitalId={selectedHospitalId} />;
    }
  };
  
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-white/20 dark:bg-white/10 rounded-full p-2 mr-3">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Assistente IA</h2>
              <p className="text-blue-100 text-sm">
                Análise inteligente e recomendações para otimização hospitalar
              </p>
            </div>
          </div>
          
          <button 
            onClick={refreshData} 
            disabled={isRefreshing || networkLoading}
            className="text-white bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
          >
            <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
        
        <p className="text-xs text-blue-100 mt-2">
          Última atualização: {lastUpdate.toLocaleString()}
        </p>
      </div>
      
      <div className="p-4">
        {/* Seletor de Hospital - sempre visível */}
        {renderHospitalSelector()}
        
        {/* Tabs - sempre visíveis */}
        {renderTabs()}
        
        {/* Conteúdo - condicional baseado no estado de carregamento */}
        {networkLoading ? renderLoading() : renderTabContent()}
      </div>
    </div>
  );
};