import { motion } from "framer-motion";
import { EmptyState } from "./EmptyState";
import { MedicationCardProps, ReportModalComponentsProps } from "../types";
import { useMemo, useState } from "react";
import { convertToImageUrl } from "../services/functions/imagePresenter";

// Função auxiliar para verificar e corrigir o formato base64
const ensureBase64Prefix = (base64String: string) => {
    if (!base64String) return '';
    if (base64String.startsWith('data:image')) return base64String;
    return `data:image/png;base64,${base64String}`;
};

const ImageDebug: React.FC<{ src: string; label: string }> = ({ src, label }) => (
    <div className="border border-white/10 p-2 rounded">
      <div className="text-xs text-white/50 mb-2">{label}</div>
      <div className="text-xs text-white/50 overflow-auto max-h-20">
        {src ? src.substring(0, 100) + '...' : 'No image data'}
      </div>
    </div>
);

// Componente de Medicamento
const MedicationCard: React.FC<MedicationCardProps> = ({ medication, images }) => {
    const [imageLoadStatus, setImageLoadStatus] = useState({
        usage: false,
        application: false,
        precaution: false
    });

    // Processa as imagens com verificações
    const processedImages = useMemo(() => {
    const processed = {
        usage: convertToImageUrl(images?.usage),
        application: convertToImageUrl(images?.application),
        precaution: convertToImageUrl(images?.precaution)
    };

    console.log('Imagens processadas:', {
        usage: processed.usage ? `${processed.usage.substring(0, 50)}...` : null,
        application: processed.application ? `${processed.application.substring(0, 50)}...` : null,
        precaution: processed.precaution ? `${processed.precaution.substring(0, 50)}...` : null
    });

    return processed;
    }, [images]);

    // Verificações de segurança melhoradas
    const hasInstructions = Array.isArray(medication?.instructions) && medication.instructions.length > 0;
    const hasWarnings = Array.isArray(medication?.warnings) && medication.warnings.length > 0;
    const hasAIRecommendations = Boolean(
        Array.isArray(medication?.aiRecommendations?.nurseProcedures) && medication.aiRecommendations.nurseProcedures.length > 0 ||
        Array.isArray(medication?.aiRecommendations?.technicalProcedures) && medication.aiRecommendations.technicalProcedures.length > 0 ||
        Array.isArray(medication?.aiRecommendations?.additionalCare) && medication.aiRecommendations.additionalCare.length > 0
    );

    return (
        <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#1e2a4a]/40 rounded-xl p-6 border border-white/10"
        >
        {/* Cabeçalho do Medicamento */}
        <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-blue-500/20 flex items-center justify-center">
            <span className="text-3xl">💊</span>
            </div>
            <div>
            <h4 className="text-white text-xl font-semibold">{medication.name}</h4>
            <div className="text-white/60">
                {medication.dosage} - {medication.frequency}
            </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Instruções de Uso */}
            <div className="space-y-4">
            <h5 className="text-white/90 font-medium flex items-center gap-2">
                <span>📋</span> Instruções de Uso
            </h5>
            {processedImages.usage ? (
                <div className="relative aspect-square rounded-lg overflow-hidden">
                <img 
                    src={processedImages.usage}
                    alt="Instruções de uso"
                    className="object-cover w-full h-full"
                    onError={(e) => {
                    console.error('Erro ao carregar imagem de uso:', e);
                    e.currentTarget.style.display = 'none';
                    }}
                />
                </div>
            ) : (
                <EmptyState message="Instruções detalhadas não disponíveis no momento" />
            )}
            </div>

            {/* Aplicação */}
         <div className="space-y-4 print:break-inside-avoid">
            <h5 className="text-white/90 font-medium flex items-center gap-2 print:text-black">
                <span>🎯</span> Aplicação
            </h5>
            {processedImages.application ? (
                <div className="relative rounded-lg overflow-hidden print:shadow-none">
                <img 
                    src={processedImages.application}
                    alt="Técnica de aplicação"
                    className="w-full h-auto object-contain max-h-[400px] print:max-h-none"
                    style={{
                    pageBreakInside: 'avoid',
                    breakInside: 'avoid',
                    }}
                />
                </div>
            ) : (
                <EmptyState message="Demonstração visual será disponibilizada em breve" />
            )}
            </div>
        </div>

        {/* Precauções */}
        <div className="mt-6">
            <h5 className="text-white/90 font-medium flex items-center gap-2 mb-3">
            <span>⚠️</span> Precauções
            </h5>
            {processedImages.precaution ? (
            <div className="relative aspect-square rounded-lg overflow-hidden">
                <img 
                src={processedImages.precaution}
                alt="Precauções importantes"
                className="object-cover w-full h-full"
                onError={(e) => {
                    console.error('Erro ao carregar imagem de precaução:', e);
                    e.currentTarget.style.display = 'none';
                }}
                />
            </div>
            ) : (
            <EmptyState message="Sem precauções específicas registradas" />
            )}
        </div>

        {/* Recomendações da IA */}
        {hasAIRecommendations && (
            <div className="mt-6">
            <h5 className="text-white/90 font-medium flex items-center gap-2 mb-3">
                <span>🤖</span> Recomendações Avançadas
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {medication?.aiRecommendations?.nurseProcedures && 
                Array.isArray(medication.aiRecommendations.nurseProcedures) 
                && medication.aiRecommendations.nurseProcedures.length > 0 && (
                <div className="bg-[#1e2a4a]/60 p-4 rounded-lg">
                    <h6 className="text-white/80 mb-2">Procedimentos de Enfermagem</h6>
                    <ul className="space-y-2">
                    {medication.aiRecommendations.nurseProcedures.map((proc, idx) => (
                        <li key={idx} className="text-white/70 flex items-start gap-2">
                        <span className="text-blue-400">•</span>
                        {proc}
                        </li>
                    ))}
                    </ul>
                </div>
                )}

            {medication?.aiRecommendations?.technicalProcedures && 
                Array.isArray(medication.aiRecommendations.technicalProcedures) 
                && medication.aiRecommendations.technicalProcedures.length > 0 && (
                <div className="bg-[#1e2a4a]/60 p-4 rounded-lg">
                    <h6 className="text-white/80 mb-2">Procedimentos Técnicos</h6>
                    <ul className="space-y-2">
                    {medication.aiRecommendations.technicalProcedures.map((proc, idx) => (
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
        )}
        </motion.div>
    );
};

export const renderMedications: React.FC<ReportModalComponentsProps> = ({ data }) => {
        const medications = data.raw.data.patient.treatment.medications || [];
        const medicationImages = data.raw.data.analysis.medicationImages || [];

        // Pega o primeiro objeto de imagens do array
        const firstImageSet = medicationImages[0] || {};
        
        console.log('Image set being used:', firstImageSet);

        return (
            <div className="space-y-6">
            {medications.map((medication, index) => {
            // Como as imagens não têm medicationId, vamos usar o mesmo conjunto para todos
                const images = {
                    usage: firstImageSet.usage || '',
                    application: firstImageSet.application || '',
                    precaution: firstImageSet.precaution || ''
                };
                
                console.log(`Images for ${medication.name}:`, images);
                
                return (
                    <MedicationCard 
                        key={index} 
                        medication={medication}
                        images={images}
                    />
                );
            })}
        </div>
    );
};