/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useRef } from 'react';
import { TFontSize } from '@/types/utils-types';
import { IGeneratedData } from '@/types/ai-types';
import { AIPatientAssistant } from './AIPatientAssistant';
import { IPatient } from '@/types/hospital-network-types';
import { FileUpload } from './patient-card-modal/FileUploadPatientModal';
import { AccessibilityBar } from './patient-card-modal/AccessibilityBar';
import { PatientHeader } from './patient-card-modal/PatientHeader';
import { VitalsChart } from './patient-card-modal/VitalsChart';
import { RiskAnalysis } from './patient-card-modal/RiskAnalysis';
import { MediMindAI } from './patient-card-modal/MediMindAI';
import { ReportsSlider } from './patient-card-modal/ReportsSlider';
import { StatusHistory } from './patient-card-modal/StatusHistory';
import { BedInformation } from './patient-card-modal/BedInformation';

interface FileUploadProps {
    onFileUpload?: (files: File[]) => void;
    maxFileSize?: number;         // Personalizar tamanho máximo
    acceptedTypes?: string[];     // Personalizar tipos aceitos
    maxFiles?: number;           // Limitar número de arquivos
    className?: string;          // Estilização adicional
}

interface UploadResponse {
    success: boolean;
    message: string;
    fileId?: string;
}

interface PatientCardModalProps {
    selectedPatient: IPatient | null;
    setSelectedPatient: (patient: IPatient | null) => void;
    isHighContrast: boolean;
    setIsHighContrast: React.Dispatch<React.SetStateAction<boolean>>;
    setShowAudioControls: React.Dispatch<React.SetStateAction<boolean>>;
    showAudioControls: boolean;
    setFontSize: (size: TFontSize) => void;
    fontSize: TFontSize;
    aiQuery: string;
    setAiQuery: React.Dispatch<React.SetStateAction<string>>;
    generatedData: IGeneratedData;
    setCurrentUtterance: React.Dispatch<React.SetStateAction<SpeechSynthesisUtterance | null>>;
    setSynthesis: React.Dispatch<React.SetStateAction<SpeechSynthesis | null>>;
    synthesis: SpeechSynthesis | null;
    onGenerateRecommendation?: () => Promise<void>;
    isLoading?: boolean;
}

export const PatientCardModal = ({
    selectedPatient,
    setSelectedPatient,
    ...props
  }: PatientCardModalProps) => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiResponse, setAiResponse] = useState("");

    if (!selectedPatient) return null;

    const getContrastClass = (baseClass: string) => {
        if (!props.isHighContrast) return baseClass;
        return `${baseClass} contrast-high brightness-110`;
    };

    // Função para processar os arquivos após validação
    const processFiles = async (files: File[]): Promise<UploadResponse[]> => {
        const results: UploadResponse[] = [];
        
        for (const file of files) {
            try {
            const formData = new FormData();
            formData.append('file', file);
            
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            results.push(result);
            } catch (error) {
            results.push({
                success: false,
                message: `Erro ao processar ${file.name}: ${error}`
            });
            }
        }
        
        return results;
    };

    // Função para lidar com o upload de arquivos
    const handleUpload = async (files: File[]) => {
        try {
            setIsUploading(true);
            const validFiles = files.filter(file => {
            const isValidType = file.name.match(/\.(xls|xlsx)$/i);
            const isValidSize = file.size <= 25 * 1024 * 1024;
            return isValidType && isValidSize;
            });
    
            if (validFiles.length > 0) {
            const results = await processFiles(validFiles);
            setUploadStatus('Upload concluído com sucesso!');
            } else {
            setUploadStatus('Nenhum arquivo válido para upload.');
            }
        } catch (error) {
            setUploadStatus('Erro durante o upload.');
            console.error(error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleQuestionSelect = async (question: string) => {
        setIsGenerating(true);
        try {
          if (props.onGenerateRecommendation) {
            await props.onGenerateRecommendation();
            setAiResponse("Analisando dados do paciente...");
          }
        } catch (error) {
          setAiResponse("Erro ao processar pergunta.");
        } finally {
          setIsGenerating(false);
        }
    };
    
    const handleGenerateProtocol = () => {
        setIsGenerating(true);
        setTimeout(() => setIsGenerating(false), 2000);
    };

    const mockReports = [
        { title: "Análise de Evolução Clínica", date: "2024-01-08", type: "Clínico" },
        { title: "Avaliação de Riscos", date: "2024-01-07", type: "Risco" },
        { title: "Relatório de Medicações", date: "2024-01-06", type: "Medicação" },
        { title: "Análise de Exames", date: "2024-01-05", type: "Exames" }
    ];
  
    return (
      <div className='p-12'>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={getContrastClass("p-8 bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto")}>
            <AccessibilityBar {...props} />
            <PatientHeader patient={selectedPatient} onClose={() => setSelectedPatient(null)} />
            <AIPatientAssistant {...props} selectedPatient={selectedPatient} />
            <VitalsChart patientData={selectedPatient} />
            <div className="flex flex-row gap-4 mt-8 mb-12">
              <RiskAnalysis patient={selectedPatient} />
              <FileUpload onFileUpload={handleUpload} className="h-full" />
            </div>
            <MediMindAI 
                onQuestionSelect={handleQuestionSelect}
                isGenerating={isGenerating}
                aiResponse={aiResponse}
                onGenerateProtocol={handleGenerateProtocol}
            />
            <ReportsSlider reports={mockReports} />
            <StatusHistory 
              statusHistory={selectedPatient.careHistory?.statusHistory}
              expectedDischarge={selectedPatient.expectedDischarge}
            />
            <BedInformation patient={selectedPatient} />
          </div>
        </div>
      </div>
    );
  };