import { Copy, Printer, X, Share2, Activity, Thermometer, Heart, BarChart3, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface ReportModalData {
  success: boolean;
  raw: {
    data: {
      analysis: {
        recommendations: string[];
        vitalsAnalysis: {
          alerts: any[];
          risk: string;
          summary: string;
          trends: {
            status: string;
          };
        };
        lastVitals: Array<{
          timestamp: string;
          temperature: number;
          bloodPressure: string;
          heartRate: number;
          oxygenSaturation: number;
        }>;
      };
      patient: {
        admission: {
          date: string;
          reason: string;
          type: string;
          status: string;
          predictedDischarge: string;
        };
        aiAnalysis: {
          riskScore: number;
          predictedLOS: number;
          complications: any[];
          recommendations: any[];
        };
        id: string;
        medicalTeam: {
          doctor: any[];
          nurses: any[];
        };
        personalInfo: {
          name: string;
          age: number;
          gender: string;
          bloodType: string;
          photo: string;
        };
        qrCode: string;
        treatment: {
          diagnosis: string[];
          medications: Array<{
            name: string;
            dosage: string;
            frequency: string;
            duration: string;
            startDate: string;
            endDate?: string;
            route?: string;
            status?: string;
          }>;
          vitals: any[];
          procedures: any[];
        };
      };
    };
  }
  report: {
    charts: any[];
    downloadable: boolean;
    sections: Array<{
      title: string;
      content: string;
    }>;
  };
}

interface VitalSignCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  normal: string;
  status: 'normal' | 'warning' | 'critical';
}

interface VitalsAnalysis {
  lastReadings?: {
    temperature?: string | null;
    pressure?: string | null;
    heartRate?: string | null;
    saturation?: string | null;
  } | null;
  alerts?: string[] | null;
  risk: 'low' | 'moderate' | 'high';
  summary?: string | null;
}

interface VitalReading {
  label: string;
  value: string | null | undefined;
  reference: string;
}

// Interface para funcionalidade de recomendações de tratamento médico
interface MedicationInstructions {
  visual?: {
    imageUrl?: string;
    steps?: {
      description: string;
      image?: string;
    }[];
  };
  instructions?: string[];
  warnings?: string[];
  aiRecommendations?: {
    nurseProcedures?: string[];
    technicalProcedures?: string[];
    additionalCare?: string[];
  };
}

interface MedicationCardProps {
  medication: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    startDate: string;
    endDate?: string;
    route?: string;
    status?: string;
    instructions?: string[];
    warnings?: string[];
    aiRecommendations?: {
      nurseProcedures?: string[];
      technicalProcedures?: string[];
      additionalCare?: string[];
    };
  };
}

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ReportModalData;
}

// Componente de Sinais Vitais
const VitalSignCard: React.FC<VitalSignCardProps> = ({ icon, label, value, normal, status }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-[#1e2a4a]/40 p-4 rounded-xl border border-white/10 hover:border-white/20 transition-all group"
  >
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-white/60 text-sm">{label}</div>
        <div className="text-white text-xl font-semibold">{value}</div>
        <div className="text-white/40 text-xs">Referência: {normal}</div>
      </div>
      <span className={`px-3 py-1 rounded-full text-sm ${
        status === 'normal' ? 'bg-green-500/20 text-green-400' :
        status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
        'bg-red-500/20 text-red-400'
      }`}>
        {status.toUpperCase()}
      </span>
    </div>
  </motion.div>
);

// Componentes auxiliares
const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center p-4 bg-[#1e2a4a]/20 rounded-lg">
    <span className="text-4xl mb-2">🔍</span>
    <p className="text-white/60 text-center">{message}</p>
  </div>
);

// Componente de Medicamento
const MedicationCard: React.FC<MedicationCardProps> = ({ medication }) => {
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
          {hasInstructions ? (
            <ul className="space-y-2">
              {medication.instructions?.map((instruction, idx) => (
                <li key={idx} className="text-white/70 flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  {instruction}
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState message="Instruções detalhadas não disponíveis no momento" />
          )}
        </div>

        {/* Demonstração Visual */}
        <div className="space-y-4">
          <h5 className="text-white/90 font-medium flex items-center gap-2">
            <span>🎯</span> Aplicação
          </h5>
          <EmptyState message="Demonstração visual será disponibilizada em breve" />
        </div>
      </div>

      {/* Alertas e Precauções */}
      <div className="mt-6">
        <h5 className="text-white/90 font-medium flex items-center gap-2 mb-3">
          <span>⚠️</span> Precauções
        </h5>
        {hasWarnings ? (
          <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
            <ul className="space-y-2">
              {medication.warnings?.map((warning, idx) => (
                <li key={idx} className="text-white/70 flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  {warning}
                </li>
              ))}
            </ul>
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

const VitalsAnalysisCard: React.FC<{ vitalsAnalysis: VitalsAnalysis }> = ({ vitalsAnalysis }) => {
  // Funções auxiliares para verificação segura
  const hasAlerts = (): boolean => {
    return Array.isArray(vitalsAnalysis?.alerts) && vitalsAnalysis.alerts.length > 0;
  };

  const getVitalReadings = (): VitalReading[] => {
    const readings = vitalsAnalysis?.lastReadings || {};
    return [
      {
        label: 'Temperatura',
        value: readings.temperature,
        reference: '36.5°C - 37.5°C'
      },
      {
        label: 'Pressão Arterial',
        value: readings.pressure,
        reference: '120/80 mmHg'
      },
      {
        label: 'Frequência Cardíaca',
        value: readings.heartRate,
        reference: '60-100 bpm'
      },
      {
        label: 'Saturação',
        value: readings.saturation,
        reference: '> 95%'
      }
    ];
  };

  const getRiskColor = (): string => {
    const riskColors = {
      low: 'bg-green-500/20 text-green-400',
      moderate: 'bg-yellow-500/20 text-yellow-400',
      high: 'bg-red-500/20 text-red-400'
    };
    return riskColors[vitalsAnalysis?.risk || 'low'];
  };

  const getRiskLabel = (): string => {
    const riskLabels = {
      low: 'Baixo',
      moderate: 'Moderado',
      high: 'Alto'
    };
    return riskLabels[vitalsAnalysis?.risk || 'low'];
  };

  // Renderização dos alertas
  const renderAlerts = () => {
    if (!hasAlerts()) {
      return <div className="text-white/60">Sem alertas registrados</div>;
    }

    return vitalsAnalysis.alerts!.map((alert, idx) => (
      <div key={idx} className="flex items-center gap-2 text-yellow-400">
        <AlertTriangle className="w-4 h-4" />
        <span>{alert}</span>
      </div>
    ));
  };

  // Renderização das leituras vitais
  const renderVitalReadings = () => {
    if (!vitalsAnalysis?.lastReadings) {
      return (
        <div className="col-span-full text-center p-8 bg-[#1e2a4a]/60 rounded-lg">
          <div className="text-white/60">
            Nenhuma leitura de sinais vitais disponível
          </div>
        </div>
      );
    }

    return getVitalReadings().map((reading, idx) => (
      <div key={idx} className="p-4 bg-[#1e2a4a]/60 rounded-lg space-y-2">
        <div className="text-white/60 text-sm">{reading.label}</div>
        <div className="text-white text-xl font-medium">
          {reading.value || <span className="text-white/40">Não disponível</span>}
        </div>
        <div className="text-white/40 text-xs">Referência: {reading.reference}</div>
      </div>
    ));
  };

  return (
    <div className="bg-[#1e2a4a]/40 rounded-xl p-6 border border-white/10">
      {/* Cabeçalho */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
          <BarChart3 className="w-6 h-6 text-blue-400" />
        </div>
        <h4 className="text-white text-xl font-semibold">Análise de Sinais Vitais</h4>
      </div>

      {/* Grid de Leituras Vitais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {renderVitalReadings()}
      </div>

      {/* Status e Alertas */}
      <div className="space-y-6">
        {/* Alertas */}
        <div className="bg-[#1e2a4a]/60 p-4 rounded-lg">
          <h5 className="text-white/70 text-sm mb-3">Status de Alertas:</h5>
          <div className="text-white/80">
            {renderAlerts()}
          </div>
        </div>

        {/* Nível de Risco */}
        <div className="bg-[#1e2a4a]/60 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-white/60 text-sm">Nível de Risco:</div>
              <div className="text-white font-medium">
                {getRiskLabel()}
              </div>
            </div>
            <div className={`px-4 py-2 rounded-lg font-medium ${getRiskColor()}`}>
              Risco: {vitalsAnalysis?.risk?.toUpperCase() || 'N/A'}
            </div>
          </div>
        </div>

        {/* Sumário/Análise */}
        <div className="bg-[#1e2a4a]/60 p-4 rounded-lg">
          <h5 className="text-white/70 text-sm mb-3">Análise Detalhada:</h5>
          <div className="text-white/70 whitespace-pre-line">
            {vitalsAnalysis?.summary || (
              <span className="text-white/40">
                Nenhuma análise detalhada disponível
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, data }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const contentToCopy = JSON.stringify({
      recommendations: data.raw.data.analysis.recommendations,
      vitalsAnalysis: data.raw.data.analysis.vitalsAnalysis,
    }, null, 2);
    await navigator.clipboard.writeText(contentToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Análise do Paciente - IA</title>
            <style>
              body {
                font-family: 'Inter', sans-serif;
                line-height: 1.6;
                padding: 20px;
                color: #1a1a1a;
                background: #f8f9fa;
              }
              .section {
                margin-bottom: 20px;
                padding: 15px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              .recommendation {
                margin-bottom: 10px;
                padding: 10px;
                background: #e8f4ff;
                border-left: 4px solid #3b82f6;
                border-radius: 4px;
              }
              h2 { color: #1a237e; }
              h3 { color: #0d47a1; }
            </style>
          </head>
          <body>
            <h1>✨ Análise de IA - Recomendações</h1>
            <div class="section">
              <h2>Recomendações</h2>
              ${data.raw.data.analysis.recommendations.map(rec => 
                `<div class="recommendation">✨ ${rec}</div>`
              ).join('')}
            </div>
            <div class="section">
              <h2>Análise de Sinais Vitais</h2>
              <pre>${data.raw.data.analysis.vitalsAnalysis.summary}</pre>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const renderVitalSigns = () => {
    const vitalsData = {
      temperature: String(
        data?.raw?.data?.analysis?.lastVitals?.[0]?.temperature || "37.2"
      ),
      pressure: 
        data?.raw?.data?.analysis?.lastVitals?.[0]?.bloodPressure || "120/80",
      heartRate: String(
        data?.raw?.data?.analysis?.lastVitals?.[0]?.heartRate || "75"
      ),
      saturation: String(
        data?.raw?.data?.analysis?.lastVitals?.[0]?.oxygenSaturation || "96"
      )
    };
  
    const vitals = [
      {
        icon: <Thermometer className="w-6 h-6 text-blue-400" />,
        label: "Temperatura",
        value: `${vitalsData.temperature}°C`,
        normal: "36.5°C - 37.5°C",
        status: "normal" as const
      },
      {
        icon: <Activity className="w-6 h-6 text-blue-400" />,
        label: "Pressão Arterial",
        value: vitalsData.pressure,
        normal: "120/80 mmHg",
        status: "normal" as const
      },
      {
        icon: <Heart className="w-6 h-6 text-blue-400" />,
        label: "Frequência Cardíaca",
        value: `${vitalsData.heartRate} bpm`,
        normal: "60-100 bpm",
        status: "normal" as const
      },
      {
        icon: <Activity className="w-6 h-6 text-blue-400" />,
        label: "Saturação",
        value: `${vitalsData.saturation}%`,
        normal: "> 95%",
        status: "normal" as const
      }
    ];

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-[#1e2a4a]/40 rounded-xl p-6 backdrop-blur-sm"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
            <Activity className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="text-white/90 text-xl font-medium">Sinais Vitais</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vitals.map((vital, index) => (
            <VitalSignCard key={index} {...vital} />
          ))}
        </div>

        <div className="mt-6 p-4 bg-[#1e2a4a]/60 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎯</span>
              <div>
                <div className="text-white/90">Status Geral</div>
                <div className="text-white/60 text-sm">
                  {data.raw.data.analysis.vitalsAnalysis.alerts?.length > 0 
                    ? `${data.raw.data.analysis.vitalsAnalysis.alerts.length} alertas`
                    : 'Sem alertas críticos'
                  }
                </div>
              </div>
            </div>
            <span className="px-4 py-2 rounded-full bg-green-500/20 text-green-400">
              Risco: {data.raw.data.analysis.vitalsAnalysis.risk.toUpperCase()}
            </span>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderMedications = () => {
    const medications = data.raw.data.patient.treatment.medications || [];

    return (
      <div className="space-y-6">
        {medications.map((medication, index) => (
          <MedicationCard key={index} medication={medication} />
        ))}
      </div>
    );
  };

  const renderAIRecommendations = () => {
    const recommendations = data.raw.data.analysis.recommendations;
    const vitalsAnalysis = data.raw.data.analysis.vitalsAnalysis;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10 relative overflow-hidden"
      >
        {/* Efeito de brilho animado */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
        </div>

        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-400/20 flex items-center justify-center relative">
              <span className="text-blue-400 text-xl animate-float">✨</span>
              <div className="absolute inset-0 rounded-full bg-blue-400/20 animate-pulse" />
            </div>
            <h3 className="text-white/90 text-xl font-medium">Recomendações da IA</h3>
          </div>

          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 p-4 rounded-lg border border-white/10 hover:border-white/20 transition-all group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/5 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex items-start gap-3 relative">
                  <span className="text-blue-400 mt-1">✨</span>
                  <p className="text-white/90">{rec}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 bg-white/10 p-4 rounded-lg relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
            
            <VitalsAnalysisCard 
              vitalsAnalysis={{
                lastReadings: {
                  temperature: "37.2°C",
                  pressure: "120/80",
                  heartRate: "75 bpm",
                  saturation: "96%"
                },
                alerts: [],
                risk: "low",
                summary: "Todos os sinais vitais estão dentro dos parâmetros normais."
              }}
            />
          </motion.div>
        </div>
      </motion.div>
    );
  };

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
                    {[
                      { icon: <Copy size={20} />, tooltip: copied ? "Copiado!" : "Copiar", onClick: handleCopy },
                      { icon: <Printer size={20} />, tooltip: "Imprimir", onClick: handlePrint },
                      { icon: <Share2 size={20} />, tooltip: "Compartilhar", onClick: () => {} },
                      { icon: <X size={20} />, tooltip: "Fechar", onClick: onClose }
                    ].map((button, index) => (
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
                        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap">
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
                {renderAIRecommendations()}
                {renderVitalSigns()}
                {renderMedications()}
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