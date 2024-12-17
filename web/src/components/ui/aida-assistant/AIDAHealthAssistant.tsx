'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';

import aiAssistant from '@/assets/ai-assistant.png'

const IAgrixiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [aiMessage] = useState('Aqui estará a mensagem gerada pela inteligência artificial...');

  const toggleAssistant = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
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
        className="fixed bottom-8 left-[1450px] text-white rounded-full p-6 shadow-lg transition-all duration-300 z-50 w-24 h-24 flex items-center justify-center hover:scale-110 ai-gradient-bg"
        aria-label="Open Agrixi Assistant"
      >
        <Image
          src={aiAssistant} // Substitua pelo caminho correto da sua imagem
          alt="AI Assistant Icon"
          width={64} // Tamanho em pixels
          height={64} // Tamanho em pixels
          className="object-contain" // Mantém a proporção da imagem
          priority // Carrega a imagem com prioridade por ser um elemento importante
        />
      </button>


      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="relative w-full max-w-4xl h-[90vh] m-4">
            <div className="absolute inset-0 overflow-hidden rounded-lg" style={{ margin: '-12px' }}>
              <div className="colorful-border"></div>
            </div>
            <div className="relative z-10 bg-gray-800 bg-opacity-80 backdrop-blur-md rounded-lg shadow-xl h-full p-6 flex flex-col">
              <h2 className="text-2xl font-bold mb-6 text-white">Explore</h2>

              <div className="grid grid-cols-3 gap-4 mb-6">
                {cards.map((card, index) => (
                  <div key={index} className="bg-gray-700 bg-opacity-50 p-4 rounded-lg">
                    <div className="text-3xl mb-2">{card.icon}</div>
                    <h3 className="text-lg font-semibold text-white mb-1">{card.title}</h3>
                    <p className="text-sm text-gray-300">{card.description}</p>
                  </div>
                ))}
              </div>

              <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4 flex items-center mb-4 h-full">
                <Sparkles className="h-6 w-6 text-gray-400 mr-3" />
                <p className="text-gray-300 italic">{aiMessage}</p>
              </div>

              <div className="mt-auto">
                <div className="bg-gray-700 bg-opacity-50 rounded-full overflow-hidden flex items-center p-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask me anything..."
                    className="flex-grow px-4 py-2 bg-transparent focus:outline-none text-white"
                  />
                  <button
                    className="colorful-button text-white px-6 py-2 rounded-full"
                    onClick={() => {
                      console.log(message);
                      setMessage('');
                    }}
                  >
                    Enviar
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-white z-20"
              aria-label="Close Agrixi Assistant"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        .ai-gradient-bg {
          position: relative;
          background: linear-gradient(135deg, #0F172A, #155E75);
          box-shadow: 0 0 20px rgba(15,23,42,0.5), 0 0 40px rgba(21,94,117,0.3);
        }

        .ai-gradient-bg::before {
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

        .colorful-border {
          position: absolute;
          inset: -2px;
          background: linear-gradient(
            45deg,
            #0F172A,
            #164E63,
            #155E75,
            #1E293B
          );
          border-radius: inherit;
          filter: blur(8px);
          opacity: 0.8;
          animation: expand 3s ease-in-out infinite;
        }

        .colorful-button {
          position: relative;
          background: linear-gradient(
            45deg,
            #0F172A,
            #164E63,
            #155E75,
            #1E293B
          );
          background-size: 300% 300%;
          animation: gradient 20s ease infinite;
        }

        @keyframes animatedBorder {
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

        .ai-gradient-bg::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 2px;
          background: linear-gradient(
            45deg,
            #0F172A,
            #164E63,
            #155E75,
            #1E293B
          );
          -webkit-mask: 
            linear-gradient(#fff 0 0) content-box, 
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          animation: borderGlow 8s linear infinite;
        }

        .relative.w-full.max-w-4xl::after {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: inherit;
          background: linear-gradient(
            45deg,
            #0F172A,
            #164E63,
            #155E75,
            #1E293B
          );
          z-index: -1;
          animation: glowPulse 3s ease-in-out infinite;
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

export default IAgrixiAssistant;