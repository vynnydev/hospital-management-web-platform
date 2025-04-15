/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNetworkData } from '@/hooks/network-hospital/useNetworkData';
import { 
  Bot, 
  ChevronLeft, 
  Settings, 
  Share2, 
  Download, 
  Moon, 
  Sun,
  RefreshCw,
  Building2,
  ChevronDown,
  Check,
  Activity
} from 'lucide-react';
import { AlertsProvider } from '@/components/ui/templates/providers/alerts/AlertsProvider';
import { AIDashboard } from '@/components/ui/templates/ai/AIDashboard';

interface AiAnalysisGeneralDataProps {
  // Propriedades opcionais, como preSelectedHospitalId
  preSelectedHospitalId?: string;
}

export const AIAnalyticsGeneralData: React.FC<AiAnalysisGeneralDataProps> = ({ preSelectedHospitalId }) => {
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(null);
  const [isHospitalSelectorOpen, setIsHospitalSelectorOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  
  const { networkData, loading: networkLoading } = useNetworkData();
  
  // Efeito para detectar o modo escuro do sistema
  useEffect(() => {
    // Verificar se o usuário prefere modo escuro
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
    
    // Adicionar classe ao documento se estiver em modo escuro
    if (prefersDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);
  
  // Efeito para definir o hospital padrão quando os dados são carregados
  useEffect(() => {
    if (!selectedHospitalId && networkData?.hospitals && networkData.hospitals.length > 0) {
      setSelectedHospitalId(networkData.hospitals[0].id);
    }
  }, [selectedHospitalId, networkData]);
  
  // Função para alternar entre modo claro e escuro
  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      
      if (newMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      return newMode;
    });
  };
  
  // Função para atualizar os dados
  const refreshData = () => {
    setIsRefreshing(true);
    
    // Simulação de tempo de atualização
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdate(new Date());
    }, 1500);
  };
  
  // Encontrar hospital atual
  const selectedHospital = selectedHospitalId 
    ? networkData?.hospitals.find(h => h.id === selectedHospitalId) 
    : null;
  
  // Renderizar seletor de hospital
  const renderHospitalSelector = () => {
    return (
      <div className="relative mb-6">
        <button
          onClick={() => setIsHospitalSelectorOpen(!isHospitalSelectorOpen)}
          className="flex items-center justify-between w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-left shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center">
            <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
            <span className="text-gray-800 dark:text-gray-200 font-medium">
              {selectedHospital ? selectedHospital.name : 'Selecione um hospital'}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        </button>
        
        {isHospitalSelectorOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {networkData?.hospitals.map(hospital => (
              <button
                key={hospital.id}
                className={`flex items-center justify-between w-full text-left p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
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
            ))}
            
            {(!networkData?.hospitals || networkData.hospitals.length === 0) && (
              <div className="p-3 text-gray-500 dark:text-gray-400 text-center">
                Nenhum hospital disponível
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Estado de carregamento
  if (networkLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-6 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-10 w-10 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold">Carregando dados de análise de IA...</h2>
        </div>
      </div>
    );
  }
  
  return (
    <AlertsProvider hospitalId={selectedHospitalId || ''} checkInterval={30000}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-6">
        <div className="max-w-8xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              {/* <button 
                onClick={() => history.back()}
                className="mr-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Voltar"
              >
                <ChevronLeft className="h-5 w-5" />
              </button> */}
              
              <div>
                <h1 className="text-2xl font-bold flex items-center">
                  <Bot className="h-7 w-7 text-blue-600 dark:text-blue-400 mr-3" />
                  Análises IA
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedHospital 
                    ? `${selectedHospital.name} | Análise e recomendações baseadas em IA` 
                    : 'Selecione um hospital para visualizar análises de IA'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Atualizado: {lastUpdate.toLocaleTimeString()}
              </span>
              
              <button 
                onClick={refreshData}
                disabled={isRefreshing}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
                aria-label="Atualizar dados"
              >
                <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
              
              <button 
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
                aria-label={isDarkMode ? 'Modo claro' : 'Modo escuro'}
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
              
              <button 
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
                aria-label="Compartilhar"
              >
                <Share2 className="h-5 w-5" />
              </button>
              
              <button 
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
                aria-label="Exportar dados"
              >
                <Download className="h-5 w-5" />
              </button>
              
              <button 
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
                aria-label="Configurações"
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {/* Seletor de Hospital */}
          {renderHospitalSelector()}
          
          {/* Conteúdo principal */}
          <div className="space-y-6">
            {selectedHospital && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Ocupação Total
                  </h3>
                  <p className="text-2xl font-bold">{selectedHospital.metrics.overall.occupancyRate.toFixed(1)}%</p>
                  <div className={`text-xs ${
                    selectedHospital.metrics.overall.periodComparison.occupancy.trend === 'up'
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-green-600 dark:text-green-400'
                  }`}>
                    {selectedHospital.metrics.overall.periodComparison.occupancy.trend === 'up' ? '↑' : '↓'} 
                    {selectedHospital.metrics.overall.periodComparison.occupancy.value.toFixed(1)}% vs. último período
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Pacientes Ativos
                  </h3>
                  <p className="text-2xl font-bold">{selectedHospital.metrics.overall.totalPatients}</p>
                  <div className={`text-xs ${
                    selectedHospital.metrics.overall.periodComparison.patients.trend === 'up'
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-green-600 dark:text-green-400'
                  }`}>
                    {selectedHospital.metrics.overall.periodComparison.patients.trend === 'up' ? '↑' : '↓'} 
                    {selectedHospital.metrics.overall.periodComparison.patients.value} vs. último período
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Leitos Disponíveis
                  </h3>
                  <p className="text-2xl font-bold">{selectedHospital.metrics.overall.availableBeds}</p>
                  <div className={`text-xs ${
                    selectedHospital.metrics.overall.periodComparison.beds.trend === 'up'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {selectedHospital.metrics.overall.periodComparison.beds.trend === 'up' ? '↑' : '↓'} 
                    {selectedHospital.metrics.overall.periodComparison.beds.value} vs. último período
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Permanência Média
                  </h3>
                  <p className="text-2xl font-bold">{selectedHospital.metrics.overall.avgStayDuration.toFixed(1)} dias</p>
                  <div className="text-xs text-blue-600 dark:text-blue-400">
                    Meta: 5.0 dias
                  </div>
                </div>
              </div>
            )}
            
            {/* Dashboard principal de IA */}
            <div className="rounded-lg overflow-hidden shadow-lg">
              {/* Se não houver hospital selecionado, mostra um componente centralizado */}
              {!selectedHospital ? (
                <div className="bg-white dark:bg-gray-800 p-8 flex flex-col items-center justify-center text-center">
                  <Activity className="h-16 w-16 text-gray-200 dark:text-gray-700 mb-4" />
                  <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Selecione um hospital para visualizar análises de IA
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
                    O assistente de IA fornece recomendações inteligentes, análises preditivas e insights
                    personalizados para o hospital selecionado.
                  </p>
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-3 text-blue-700 dark:text-blue-400">
                    <span className="flex items-center">
                      <Building2 className="h-5 w-5 mr-2" />
                      Use o seletor acima para escolher um hospital
                    </span>
                  </div>
                </div>
              ) : (
                <AIDashboard 
                  preSelectedHospitalId={selectedHospitalId ? selectedHospitalId : ''} 
                />
              )}
            </div>
            
            {/* Painel de ajuda */}
            <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2 flex items-center">
                <Bot className="h-5 w-5 mr-2" />
                Sobre a Análise Inteligente
              </h4>
              <p className="text-blue-700 dark:text-blue-400 text-sm">
                Este dashboard utiliza algoritmos de inteligência artificial para analisar os dados hospitalares
                e gerar recomendações para otimizar os recursos e melhorar a eficiência operacional.
                As análises são atualizadas a cada 5 minutos e consideram dados históricos e tendências recentes.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button className="text-xs bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full">
                  Como funciona a IA?
                </button>
                <button className="text-xs bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full">
                  Configurar análises
                </button>
                <button className="text-xs bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full">
                  Perguntar à IA
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AlertsProvider>
  );
};