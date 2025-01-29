/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useRef } from 'react';
import { 
    X, 
    Accessibility,
    Volume2,
    Eye,
    Calendar,
    Brain,
    FileText,
    ChevronRight,
    ChevronLeft,
    MessageSquare,
    Bot
} from 'lucide-react';
import { LineChart, XAxis, YAxis, Tooltip, Line, ResponsiveContainer } from 'recharts';
import { TFontSize, IGeneratedData } from '../types/types';
import { AIPatientAssistant } from './AIPatientAssistant';
import { Card, CardContent } from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';
import { QRCodeCanvas } from 'qrcode.react';
import { IPatient } from '@/types/hospital-network-types';
import {
    getPatientVitals,
    getPatientMedications,
    getLatestProcedure,
    getLatestStatus,
    generateCarePlanPrompt
} from '@/utils/patientDataUtils';

interface PatientCardModalProps {
    selectedPatient: IPatient | null;
    setSelectedPatient: (patient: IPatient | null) => void;
    generateData: (patient: IPatient) => Promise<void>;
    isHighContrast: boolean;
    setIsHighContrast: React.Dispatch<React.SetStateAction<boolean>>;
    setShowAudioControls: React.Dispatch<React.SetStateAction<boolean>>;
    showAudioControls: boolean;
    setFontSize: (size: TFontSize) => void;
    fontSize: TFontSize;
    aiQuery: string;
    setAiQuery: React.Dispatch<React.SetStateAction<string>>;
    generatedData: IGeneratedData;
    setCurrentUtterance: React.Dispatch<React.SetStateAction<SpeechSynthesisUtterance | null>>;
    setSynthesis: React.Dispatch<React.SetStateAction<SpeechSynthesis | null>>;
    synthesis: SpeechSynthesis | null;
}

export const PatientCardModal: React.FC<PatientCardModalProps> = ({
    selectedPatient,
    setSelectedPatient,
    generateData,
    isHighContrast,
    setIsHighContrast,
    setShowAudioControls,
    showAudioControls,
    fontSize,
    setFontSize,
    aiQuery,
    setAiQuery,
    generatedData,
    setCurrentUtterance,
    setSynthesis,
    synthesis
}) => {
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);
    const [aiResponse, setAiResponse] = useState<string>("");
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const mockReports = [
        { title: "Análise de Evolução Clínica", date: "2024-01-08", type: "Clínico" },
        { title: "Avaliação de Riscos", date: "2024-01-07", type: "Risco" },
        { title: "Relatório de Medicações", date: "2024-01-06", type: "Medicação" },
        { title: "Análise de Exames", date: "2024-01-05", type: "Exames" }
    ];

    const commonQuestions = [
        {
            category: "Sinais Vitais",
            questions: [
                "Analisar tendências dos sinais vitais",
                "Avaliar risco cardíaco atual",
                "Verificar padrão respiratório"
            ]
        },
        {
            category: "Medicações",
            questions: [
                "Verificar interações medicamentosas",
                "Sugerir ajustes de dosagem",
                "Analisar eficácia do tratamento"
            ]
        },
        {
            category: "Prognóstico",
            questions: [
                "Estimar tempo de recuperação",
                "Avaliar riscos de complicações",
                "Sugerir próximas etapas"
            ]
        }
    ];

    const handleSlideLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
        }
    };

    const handleSlideRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
        }
    };

    const handleAIQuestion = async (question: string) => {
        if (!selectedPatient) return;
    
        setIsGeneratingAI(true);
        setAiQuery(question);
        try {
            await generateData(selectedPatient);
            setAiResponse("Baseado na análise dos dados do paciente...");
        } catch (error) {
            console.error('Erro ao gerar resposta:', error);
            setAiResponse("Erro ao gerar resposta. Por favor, tente novamente.");
        } finally {
            setIsGeneratingAI(false);
        }
    };

    const getContrastClass = (baseClass: string) => {
        if (!isHighContrast) return baseClass;
        return `${baseClass} contrast-high brightness-110`;
    };

    const generateProgressData = () => {
        if (!selectedPatient) return [];
        
        // Usar a função getPatientVitals para obter os dados de sinais vitais
        const vitals = getPatientVitals(selectedPatient);
        
        // Criar dados para o gráfico
        return [{
            date: new Date().toLocaleDateString(),
            heartRate: vitals.heartRate,
            temperature: vitals.temperature,
            oxygenSaturation: vitals.oxygenSaturation
        }];
    };

    if (!selectedPatient) return null;

    const latestStatus = getLatestStatus(selectedPatient);
    const medications = getPatientMedications(selectedPatient);
    const latestProcedure = getLatestProcedure(selectedPatient);

    console.log("Paciente recebido no Modal:", selectedPatient.name)

    return (
        <div className='p-8'>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className={getContrastClass("p-4 bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto")}>
                    {/* Barra de Acessibilidade */}
                    <div className="bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-600 p-3 flex items-center justify-between rounded-xl">
                        <div className="flex items-center gap-2">
                            <Accessibility className="w-5 h-5 text-blue-500" />
                            <span className="text-sm font-medium">Recursos de Acessibilidade</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsHighContrast(!isHighContrast)}
                                className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-600 transition-all"
                                aria-label="Alternar alto contraste"
                            >
                                <Eye className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setShowAudioControls(!showAudioControls)}
                                className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-600 transition-all"
                                aria-label="Controles de áudio"
                            >
                                <Volume2 className="w-5 h-5" />
                            </button>
                            <select
                                value={fontSize}
                                onChange={(e) => setFontSize(e.target.value as TFontSize)}
                                className="p-2 rounded-lg bg-transparent border border-gray-200 dark:border-gray-500"
                            >
                                <option value="normal">Fonte: Normal</option>
                                <option value="large">Fonte: Grande</option>
                                <option value="extra-large">Fonte: Extra Grande</option>
                            </select>
                        </div>
                    </div>

                    {/* Cabeçalho do Paciente */}
                    <div className="bg-gradient-to-r from-blue-500 to-teal-500 dark:from-blue-700 dark:to-teal-700 p-8 rounded-xl relative">
                        <button
                            onClick={() => setSelectedPatient(null)}
                            className="absolute right-4 top-4 text-white hover:bg-white/20 p-2 rounded-lg transition-all"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-2">
                                    {selectedPatient.name}
                                </h2>
                                <div className="text-blue-50 space-y-2">
                                    <p className="text-lg">{selectedPatient.diagnosis}</p>
                                    <p className="text-sm">
                                        Admissão: {new Date(selectedPatient.admissionDate).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Seção de Recomendações da IA */}
                    <AIPatientAssistant 
                        fontSize={fontSize}
                        showAudioControls={showAudioControls}
                        generatedData={generatedData}
                        isHighContrast={isHighContrast}
                        setCurrentUtterance={setCurrentUtterance}
                        setSynthesis={setSynthesis}
                        setShowAudioControls={setShowAudioControls}
                        synthesis={synthesis}
                    />

                    {/* O trecho abaixo precisa ser corrigido */}
                    {/* Seção de Sinais Vitais */}
                    <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mt-4'>
                        <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                            Sinais Vitais
                        </h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={generateProgressData()}>
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line 
                                        type="monotone" 
                                        dataKey="heartRate" 
                                        stroke="#ef4444" 
                                        name="Freq. Cardíaca"
                                        strokeWidth={2}
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="temperature" 
                                        stroke="#f97316" 
                                        name="Temperatura"
                                        strokeWidth={2}
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="oxygenSaturation" 
                                        stroke="#0ea5e9" 
                                        name="Saturação"
                                        strokeWidth={2}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-8">
                        {/* Análise de Risco */}
                        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 shadow-lg">
                            <h4 className="font-semibold text-gray-800 dark:text-white mb-2 flex items-center">
                                <span className="mr-2">📊</span> Análise de Risco
                            </h4>
                            <div className="space-y-2">
                                {/* Usando eventos do careHistory para análise de risco */}
                                <p className="text-gray-600 dark:text-gray-300 flex items-center">
                                    <span className="mr-2">📈</span> Score de Risco: {
                                        selectedPatient.careHistory?.events
                                            .filter(e => e.type === 'exam' && e.details?.examType === 'risk-assessment')
                                            .slice(-1)[0]?.details?.riskScore || 'N/A'
                                    }
                                </p>
                                <p className="text-gray-600 dark:text-gray-300 flex items-center">
                                    <span className="mr-2">🕰️</span> Permanência Prevista até: {
                                        selectedPatient.expectedDischarge 
                                            ? new Date(selectedPatient.expectedDischarge).toLocaleDateString() 
                                            : 'N/A'
                                    }
                                </p>
                                <div className="text-gray-600 dark:text-gray-300">
                                    <p className="font-semibold flex items-center">
                                        <span className="mr-2">⚠️</span> Fatores de Risco:
                                    </p>
                                    <ul className="list-disc list-inside">
                                        {(() => {
                                            const lastRiskAssessment = selectedPatient.careHistory?.events
                                                .filter(e => e.type === 'exam' && e.details?.examType === 'risk-assessment')
                                                .slice(-1)[0];

                                            const riskFactors = lastRiskAssessment?.details?.riskFactors;

                                            if (Array.isArray(riskFactors) && riskFactors.length > 0) {
                                                return riskFactors.map((factor, index) => (
                                                    <li key={index}>{factor}</li>
                                                ));
                                            }
                                            
                                            return <li>Nenhum fator de risco registrado</li>;
                                        })()}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Seção de anexos */}
                        <div className="mt-8">
                            <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Anexar Relatórios</h4>
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex justify-center items-center cursor-pointer">
                                📎 <span className="ml-2">Clique para Anexar Documentos</span>
                            </div>
                        </div>
                    </div>


                    {/* Medicações e Procedimentos */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            {/* Medicações */}
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mt-4">
                                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                                    Medicações Atuais
                                </h4>
                                <div className="space-y-2">
                                    {selectedPatient.careHistory?.events
                                        .filter(event => event.type === 'medication')
                                        .map((med, index) => (
                                            <div 
                                                key={index}
                                                className="p-2 bg-gray-100 dark:bg-gray-600 rounded-lg"
                                            >
                                                <p className="font-medium text-gray-800 dark:text-white">
                                                    {med.details?.medicationName}
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                                    {med.description}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    Data: {new Date(med.timestamp).toLocaleDateString()}
                                                </p>
                                            </div>
                                        ))}
                                </div>
                            </div>

                            {/* Procedimentos */}
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mt-4">
                                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                                    Procedimentos Realizados
                                </h4>
                                <div className="space-y-2">
                                    {selectedPatient.careHistory?.events
                                        .filter(event => event.type === 'procedure')
                                        .map((proc, index) => (
                                            <div 
                                                key={index}
                                                className="p-2 bg-gray-100 dark:bg-gray-600 rounded-lg"
                                            >
                                                <p className="font-medium text-gray-800 dark:text-white">
                                                    {proc.details?.procedureType}
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                                    {proc.description}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    Data: {new Date(proc.timestamp).toLocaleDateString()}
                                                </p>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='mb-8 dark:from-gray-700 h-2'></div>

                    {/* AIDA - Assistente de IA */}
                    <div className='bg-gradient-to-br from-teal-400 to-blue-500 dark:from-teal-700 dark:to-blue-700 rounded-xl p-1'>
                        <div className="bg-gradient-to-r from-blue-50 to-teal-50 dark:from-gray-700 dark:to-gray-600 p-6 rounded-xl">
                            <div className="flex items-center gap-3 mb-6">
                                <Bot className="w-6 h-6 text-blue-500" />
                                <h3 className="text-xl font-semibold">AIDA - Assistente Inteligente</h3>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-6">
                                {commonQuestions.map((category, idx) => (
                                    <div key={idx} className="space-y-3">
                                        <h4 className="font-medium text-gray-700 dark:text-gray-300">
                                            {category.category}
                                        </h4>
                                        {category.questions.map((question, qIdx) => (
                                            <Button
                                                key={qIdx}
                                                variant="outline"
                                                className="w-full justify-start text-left min-h-[4rem] py-3 px-4 bg-white dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600 transition-all whitespace-normal"
                                                onClick={() => handleAIQuestion(question)}
                                            >
                                                <MessageSquare className="w-4 h-4 mr-2 flex-shrink-0" />
                                                <span className="line-clamp-2">{question}</span>
                                            </Button>
                                        ))}
                                    </div>
                                ))}
                            </div>

                            {/* Campo de Resposta da IA */}
                            <div className="relative bg-white dark:bg-gray-700 rounded-xl p-4 min-h-[120px] border border-gray-200 dark:border-gray-600">
                                {isGeneratingAI ? (
                                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                        <div className="flex gap-1">
                                            <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                            <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                            <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></span>
                                        </div>
                                        <span>AIDA está analisando...</span>
                                    </div>
                                ) : (
                                    <div className="prose dark:prose-invert max-w-none">
                                        {aiResponse || "Selecione uma pergunta acima ou faça sua própria consulta"}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Relatórios em Slider */}
                    <div className="space-y-4 pt-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                Relatórios e Documentos
                            </h3>
                            <div className="flex gap-2">
                                <Button 
                                    variant="outline" 
                                    size="icon"
                                    onClick={handleSlideLeft}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                                <Button 
                                    variant="outline" 
                                    size="icon"
                                    onClick={handleSlideRight}
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    
                        <div 
                            ref={scrollContainerRef}
                            className="flex gap-4 overflow-x-auto scroll-smooth hide-scrollbar"
                            style={{ scrollBehavior: 'smooth' }}
                        >
                            {mockReports.map((report, index) => (
                                <Card key={index} className="flex-shrink-0 w-[300px] cursor-pointer hover:shadow-lg transition-all">
                                    <CardContent className="p-6 border rounded-md">
                                        <div className="flex flex-col gap-2">
                                            <span className="text-sm text-blue-500 font-medium">
                                                {report.type}
                                            </span>
                                            <h4 className="font-semibold">{report.title}</h4>
                                            <time className="text-sm text-gray-500">
                                                {new Date(report.date).toLocaleDateString()}
                                            </time>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Botão de Protocolo */}
                    <Button 
                        className="w-full py-6 bg-gradient-to-r from-blue-500 to-teal-500 
                                hover:from-blue-600 hover:to-teal-600 text-white font-semibold
                                rounded-xl transition-all"
                        onClick={() => {
                            setIsGeneratingAI(true);
                            setTimeout(() => setIsGeneratingAI(false), 2000);
                        }}
                    >
                        <Brain className="w-5 h-5 mr-2" />
                        Gerar Diagrama de Protocolo de Cuidados
                    </Button>

                    {/* Histórico de Status */}
                    <div className="pt-4">
                        <div className="flex items-center justify-between mb-4 mt-4">
                            <h4 className="font-semibold text-gray-800 dark:text-white">
                                Histórico de Status
                            </h4>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Previsão de Alta: {
                                    selectedPatient.expectedDischarge
                                        ? new Date(selectedPatient.expectedDischarge).toLocaleDateString()
                                        : 'Não definida'
                                }
                            </div>
                        </div>
                        <div className="space-y-2">
                            {selectedPatient.careHistory?.statusHistory
                                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                                .map((status, index) => (
                                    <div 
                                        key={index}
                                        className="flex items-center justify-between p-2 bg-gray-50 
                                                dark:bg-gray-700 rounded-lg"
                                    >
                                        <div>
                                            <p className="font-medium text-gray-800 dark:text-white">
                                                {status.status}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                {status.department}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {status.specialty}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(status.timestamp).toLocaleString()}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {status.updatedBy.name}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* Informações do Leito */}
                    <div className="pt-4">
                        <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Informações do Leito</h4>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex justify-between items-center">
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Departamento</p>
                                    <p className="font-medium text-gray-800 dark:text-white">
                                        {selectedPatient.careHistory?.events
                                            .find(e => e.type === 'admission')?.department || 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Destino</p>
                                    <p className="font-medium text-gray-800 dark:text-white">
                                        {selectedPatient.careHistory?.events
                                            .find(e => e.type === 'admission')?.details?.toDepartment || 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Responsável</p>
                                    <p className="font-medium text-gray-800 dark:text-white">
                                        {selectedPatient.careHistory?.events
                                            .find(e => e.type === 'admission')?.responsibleStaff.name || 'N/A'}
                                    </p>
                                </div>
                            </div>
                            <QRCodeCanvas 
                                value={JSON.stringify({
                                    admissionEvent: selectedPatient.careHistory?.events
                                        .find(e => e.type === 'admission') || {},
                                    patientId: selectedPatient.id
                                })} 
                                size={80} 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}