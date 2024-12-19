/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { Sparkles, Loader } from 'lucide-react';

import AnimatedAIText from './AnimatedAIText';
import aiAssistant from '@/assets/ai-assistant.png'

import { PatientRiskAnalysis } from '@/services/AI/aida-assistant/patientAnalysis';

import ReportModal from './ReportModal';
import { Card, cardInitialMessages, CardTitle, formatAIResponse, initialMessage, ReportType } from './utils/aidaAssistantFunctions';

const AIDAHealthAssistant: React.FC = () => {
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [aiMessage, setAiMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportType, setReportType] = useState<ReportType>('evolucao');
  const [isClearing, setIsClearing] = useState(false);
  const [reportData, setReportData] = useState<any>(null); // Estado para os dados do relatório

  // Modificar a função toggleAssistant para resetar o estado quando fechar
  const toggleAssistant = () => {
    if (!isOpen) {
      // Quando abrir, mostra a mensagem inicial
      setAiMessage(initialMessage);
    } else {
      // Quando fechar, limpa tudo
      setMessage('');
      setAiMessage('');
      setSelectedCard(null);
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isOpen) {
      setAiMessage(initialMessage);
    }
  }, [isOpen]);
  
  // Modificar a função handleCardClick para usar o histórico
  const handleCardClick = async (cardTitle: string) => {
    setSelectedCard(cardTitle);
    setLoading(true);
    setIsClearing(true);
    
    try {
      // Limpa completamente antes de definir nova mensagem
      setAiMessage('');
      await new Promise(resolve => setTimeout(resolve, 10));
      setIsClearing(false);
      
      setAiMessage(cardInitialMessages[cardTitle as CardTitle]);
  
      const selectedCardData = cards.find(card => card.title === cardTitle);
  
      if (selectedCardData?.aiHandler && message) {
        const result = await selectedCardData.aiHandler(message);
  
        if (result.report) {
          setReportData(result.report);
          setReportType(cardTitle.toLowerCase() as ReportType);
          setIsReportModalOpen(true);
        }
  
        // Substitui a mensagem anterior em vez de adicionar ao histórico
        setAiMessage(formatAIResponse(result));
      }
    } catch (error: any) {
      console.error('Erro ao processar card:', error);
      setAiMessage(`Erro ao processar: ${error.message}`);
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
        setAiMessage('');
        setSelectedCard(null);
      }
    };
  
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const cards: Card[] = [
    { 
      icon: '🏥', 
      title: 'Gestão de Pacientes', 
      description: 'Monitore em tempo real sinais vitais, histórico médico e evolução dos pacientes. Alertas automáticos para alterações críticas.',
      aiHandler: async (patientId: string) => {
        const response = await fetch(`http://localhost:3001/patients/${patientId}`);
        if (!response.ok) throw new Error('Paciente não encontrado');
        
        const patientData = await response.json();
        const riskAnalyzer = new PatientRiskAnalysis();
        const analysis = await riskAnalyzer.analyzePatient(patientData);

        // Formata os dados para o relatório
        const reportData = {
          title: 'Relatório de Análise do Paciente',
          sections: [
            {
              title: 'Informações do Paciente',
              content: `
                Nome: ${patientData.name}
                ID: ${patientData.id}
                Idade: ${patientData.age}
                Último Atendimento: ${new Date(patientData.lastVisit).toLocaleDateString()}
              `
            },
            {
              title: 'Análise de Risco',
              content: `
                Nível de Risco: ${analysis.riskAnalysis.overallRisk.level}
                Tendência: ${analysis.riskAnalysis.vitalTrends}
                Alertas: ${analysis.analysis.alerts.join(', ')}
              `
            },
            {
              title: 'Recomendações',
              content: analysis.analysis.recommendations.join('\n')
            }
          ],
          downloadable: true,
          charts: [
            {
              type: 'line',
              title: 'Evolução dos Sinais Vitais',
              data: analysis.analysis.vitalSignsTrend
            }
          ]
        };

        <ReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          reportType={reportType}
          patientData={reportData}
        />

        return {
          analysis,
          report: reportData
        };
      }
    },
    { 
      icon: '📋', 
      title: 'Prontuário Digital', 
      description: 'Acesse e atualize prontuários eletrônicos com histórico completo, exames, prescrições e evolução do tratamento de forma integrada.',
      aiHandler: async (recordId: string) => {
        const response = await fetch(`http://localhost:3001/patients/${recordId}/records`);
        if (!response.ok) throw new Error('Prontuário não encontrado');
        
        const recordData = await response.json();
        const riskAnalyzer = new PatientRiskAnalysis();
        const analysis = await riskAnalyzer.analyzePatient(recordData);

        const reportData = {
          title: 'Relatório do Prontuário Digital',
          sections: [
            {
              title: 'Histórico de Tratamentos',
              content: recordData.treatments.map((t: any) => 
                `${t.date}: ${t.procedure} - ${t.outcome}`
              ).join('\n')
            },
            {
              title: 'Exames Recentes',
              content: recordData.exams.map((e: any) => 
                `${e.date}: ${e.type} - ${e.result}`
              ).join('\n')
            },
            {
              title: 'Medicações Atuais',
              content: recordData.medications.map((m: any) => 
                `${m.name}: ${m.dosage} - ${m.frequency}`
              ).join('\n')
            }
          ],
          downloadable: true
        };

        <ReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          reportType={reportType}
          patientData={reportData}
        />

        return {
          recordAnalysis: analysis,
          report: reportData
        };
      }
    },
    { 
      icon: '🗓️', 
      title: 'Agenda Médica', 
      description: 'Gerencie consultas, procedimentos e cirurgias. Sistema inteligente de priorização e distribuição de horários com base na urgência.',
      aiHandler: async (scheduleQuery: string) => {
        const response = await fetch(`http://localhost:3001/staff/schedule`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: scheduleQuery })
        });
        
        if (!response.ok) throw new Error('Erro ao acessar agenda');
        
        const scheduleData = await response.json();

        const reportData = {
          title: 'Relatório de Agenda Médica',
          sections: [
            {
              title: 'Horários Disponíveis',
              content: scheduleData.slots.map((s: any) => 
                `${s.date} ${s.time}: ${s.type}`
              ).join('\n')
            },
            {
              title: 'Casos Urgentes',
              content: scheduleData.urgent.map((u: any) => 
                `Paciente: ${u.patient} - Prioridade: ${u.priority}`
              ).join('\n')
            },
            {
              title: 'Recomendações de Agendamento',
              content: scheduleData.recommendations.join('\n')
            }
          ],
          downloadable: true,
          charts: [
            {
              type: 'calendar',
              title: 'Visão Mensal',
              data: scheduleData.monthlyView
            }
          ]
        };

        <ReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          reportType={reportType}
          patientData={reportData}
        />

        return {
          scheduleData,
          report: reportData
        };
      }
    },
    { 
      icon: '💊', 
      title: 'Gestão de Medicamentos', 
      description: 'Controle estoque, validade e dispensação de medicamentos. Alertas de interações medicamentosas e necessidade de reposição.',
      aiHandler: async (medicationQuery: string) => {
        const response = await fetch(`http://localhost:3001/medications/inventory`);
        if (!response.ok) throw new Error('Erro ao acessar inventário de medicamentos');
        
        const medicationData = await response.json();
        const riskAnalyzer = new PatientRiskAnalysis();
        const interactions = await riskAnalyzer.checkMedicationInteractions(medicationData.medications);

        const reportData = {
          title: 'Relatório de Gestão de Medicamentos',
          sections: [
            {
              title: 'Status do Inventário',
              content: medicationData.stock.map((s: any) => 
                `${s.name}: ${s.quantity} unidades - Validade: ${s.expiration}`
              ).join('\n')
            },
            {
              title: 'Alertas de Validade',
              content: medicationData.expiring.map((e: any) => 
                `${e.name}: Vence em ${e.daysUntilExpiration} dias`
              ).join('\n')
            },
            {
              title: 'Interações Medicamentosas',
              content: interactions.map((i: any) => 
                `${i.drugs.join(' + ')}: ${i.severity} - ${i.effect}`
              ).join('\n')
            }
          ],
          downloadable: true,
          charts: [
            {
              type: 'bar',
              title: 'Níveis de Estoque',
              data: medicationData.stockLevels
            }
          ]
        };

        <ReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          reportType={reportType}
          patientData={reportData}
        />

        return {
          inventoryData: medicationData,
          report: reportData
        };
      }
    },
    { 
      icon: '🔬', 
      title: 'Resultados de Exames', 
      description: 'Acesse resultados de exames laboratoriais e de imagem, com análise comparativa e histórico completo do paciente.',
      aiHandler: async (examId: string) => {
        const response = await fetch(`http://localhost:3001/patients/exams/${examId}`);
        if (!response.ok) throw new Error('Resultados não encontrados');
        
        const examData = await response.json();
        const riskAnalyzer = new PatientRiskAnalysis();
        const comparison = await riskAnalyzer.compareExamHistory(examData.history);

        const reportData = {
          title: 'Relatório de Resultados de Exames',
          sections: [
            {
              title: 'Resultados Atuais',
              content: examData.results.map((r: any) => 
                `${r.test}: ${r.value} ${r.unit} (Ref: ${r.reference})`
              ).join('\n')
            },
            {
              title: 'Análise Comparativa',
              content: comparison.map((c: any) => 
                `${c.test}: ${c.trend} (Variação: ${c.variation})`
              ).join('\n')
            },
            {
              title: 'Recomendações',
              content: examData.recommendations.join('\n')
            }
          ],
          downloadable: true,
          charts: [
            {
              type: 'line',
              title: 'Evolução Temporal',
              data: examData.history
            }
          ]
        };

        <ReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          reportType={reportType}
          patientData={reportData}
        />

        return {
          examData,
          report: reportData
        };
      }
    },
    { 
      icon: '⚕️', 
      title: 'Suporte à Decisão Clínica', 
      description: 'Recomendações baseadas em evidências para diagnósticos e tratamentos, utilizando IA para análise de casos similares.',
      aiHandler: async (caseData: string) => {
        const response = await fetch(`http://localhost:3001/clinical-support`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ case: caseData })
        });
        
        if (!response.ok) throw new Error('Erro na análise clínica');
        
        const clinicalData = await response.json();
        const riskAnalyzer = new PatientRiskAnalysis();
        const similarCases = await riskAnalyzer.analyzeSimilarCases(clinicalData.cases);

        const reportData = {
          title: 'Relatório de Suporte à Decisão Clínica',
          sections: [
            {
              title: 'Sugestões de Diagnóstico',
              content: clinicalData.diagnoses.map((d: any) => 
                `${d.condition} (${d.probability}%) - ${d.evidence}`
              ).join('\n')
            },
            {
              title: 'Opções de Tratamento',
              content: clinicalData.treatments.map((t: any) => 
                `${t.treatment}: ${t.efficacy} - ${t.considerations}`
              ).join('\n')
            },
            {
              title: 'Casos Similares',
              content: similarCases.map((c: any) => 
                `Caso ${c.id}: ${c.outcome} (${c.similarity}% similar)`
              ).join('\n')
            }
          ],
          downloadable: true,
          charts: [
            {
              type: 'radar',
              title: 'Análise Multifatorial',
              data: clinicalData.factors
            }
          ]
        };

        <ReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          reportType={reportType}
          patientData={reportData}
        />

        return {
          clinicalData,
          report: reportData
        };
      }
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
                      {!isClearing && <AnimatedAIText text={aiMessage} 
                        className={`italic ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} />
                      }
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