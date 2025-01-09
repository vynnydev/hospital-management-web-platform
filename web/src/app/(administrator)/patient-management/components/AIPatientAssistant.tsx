import React, { useState } from 'react';
import Image from 'next/image';
import { Volume2, Tag, Clock, Calendar, User, AlertTriangle, Activity, Clipboard, Heart } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/organisms/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/organisms/card';
import { ScrollArea } from '@/components/ui/organisms/scroll-area';
import { Skeleton } from '@/components/ui/organisms/skeleton';
import { FontSize, GeneratedData } from '../types/types';

interface Recommendation {
    text: string;
    tags: string[];
    image?: string;
}

interface AIPatientAssistantProps {
    fontSize: FontSize;
    showAudioControls: boolean;
    generatedData: GeneratedData;
    isHighContrast: boolean;
    isLoading?: boolean;
    setCurrentUtterance: React.Dispatch<React.SetStateAction<SpeechSynthesisUtterance | null>>;
    setSynthesis: React.Dispatch<React.SetStateAction<SpeechSynthesis | null>>;
    setShowAudioControls: React.Dispatch<React.SetStateAction<boolean>>;
    synthesis: SpeechSynthesis | null;
}

interface RecommendationModalProps {
    isOpen: boolean;
    onClose: () => void;
    recommendation: Recommendation | null;
    image: string | undefined;
    fontSize: FontSize;
    showAudioControls: boolean;
    handleTextToSpeech: (text: string | undefined) => void;
    createdAt?: string;
    doctor?: string;
}

const LoadingCard: React.FC = () => (
    <Card className="relative transition-all duration-300">
        <CardContent className="relative z-10 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <Skeleton className="h-40 w-full mb-4 rounded-lg" />
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3 mb-4" />
            <div className="flex gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
            </div>
        </CardContent>
    </Card>
);

const RecommendationCard: React.FC<{ recommendation: Recommendation; image?: string }> = ({ 
    recommendation, 
    image 
}) => (
    <Card className="relative bg-white dark:bg-gray-800 p-4">
        <CardHeader className="p-0 mb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                Recomendação Médica
            </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
            {(recommendation.image || image) && (
                <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                    <Image
                        src={recommendation.image || image || '/images/default-avatar.png'}
                        alt="Procedimento médico"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                    />
                </div>
            )}
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {recommendation.text}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
                {recommendation.tags.map((tag: string, idx: number) => (
                    <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                    </span>
                ))}
            </div>
        </CardContent>
    </Card>
);

const RecommendationModal: React.FC<RecommendationModalProps> = ({ 
    isOpen,
    onClose, 
    recommendation, 
    image, 
    // fontSize,
    handleTextToSpeech,
    showAudioControls,
    createdAt = new Date().toLocaleDateString(),
    doctor = "Dr. João Silva"
}) => (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                    <Clipboard className="w-5 h-5 text-blue-500" />
                    Detalhes das Recomendações
                </DialogTitle>
                <DialogClose className="absolute right-4 top-4" />
            </DialogHeader>
            
            <ScrollArea className="h-[calc(90vh-120px)]">
                <div className="space-y-6 p-6">
                    <Card className="bg-gray-50 dark:bg-gray-800">
                        <CardContent className="p-4">
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-blue-500" />
                                    <span>{doctor}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-blue-500" />
                                    <span>{createdAt}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-blue-500" />
                                    <span>Última atualização: {new Date().toLocaleTimeString()}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-4">
                        {recommendation && (
                            <RecommendationCard 
                                recommendation={recommendation} 
                                image={image}
                            />
                        )}
                    </div>

                    <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-900">
                        <CardContent className="p-4">
                            <h4 className="flex items-center gap-2 text-orange-700 dark:text-orange-400 font-medium mb-2">
                                <AlertTriangle className="w-5 h-5" />
                                Alertas e Precauções
                            </h4>
                            <ul className="list-disc list-inside text-orange-600 dark:text-orange-300">
                                <li>Monitorar sinais vitais a cada 4 horas</li>
                                <li>Verificar interações medicamentosas</li>
                                <li>Atenção aos fatores de risco identificados</li>
                            </ul>
                        </CardContent>
                    </Card>

                    {showAudioControls && recommendation && (
                        <button
                            onClick={() => handleTextToSpeech(recommendation.text)}
                            className="mt-4 flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors"
                        >
                            <Volume2 className="w-4 h-4" />
                            Ouvir recomendação
                        </button>
                    )}
                </div>
            </ScrollArea>
        </DialogContent>
    </Dialog>
);

export const AIPatientAssistant: React.FC<AIPatientAssistantProps> = ({
    fontSize,
    showAudioControls,
    generatedData,
    isHighContrast,
    isLoading = false,
    setCurrentUtterance,
    setSynthesis,
    synthesis
}) => {
    const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const getFontSizeClass = (baseClass: string) => {
        const sizeMap: Record<FontSize, string> = {
            small: 'text-sm',
            normal: 'text-base',
            large: 'text-lg',
            'extra-large': 'text-xl'
        };
        return `${baseClass} ${sizeMap[fontSize]}`;
    };

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

    const getContrastClass = (baseClass: string) => {
        return isHighContrast ? `${baseClass} contrast-high brightness-110` : baseClass;
    };

    const parseRecommendations = (text: string | undefined): Recommendation[] => {
        if (!text) return [];
        const regex = /\*\*(\d+)\..*?\*\*/g;
        let matches;
        const recommendations: Recommendation[] = [];
        let lastIndex = 0;

        while ((matches = regex.exec(text)) !== null) {
            if (matches.index > lastIndex) {
                recommendations.push({
                    text: text.slice(lastIndex, matches.index).trim(),
                    tags: ['Cuidados', 'Tratamento', 'Recomendação'],
                    image: generatedData.treatmentImage
                });
            }
            lastIndex = matches.index;
        }
        recommendations.push({
            text: text.slice(lastIndex).trim(),
            tags: ['Cuidados', 'Tratamento', 'Recomendação'],
            image: generatedData.treatmentImage
        });
        return recommendations;
    };

    const recommendations = parseRecommendations(generatedData.recommendation);
    console.log(isLoading)

    return (
        <div className="space-y-6 p-6">
            <h4 className={getFontSizeClass("font-semibold text-gray-800 dark:text-white flex items-center gap-2")}>
                <Heart className="w-5 h-5 text-blue-500" />
                Recomendações da IA
            </h4>

            <div className={getContrastClass("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3")}>
                {isLoading ? (
                    <>
                        <LoadingCard />
                        <LoadingCard />
                        <LoadingCard />
                    </>
                ) : (
                    recommendations.map((rec, index) => (
                        <div
                            key={index}
                            className="group cursor-pointer"
                            onClick={() => {
                                setSelectedRecommendation(rec);
                                setIsModalOpen(true);
                            }}
                        >
                            <Card className="relative transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                                <div className="absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-teal-400 to-blue-500 animate-pulse-border -mt-2 h-[330px] w-[265px]" />
                                <CardContent className="relative z-10 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                    {rec.image && (
                                        <div className="relative h-40 mb-4 rounded-lg overflow-hidden">
                                            <Image
                                                src={rec.image}
                                                alt="Procedimento médico"
                                                layout="fill"
                                                objectFit="cover"
                                                className="rounded-lg"
                                            />
                                        </div>
                                    )}

                                    <p className={getFontSizeClass("text-gray-700 dark:text-gray-300 line-clamp-3")}>
                                        {rec.text}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {rec.tags.slice(0, 2).map((tag, tagIndex) => (
                                            <span
                                                key={tagIndex}
                                                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                                            >
                                                <Tag className="w-3 h-3 mr-1" />
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ))
                )}
            </div>

            {selectedRecommendation && (
                <RecommendationModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setTimeout(() => setSelectedRecommendation(null), 200);
                    }}
                    recommendation={selectedRecommendation}
                    image={generatedData.treatmentImage}
                    fontSize={fontSize}
                    handleTextToSpeech={handleTextToSpeech}
                    showAudioControls={showAudioControls}
                />
            )}

            <style jsx global>{`
                @keyframes pulse-border {
                    0% { opacity: 0.2; }
                    50% { opacity: 0.6; }
                    100% { opacity: 0.2; }
                }
                .animate-pulse-border {
                    animation: pulse-border 2s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};