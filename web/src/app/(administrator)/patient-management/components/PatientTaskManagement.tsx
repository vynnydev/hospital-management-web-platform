/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { 
  TrendingUp, TrendingDown, 
  AlertCircle, RefreshCw,
  Bed, Clock, Users
} from 'lucide-react';
import { 
  GeneratedData, GeneratedImages, 
  HospitalMetrics, Patient, 
  VitalSign 
} from "../types/types";
import { HfInference } from "@huggingface/inference";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { DepartmentBoard } from "./DepartmentBoard";
import { PatientCardModal } from "./PatientCardModal";
import { generateEnhancedPrompt } from "./functions/AI/aiAssistantPatientBoard";
import { isValidBase64Image } from "@/components/ui/aida-assistant/report-modal-ai/services/functions/imagePresenter";

const hfInference = new HfInference(process.env.HUGGING_FACE_API_KEY!);
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

type FontSize = 'small' | 'normal' | 'large' | 'extra-large';

interface Props {
  data: HospitalMetrics;
  patients: Patient[];
  selectedArea: string;
  onSelect: (patient: Patient) => void;
  departments: Record<string, string[]>;
  onClose: () => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

const MetricCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    trend: 'up' | 'down';
  };
  loading: boolean;
}> = ({ title, value, icon, trend, loading }) => (
  <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl mb-4">
    {loading ? (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
      </div>
    ) : (
      <>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-500 dark:text-gray-400 font-medium">{title}</h3>
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            {icon}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{value}</p>
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

export const PatientTaskManagement: React.FC<Props> = ({
  patients,
  selectedArea,
  onSelect,
  departments,
  data,
  onClose,
  fontSize,
  setFontSize,
  loading,
  error,
  onRetry
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

  // Valores default seguros para métricas com a nova estrutura
  const defaultMetrics = {
    overall: {
      occupancyRate: 0,
      totalPatients: 0,
      availableBeds: 0,
      avgStayDuration: 0,
      turnoverRate: 0,
      totalBeds: 0,
      lastUpdate: new Date().toISOString(),
      periodComparison: {
        occupancy: { value: 0, trend: 'up' as const },
        patients: { value: 0, trend: 'up' as const },
        beds: { value: 0, trend: 'up' as const }
      }
    },
    departmental: {}
  };

  // Combinar dados recebidos com valores default
  const safeData = {
    ...defaultMetrics,
    ...data,
    overall: {
      ...defaultMetrics.overall,
      ...data?.overall
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className={`relative ${error ? 'opacity-50' : ''}`}>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard
              title="Taxa de Ocupação"
              value={`${safeData.overall.occupancyRate}%`}
              icon={<Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
              trend={safeData.overall.periodComparison.occupancy}
              loading={loading}
            />
            <MetricCard
              title="Leitos Disponíveis"
              value={safeData.overall.availableBeds}
              icon={<Bed className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
              trend={safeData.overall.periodComparison.beds}
              loading={loading}
            />
            <MetricCard
              title="Tempo Médio de Internação"
              value={`${safeData.overall.avgStayDuration} dias`}
              icon={<Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
              loading={loading}
            />
          </div>

          {selectedArea && safeData.departmental[selectedArea] ? (
            <DepartmentBoard
              data={safeData}
              selectedArea={selectedArea}
              patients={patients}
              setSelectedPatient={setSelectedPatient}
              generateData={generateData}
              generatedData={generatedData}
              isLoading={isLoading}
              loadingMessage={loadingMessage}
              loadingProgress={loadingProgress}
            />
          ) : (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-8 text-center">
              <h3 className="text-gray-500 dark:text-gray-400">
                Selecione um departamento para ver os detalhes
              </h3>
            </div>
          )}

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

        {error && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-red-200 dark:border-red-800 p-4 w-full max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <div>
                  <h3 className="font-medium text-red-500">Erro ao carregar dados</h3>
                </div>
              </div>
              <button
                onClick={onRetry}
                className="inline-flex items-center space-x-2 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm rounded-md transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Tentar novamente</span>
              </button>
            </div>
          </div>
        )}
    </div>
  );
};