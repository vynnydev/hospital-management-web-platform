/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { Sparkles, Volume2, Tag, RefreshCw, Lightbulb, Activity, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/organisms/card';
import { ScrollArea } from '@/components/ui/organisms/scroll-area';
import { Button } from '@/components/ui/organisms/button';

import { generateAIContent } from '@/services/AI/aiGenerateRecommendationsAndImagesServices';
import { IPatient } from '@/types/hospital-network-types';
import { AISphereButton } from './AI/AISphereButton';
import { AILoadingCard } from './AI/AILoadingCard';
import { TFontSize } from '@/types/utils-types';
import { IGeneratedData } from '@/types/ai-types';

interface IAIPatientAssistantProps {
    selectedPatient: IPatient | null;
    fontSize: TFontSize;
    showAudioControls: boolean;
    isHighContrast: boolean;
    setCurrentUtterance: React.Dispatch<React.SetStateAction<SpeechSynthesisUtterance | null>>;
    setSynthesis: React.Dispatch<React.SetStateAction<SpeechSynthesis | null>>;
    setShowAudioControls: React.Dispatch<React.SetStateAction<boolean>>;
    synthesis: SpeechSynthesis | null;
    generatedData: IGeneratedData;
    onGenerateRecommendation?: () => Promise<void>;
    isLoading?: boolean;
}

const suggestedPrompts = [
    "Recomendações para melhoria do quadro clínico",
    "Sugestões de cuidados preventivos",
    "Orientações para acompanhamento",
    "Plano de tratamento sugerido",
    "Análise dos sinais vitais",
];

const SuggestedPrompt: React.FC<{ active: boolean; children: React.ReactNode }> = ({ active, children }) => (
    <div className={`
        p-0.5 rounded-full transform transition-all duration-500
        ${active ? 'scale-105' : 'scale-100 opacity-80'}
        bg-gradient-to-r from-blue-700 to-cyan-700
    `}>
        <div className="bg-gray-600 px-4 py-2 rounded-full">
            <span className="text-white text-sm">{children}</span>
        </div>
    </div>
);

export const AIPatientAssistant: React.FC<IAIPatientAssistantProps> = ({
    selectedPatient,
    fontSize,
    showAudioControls,
    generatedData,
    isHighContrast,
    isLoading: aiISLoading = false,
    setCurrentUtterance,
    setSynthesis,
    synthesis,
    onGenerateRecommendation
}) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [activeTab, setActiveTab] = useState<'text' | 'image'>('text');
    const [hasInteracted, setHasInteracted] = useState(false);
    const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [generatedContent, setGeneratedContent] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleTextToSpeech = (text: string | undefined) => {
        if (!text) return;
        if (synthesis) synthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        utterance.rate = 0.9;
        setCurrentUtterance(utterance);
        setSynthesis(window.speechSynthesis);
        window.speechSynthesis.speak(utterance);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPromptIndex((prev) => (prev + 1) % suggestedPrompts.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const [showGeneratedContent, setShowGeneratedContent] = useState(false);

    const handleSphereClick = async () => {
        if (!selectedPatient) {
          setError('Nenhum paciente selecionado');
          return;
        }
    
        setIsLoading(true);
        setError(null);
        
        try {
          const result = await generateAIContent(selectedPatient, {
            onStart: () => {
              setLoadingProgress(0);
              setLoadingMessage('Iniciando...');
            },
            onProgress: (progress, message) => {
              setLoadingProgress(progress);
              setLoadingMessage(message);
            },
            onComplete: () => {
              setIsLoading(false);
              setLoadingProgress(100);
              setLoadingMessage('');
            },
            onError: (error) => {
              setError(error.message);
              setIsLoading(false);
            }
          });
    
          setGeneratedContent(result);
          setHasInteracted(true);
          setShowGeneratedContent(true);
          
        } catch (error: any) {
          setError(error.message);
        } finally {
          setIsLoading(false);
        }
    };

    const containerClassName = `
    bg-gradient-to-r from-blue-700 to-cyan-700 p-1 mt-8 rounded-md
    transition-all duration-500 transform
    ${isAnimating ? 'animate-rotate-content' : ''}
    `;

    return (
        <div className={containerClassName}>
            <div className="space-y-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
                {/* Header Section - Always visible */}
                <div className="bg-gradient-to-r from-blue-700 to-cyan-700 rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-white/10 rounded-lg">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">MediMind AI</h2>
                                <p className="text-white/80">Assistente Inteligente de Recomendações Médicas</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Interactive Sphere Section - Initial State */}
                {!hasInteracted && (
                    <div className="flex flex-col items-center justify-center space-y-6 py-12">
                        {/* Suggested Prompts */}
                        <div className="flex flex-wrap justify-center gap-4">
                            {suggestedPrompts.map((prompt, index) => (
                                <SuggestedPrompt 
                                    key={prompt}
                                    active={index === currentPromptIndex}
                                >
                                    {prompt}
                                </SuggestedPrompt>
                            ))}
                        </div>

                        {/* Text with gradient border */}
                        <AILoadingCard 
                            isLoading={isLoading}
                            message={loadingMessage}
                        />

                        {/* Animated Sphere Button */}
                        <AISphereButton 
                            onClick={handleSphereClick}
                            isLoading={isLoading}
                            loadingMessage={loadingMessage}
                            // Props opcionais
                            // size={200} // Customizar tamanho
                            // disabled={true} // Desabilitar botão
                            // className="custom-class" // Adicionar classes personalizadas
                        />
                    </div>
                )}

                {/* Generated Content Section - Shows after interaction */}
                {showGeneratedContent && (
                    <Card className="bg-gray-900/95 shadow-xl backdrop-blur-sm border-0">
                        <CardHeader className="border-b border-gray-700">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-blue-400" />
                                    Recomendações Geradas
                                </CardTitle>
                                <Button
                                    onClick={async () => {
                                        if (onGenerateRecommendation) {
                                            try {
                                                await onGenerateRecommendation();
                                            } catch (error) {
                                                console.error('Erro ao gerar recomendação:', error);
                                            }
                                        }
                                    }}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                                    ) : (
                                        <Lightbulb className="w-4 h-4 mr-2" />
                                    )}
                                    Gerar Nova Recomendação
                                </Button>
                            </div>
                        </CardHeader>

                        <CardContent className="p-6">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <div className="w-24 h-24 relative">
                                        {/* Similar sphere animation as above but smaller */}
                                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 animate-pulse">
                                            <div className="absolute inset-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 animate-spin"></div>
                                        </div>
                                    </div>
                                    <p className="text-white/80 mt-4">Gerando recomendações...</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {generatedData.treatmentImage && (
                                        <div className="relative rounded-xl overflow-hidden">
                                            <Image
                                                src={generatedData.treatmentImage}
                                                alt="Recomendação gerada"
                                                width={800}
                                                height={400}
                                                className="w-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                                            <div className="absolute bottom-0 p-6 w-full">
                                                <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-4">
                                                    <h3 className="text-lg font-semibold text-white mb-2">
                                                        Recomendação Médica
                                                    </h3>
                                                    <p className="text-white/90">
                                                        {generatedData.recommendation}
                                                    </p>
                                                    {showAudioControls && (
                                                        <Button
                                                            variant="ghost"
                                                            onClick={() => handleTextToSpeech(generatedData.recommendation)}
                                                            className="mt-4 text-blue-400 hover:text-blue-300"
                                                        >
                                                            <Volume2 className="w-4 h-4 mr-2" />
                                                            Ouvir recomendação
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};