/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, AlertCircle, Clock, Users, Bed, RefreshCw } from 'lucide-react';
import { DepartmentBoard } from './DepartmentBoard';
import { PatientCardModal } from './PatientCardModal';
import type { 
  IGeneratedData,
  IHospitalMetrics,
  TFontSize, 
} from '../types/types';
import { IPatient } from '@/types/hospital-network-types';
import {
  getLatestStatus,
  categorizePatients,
  normalizeDepartmentName,
  getDepartmentData
} from '@/utils/patientDataUtils';
import { generateAIContent } from '@/services/AI/aiGenerateRecommendationsAndImagesServices';

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

const MetricCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: number; trend: 'up' | 'down' };
  loading: boolean;
}> = ({ title, value, icon, trend, loading }) => (
  <div className="relative overflow-hidden bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg 
                 transition-all duration-300 hover:shadow-xl">
    {loading ? (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      </div>
    ) : (
      <>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-500 dark:text-gray-400 font-medium">{title}</h3>
          <div className="p-2.5 bg-primary/10 dark:bg-primary/20 rounded-lg">
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

export const PatientTaskManagement: React.FC<PatientTaskManagementProps> = ({
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
  const [selectedPatient, setSelectedPatient] = useState<IPatient | null>(null);
  const [generatedData, setGeneratedData] = useState<IGeneratedData>({});
  const [aiQuery, setAiQuery] = useState('');
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [showAudioControls, setShowAudioControls] = useState(false);
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [synthesis, setSynthesis] = useState<SpeechSynthesis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('');

  // Usar a função categorizePatients do utilitário
  const categorizedPatients = categorizePatients(patients, departments);

  // Verificações de departamento usando utilitários
  const normalizedArea = selectedArea ? normalizeDepartmentName(selectedArea) : '';
  const departmentData = selectedArea ? getDepartmentData(data, selectedArea) : null;
  const isDepartmentAvailable = selectedArea && departmentData;

  // Event listeners
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.altKey && e.key === 'c') setIsHighContrast(prev => !prev);
      if (e.altKey && e.key === 'a') setShowAudioControls(prev => !prev);
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onClose]);

  // Clean up do áudio
  useEffect(() => {
    return () => {
      if (synthesis) {
        synthesis.cancel();
      }
    };
  }, [synthesis]);

  const handlePatientSelect = (patient: IPatient | null) => {
    setSelectedPatient(patient);
    onSelectPatient(patient);
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

  return (
    <div className='py-2 bg-gradient-to-r from-blue-700 to-cyan-700 rounded-md shadow-md'>
      <div className="w-full space-y-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
        <div className={`relative ${error ? 'opacity-50' : ''}`}>
          {/* Métricas em Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
            <MetricCard
              title="Taxa de Ocupação"
              value={`${data.overall.occupancyRate}%`}
              icon={<Users className="w-6 h-6 text-primary" />}
              trend={data.overall.periodComparison.occupancy}
              loading={loading}
            />
            <MetricCard
              title="Leitos Disponíveis"
              value={data.overall.availableBeds}
              icon={<Bed className="w-6 h-6 text-primary" />}
              trend={data.overall.periodComparison.beds}
              loading={loading}
            />
            <MetricCard
              title="Tempo Médio de Internação"
              value={`${data.overall.avgStayDuration} dias`}
              icon={<Clock className="w-6 h-6 text-primary" />}
              loading={loading}
            />
          </div>

          {/* Área Principal */}
          {isDepartmentAvailable && departmentData ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <DepartmentBoard
                data={data}
                selectedArea={normalizedArea}
                patients={patients.filter(patient => {
                  const status = getLatestStatus(patient);
                  return status && normalizeDepartmentName(status.department) === normalizedArea;
                })}
                setSelectedPatient={handlePatientSelect}
                generatedData={generatedData}
                isLoading={isLoading}
                loadingMessage={loadingMessage}
                loadingProgress={loadingProgress} 
                generateData={handleAIGeneration}
              />
            </div>
          ) : (
            renderNoAreaSelected()
          )}

          {/* Modal do Paciente */}
          {selectedPatient && (
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
              generateData={handleAIGeneration}          
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