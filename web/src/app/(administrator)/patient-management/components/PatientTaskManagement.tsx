/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import Image from "next/image";

import { Department, GeneratedData, GeneratedImages, Metrics, Patient } from "../types/types";
import { VitalSign } from "../types/types";
import { 
  Heart, 
  UserRound,
  X, 
  Accessibility,
  Volume2,
  Activity,
  TrendingUp,
  TrendingDown,
  HelpCircle,
  Bell,
  Eye,
  EyeOff,
  MessageSquare,
  Maximize2
} from 'lucide-react';
import { LineChart, XAxis, YAxis, Tooltip, Line, ResponsiveContainer } from 'recharts';

import { motion } from "framer-motion";
import { HfInference } from "@huggingface/inference";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { DepartmentBoard } from "./DepartmentBoard";
import { generateEnhancedPrompt } from "./functions/AI/aiAssistantPatientBoard";
import { PatientCardModal } from "./PatientCardModal";

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

  const isAllDepartments = selectedArea === "todos";

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

  const handleTextToSpeech = (text: string | undefined) => {
    if (!text) return;
    
    if (synthesis) {
      synthesis.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9;
    
    setCurrentUtterance(utterance);
    setSynthesis(window.speechSynthesis);
    
    window.speechSynthesis.speak(utterance);
  };

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

  const generateData = async (patient: Patient) => {
    const enhancedPrompt = generateEnhancedPrompt(patient);
    
    try {
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
          .then((res) => res.response.text()),
        hfInference
          .textToImage({
            inputs: enhancedPrompt,
            parameters: {
              negative_prompt: "texto, palavras, letras, números, baixa qualidade, borrado",
              num_inference_steps: 50,
              guidance_scale: 7.5,
            },
            model: "stabilityai/stable-diffusion-3.5-large",
          })
          .then((blob) => URL.createObjectURL(blob)),
      ]);
  
      const latestVitals = patient.treatment.vitals[patient.treatment.vitals.length - 1];
  
      const carePlanPrompt = `Crie uma imagem clara e profissional representando o plano de cuidados para ${patient.personalInfo.name}, focando em: monitoramento de sinais vitais (FC: ${latestVitals.heartRate}bpm, Temp: ${latestVitals.temperature}°C, SatO2: ${latestVitals.oxygenSaturation}%), medicações principais e cuidados específicos.`;
  
      const carePlanImage = await hfInference
        .textToImage({
          inputs: carePlanPrompt,
          parameters: {
            negative_prompt: "texto, palavras, letras, números, baixa qualidade, borrado",
            num_inference_steps: 50,
            guidance_scale: 7.5,
          },
          model: "stabilityai/stable-diffusion-3.5-large",
        })
        .then((blob) => URL.createObjectURL(blob));
  
      setGeneratedData({
        recommendation: recommendationResult,
        treatmentImage: imageResult,
        carePlanImage: carePlanImage,
      } as GeneratedData);
  
      setGeneratedImages((prev: GeneratedImages) => ({
        ...prev,
        [patient.id]: { treatment: imageResult, carePlan: carePlanImage }
      }));
  
    } catch (error) {
      // console.error("Erro ao gerar dados:", error);
      setGeneratedData({
        recommendation: "Erro ao gerar recomendação. Por favor, tente novamente.",
      });
    }
  };

  const generateProgressData = (vitals: VitalSign[]) => {
    return vitals.map(vital => ({
      date: new Date(vital.timestamp).toLocaleDateString(),
      progress: vital.oxygenSaturation,
      temperature: vital.temperature,
      heartRate: vital.heartRate
    }));
  };

  const getContrastClass = (baseClass: string) => {
    if (!isHighContrast) return baseClass;
    return `${baseClass} contrast-high brightness-110`;
  };

  if (!selectedArea || !departments[selectedArea]) return null;
  
  const validStatuses = departments[selectedArea];
  // console.log("Status do departamento selecionado:", validStatuses)

  // console.log("Possivel erro de duplicação:", data.departmental[selectedArea])

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