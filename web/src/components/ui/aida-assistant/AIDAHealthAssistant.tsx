/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { Sparkles, Loader } from 'lucide-react';

import AnimatedAIText from './AnimatedAIText';
import aiAssistant from '@/assets/ai-assistant.png'

interface AIResponse {
  response: string;
  confidence: number;
  metadata?: any;
}

const initialMessage = 'Olá! Sou AIDA, sua assistente virtual especializada em saúde. ' +
'Posso ajudar com gestão de pacientes, análise de prontuários, agendamentos e muito mais. ' +
'Como posso auxiliar você hoje?';

const AIDAHealthAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [aiMessage, setAiMessage] = useState(initialMessage);
  const [loading, setLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const { theme } = useTheme();

  const getCurrentContext = () => {
    // Implementar lógica para obter contexto específico baseado na funcionalidade selecionada
    return {
      selectedCard,
      currentTime: new Date().toISOString(),
      // Adicionar outros dados contextuais relevantes
    };
  };

  // Modificar a função toggleAssistant para resetar o estado quando fechar
  const toggleAssistant = () => {
    if (isOpen) {
      // Reset todos os estados relevantes quando fechar
      setMessage('');
      setAiMessage(initialMessage);
      setSelectedCard(null);
    }
    setIsOpen(!isOpen);
  };

  // Modificar o handleCardClick para tratar erros adequadamente
  const handleCardClick = async (cardTitle: string) => {
    setSelectedCard(cardTitle);
    setLoading(true);
    try {
      const response = await fetch('/api/ai-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          functionality: cardTitle,
          query: message,
          context: getCurrentContext()
        })
      });
      
      if (!response.ok) {
        throw new Error('Erro na resposta da API');
      }
  
      const data: AIResponse = await response.json();
      setAiMessage(data.response);
    } catch (error: any) {
      // Define apenas a mensagem de erro
      setAiMessage('Desculpe, ocorreu um erro ao processar sua solicitação. ');
      // Após 3 segundos, substitui pela mensagem inicial
      setTimeout(() => {
        setAiMessage(initialMessage);
        setSelectedCard(null);
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  // Modificar o useEffect do Escape key para também resetar os estados
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setMessage('');
        setAiMessage(initialMessage);
        setSelectedCard(null);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const cards = [
    { 
      icon: '🏥', 
      title: 'Gestão de Pacientes', 
      description: 'Monitore em tempo real sinais vitais, histórico médico e evolução dos pacientes. Alertas automáticos para alterações críticas.'
    },
    { 
      icon: '📋', 
      title: 'Prontuário Digital', 
      description: 'Acesse e atualize prontuários eletrônicos com histórico completo, exames, prescrições e evolução do tratamento de forma integrada.'
    },
    { 
      icon: '🗓️', 
      title: 'Agenda Médica', 
      description: 'Gerencie consultas, procedimentos e cirurgias. Sistema inteligente de priorização e distribuição de horários com base na urgência.'
    },
    { 
      icon: '💊', 
      title: 'Gestão de Medicamentos', 
      description: 'Controle estoque, validade e dispensação de medicamentos. Alertas de interações medicamentosas e necessidade de reposição.'
    },
    { 
      icon: '🔬', 
      title: 'Resultados de Exames', 
      description: 'Acesse resultados de exames laboratoriais e de imagem, com análise comparativa e histórico completo do paciente.'
    },
    { 
      icon: '⚕️', 
      title: 'Suporte à Decisão Clínica', 
      description: 'Recomendações baseadas em evidências para diagnósticos e tratamentos, utilizando IA para análise de casos similares.'
    }
  ];

  return (
    <>
      <button
        onClick={toggleAssistant}
        className={`fixed bottom-8 left-[1550px] rounded-full p-6 shadow-lg transition-all duration-300 z-50 w-24 h-24 flex items-center justify-center hover:scale-110
          ${theme === 'dark' 
            ? 'dark-assistant-button' 
            : 'light-assistant-button'
          }`}
        aria-label="Open AIDA Assistant"
      >
        <Image
          src={aiAssistant}
          alt="AI Assistant Icon"
          width={64}
          height={64}
          className="object-contain"
          priority
        />
      </button>

      {isOpen && (
        <div className={`fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50 
          ${theme === 'dark' ? 'bg-black/50' : 'bg-gray-500/30'}`}>
          <div className="relative w-full max-w-4xl h-[90vh] m-4">
            <div className="absolute inset-0 overflow-hidden rounded-lg" style={{ margin: '-12px' }}>
              <div className={`colorful-border ${theme === 'dark' ? 'dark-border' : 'light-border'}`}></div>
            </div>
            <div className={`relative z-10 rounded-lg shadow-xl h-full p-6 flex flex-col
              ${theme === 'dark' 
                ? 'bg-gray-800/80 backdrop-blur-md' 
                : 'bg-gray-200/90 backdrop-blur-md'}`}>
              <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Explore
              </h2>

              <div className="grid grid-cols-3 gap-4 mb-6">
                {cards.map((card, index) => (
                  <div
                    key={index}
                    onClick={() => handleCardClick(card.title)}
                    className={`p-4 rounded-lg cursor-pointer transition-all duration-300 hover:scale-105
                      ${theme === 'dark' 
                        ? 'bg-gray-700/50 hover:bg-gradient-to-r hover:from-blue-900 hover:to-cyan-800' 
                        : 'bg-gray-300/70 hover:bg-gradient-to-r hover:from-blue-400 hover:to-cyan-500'}
                      ${selectedCard === card.title ? 'ring-2 ring-blue-500' : ''}`}
                  >
                    <div className="text-3xl mb-2">{card.icon}</div>
                    <h3 className={`text-lg font-semibold mb-1 
                      ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {card.title}
                    </h3>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      {card.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className={`rounded-lg p-4 flex items-center mb-4 h-full
                ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-300/70'}`}>
                {loading ? (
                  <div className="flex items-center justify-center w-full">
                    <Loader className="animate-spin h-6 w-6 mr-2" />
                    <span>Processando...</span>
                  </div>
                ) : (
                  <>
                    <Sparkles className={`h-6 w-6 mr-3 
                      ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                    <AnimatedAIText 
                      text={aiMessage} 
                      className={`italic ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}
                    />
                  </>
                )}
              </div>

              <div className="mt-auto">
                <div className={`rounded-full overflow-hidden flex items-center p-2
                  ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-300/70'}`}>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask me anything..."
                    className={`flex-grow px-4 py-2 bg-transparent focus:outline-none
                      ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                  />
                  <button
                    className={`colorful-button text-white px-6 py-2 rounded-full
                      ${theme === 'dark' ? 'dark-button' : 'light-button'}
                      ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
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

            <button
              onClick={() => setIsOpen(false)}
              className={`absolute top-2 right-2 hover:text-white z-20
                ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
              aria-label="Close AIDA Assistant"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        .dark-assistant-button {
          background: linear-gradient(135deg, #0F172A, #155E75);
          box-shadow: 0 0 20px rgba(15,23,42,0.5), 0 0 40px rgba(21,94,117,0.3);
        }

        .dark-assistant-button::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(
            45deg,
            #0F172A,
            #164E63,
            #155E75,
            #1E293B
          );
          border-radius: inherit;
          z-index: -1;
          animation: animatedBorder 8s linear infinite;
        }

        .light-assistant-button {
          background: linear-gradient(135deg, #64748B, #0EA5E9);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .light-assistant-button::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(
            45deg,
            #64748B,
            #0EA5E9,
            #38BDF8,
            #7DD3FC
          );
          border-radius: inherit;
          z-index: -1;
          animation: animatedBorder 8s linear infinite;
        }

        .dark-border {
          background: linear-gradient(
            45deg,
            #0F172A,
            #164E63,
            #155E75,
            #1E293B
          );
        }

        .light-border {
          background: linear-gradient(
            45deg,
            #64748B,
            #0EA5E9,
            #38BDF8,
            #7DD3FC
          );
        }

        .dark-button {
          background: linear-gradient(
            45deg,
            #0F172A,
            #164E63,
            #155E75,
            #1E293B
          );
        }

        .light-button {
          background: linear-gradient(
            45deg,
            #64748B,
            #0EA5E9,
            #38BDF8,
            #7DD3FC
          );
        }

        .colorful-border {
          position: absolute;
          inset: -5%;
          border-radius: inherit;
          filter: blur(8px);
          opacity: 0.8;
          animation: expand 3s ease-in-out infinite;
        }

        .colorful-button {
          position: relative;
          background-size: 300% 300%;
          animation: gradient 15s ease infinite;
        }

        .ai-text-container {
          position: relative;
          background: linear-gradient(45deg, rgba(0,128,255,0.1), rgba(0,255,255,0.1));
          border-radius: 8px;
          padding: 1rem;
          overflow: hidden;
        }

        .ai-text-container::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, #00f, #0ff);
          z-index: -1;
          filter: blur(10px);
          opacity: 0.2;
          animation: borderFlow 3s infinite linear;
        }

        .colorful-button {
          background: linear-gradient(90deg, #2c5282 0%, #2b6cb0 100%);
          transition: all 0.3s ease;
        }

        .colorful-button:hover:not(:disabled) {
          background: linear-gradient(90deg, #2747a8 0%, #275c8f 100%);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(30, 58, 138, 0.3);
        }

        .colorful-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .dark-button {
          background: linear-gradient(90deg, #2c5282 0%, #2b6cb0 100%);
        }

        .light-button {
          background: linear-gradient(90deg, #2c5282 0%, #2b6cb0 100%);
        }

        @keyframes borderFlow {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes expand {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.6;
          }
          100% {
            transform: scale(1);
            opacity: 0.8;
          }
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes borderGlow {
          0% {
            filter: hue-rotate(0deg) brightness(0.8);
          }
          50% {
            filter: hue-rotate(180deg) brightness(1);
          }
          100% {
            filter: hue-rotate(360deg) brightness(0.8);
          }
        }

        @keyframes glowPulse {
          0% {
            filter: brightness(0.8) blur(8px);
            transform: scale(1);
          }
          50% {
            filter: brightness(1.2) blur(12px);
            transform: scale(1.05);
          }
          100% {
            filter: brightness(0.8) blur(8px);
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
};

export default AIDAHealthAssistant;