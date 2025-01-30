/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { Sparkles, Loader, X } from 'lucide-react';
import AnimatedAIText from './AnimatedAIText';
import aiAssistant from '@/assets/ai-assistant.png';
import { ReportModal } from './report-modal-ai/ReportModal';
import {
  cardInitialMessages,
  CardTitle,
  formatAIResponse,
  initialMessage,
  ReportType,
} from './utils/aidaAssistantFunctions';
import { funcionalitiesCards } from './utils/AssistantFuncionalities';

const AIDAHealthAssistant: React.FC = () => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [aiMessage, setAiMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportType, setReportType] = useState<ReportType>('evolucao');
  const [isClearing, setIsClearing] = useState(false);
  const [reportData, setReportData] = useState<any>(null);

  const toggleAssistant = () => {
    if (!isOpen) {
      setAiMessage(initialMessage);
    } else {
      setMessage('');
      setAiMessage('');
      setSelectedCard(null);
    }
    setIsOpen(!isOpen);
  };

  const handleCardClick = async (cardTitle: string) => {
    setSelectedCard(cardTitle);
    setLoading(true);
    setIsClearing(true);
    
    try {
      setAiMessage('');
      await new Promise(resolve => setTimeout(resolve, 10));
      setIsClearing(false);
      setAiMessage(cardInitialMessages[cardTitle as CardTitle]);
  
      const selectedCardData = funcionalitiesCards.find(card => card.title === cardTitle);
  
      if (selectedCardData?.aiHandler && message) {
        const result = await selectedCardData.aiHandler(message);
        const formattedResponse = formatAIResponse(result);
        
        if (result.report) {
          setReportData({
            type: cardTitle.toLowerCase(),
            content: formattedResponse,
            raw: result,
            patientId: message,
            timestamp: new Date().toISOString()
          });
          setReportType(cardTitle.toLowerCase() as ReportType);
          setIsReportModalOpen(true);
        } else {
          setAiMessage('Não foi possível processar sua solicitação. Tente novamente.');
        }
      }
    } catch (error: any) {
      console.error('Erro ao processar card:', error);
      setAiMessage(`Erro ao processar: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setAiMessage(initialMessage);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setMessage('');
        setAiMessage('');
        setSelectedCard(null);
      }
    };
  
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <>
      <button
        onClick={toggleAssistant}
        className="fixed bottom-8 right-8 rounded-full p-4 shadow-lg transition-all 
          duration-300 hover:scale-110 bg-gradient-to-r from-blue-700 via-cyan-700 to-blue-700
          hover:from-blue-800 hover:via-cyan-800 hover:to-blue-800 group
          [background-size:200%_200%] animate-[pulse-gradient_3s_ease-in-out_infinite]"
        aria-label="Open AIDA Assistant"
      >
        <div className="relative w-12 h-12">
          <Image
            src={aiAssistant}
            alt="AI Assistant Icon"
            layout="fill"
            className="object-contain group-hover:animate-pulse"
            priority
          />
        </div>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-full max-w-4xl mx-4 relative">
            <div className="relative">
              {/* Camada de gradiente animado */}
              <div className="absolute -inset-[2px] bg-gradient-to-br from-blue-700 to-cyan-700 rounded-xl blur-sm animate-pulse-gradient"></div>
              <div className="absolute -inset-[2px] bg-gradient-to-br from-blue-700 to-cyan-700 rounded-xl opacity-50"></div>
              {/* Conteúdo principal */}
              <div className="bg-gray-900/95 backdrop-blur-xl rounded-xl p-6 relative z-10">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Explore
                  </h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  {funcionalitiesCards.map((card, index) => (
                    <div
                      key={index}
                      onClick={() => handleCardClick(card.title)}
                      className={`p-4 rounded-xl cursor-pointer transition-all duration-300
                        ${
                          selectedCard === card.title
                            ? 'bg-gradient-to-br from-blue-700/80 to-cyan-700/80 scale-[1.02] shadow-xl'
                            : 'bg-gray-800/50 hover:bg-gradient-to-br hover:from-blue-700/60 hover:to-cyan-700/60'
                        }
                      `}
                    >
                      <div className="text-3xl mb-2">{card.icon}</div>
                      <h3 className="text-lg font-semibold mb-1 text-white">
                        {card.title}
                      </h3>
                      <p className="text-sm text-gray-300">
                        {card.description}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-800/50 rounded-xl p-4 mb-4 min-h-[200px] flex items-start">
                  {loading ? (
                    <div className="flex items-center justify-center w-full">
                      <Loader className="animate-spin h-6 w-6 mr-2 text-blue-400" />
                      <span className="text-gray-300">Processando...</span>
                    </div>
                  ) : (
                    <>
                      <Sparkles className="h-6 w-6 mr-3 text-blue-400" />
                      {!isClearing && (
                        <AnimatedAIText
                          text={aiMessage}
                          className="text-gray-300 leading-relaxed"
                        />
                      )}
                    </>
                  )}
                </div>

                <div className="relative">
                  <div className="flex items-center gap-2 bg-gray-800/50 rounded-full p-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Como posso ajudar você hoje?"
                      className="flex-grow px-4 py-2 bg-transparent text-white placeholder-gray-400 focus:outline-none"
                    />
                    <button
                      className={`px-6 py-2 rounded-full transition-all duration-300
                        ${
                          loading
                            ? 'bg-gray-700 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-700 to-cyan-700 hover:from-blue-600 hover:to-cyan-600'
                        }
                        text-white font-medium shadow-lg`}
                      onClick={() => {
                        if (!loading && selectedCard) {
                          handleCardClick(selectedCard);
                        }
                      }}
                      disabled={loading}
                    >
                      {loading ? 'Enviando...' : 'Enviar'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ReportModal 
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        data={reportData}
      />
    </>
  );
};

export default AIDAHealthAssistant;