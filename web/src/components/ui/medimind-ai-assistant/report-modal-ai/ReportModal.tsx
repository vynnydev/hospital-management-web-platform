import { Copy, Printer, X, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ActionButton, ReportModalProps } from './types';
import { renderAIRecommendations } from './components/RenderAIRecommendations';
import { renderVitalSigns } from './components/VitalSignCard';
import { renderCareInstructions } from './components/CareInstructionsCard';
import { calculateBloodPressureStatus, calculateHeartRateStatus, calculateSaturationStatus, calculateTemperatureStatus, getStatusClass } from './services/functions/calculateVitalSigns';
import { usePrint } from './services/hooks/usePrint';
import { generatePrintTemplate } from './components/PrintTemplate';

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, data }) => {
  const [copied, setCopied] = useState(false);
  const { handlePrint, preparePrintData } = usePrint();

  const handleCopy = async () => {
    const contentToCopy = JSON.stringify({
      recommendations: data.raw.data.analysis.recommendations,
      vitalsAnalysis: data.raw.data.analysis.vitalsAnalysis,
    }, null, 2);
    await navigator.clipboard.writeText(contentToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const buttons: ActionButton[] = [
    { 
      icon: <Copy size={20} />, 
      tooltip: copied ? "Copiado!" : "Copiar", 
      onClick: handleCopy 
    },
    {
      icon: <Printer size={20} />,
      tooltip: "Imprimir",
      onClick: (e) => {
        const printData = preparePrintData(data);
        const template = generatePrintTemplate({
          printData,
          calculateTemperatureStatus,
          calculateBloodPressureStatus,
          calculateHeartRateStatus,
          calculateSaturationStatus,
          getStatusClass
        });
        handlePrint(e, template);
      }
    },
    { 
      icon: <Share2 size={20} />, 
      tooltip: "Compartilhar", 
      onClick: () => {} // ou sua função de compartilhamento
    },
    { 
      icon: <X size={20} />, 
      tooltip: "Fechar", 
      onClick: onClose 
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-4xl m-4"
          >
            <div className="relative bg-gradient-to-br from-[#1e1e2d] to-[#2d314f] rounded-3xl overflow-hidden">
              {/* Header */}
              <div className="relative bg-[#1e2a4a]/40 backdrop-blur-sm border-b border-white/10">
                <div className="px-6 py-4 flex justify-between items-center">
                  <motion.h2 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xl font-semibold text-white flex items-center gap-2"
                  >
                    <span className="text-2xl animate-float">✨</span>
                    Análise da IA
                  </motion.h2>
                  
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-1"
                  >
                    {buttons.map((button, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={button.onClick}
                        className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200 relative group button-glow"
                      >
                        <span className="text-white/80 hover:text-white transition-colors">
                          {button.icon}
                        </span>
                        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100">
                          {button.tooltip}
                        </span>
                      </motion.button>
                    ))}
                  </motion.div>
                </div>
              </div>

              {/* Conteúdo */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-6 max-h-[70vh] overflow-auto custom-scrollbar space-y-6"
              >
                {renderAIRecommendations({ data })}
                {renderVitalSigns({ data })}
                {renderCareInstructions({ data })}
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}

      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .animate-shimmer {
          animation: shimmer 3s infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }

        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .button-glow:hover {
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
        }
      `}</style>
    </AnimatePresence>
  );
};