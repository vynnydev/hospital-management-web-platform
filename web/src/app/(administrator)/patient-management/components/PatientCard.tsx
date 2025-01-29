import Image from 'next/image';
import { IGeneratedData } from '../types/types';
import { HiSparkles } from 'react-icons/hi'; // ícone de brilho (sparkles)
import { LoadingState } from './LoadingState';
import { IPatient } from '@/types/hospital-network-types';

interface PatientCardProps {
    patient: IPatient;
    status: string;
    generatedData: IGeneratedData;
    isLoading: boolean;
    loadingMessage?: string;
    loadingProgress?: number;
}

export const PatientCard: React.FC<PatientCardProps> = ({ 
    patient,
    status,
    generatedData,
    isLoading,
    loadingMessage = "Carregando imagem...",
    loadingProgress
}) => {
    const getLatestStatus = () => {
        return patient.careHistory?.statusHistory?.[0] || null;
    };
    
    const latestStatus = getLatestStatus();

    return (
        <div className="bg-gradient-to-br from-teal-400 to-blue-500 dark:from-teal-700 dark:to-blue-700 rounded-xl p-1">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <p className="font-bold text-lg text-gray-800 dark:text-white">
                  {patient.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  Admissão: {new Date(patient.admissionDate).toLocaleDateString()}
                </p>
                
                {latestStatus && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 text-sm">
                      {latestStatus.status}
                    </span>
                    <span className="px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 text-sm">
                      {latestStatus.specialty}
                    </span>
                  </div>
                )}
    
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {patient.diagnosis}
                </p>
              </div>
            </div>
    
            {/* Área de Loading e Dados Gerados */}
            {isLoading ? (
              <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{loadingMessage}</span>
                  {loadingProgress !== undefined && (
                    <span className="text-sm text-gray-500">({loadingProgress}%)</span>
                  )}
                </div>
              </div>
            ) : (
              generatedData.treatmentImage && (
                <div className="mt-4 relative w-full h-40 rounded-lg overflow-hidden">
                  <img
                    src={generatedData.treatmentImage}
                    alt="Visualização do tratamento"
                    className="w-full h-full object-cover"
                  />
                </div>
              )
            )}
          </div>
        </div>
    );
};