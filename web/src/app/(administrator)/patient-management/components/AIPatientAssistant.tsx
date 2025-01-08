import Image from 'next/image'
import { 
    Volume2,
    MessageSquare,
} from 'lucide-react';
import { FontSize, GeneratedData } from '../types/types';

interface AIPatientAssistantProps {
    fontSize: FontSize,
    showAudioControls: boolean,
    generatedData: GeneratedData,
    isHighContrast: boolean,
    setCurrentUtterance: React.Dispatch<React.SetStateAction<SpeechSynthesisUtterance | null>>,
    setSynthesis: React.Dispatch<React.SetStateAction<SpeechSynthesis | null>>,
    setShowAudioControls: React.Dispatch<React.SetStateAction<boolean>>,
    synthesis: SpeechSynthesis | null,
}

export const AIPatientAssistant: React.FC<AIPatientAssistantProps> = ({
    fontSize,
    showAudioControls,
    generatedData,
    isHighContrast,
    setCurrentUtterance,
    setSynthesis,
    synthesis
}) => {

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
        if (!isHighContrast) return baseClass;
        return `${baseClass} contrast-high brightness-110`;
    };

    return (                         
        <div className="p-6 space-y-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                    <h4 className={getFontSizeClass("font-semibold text-gray-800 dark:text-white")}>
                        Recomendações da IA
                    </h4>
                    {showAudioControls && (
                    <button
                        onClick={() => handleTextToSpeech(generatedData.recommendation)}
                        className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
                    >
                    <Volume2 className="w-4 h-4" />
                        Ouvir recomendações
                    </button>
                )}
                </div>

                <div className={getContrastClass("grid grid-cols-1 md:grid-cols-2 gap-4")}>
                    <div>
                        <p className={getFontSizeClass("text-gray-600 dark:text-gray-300 whitespace-pre-line")}>
                        {generatedData.recommendation}
                        </p>
                    </div>
            
                    <div className="space-y-4">
                    {generatedData.treatmentImage && (
                        <div className="relative">
                            <Image
                                src={generatedData.treatmentImage}
                                alt="Protocolo de tratamento recomendado"
                                className="rounded-lg w-full"
                                width={32}
                                height={32}
                            />
                            <button
                                onClick={() => handleTextToSpeech("Imagem mostrando protocolo de tratamento recomendado")}
                                className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 rounded-full text-white"
                                aria-label="Descrição da imagem"
                            >
                                <MessageSquare className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                
                    {generatedData.carePlanImage && (
                        <div className="relative">
                            <Image
                                src={generatedData.carePlanImage}
                                alt="Plano de cuidados visualizado"
                                className="rounded-lg w-full"
                                width={32}
                                height={32}
                            />
                            <button
                                onClick={() => handleTextToSpeech("Imagem mostrando plano de cuidados detalhado")}
                                className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 rounded-full text-white"
                                aria-label="Descrição da imagem"
                            >
                                <MessageSquare className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
    )
}