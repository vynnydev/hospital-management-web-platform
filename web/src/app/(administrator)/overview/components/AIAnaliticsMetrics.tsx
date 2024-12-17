'use client'
import React, { useEffect, useState, useCallback } from 'react';
import { useHospitalAnalytics } from '@/services/AI/hooks/useHospitalAnalytics';
import {
    ChartBarIcon,
    ExclamationTriangleIcon, 
    ClipboardDocumentCheckIcon,
    ClockIcon,
    ChevronDownIcon,
    BoltIcon,
    UserGroupIcon,
    CogIcon,
    ShieldExclamationIcon,
    ArrowTrendingUpIcon,
    BuildingOfficeIcon,
    ArrowPathIcon,
    InformationCircleIcon
} from '@heroicons/react/24/outline';
import { useTheme } from 'next-themes'
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ColumnContent {
    title: string;
    content: string;
}

interface SubCard {
    title: string;
    icon: React.ReactNode;
    gradient: string;
    content: string;
}

interface Section {
    title: string;
    icon: React.ReactNode;
    gradient: string;
    content: string;
    tooltip: string;
    subCards: SubCard[];
    columns: ColumnContent[];
    actionPlan: string; // Novo campo
}

interface AIAnaliticsMetricsProps {
    onRefresh?: () => void;
}

interface DebugInfo {
    hookAnalysis?: string;
    analysisResult?: string;
    error?: unknown;
}

const cleanText = (text: string) => {
    return text?.replace(/\*/g, '').trim() || "Dados não disponíveis";
};

const AIAnaliticsMetrics: React.FC<AIAnaliticsMetricsProps> = ({ onRefresh }) => {
    const { theme } = useTheme();
    const [expandedSections, setExpandedSections] = useState<boolean[]>(Array(4).fill(true));
    const { loading: isLoading, error, analysis: hookAnalysis, analyzeMetrics } = useHospitalAnalytics();
    const [analysis, setAnalysis] = useState<string>('');
    const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);

    useEffect(() => {
        if (analysis) {
            console.log('Análise completa recebida:', analysis);
            sections.forEach(section => {
                console.log(`\nSeção: ${section.title}`);
                section.subCards.forEach(card => {
                    console.log(`SubCard ${card.title}:`, card.content);
                });
                section.columns.forEach(column => {
                    console.log(`Coluna ${column.title}:`, column.content);
                });
            });
        }
    }, [analysis]);
    
    const fetchAnalysis = async () => {
        try {
            const initialMetrics = {
                occupancyRate: 75,
                totalPatients: 150,
                availableBeds: 50,
                avgStayDuration: 5,
                turnoverRate: 8,
                departmentOccupancy: [
                    { department: "UTI", rate: 80 },
                    { department: "Emergência", rate: 70 }
                ],
                trends: [
                    { metric: "Ocupação", value: 5, direction: "up" },
                    { metric: "Rotatividade", value: 3, direction: "down" }
                ]
            };
    
            const analysisResult = await analyzeMetrics(initialMetrics);
            console.log('Resultado da análise:', analysisResult);
            setAnalysis(analysisResult);
            setDebugInfo((prev: DebugInfo | null) => ({ 
                ...(prev || {}), 
                analysisResult 
            }));
        } catch (error) {
            console.error('Erro ao buscar análise:', error);
            setDebugInfo((prev: DebugInfo | null) => ({ 
                ...(prev || {}), 
                error 
            }));
        }
    };

    const extractSection = (text: string, startMarker: string, endMarker: string) => {
        if (!text) {
            console.log(`Texto vazio para marcadores: ${startMarker} - ${endMarker}`);
            return "";
        }
        
        try {
            // Remove asteriscos duplos dos marcadores para facilitar a busca
            const cleanStartMarker = startMarker.replace(/\*\*/g, '');
            const cleanEndMarker = endMarker ? endMarker.replace(/\*\*/g, '') : '';
            
            // Procura pelo início da seção
            let startIndex = text.indexOf(cleanStartMarker);
            if (startIndex === -1) {
                console.log(`Marcador inicial não encontrado: ${cleanStartMarker}`);
                return "";
            }
            
            // Avança para depois do marcador inicial
            startIndex = startIndex + cleanStartMarker.length;
            
            // Se não houver marcador final, pega até o fim do texto
            if (!cleanEndMarker) {
                return text.substring(startIndex).trim();
            }
            
            // Procura pelo fim da seção
            const endIndex = text.indexOf(cleanEndMarker, startIndex);
            if (endIndex === -1) {
                return text.substring(startIndex).trim();
            }
            
            // Extrai o conteúdo entre os marcadores
            return text.substring(startIndex, endIndex).trim();
        } catch (error) {
            console.error('Erro ao extrair seção:', error);
            return "";
        }
    };

    useEffect(() => {
        if (analysis) {
            setDebugInfo((prev: DebugInfo | null) => ({
                ...(prev || {}),
                hookAnalysis: analysis,
                sections: sections.map(section => ({
                    title: section.title,
                    content: section.content
                }))
            }));
        }
    }, [analysis]);

    useEffect(() => {
        fetchAnalysis();
    }, [analyzeMetrics]);

    const handleRefresh = useCallback(async () => {
        await fetchAnalysis();
        if (onRefresh) {
            onRefresh();
        }
    }, [analyzeMetrics, onRefresh]);

    const toggleSection = (index: number) => {
        const newExpandedSections = [...expandedSections];
        newExpandedSections[index] = !newExpandedSections[index];
        setExpandedSections(newExpandedSections);
    };

    const sections = [
        {
            title: "1. ANÁLISE DA SITUAÇÃO ATUAL",
            icon: <ChartBarIcon className="h-6 w-6" />,
            gradient: "from-emerald-500 to-emerald-700",
            tooltip: "Análise detalhada da situação atual do hospital",
            content: "",
            subCards: [
                {
                    title: "Equilíbrio Capacidade-Demanda",
                    icon: <BuildingOfficeIcon className="h-5 w-5" />,
                    gradient: "from-emerald-400 to-emerald-600",
                    content: cleanText(extractSection(analysis, "**Equilíbrio entre Capacidade e Demanda**", "**Comparação com Padrões do Setor**"))
                },
                {
                    title: "Padrões do Setor",
                    icon: <ArrowTrendingUpIcon className="h-5 w-5" />,
                    gradient: "from-emerald-400 to-emerald-600",
                    content: cleanText(extractSection(analysis, "**Comparação com Padrões do Setor**", "**Padrões nas Tendências Atuais**"))
                }
            ],
            columns: [
                {
                    title: "Tendências Atuais",
                    content: cleanText(extractSection(analysis, "**Padrões nas Tendências Atuais**", "**Impacto das Variações Recentes**"))
                },
                {
                    title: "Variações Recentes",
                    content: cleanText(extractSection(analysis, "**Impacto das Variações Recentes**", "**2. PONTOS CRÍTICOS**"))
                }
            ],
            actionPlan: cleanText(extractSection(analysis, "**Planos de Ação para Situação Atual:**", "**2. PONTOS CRÍTICOS**")),
        },
        {
            title: "2. PONTOS CRÍTICOS",
            icon: <ExclamationTriangleIcon className="h-6 w-6" />,
            gradient: "from-rose-500 to-rose-700",
            tooltip: "Identificação de áreas que requerem atenção imediata",
            content: "",
            subCards: [
                {
                    title: "Ocupação Crítica",
                    icon: <UserGroupIcon className="h-5 w-5" />,
                    gradient: "from-rose-400 to-rose-600",
                    content: cleanText(extractSection(analysis, "**Ocupação Crítica**", "**Gargalos Operacionais**"))
                },
                {
                    title: "Gargalos Operacionais",
                    icon: <ShieldExclamationIcon className="h-5 w-5" />,
                    gradient: "from-rose-400 to-rose-600",
                    content: cleanText(extractSection(analysis, "**Gargalos Operacionais**", "**Riscos Potenciais**"))
                }
            ],
            columns: [
                {
                    title: "Riscos Potenciais",
                    content: cleanText(extractSection(analysis, "**Riscos Potenciais**", "**Variações Significativas**"))
                },
                {
                    title: "Variações Significativas",
                    content: cleanText(extractSection(analysis, "**Variações Significativas**", "**3. RECOMENDAÇÕES DE AÇÃO**"))
                }
            ],
            actionPlan: cleanText(extractSection(analysis, "**Planos de Ação para Pontos Críticos:**", "**3. RECOMENDAÇÕES DE AÇÃO**")),
        },
        {
            title: "3. RECOMENDAÇÕES DE AÇÃO",
            icon: <CogIcon className="h-6 w-6" />,
            gradient: "from-blue-500 to-blue-700",
            tooltip: "Ações recomendadas para otimização do sistema",
            content: "",
            subCards: [
                {
                    title: "Ações Imediatas",
                    icon: <BoltIcon className="h-5 w-5" />,
                    gradient: "from-blue-400 to-blue-600",
                    content: cleanText(extractSection(analysis, "**Ações Imediatas:**", "**Gestão de Recursos:**"))
                },
                {
                    title: "Gestão de Recursos",
                    icon: <ClipboardDocumentCheckIcon className="h-5 w-5" />,
                    gradient: "from-blue-400 to-blue-600",
                    content: cleanText(extractSection(analysis, "**Gestão de Recursos:**", "**Melhorias de Processo:**"))
                }
            ],
            columns: [
                {
                    title: "Melhorias de Processo",
                    content: cleanText(extractSection(analysis, "**Melhorias de Processo:**", "**Medidas Preventivas:**"))
                },
                {
                    title: "Medidas Preventivas",
                    content: cleanText(extractSection(analysis, "**Medidas Preventivas:**", "**4. PREVISÕES"))
                }
            ],
            actionPlan: cleanText(extractSection(analysis, "**Planos de Ação para Recomendações:**", "**4. PREVISÕES**")),
        },
        {
            title: "4. PREVISÕES 24-48h",
            icon: <ClockIcon className="h-6 w-6" />,
            gradient: "from-violet-500 to-violet-700",
            tooltip: "Projeções e previsões para as próximas 24-48 horas",
            content: "",
            subCards: [
                {
                    title: "Projeções de Curto Prazo",
                    icon: <ChartBarIcon className="h-5 w-5" />,
                    gradient: "from-violet-400 to-violet-600",
                    content: cleanText(extractSection(analysis, "**Projeções de Curto Prazo:**", "**Necessidades de Recursos:**"))
                },
                {
                    title: "Necessidades de Recursos",
                    icon: <UserGroupIcon className="h-5 w-5" />,
                    gradient: "from-violet-400 to-violet-600",
                    content: cleanText(extractSection(analysis, "**Necessidades de Recursos:**", "**Cenários e Contingências:**"))
                }
            ],
            columns: [
                {
                    title: "Cenários e Contingências",
                    content: cleanText(extractSection(analysis, "**Cenários e Contingências:**", "**Planos de Ação:**"))
                },
                {
                    title: "Planos de Ação",
                    content: cleanText(extractSection(analysis, "**Planos de Ação:**", ""))
                }
            ],
            actionPlan: cleanText(extractSection(analysis, "**Planos de Ação para Previsões:**", "")),
        }
    ];

    const SubCard = ({ title, icon, gradient, content }: SubCard) => {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl bg-gradient-to-br ${gradient} shadow-md`}
            >
                <div className="flex items-center gap-2 text-white">
                    {icon}
                    <h4 className="font-semibold text-lg">{title}</h4>
                </div>
                <div className="mt-2 text-sm text-white/90 leading-relaxed">
                    {cleanText(content)}
                </div>
            </motion.div>
        );
    };

    const ContentColumn = ({ title, content }: ColumnContent) => {
        console.log(`Renderizando coluna ${title}:`, content);
        return (
            <div className="flex-1">
                <h4 className="text-white/90 font-medium mb-2 text-lg">{title}</h4>
                <div className="text-white/80 text-sm leading-relaxed">
                    {content || "Conteúdo não disponível"}
                </div>
            </div>
        );
    };

    return (
        <TooltipProvider>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full"
            >
                <div className="max-w-[1920px] mx-auto mt-20 bg-slate-100 dark:bg-slate-800 p-6">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                                Análise de Dados Hospitalares
                            </h2>
                            <Tooltip>
                                <TooltipTrigger>
                                    <InformationCircleIcon className="h-6 w-6 text-gray-400" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Análise em tempo real dos indicadores hospitalares</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        <button
                            onClick={handleRefresh}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                        >
                            <ArrowPathIcon className="h-5 w-5" />
                            Atualizar Dados
                        </button>
                    </div>

                    {!analysis && (
                        <div className="text-center p-4rounded-lg bg-slate-100 dark:bg-slate-900">
                            <p>Aguardando dados da análise...</p>
                        </div>
                    )}

                    {analysis && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
                            <AnimatePresence>
                                {sections.map((section, index) => {
                                    console.log(`Renderizando seção ${section.title}:`, {
                                        content: section.content,
                                        columns: section.columns
                                    });
                                    return (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.3, delay: index * 0.1 }}
                                            className={`relative rounded-2xl shadow-xl overflow-hidden bg-gradient-to-br ${section.gradient} backdrop-blur-sm`}
                                        >
                                            <div className="p-8 text-white backdrop-blur-sm bg-black/5">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-3">
                                                        {section.icon}
                                                        <div>
                                                            <h3 className="text-xl font-bold">{section.title}</h3>
                                                            <Tooltip>
                                                                <TooltipTrigger>
                                                                    <p className="text-sm text-white/80 mt-1 cursor-help">
                                                                        Clique para mais detalhes
                                                                    </p>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>{section.tooltip}</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => toggleSection(index)}
                                                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                                    >
                                                        <ChevronDownIcon 
                                                            className={`h-6 w-6 transition-transform ${expandedSections[index] ? 'rotate-180' : ''}`}
                                                        />
                                                    </button>
                                                </div>

                                                <AnimatePresence>
                                                {expandedSections[index] && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="mt-6 space-y-6"
                                                    >
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                {section.subCards.map((subCard, subIndex) => (
                                                                    <SubCard key={subIndex} {...subCard} />
                                                                ))}
                                                            </div>
                                                            
                                                            <div className="border-t border-white/10 pt-4">
                                                                <div className="flex flex-col md:flex-row gap-6">
                                                                    {section.columns.map((column, colIndex) => (
                                                                        <ContentColumn key={colIndex} {...column} />
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            <div className="border-t border-white/10 pt-4 mt-4">
                                                                <div className="bg-white/10 rounded-xl p-4">
                                                                    <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                                                                        <ClipboardDocumentCheckIcon className="h-5 w-5" />
                                                                        Plano de Ação
                                                                    </h4>
                                                                    <p className="text-white/90 text-sm leading-relaxed">
                                                                        {section.actionPlan || "Plano de ação não disponível"}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    )}

                    {isLoading && (
                        <div className="flex justify-center items-center mt-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                        </div>
                    )}

                    {error && (
                        <div className="mt-8 p-4 bg-red-100 text-red-700 rounded-lg">
                            <p>Erro ao carregar os dados. Por favor, tente novamente.</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </TooltipProvider>
    );
};

export default AIAnaliticsMetrics;