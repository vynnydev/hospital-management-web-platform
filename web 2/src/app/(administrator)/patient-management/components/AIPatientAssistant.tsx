/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Volume2, Tag, Clock, Calendar, User, AlertTriangle, Activity, Clipboard, Heart, Target, CheckCircle, FileText, Pill, RefreshCcwIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/organisms/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/organisms/card';
import { ScrollArea } from '@/components/ui/organisms/scroll-area';
import { Skeleton } from '@/components/ui/organisms/skeleton';
import { TFontSize, IGeneratedData } from '../types/types';
import { FaPills } from 'react-icons/fa';

interface IRecommendation {
    text: string;
    tags: string[];
    image?: string;
}

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
}

interface IRecommendationModalProps {
    isOpen: boolean;
    onClose: () => void;
    recommendation: IRecommendation | null;
    image: string | undefined;
    fontSize: TFontSize;
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

const RecommendationCard: React.FC<{ data: IGeneratedData }> = ({ data }) => {
    // Função para processar as recomendações e aplicar os ajustes
    const parseRecommendation = (text?: string) => {
        if (!text) return [];

        // Verifica se o texto contém as palavras proibidas
        const forbiddenTerms = ['IMAGEM TÉCNICA', 'RECOMENDAÇÃO', 'Recomendação'];
        if (forbiddenTerms.some(term => text.includes(term))) {
            return []; // Retorna uma lista vazia para impedir a renderização
        }

        return text.split('\n').map((line) => {
            const titleMatch = line.match(/\*\*(.*?)\*\*/);
            if (titleMatch) {
                return { type: 'title', content: titleMatch[1] };
            }
            if (line.startsWith('* ')) {
                return { type: 'item', content: line.replace('* ', '').trim() };
            }
            return { type: 'text', content: line };
        }).filter(item => 
            item.type !== 'text' || item.content.trim() !== '' // Remove textos vazios
        );
    };

    const recommendations = parseRecommendation(data.recommendation);

    // Se as recomendações estiverem vazias após o filtro, não renderiza o card
    if (recommendations.length === 0) {
        return null;
    }

    console.log("Recomendações:", recommendations);

    return (
        <Card className="relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border dark:border-gray-700 mb-4">
            
            {/* Imagem priorizada */}
            {(data.treatmentImage || data.carePlanImage || data.monitoringImage) && (
                <div className="relative h-48 mb-4 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
                    <Image
                        src={data.treatmentImage || data.carePlanImage || data.monitoringImage || '/images/default-avatar.png'}
                        alt="Imagem da Recomendação"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-t-lg"
                    />
                </div>
            )}

            {/* Conteúdo das recomendações */}
            <CardContent className="p-0 space-y-4">
                {recommendations.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                        {item.type === 'title' && (
                            <h2 className="text-lg font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                                <Clipboard className="w-5 h-5" />
                                {item.content}
                            </h2>
                        )}
                        {item.type === 'item' && (
                            <p className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                {/* Verifica se a frase tem apenas um asterisco e coloca o ícone de pílula */}
                                {item.content.startsWith('* ') && item.content.split(' ').length === 2 && (
                                    <FaPills className="w-4 h-4 text-blue-500" />
                                )}
                                {item.content}
                            </p>
                        )}
                        {item.type === 'text' && (
                            <p className="text-gray-600 dark:text-gray-400">{item.content}</p>
                        )}
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};

const RecommendationModal: React.FC<IRecommendationModalProps> = ({ 
    isOpen,
    onClose, 
    recommendation, 
    image, 
    handleTextToSpeech,
    showAudioControls,
    createdAt = new Date().toLocaleDateString(),
    doctor = "Dr. João Silva"
}) => {

    const parseRecommendations = (text: string) => {
        return text.split(/\n\n/).map((section) => {
            const titleMatch = section.match(/\*\*(.*?)\*\*/);
            const title = titleMatch ? titleMatch[1] : "Recomendação";
            const content = section.replace(/\*\*(.*?)\*\*/, "").trim();
            return { title, content };
        });
    };

    const recommendations = recommendation?.text ? parseRecommendations(recommendation.text) : [];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
                {/* Header com informações do médico e data */}
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                        <Clipboard className="w-5 h-5" />
                        Detalhes das Recomendações
                    </DialogTitle>
                    <DialogClose className="absolute right-4 top-4" />
                </DialogHeader>

                {/* Informações básicas */}
                <Card className="bg-gray-200 dark:bg-gray-800 border-l-4 border-blue-500 my-4">
                    <CardContent className="p-4 flex flex-wrap gap-4 text-sm">
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
                    </CardContent>
                </Card>

                {/* Renderização do componente RecommendationCard */}
                <ScrollArea className="h-[calc(90vh-180px)] px-6 space-y-6">
                    {recommendations.length > 0 ? (
                        recommendations.map((rec, index) => (
                            <RecommendationCard
                                key={index}
                                data={{
                                    recommendation: `${rec.title}\n\n${rec.content}`,
                                    treatmentImage: recommendation?.image,
                                }}
                            />
                        ))
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400">Nenhuma recomendação disponível.</p>
                    )}

                    {/* Controle de áudio */}
                    {showAudioControls && recommendation?.text && (
                        <button
                            onClick={() => handleTextToSpeech(recommendation?.text)}
                            className="mt-4 flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors"
                        >
                            <Volume2 className="w-4 h-4" />
                            Ouvir recomendação
                        </button>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

export const AIPatientAssistant: React.FC<IAIPatientAssistantProps> = ({
    fontSize,
    showAudioControls,
    generatedData,
    isHighContrast,
    isLoading: initialIsLoading = true,
    setCurrentUtterance,
    setSynthesis,
    synthesis
}) => {
    const [selectedRecommendation, setSelectedRecommendation] = useState<IRecommendation | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoadingState, setIsLoadingState] = useState(initialIsLoading);
    const [treatmentImage, setTreatmentImage] = useState<string | undefined>(undefined);
    const [imageError, setImageError] = useState(false);
    
    // Estado adicional para forçar a re-renderização
    const [refreshKey, setRefreshKey] = useState(0);

    const isValidBase64Image = (str: string) => {
        if (!str?.startsWith('data:image/')) return false;
        try {
            window.atob(str.split(',')[1]);
            return true;
        } catch (e) {
            return false;
        }
    };

    // Atualiza o estado de loading quando o initialIsLoading muda
    useEffect(() => {
        setIsLoadingState(initialIsLoading);
    }, [initialIsLoading]);

    // Atualiza o estado de loading quando os dados são carregados
    useEffect(() => {
        if (generatedData) {
            setIsLoadingState(false);
        }
    }, [generatedData]);

    useEffect(() => {
        if (generatedData?.treatmentImage) {
            if (!isValidBase64Image(generatedData.treatmentImage)) {
                console.error('Invalid base64 image string');
                setImageError(true);
                return;
            }
            setTreatmentImage(generatedData.treatmentImage);
        }
    }, [generatedData?.treatmentImage]);

    useEffect(() => {
        if (generatedData?.treatmentImage) {
            try {
                const isValidBase64 = /^data:image\/[a-z]+;base64,/.test(generatedData.treatmentImage);
                if (!isValidBase64) {
                    console.error('Invalid base64 image format');
                    setImageError(true);
                    return;
                }
                
                setImageError(false);
                setTreatmentImage(generatedData.treatmentImage);
                console.log("Imagem definida no estado");
                // Garantir que o loading state seja false após a imagem ser definida
                setIsLoadingState(false);
            } catch (error) {
                console.error('Error processing image:', error);
                setImageError(true);
            }
        }
    }, [generatedData?.treatmentImage]);

    // Função para recarregar o componente
    const handleReload = () => {
        setIsLoadingState(true); // Marca o carregamento como verdadeiro
        setRefreshKey(prevKey => prevKey + 1); // Força a re-renderização do componente
    };

    const getFontSizeClass = (baseClass: string) => {
        const sizeMap: Record<TFontSize, string> = {
            small: 'text-sm',
            normal: 'text-base',
            large: 'text-lg',
            'extra-large': 'text-xl'
        };
        return `${baseClass} ${sizeMap[fontSize]}`;
    };

    const getContrastClass = (baseClass: string) =>
        isHighContrast ? `${baseClass} contrast-high brightness-110` : baseClass;

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

    const parseRecommendations = (text: string | undefined): IRecommendation[] => {
        if (!text) return [];
        const regex = /\*\*(\d+)\..*?\*\*/g;
        let matches;
        const recommendations: IRecommendation[] = [];
        let lastIndex = 0;

        while ((matches = regex.exec(text)) !== null) {
            if (matches.index > lastIndex) {
                recommendations.push({
                    text: text.slice(lastIndex, matches.index).trim(),
                    tags: ['Cuidados', 'Tratamento', 'Recomendação'],
                    image: treatmentImage
                });
            }
            lastIndex = matches.index;
        }
        recommendations.push({
            text: text.slice(lastIndex).trim(),
            tags: ['Cuidados', 'Tratamento', 'Recomendação'],
            image: treatmentImage
        });
        return recommendations;
    };

    useEffect(() => {
        if (generatedData?.treatmentImage) {
            console.log("Tamanho da string base64:", generatedData.treatmentImage.length);
            console.log("Primeiros 100 caracteres:", generatedData.treatmentImage.substring(0, 100));
            setTreatmentImage(generatedData.treatmentImage);
        }
    }, [generatedData?.treatmentImage]);

    const recommendations = parseRecommendations(generatedData?.recommendation);

    return (
        <div className="space-y-6 p-4">
            <div className='flex flex-row justify-between'>
                <h4 className={getFontSizeClass("font-semibold text-gray-800 dark:text-white flex items-center gap-2 mt-4")}>
                    <Heart className="w-5 h-5 text-blue-500" />
                    Recomendações da IA
                </h4>
                {/* Botão de recarregar */}
                <button
                    onClick={handleReload}
                    className="mt-6 p-2 bg-gradient-to-r from-teal-700 to-blue-700 
                             text-white rounded-md shadow-md hover:bg-gradient-to-r 
                              hover:from-teal-500 hover:to-blue-500 transition-all 
                              flex items-center gap-2"
                >
                    <RefreshCcwIcon className="w-4 h-4" />
                    <p className='text-sm'>Recarregar</p>
                </button>
            </div>

            <div className={getContrastClass("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4")}>
                {isLoadingState ? (
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
                            <Card className="relative h-[330px] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden">
                                <div className="rounded-xl border-2 border-transparent bg-gradient-to-r from-teal-700 to-blue-700 p-1">
                                    <CardContent className="p-0 h-full">
                                        {/* Container da imagem */}
                                        <div className="relative w-full h-40 bg-gray-100 dark:bg-gray-800">
                                            {treatmentImage ? (
                                                <Image
                                                    src={treatmentImage}
                                                    alt="Imagem do tratamento"
                                                    className="w-full h-full object-cover"
                                                    width={40}
                                                    height={40}
                                                    onError={(e) => {
                                                        console.error("Erro ao renderizar imagem");
                                                        e.currentTarget.style.display = 'none';
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                                            )}
                                        </div>

                                        {/* Conteúdo do card */}
                                        <div className="p-4 bg-white dark:bg-gray-800">
                                            <p className={getFontSizeClass("text-gray-700 dark:text-gray-300 line-clamp-3 mb-4")}>
                                                {rec.text}
                                            </p>

                                            <div className="flex flex-wrap gap-2">
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
                                        </div>
                                    </CardContent>
                                </div>
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
                    image={treatmentImage}
                    fontSize={fontSize}
                    handleTextToSpeech={handleTextToSpeech}
                    showAudioControls={showAudioControls}
                />
            )}
        </div>
    );
};
