/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, AlertCircle, Clock, Users, Bed, RefreshCw } from 'lucide-react';
import { PatientBoard } from './PatientBoard';
import { PatientCardModal } from './PatientCardModal';
import { PatientCalendar } from './PatientCalendar';
import { IHospitalMetrics, IPatient } from '@/types/hospital-network-types';
import {
  getLatestStatus,
  categorizePatients,
  normalizeDepartmentName,
  getDepartmentData,
  filterPatientsByDepartment
} from '@/utils/patientDataUtils';
import { generateAIContent } from '@/services/AI/aiGenerateRecommendationsAndImagesServices';
import { PatientViewListMenuBar } from '@/components/ui/templates/PatientViewListMenuBar';
import { ViewType } from '@/types/app-types';
import { PatientListView } from './PatientListView';
import { useNetworkData } from '@/services/hooks/useNetworkData';
import { TFontSize } from '@/types/utils-types';
import { IGeneratedData } from '@/types/ai-types';

// Interface Props mantém-se a mesma
interface PatientTaskManagementProps {
  data: IHospitalMetrics;
  patients: IPatient[];
  selectedArea: string;
  onSelectPatient: (patient: IPatient | null) => void;
  departments: Record<string, string[]>;
  onClose: () => void;
  fontSize: TFontSize;
  setFontSize: (size: TFontSize) => void;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

// Componente PatientPatientMetricCard mantém-se o mesmo
const PatientMetricCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: number; trend: 'up' | 'down' };
  loading: boolean;
  subtitle?: string;
  color?: string;
}> = ({ title, value, icon, trend, loading, subtitle, color = 'primary' }) => (
  <div className={`relative overflow-hidden bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg 
                 transition-all duration-300 hover:shadow-xl border-l-4 border-${color}`}>
    {loading ? (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
      </div>
    ) : (
      <>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-gray-500 dark:text-gray-400 font-medium">{title}</h3>
            {subtitle && (
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          <div className={`p-2.5 bg-${color}/10 dark:bg-${color}/20 rounded-lg`}>
            {icon}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          {trend && (
            <span className={trend.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
              {trend.trend === 'up' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
            </span>
          )}
        </div>
      </>
    )}
  </div>
);

export const PatientManagement: React.FC<PatientTaskManagementProps> = ({
  data,
  patients,
  selectedArea,
  onSelectPatient,
  departments,
  onClose,
  fontSize,
  setFontSize,
  loading,
  error,
  onRetry
}) => {
  // Estados principais
  const { currentUser } = useNetworkData();
  const [selectedPatient, setSelectedPatient] = useState<IPatient | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>('board');
  const [filteredPatients, setFilteredPatients] = useState<IPatient[]>(patients);
  const [searchQuery, setSearchQuery] = useState('');
  const [isChangingView, setIsChangingView] = useState(false);

  // Estados para IA e acessibilidade
  const [generatedData, setGeneratedData] = useState<IGeneratedData>({});
  const [aiQuery, setAiQuery] = useState('');
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [showAudioControls, setShowAudioControls] = useState(false);
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [synthesis, setSynthesis] = useState<SpeechSynthesis | null>(null);
  
  // Estados de loading
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('');

  // Utilitários e verificações de departamento
  const normalizedArea = selectedArea ? normalizeDepartmentName(selectedArea) : '';
  const departmentData = selectedArea ? getDepartmentData(data, selectedArea) : null;
  const isDepartmentAvailable = selectedArea && departmentData;

  // Efeito para atualizar pacientes filtrados quando mudar a área selecionada ou a busca
  useEffect(() => {
    let result = patients;
    
    if (normalizedArea) {
      result = filterPatientsByDepartment(result, normalizedArea, normalizeDepartmentName);
    }
    
    if (searchQuery) {
      result = result.filter(patient => 
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.id.toString().includes(searchQuery) ||
        patient.diagnosis.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredPatients(result);
  }, [patients, normalizedArea, searchQuery]);

  // Event listeners para teclas de atalho
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.altKey && e.key === 'c') setIsHighContrast(prev => !prev);
      if (e.altKey && e.key === 'a') setShowAudioControls(prev => !prev);
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onClose]);

  // Cleanup do áudio
  useEffect(() => {
    return () => {
      if (synthesis) {
        synthesis.cancel();
      }
    };
  }, [synthesis]);

  // Handlers
  const handleViewChange = (view: ViewType) => {
    setIsChangingView(true); // Indica que está mudando de view
    setCurrentView(view);
    
    switch (view) {
      case 'board':
        setSearchQuery('');
        setSelectedPatient(null); // Limpa a seleção ao mudar para board
        setFilteredPatients(filterPatientsByDepartment(patients, normalizedArea, normalizeDepartmentName));
        break;
      case 'list':
        setSelectedPatient(null); // Limpa a seleção ao mudar para list
        break;
      case 'calendar':
        // Mantém o selectedPatient apenas para o calendário
        break;
    }

    // Reseta o estado após um pequeno delay para garantir que a transição seja suave
    setTimeout(() => {
      setIsChangingView(false);
    }, 100);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handlePatientSelect = (patient: IPatient | null) => {
    if (currentView === 'calendar') {
      // No calendário, apenas atualiza o estado interno
      setSelectedPatient(patient);
    } else {
      // Nas outras views, atualiza o estado e notifica o componente pai
      setSelectedPatient(patient);
      onSelectPatient(patient);
    }
  };

  const handleAIGeneration = async (patient: IPatient) => {
    try {
      setIsLoading(true);
      const result = await generateAIContent(patient, {
        onStart: () => {
          setLoadingProgress(0);
          setLoadingMessage('Iniciando geração...');
        },
        onProgress: (progress, message) => {
          setLoadingProgress(progress);
          setLoadingMessage(message);
        },
        onComplete: () => {
          setIsLoading(false);
        },
        onError: (error) => {
          console.error('Erro na geração:', error);
          setIsLoading(false);
        }
      });

      setGeneratedData(result);
    } catch (error) {
      console.error('Erro ao gerar dados:', error);
      setIsLoading(false);
    }
  };

  const handleSphereButtonGeneration = async () => {
    if (!selectedPatient) return;
    await handleAIGeneration(selectedPatient);
  };

  const renderNoAreaSelected = () => (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 
                   rounded-xl p-8 text-center shadow-lg">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="p-4 bg-gray-100 dark:bg-gray-700/50 rounded-full">
          <AlertCircle className="w-8 h-8 text-gray-500 dark:text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
          Selecione um departamento
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-md">
          Escolha um departamento para visualizar informações detalhadas e gerenciar pacientes
        </p>
      </div>
    </div>
  );

  const renderMetricsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
      <PatientMetricCard
        title="Taxa de Ocupação"
        value={`${data.overall.occupancyRate}%`}
        subtitle={`${data.overall.totalPatients} pacientes internados`}
        icon={<Users className="w-6 h-6 text-primary" />}
        trend={data.overall.periodComparison.occupancy}
        loading={loading}
        color="primary"
      />
      <PatientMetricCard
        title="Leitos Disponíveis"
        value={data.overall.availableBeds}
        subtitle={`De um total de ${data.overall.totalBeds} leitos`}
        icon={<Bed className="w-6 h-6 text-blue-500" />}
        trend={data.overall.periodComparison.beds}
        loading={loading}
        color="blue"
      />
      <PatientMetricCard
        title="Tempo Médio de Internação"
        value={`${data.overall.avgStayDuration} dias`}
        subtitle={`Taxa de rotatividade: ${data.overall.turnoverRate}`}
        icon={<Clock className="w-6 h-6 text-green-500" />}
        loading={loading}
        color="green"
      />
    </div>  
  );

  return (
    <div className="flex flex-col bg-gradient-to-r from-blue-700 to-cyan-700 py-1 rounded-xl">
      <div className="flex-1 p-4 space-y-4 bg-gray-100 dark:bg-gray-800 overflow-hidden rounded-xl">
        <div className={`flex flex-col ${error ? 'opacity-50' : ''}`}>
          {/* Barra de navegação e pesquisa */}
          <PatientViewListMenuBar
            currentView={currentView}
            onViewChange={handleViewChange}
            onSearch={handleSearch}
          />

          {/* Área principal com altura flexível */}
          {isDepartmentAvailable && departmentData ? (
            <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              {currentView === 'board' ? (
                <>
                  {/* Métricas em Cards */}
                  {renderMetricsCards()}               
                  <PatientBoard
                    data={data}
                    selectedArea={normalizedArea}
                    patients={filteredPatients}
                    setSelectedPatient={handlePatientSelect}
                    generatedData={generatedData}
                    isLoading={isLoading}
                    loadingMessage={loadingMessage}
                    loadingProgress={loadingProgress} 
                    generateData={handleAIGeneration}
                  />
                </>
              ) : currentView === 'list' ? (
                <>
                  {/* Métricas em Cards */}
                  {renderMetricsCards()}                
                  <PatientListView
                    patients={filteredPatients}
                    onSelectPatient={handlePatientSelect}
                  />
                </>
              ) : currentView === 'calendar' ? (
                <div className="mt-0">
                  <PatientCalendar
                    patients={filteredPatients}
                    currentUser={currentUser}
                    selectedPatient={selectedPatient}
                    onSelectPatient={handlePatientSelect}
                  />
                </div>
              ) : null}
            </div>
          ) : (
            <>            
              {renderMetricsCards()}
              {renderNoAreaSelected()}
            </>
          )}

          {/* Modal do Paciente - Modificado para não aparecer na view de calendário */}
          {selectedPatient && currentView !== 'calendar' && !isChangingView && (
            <PatientCardModal
              selectedPatient={selectedPatient}
              setSelectedPatient={handlePatientSelect}
              isHighContrast={isHighContrast}
              setIsHighContrast={setIsHighContrast}
              showAudioControls={showAudioControls}
              setShowAudioControls={setShowAudioControls}
              fontSize={fontSize}
              setFontSize={setFontSize}
              aiQuery={aiQuery}
              setAiQuery={setAiQuery}
              setCurrentUtterance={setCurrentUtterance}
              setSynthesis={setSynthesis}
              synthesis={synthesis}
              generatedData={generatedData}
              isLoading={isLoading}
              onGenerateRecommendation={handleSphereButtonGeneration}
            />
          )}
        </div>

        {/* Mensagem de Erro */}
        {error && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 
                        rounded-xl shadow-lg border border-red-200 dark:border-red-800 p-4 
                        w-full max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <div>
                  <h3 className="font-medium text-red-500">Erro ao carregar dados</h3>
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              </div>
              <button
                onClick={onRetry}
                className="inline-flex items-center space-x-2 px-3 py-1.5 bg-red-500 hover:bg-red-600 
                        text-white text-sm rounded-md transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Tentar novamente</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};