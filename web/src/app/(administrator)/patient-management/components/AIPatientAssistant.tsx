import React, { useState, useEffect } from 'react';
import { Sparkles, Volume2, Tag, RefreshCw, Lightbulb, Activity, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/organisms/card';
import { ScrollArea } from '@/components/ui/organisms/scroll-area';
import { Button } from '@/components/ui/organisms/button';
import Image from 'next/image';
import { TFontSize, IGeneratedData } from '../types/types';

interface IAIPatientAssistantProps {
    fontSize: TFontSize;
    showAudioControls: boolean;
    generatedData: IGeneratedData;
    isHighContrast: boolean;
    isLoading?: boolean;
    setCurrentUtterance: React.Dispatch<React.SetStateAction<SpeechSynthesisUtterance | null>>;
    setSynthesis: React.Dispatch<React.SetStateAction<SpeechSynthesis | null>>;
    setShowAudioControls: React.Dispatch<React.SetStateAction<boolean>>;
    synthesis: SpeechSynthesis | null;
    onGenerateRecommendation?: () => void;
}

const suggestedPrompts = [
    "Recomendações para melhoria do quadro clínico",
    "Sugestões de cuidados preventivos",
    "Orientações para acompanhamento",
    "Plano de tratamento sugerido",
    "Análise dos sinais vitais",
];

export const AIPatientAssistant: React.FC<IAIPatientAssistantProps> = ({
    fontSize,
    showAudioControls,
    generatedData,
    isHighContrast,
    isLoading = false,
    setCurrentUtterance,
    setSynthesis,
    synthesis,
    onGenerateRecommendation
}) => {
    const [activeTab, setActiveTab] = useState<'text' | 'image'>('text');
    const [hasInteracted, setHasInteracted] = useState(false);
    const [currentPromptIndex, setCurrentPromptIndex] = useState(0);

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

    const handleSphereClick = () => {
        setHasInteracted(true);
        setShowGeneratedContent(true);
        if (onGenerateRecommendation) {
            onGenerateRecommendation();
        }
    };

    return (
        <div className='bg-gradient-to-r from-blue-700 to-cyan-700 p-1 mt-8 rounded-md'>
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
                    <div className="flex flex-col items-center justify-center space-y-8 py-12">
                        {/* Suggested Prompts */}
                        <div className="flex flex-wrap justify-center gap-3 mb-8 px-4">
                            {suggestedPrompts.map((prompt, index) => (
                                <div
                                    key={prompt}
                                    className={`bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 text-sm 
                                    text-white transition-all duration-500 transform
                                    ${index === currentPromptIndex ? 'scale-110 bg-white/20' : 'scale-100 opacity-60'}`}
                                >
                                    {prompt}
                                </div>
                            ))}
                        </div>

                        {/* Animated Sphere */}
                        <button
                            onClick={handleSphereClick}
                            className="group relative w-48 h-48 cursor-pointer focus:outline-none"
                        >
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 
                                          animate-pulse group-hover:from-blue-500 group-hover:to-purple-600">
                                <div className="absolute inset-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 
                                              animate-spin group-hover:from-cyan-500 group-hover:to-blue-600">
                                    <div className="absolute inset-2 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 
                                                  blur-sm group-hover:from-indigo-500 group-hover:to-purple-600"></div>
                                </div>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-white text-lg font-medium">Clique para gerar</span>
                            </div>
                        </button>
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
                                    onClick={onGenerateRecommendation}
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