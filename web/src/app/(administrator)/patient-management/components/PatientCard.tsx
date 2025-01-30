/* eslint-disable @typescript-eslint/no-unused-vars */
import { IGeneratedData } from '../types/types';
import { IPatient } from '@/types/hospital-network-types';
import { QRCodeSVG } from 'qrcode.react';
import {
    getPatientVitals,
    getLatestStatus
} from '@/utils/patientDataUtils';
import { AIRecommendationCardPressable } from './AI/AIRecommendationCardPressable';

interface PatientCardProps {
    patient: IPatient;
    status: string;
    generatedData: IGeneratedData;
    isLoading: boolean;
    loadingMessage?: string;
    loadingProgress?: number;
    onCardClick?: (patient: IPatient) => void;
    onGenerateRecommendation?: (patient: IPatient) => void;
}

export const PatientCard: React.FC<PatientCardProps> = ({ 
    patient,
    generatedData,
    isLoading,
    loadingMessage = "Carregando imagem...",
    loadingProgress,
    onCardClick,
    onGenerateRecommendation
}) => {
    const latestStatus = getLatestStatus(patient);
    const vitals = getPatientVitals(patient);

    // Manipulador para o clique no card principal
    const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // Previne a propagação se o clique vier do AIRecommendationCardPressable
        if (!(e.target as HTMLElement).closest('.ai-recommendation-card')) {
            e.stopPropagation();
            onCardClick?.(patient);
        }
    };

    // Manipulador específico para gerar recomendação
    const handleGenerateRecommendation = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation(); // Previne a propagação do clique
        onGenerateRecommendation?.(patient);
    };

    const generateQRCodeData = () => {
        try {
            const patientData = {
                id: patient.id,
                name: patient.name,
                diag: patient.diagnosis?.substring(0, 50),
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
            return JSON.stringify({ id: patient.id, name: patient.name });
        }
    };

    return (
        <div 
            className="bg-gradient-to-br from-blue-500 to-teal-400 dark:from-blue-700 dark:to-teal-700 rounded-xl p-1 cursor-pointer"
            onClick={handleCardClick}
        >
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

                    <div className="flex-shrink-0 group relative">
                        <div className="bg-white p-2 rounded-lg shadow-md transform transition-all duration-300 hover:shadow-lg">
                            <QRCodeSVG
                                value={generateQRCodeData()}
                                size={80}
                                level="L"
                                className="w-20 h-20"
                            />
                            <div className="absolute -bottom-1 right-0 transform translate-y-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-40 p-2 bg-gray-800 text-xs text-white rounded shadow-lg z-10">
                                Escaneie para ver detalhes do paciente
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    {latestStatus && (
                        <div className="flex flex-row gap-2">
                            <span className="px-3 py-1 rounded-full bg-green-100/80 dark:bg-green-900/80 text-green-800 dark:text-green-100 text-sm font-medium">
                                {latestStatus.specialty}
                            </span>
                        </div>
                    )}
                </div>
        
                {/* Área de Recomendação IA */}
                <div className="ai-recommendation-card">
                    <AIRecommendationCardPressable
                        onGenerateImage={handleGenerateRecommendation}
                        isLoading={isLoading}
                        loadingMessage={loadingMessage}
                        loadingProgress={loadingProgress}
                        generatedData={generatedData}                
                    />
                </div>
            </div>
        </div>
    );
};