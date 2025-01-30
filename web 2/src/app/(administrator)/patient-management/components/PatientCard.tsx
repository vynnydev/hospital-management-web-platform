import Image from 'next/image';
import { IGeneratedData, IPatient } from '../types/types';
import { HiSparkles } from 'react-icons/hi'; // ícone de brilho (sparkles)
import { LoadingState } from './LoadingState';

interface PatientCardProps {
  patient: IPatient;
  status: string;
  generatedData: IGeneratedData;
  // Atributos de carregamento de imagens e recomendações geradas por IA (passando para o LoadingState)
  isLoading: boolean;
  loadingMessage?: string;
  loadingProgress?: number;
}

export const PatientCard: React.FC<PatientCardProps> = ({ 
    patient, 
    status, 
    generatedData,
    isLoading,
    loadingMessage = "Gerando imagem...",
    loadingProgress 
}) => { 
    return (
        <div className='bg-gradient-to-br from-teal-400 to-blue-500 dark:from-teal-700 dark:to-blue-700 rounded-xl transform transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-lg p-1'>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 transform transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
                <div className="flex items-center justify-between gap-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg">
                        <Image
                            src="/images/default-avatar.png"
                            alt={patient.personalInfo.name}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-full"
                        />
                    </div>
                    <div className="flex-1 text-right">
                        <p className="font-bold text-lg text-gray-800 dark:text-white">
                            {patient.personalInfo.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-300">
                            Admissão: {new Date(patient.admission.date).toLocaleDateString()}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-1">
                            <span className="px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 text-sm">
                                {status}
                            </span>
                            <span
                                className={`px-2 py-1 rounded-full text-sm ${
                                    patient.aiAnalysis.riskScore > 0.7
                                    ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100'
                                    : patient.aiAnalysis.riskScore > 0.4
                                    ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100'
                                    : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100'
                                }`}
                            >
                                Risco: {(patient.aiAnalysis.riskScore * 100).toFixed(0)}%
                            </span>
                        </div>
                    </div>
                </div>

                {/* Ícone de recomendação IA */}

                <div className="flex items-center mt-4 gap-2 bg-gradient-to-br from-teal-400 to-blue-500 dark:from-teal-700 dark:to-blue-700 rounded-t-lg p-2 text-white">
                    <HiSparkles className="w-5 h-5" />
                    <p className="text-sm">Recomendação da AI</p>
                </div>

                {/* Renderizar a imagem treatmentImage */}
                {generatedData.treatmentImage ? (
                    <div className="relative w-full h-40 rounded-xl overflow-hidden">
                        <Image
                            src={generatedData.treatmentImage}
                            alt="Imagem de tratamento"
                            layout="fill"
                            objectFit="cover"
                            className="rounded-xl"
                        />
                    </div>
                ) : (
                    // Renderiza o componente de loading enquanto a imagem não está disponível
                    <div className="relative w-full h-40 mt-4 bg-gray-200 rounded-xl overflow-hidden">
                    {isLoading ? (
                      <div className="w-full h-full flex flex-col items-center justify-center p-4">
                        <LoadingState 
                          message={loadingMessage}
                          progress={loadingProgress}
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gray-300 dark:bg-gray-700 rounded-xl animate-pulse" />
                    )}
                  </div>
                )}
            </div>
        </div>
    );
};
