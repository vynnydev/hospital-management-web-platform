/* eslint-disable @typescript-eslint/no-explicit-any */
// CareInstructionsCard.tsx
import Image from 'next/image'
import { motion } from "framer-motion";
import { EmptyState } from "./EmptyState";
import { useState, useMemo } from "react";
import { convertToImageUrl } from "../services/functions/imagePresenter";

interface CareImages {
  usage?: string;
  application?: string;
  precaution?: string;
  palliativeCare?: string;
  monitoring?: string;
}

interface CareInstructions {
  type: 'medication' | 'palliative' | 'monitoring';
  name: string;
  details: {
    dosage?: string;
    frequency?: string;
    duration?: string;
    painLevel?: number;
    mobility?: string;
    consciousness?: string;
  };
  instructions?: string[];
  warnings?: string[];
  aiRecommendations?: {
    nurseProcedures?: string[];
    technicalProcedures?: string[];
    additionalCare?: string[];
    monitoringProtocols?: string[];
  };
}

interface CareInstructionsCardProps {
  instruction: CareInstructions;
  images: CareImages;
}

const CareInstructionsCard: React.FC<CareInstructionsCardProps> = ({ instruction, images }) => {
    const [activeTab, setActiveTab] = useState('main');

    const processedImages = useMemo(() => ({
        usage: convertToImageUrl(images?.usage),
        application: convertToImageUrl(images?.application),
        precaution: convertToImageUrl(images?.precaution),
        palliativeCare: convertToImageUrl(images?.palliativeCare),
        monitoring: convertToImageUrl(images?.monitoring)
    }), [images]);

    const renderHeader = () => (
        <div className="flex flex-col gap-4 mb-6">
            <div className='flex flex-row space-x-3'>
                <div className='w-14 h-14 rounded-full bg-blue-500/20 flex items-center justify-center'>
                    <span className="text-3xl">🏥</span>
                </div>
                <h4 className="text-white text-xl font-semibold mt-3">
                    Instruções de cuidados
                </h4>
            </div>
            <div className='flex flex-row space-x-3'>
                <div className="w-14 h-14 rounded-full bg-blue-500/20 flex items-center justify-center">
                    {getTypeIcon(instruction.type)}
                </div>
                <div>
                    <h4 className="text-white text-lg font-semibold">{instruction.name}</h4>
                    <div className="text-white/60">
                        {renderSubtitle()}
                    </div>
                </div>
            </div>
        </div>
    );

    const getTypeIcon = (type: string) => {
        switch(type) {
            case 'medication': return <span className="text-2xl">💊</span>;
            case 'palliative': return <span className="text-2xl">🏥</span>;
            case 'monitoring': return <span className="text-2xl">📊</span>;
            default: return <span className="text-3xl">ℹ️</span>;
        }
    };

    const renderSubtitle = () => {
        const { details } = instruction;
        switch(instruction.type) {
            case 'medication':
                return `${details.dosage} - ${details.frequency}`;
            case 'palliative':
                return `Nível de Dor: ${details.painLevel}/10 - Mobilidade: ${details.mobility}`;
            case 'monitoring':
                return `Protocolo de Acompanhamento`;
            default:
                return '';
        }
    };

    const renderTabs = () => (
        <div className="flex space-x-2 mt-8 mb-6 border-b border-white/10">
            {getAvailableTabs().map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-t-lg transition ${
                        activeTab === tab.id 
                            ? 'bg-white/10 text-white' 
                            : 'text-white/60 hover:text-white/80'
                    }`}
                >
                    {tab.icon} {tab.label}
                </button>
            ))}
        </div>
    );

    const getAvailableTabs = () => {
        const baseTabs = [
            { id: 'main', label: 'Principal', icon: '📋' }
        ];

        if (processedImages.application) {
            baseTabs.push({ id: 'application', label: 'Aplicação', icon: '🎯' });
        }

        if (processedImages.precaution) {
            baseTabs.push({ id: 'precautions', label: 'Precauções', icon: '⚠️' });
        }

        if (instruction.type === 'palliative' && processedImages.palliativeCare) {
            baseTabs.push({ id: 'palliative', label: 'Cuidados Paliativos', icon: '🏥' });
        }

        if (processedImages.monitoring) {
            baseTabs.push({ id: 'monitoring', label: 'Monitoramento', icon: '📊' });
        }

        return baseTabs;
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'main':
                return renderMainContent();
            case 'application':
                return renderApplicationContent();
            case 'precautions':
                return renderPrecautionsContent();
            case 'palliative':
                return renderPalliativeCareContent();
            case 'monitoring':
                return renderMonitoringContent();
            default:
                return null;
        }
    };

    const renderMainContent = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <h5 className="text-white/90 font-medium flex items-center gap-2">
                    <span>📋</span> Instruções Principais
                </h5>
                {processedImages.usage ? (
                    <div className="relative aspect-square rounded-lg overflow-hidden">
                        <Image 
                            src={processedImages.usage}
                            alt="Instruções principais"
                            width={500} 
                            height={400}
                            className="object-contain"
                            onError={(e) => {
                                console.error('Erro ao carregar imagem:', e);
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                    </div>
                ) : (
                    <EmptyState message="Instruções detalhadas não disponíveis" />
                )}
            </div>

            {instruction.aiRecommendations && renderAIRecommendations()}
        </div>
    );

    const renderApplicationContent = () => (
        <div className="space-y-4">
            <h5 className="text-white/90 font-medium flex items-center gap-2">
                <span>🎯</span> Técnica de Aplicação
            </h5>
            {processedImages.application ? (
                <div className="relative rounded-lg overflow-hidden">
                    <Image 
                        src={processedImages.application}
                        alt="Técnica de aplicação"
                        width={500} 
                        height={400}
                        className="object-contain"
                    />
                </div>
            ) : (
                <EmptyState message="Demonstração visual não disponível" />
            )}
        </div>
    );

        const renderPrecautionsContent = () => (
        <div className="space-y-4">
            <h5 className="text-white/90 font-medium flex items-center gap-2">
                <span>⚠️</span> Precauções e Alertas
            </h5>
            {processedImages.precaution ? (
                <div className="relative rounded-lg overflow-hidden">
                    <Image 
                        src={processedImages.precaution}
                        alt="Precauções importantes"
                        layout="responsive"
                        width={500} 
                        height={400}
                        className="object-contain"
                    />
                </div>
            ) : (
                <EmptyState message="Precauções não disponíveis" />
            )}
            {instruction.warnings && instruction.warnings.length > 0 && (
                <div className="mt-4 bg-red-500/10 p-4 rounded-lg">
                    <h6 className="text-red-400 mb-2">Alertas Importantes</h6>
                    <ul className="space-y-2">
                        {instruction.warnings.map((warning, idx) => (
                            <li key={idx} className="text-white/70 flex items-start gap-2">
                                <span className="text-red-400">•</span>
                                {warning}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );

    const renderPalliativeCareContent = () => (
        <div className="space-y-6">
            <div className="bg-[#1e2a4a]/60 p-4 rounded-lg">
                <h5 className="text-white/90 font-medium flex items-center gap-2 mb-4">
                    <span>🏥</span> Cuidados Paliativos
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h6 className="text-white/80 mb-2">Estado do Paciente</h6>
                        <ul className="space-y-2">
                            <li className="text-white/70">Nível de Dor: {instruction.details.painLevel}/10</li>
                            <li className="text-white/70">Mobilidade: {instruction.details.mobility}</li>
                            <li className="text-white/70">Consciência: {instruction.details.consciousness}</li>
                        </ul>
                    </div>
                    {processedImages.palliativeCare && (
                        <div className="relative rounded-lg overflow-hidden">
                            <Image 
                                src={processedImages.palliativeCare}
                                alt="Instruções de cuidados paliativos"
                                width={500} 
                                height={400}
                                className="object-contain"
                            />
                        </div>
                    )}
                </div>
            </div>
            {instruction.aiRecommendations?.additionalCare && (
                <div className="bg-[#1e2a4a]/60 p-4 rounded-lg">
                    <h6 className="text-white/80 mb-2">Recomendações Específicas</h6>
                    <ul className="space-y-2">
                        {instruction.aiRecommendations.additionalCare.map((care, idx) => (
                            <li key={idx} className="text-white/70 flex items-start gap-2">
                                <span className="text-blue-400">•</span>
                                {care}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );

    const renderMonitoringContent = () => (
        <div className="space-y-6">
            <div className="bg-[#1e2a4a]/60 p-4 rounded-lg">
                <h5 className="text-white/90 font-medium flex items-center gap-2 mb-4">
                    <span>📊</span> Protocolo de Monitoramento
                </h5>
                {processedImages.monitoring ? (
                    <div className="relative rounded-lg overflow-hidden mb-4">
                        <Image 
                            src={processedImages.monitoring}
                            alt="Protocolo de monitoramento"
                            width={500} 
                            height={400}
                            className="object-contain"
                        />
                    </div>
                ) : null}
                {instruction.aiRecommendations?.monitoringProtocols && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h6 className="text-white/80 mb-2">Parâmetros de Controle</h6>
                            <ul className="space-y-2">
                                {instruction.aiRecommendations.monitoringProtocols.map((protocol, idx) => (
                                    <li key={idx} className="text-white/70 flex items-start gap-2">
                                        <span className="text-blue-400">•</span>
                                        {protocol}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const renderAIRecommendations = () => (
        <div className="space-y-4">
            <h5 className="text-white/90 font-medium flex items-center gap-2">
                <span>🤖</span> Recomendações Avançadas
            </h5>
            <div className="grid grid-cols-1 gap-4">
                {instruction.aiRecommendations?.nurseProcedures && (
                    <div className="bg-[#1e2a4a]/60 p-4 rounded-lg">
                        <h6 className="text-white/80 mb-2">Procedimentos de Enfermagem</h6>
                        <ul className="space-y-2">
                            {instruction.aiRecommendations.nurseProcedures.map((proc, idx) => (
                                <li key={idx} className="text-white/70 flex items-start gap-2">
                                    <span className="text-blue-400">•</span>
                                    {proc}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {instruction.aiRecommendations?.technicalProcedures && (
                    <div className="bg-[#1e2a4a]/60 p-4 rounded-lg">
                        <h6 className="text-white/80 mb-2">Procedimentos Técnicos</h6>
                        <ul className="space-y-2">
                            {instruction.aiRecommendations.technicalProcedures.map((proc, idx) => (
                                <li key={idx} className="text-white/70 flex items-start gap-2">
                                    <span className="text-blue-400">•</span>
                                    {proc}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1e2a4a]/40 rounded-xl p-6 border border-white/10"
        >
            {renderHeader()}
            {renderTabs()}
            {renderContent()}
        </motion.div>
    );
};

// Componente que renderiza a lista de instruções
export const renderCareInstructions: React.FC<{ data: any }> = ({ data }) => {
    const medications = data.raw.data.patient.treatment.medications || [];
    const careImages = data.raw.data.analysis.medicationImages || [];
    const firstImageSet = careImages[0] || {};

    return (
        <div className="space-y-6">
            {medications.map((med: any, index: number) => {
                const instruction: CareInstructions = {
                    type: 'medication',
                    name: med.name,
                    details: {
                        dosage: med.dosage,
                        frequency: med.frequency,
                        duration: med.duration
                    },
                    instructions: med.instructions,
                    warnings: med.warnings,
                    aiRecommendations: med.aiRecommendations
                };

                return (
                    <CareInstructionsCard 
                        key={index}
                        instruction={instruction}
                        images={firstImageSet}
                    />
                );
            })}
        </div>
    );
};