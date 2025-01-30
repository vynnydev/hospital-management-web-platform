/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { ReportModalComponentsProps, VitalSignCardProps } from "../types";
import { Activity, Heart, Thermometer } from "lucide-react";
// import { PatientContext, PatientData } from "@/services/AI/medimind-ai-assistant/types/medimind-ai-assistant";

// function prepareVitalsContext(patientData: PatientData): any {
//   console.log(patientData)
//     return {
//         diagnoses: patientData.treatment.diagnosis || 0,
//         riskLevel: patientData.complications.risk,
//         vitals: patientData.treatment.vitals.length > 0 
//             ? patientData.treatment.vitals[patientData.treatment.vitals.length - 1]
//             : null,
//         medications: patientData.treatment.medications,
//         procedures: patientData.treatment.procedures
//     };
// }

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

export const renderVitalSigns: React.FC<ReportModalComponentsProps> = ({ data }) => {
  console.log(`Sinais Vitais: ${data?.raw?.data?.lastVitals}`)
  const vitalsData = {
    temperature: String(
      data?.raw?.data?.lastVitals?.[0]?.temperature || "00.0"
    ),
    pressure: 
      data?.raw?.data?.lastVitals?.[0]?.bloodPressure || "000/00",
    heartRate: String(
      data?.raw?.data?.lastVitals?.[0]?.heartRate || "00"
    ),
    saturation: String(
      data?.raw?.data?.lastVitals?.[0]?.oxygenSaturation || "00"
    )
  };

  console.log(vitalsData)
  
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