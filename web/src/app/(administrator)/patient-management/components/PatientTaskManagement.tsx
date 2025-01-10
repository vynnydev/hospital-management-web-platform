/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";

import { GeneratedData, GeneratedImages, Metrics, Patient } from "../types/types";
import { VitalSign } from "../types/types";
import { 
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

import { HfInference } from "@huggingface/inference";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { DepartmentBoard } from "./DepartmentBoard";
import { generateEnhancedPrompt } from "./functions/AI/aiAssistantPatientBoard";
import { PatientCardModal } from "./PatientCardModal";
import { isValidBase64Image } from "@/components/ui/aida-assistant/report-modal-ai/services/functions/imagePresenter";

const hfInference = new HfInference(process.env.HUGGING_FACE_API_KEY!);
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

type FontSize = 'small' | 'normal' | 'large' | 'extra-large';

interface Props {
  data: Metrics,
  patients: Patient[];
  selectedArea: string;
  onSelect: (patient: Patient) => void;
  departments: Record<string, string[]>;
  onClose: () => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
}

export const PatientTaskManagement: React.FC<Props> = ({
  patients,
  selectedArea,
  onSelect,
  departments,
  data,
  onClose,
  fontSize,
  setFontSize
}) => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [generatedData, setGeneratedData] = useState<GeneratedData>({});
  const [generatedImages, setGeneratedImages] = useState<GeneratedImages>({});
  const [aiQuery, setAiQuery] = useState('');
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [showAudioDescription, setShowAudioDescription] = useState(false);
  const [showAudioControls, setShowAudioControls] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<SpeechSynthesisUtterance | null>(null);
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [synthesis, setSynthesis] = useState<SpeechSynthesis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('');

  const categorizedPatients: Record<string, Record<string, Patient[]>> = {};

  Object.keys(departments).forEach((department) => {
    categorizedPatients[department] = {};
    departments[department].forEach((status) => {
      categorizedPatients[department][status] = [];
    });
  });
  // console.log("Departamentos com seus status:", departments)

  patients.forEach((patient: Patient) => {
    const latestStatus = patient?.admission?.statusHistory?.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )[0];

    const department = latestStatus?.department?.trim().toLowerCase() || "sem departamento";
    const status = latestStatus?.status?.trim().toLowerCase() || "status desconhecido";

    if (!categorizedPatients[department]) {
      categorizedPatients[department] = {};
    }
    if (!categorizedPatients[department][status]) {
      categorizedPatients[department][status] = [];
    }
    categorizedPatients[department][status].push(patient);
  });

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.altKey && e.key === 'c') setIsHighContrast(prev => !prev);
      if (e.altKey && e.key === 'a') setShowAudioControls(prev => !prev);
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onClose]);

  // Clean up do áudio quando o componente for desmontado
  useEffect(() => {
    return () => {
      if (synthesis) {
        synthesis.cancel();
      }
    };
  }, [synthesis]);

  const processImageResponse = async (response: Blob): Promise<string> => {
          if (response.size === 0) {
              throw new Error('Blob vazio recebido');
          }
  
          return new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                  const result = reader.result as string;
                  if (!result || !isValidBase64Image(result)) {
                      reject(new Error('Imagem base64 inválida gerada'));
                  } else {
                      resolve(result);
                  }
              };
              reader.onerror = () => reject(new Error('Erro ao ler blob'));
              reader.readAsDataURL(response);
          });
    }

  // Constantes para configuração
  const IMAGE_MODELS = {
    STABLE_DIFFUSION: "stabilityai/stable-diffusion-3.5-large",
    FLUX_DEV: "black-forest-labs/FLUX.1-dev", // Alternativa mais rápida
    FLUX_SCHNELL: "black-forest-labs/FLUX.1-schnell" // Alternativa mais rápida ainda
  } as const;

  const IMAGE_PARAMETERS = {
    negative_prompt: "texto, palavras, letras, números, baixa qualidade, borrado, pessoas, rostos humanos",
    num_inference_steps: 50, // Aumentei para melhor qualidade
    guidance_scale: 8.5, // Aumentei um pouco para mais precisão
  };

  const generateData = async (patient: Patient): Promise<void> => {
    setIsLoading(true);
    setLoadingProgress(0);
    setLoadingMessage('Iniciando geração...');
    console.time('generateData');
    const enhancedPrompt = generateEnhancedPrompt(patient);
    
    try {
      setLoadingProgress(20);
      setLoadingMessage('Gerando recomendações...');
      const [recommendationResult, imageResult] = await Promise.all([
        genAI
          .getGenerativeModel({ model: "gemini-pro" })
          .generateContent({
            contents: [{ role: 'user', parts: [{ text: enhancedPrompt }]}],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            },
          })
          .then((res) => {
            console.log('Recomendação gerada com sucesso');
            return res.response.text();
          })
          .catch((error) => {
            console.error('Erro ao gerar recomendação:', error);
            throw new Error('Falha ao gerar recomendação');
          }),
  
        generateImage(enhancedPrompt)
          .then((result) => {
            console.log('Primeira imagem gerada com sucesso');
            return result;
          })
          .catch((error) => {
            console.error('Erro ao gerar primeira imagem:', error);
            throw new Error('Falha ao gerar primeira imagem');
          })
      ]);
  
      console.log('Gerando imagem do plano de cuidados...');
      const latestVitals = patient.treatment.vitals[patient.treatment.vitals.length - 1];
      
      const carePlanPrompt = generateCarePlanPrompt(patient, latestVitals);
      
      const carePlanImage = await generateImage(carePlanPrompt)
        .catch((error) => {
          console.error('Erro ao gerar imagem do plano de cuidados:', error);
          throw new Error('Falha ao gerar imagem do plano de cuidados');
        });
  
      setLoadingProgress(60);
      setLoadingMessage('Gerando imagem do plano de cuidados...');
      console.log('Todas as gerações concluídas com sucesso');
  
      setGeneratedData({
        recommendation: recommendationResult,
        treatmentImage: imageResult,
        carePlanImage: carePlanImage,
      } as GeneratedData);
      
      setGeneratedImages((prev: GeneratedImages) => ({
        ...prev,
        [patient.id]: { treatment: imageResult, carePlan: carePlanImage }
      }));
  
      console.timeEnd('generateData');
      // Removido o return do GeneratedData

      setLoadingProgress(100);
      setLoadingMessage('Concluído!');
    } catch (error: any) {
      console.error('Erro durante a geração de dados:', {
        error: error.message,
        stack: error.stack,
        patientId: patient.id
      });
  
      setGeneratedData({
        recommendation: `Erro ao gerar recomendação: ${error.message}. Por favor, tente novamente.`,
        treatmentImage: undefined,
        carePlanImage: undefined,
      });
      setLoadingMessage('Erro ao gerar recomendação!');
  
      throw error;
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        setLoadingProgress(0);
        setLoadingMessage('');
      }, 1000);
    }
  };

  // Função auxiliar para geração de imagens
  const generateImage = async (prompt: string) => {
    console.time('generateImage');
    
    try {
      const result = await hfInference
        .textToImage({
          inputs: prompt,
          parameters: IMAGE_PARAMETERS,
          model: IMAGE_MODELS.FLUX_SCHNELL, // Você pode trocar para FLUX_DEV ou FLUX_SCHNELL
        });
      
      console.timeEnd('generateImage');
      return processImageResponse(result);
    } catch (error) {
      console.timeEnd('generateImage');
      throw error;
    }
  };

  // Função auxiliar para gerar prompt do plano de cuidados
  const generateCarePlanPrompt = (patient: Patient, latestVitals: any) => {
    return `Representação visual técnica e detalhada em português brasileiro:
      - TIPO: Diagrama médico técnico hospitalar
      - CONTEÚDO: Fluxograma de monitoramento de sinais vitais
      - DADOS: FC ${latestVitals.heartRate}bpm | Temp ${latestVitals.temperature}°C | SatO2 ${latestVitals.oxygenSaturation}%
      - ESTILO: Diagrama profissional médico, alto contraste
      - ELEMENTOS: Equipamentos médicos, gráficos de monitoramento, símbolos hospitalares
      - LAYOUT: Organizado em grade com setas de fluxo
      - CORES: Esquema profissional hospitalar
      - TEXTO: Todas as legendas em português do Brasil
      - ATENÇÃO: Sem pessoas, sem rostos, apenas equipamentos e diagramas`;
  };

  return (
    <div className="w-full">
      <div className="col-span-full bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400">Taxa de Ocupação</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {data.overall.occupancyRate}%
              {data.overall.periodComparison.occupancy.trend === 'up' ? 
                <TrendingUp className="inline ml-2 w-5 h-5 text-green-500" /> : 
                <TrendingDown className="inline ml-2 w-5 h-5 text-red-500" />}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400">Leitos Disponíveis</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {data.overall.availableBeds}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400">Tempo Médio de Internação</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {data.overall.avgStayDuration} dias
            </p>
          </div>
        </div>
      </div>

      {selectedArea && data.departmental[selectedArea] ? (
          <DepartmentBoard
            data={data}
            selectedArea={selectedArea}
            patients={patients}
            setSelectedPatient={setSelectedPatient}
            generateData={generateData}
            generatedData={generatedData}
            // Atributos de carregamento de imagens e recomendações geradas por IA (passando para o PatientCard)
            isLoading={isLoading}
            loadingMessage={loadingMessage}
            loadingProgress={loadingProgress}
          />
        ) : null}

      <PatientCardModal 
          selectedPatient={selectedPatient}
          setSelectedPatient={setSelectedPatient}
          generateData={generateData}
          isHighContrast={isHighContrast}
          setIsHighContrast={setIsHighContrast}
          setShowAudioControls={setShowAudioControls}
          showAudioControls={showAudioControls}
          setFontSize={setFontSize}
          fontSize={fontSize}
          aiQuery={aiQuery}
          setAiQuery={setAiQuery}
          generatedData={generatedData}
          setCurrentUtterance={setCurrentUtterance}
          setSynthesis={setSynthesis}
          synthesis={synthesis}
      />
    </div>
  );
};