import Image from 'next/image';
import { IGeneratedData } from '../types/types';
import { HiSparkles } from 'react-icons/hi';
import { IPatient } from '@/types/hospital-network-types';
import { QRCodeSVG } from 'qrcode.react';
import {
    getPatientVitals,
    getLatestStatus
} from '@/utils/patientDataUtils';

interface PatientCardProps {
    patient: IPatient;
    status: string;
    generatedData: IGeneratedData;
    isLoading: boolean;
    loadingMessage?: string;
    loadingProgress?: number;
    onGenerateImage?: () => void;
}

export const PatientCard: React.FC<PatientCardProps> = ({ 
    patient,
    generatedData,
    isLoading,
    loadingMessage = "Carregando imagem...",
    loadingProgress,
    onGenerateImage
}) => {
    const latestStatus = getLatestStatus(patient);
    const vitals = getPatientVitals(patient);

    // Função para formatar os dados do QR Code de forma mais concisa
    const generateQRCodeData = () => {
        try {
            const patientData = {
                id: patient.id,
                name: patient.name,
                diag: patient.diagnosis?.substring(0, 50), // Limitando tamanho
                adm: patient.admissionDate,
                status: {
                    current: latestStatus?.status,
                    dept: latestStatus?.department,
                    spec: latestStatus?.specialty,
                },
                vitals: {
                    hr: vitals.heartRate,
                    temp: vitals.temperature,
                    ox: vitals.oxygenSaturation
                }
            };

            return JSON.stringify(patientData);
        } catch (error) {
            console.error('Erro ao gerar dados do QR Code:', error);
            // Fallback com dados mínimos
            return JSON.stringify({
                id: patient.id,
                name: patient.name
            });
        }
    };

    return (
        <div className="bg-gradient-to-br from-blue-500 to-teal-400 dark:from-blue-700 dark:to-teal-700 rounded-xl p-1">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                
                <div className="flex items-start justify-between gap-4 relative">
                    <div className="flex-1 flex-col">
                        <div>
                          <p className="font-bold text-lg text-gray-800 dark:text-white">
                              {patient.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-300">
                              Admissão: {new Date(patient.admissionDate).toLocaleDateString()}
                          </p>
                          
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                              {patient.diagnosis}
                          </p>
                        </div>
                    </div>

                    {/* QR Code Otimizado */}
                    <div className="flex-shrink-0 group relative">
                        <div className="bg-white p-2 rounded-lg shadow-md transform transition-all duration-300 hover:shadow-lg">
                            <QRCodeSVG
                                value={generateQRCodeData()}
                                size={80}
                                level="L"
                                className="w-20 h-20"
                            />
                            {/* Tooltip mais simples */}
                            <div className="absolute -bottom-1 right-0 transform translate-y-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-40 p-2 bg-gray-800 text-xs text-white rounded shadow-lg z-10">
                                Escaneie para ver detalhes do paciente
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                  {latestStatus && (
                      <div className="flex flex-row gap-2">
                          {/* <span className="px-3 py-1 rounded-full bg-blue-100/80 dark:bg-blue-900/80 text-blue-800 dark:text-blue-100 text-sm font-medium">
                              {latestStatus.status}
                          </span> */}
                          <span className="px-3 py-1 rounded-full bg-green-100/80 dark:bg-green-900/80 text-green-800 dark:text-green-100 text-sm font-medium">
                              {latestStatus.specialty}
                          </span>
                      </div>
                  )}
                </div>
        
                {/* Área de Loading e Dados Gerados */}
                <div className="mt-4">
                  {isLoading ? (
                    <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{loadingMessage}</span>
                        {loadingProgress !== undefined && (
                          <span className="text-sm text-gray-500">({loadingProgress}%)</span>
                        )}
                      </div>
                    </div>
                  ) : generatedData.treatmentImage ? (
                    <div className="relative w-full h-40 rounded-lg overflow-hidden">
                      <Image
                        src={generatedData.treatmentImage}
                        alt="Visualização do tratamento"
                        className="w-full h-full object-cover"
                        width={40}
                        height={40}
                      />
                    </div>
                  ) : (
                    <button
                      onClick={onGenerateImage}
                      className="w-full p-4 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <HiSparkles className="w-6 h-6 text-blue-500" />
                        <div className="text-left">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Gerar Recomendação</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Clique para gerar uma imagem com recomendações de IA
                          </p>
                        </div>
                      </div>
                    </button>
                  )}
                </div>
            </div>
        </div>
    );
};