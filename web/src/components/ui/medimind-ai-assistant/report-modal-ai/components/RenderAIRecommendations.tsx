/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { VitalsAnalysisCard } from "./VitalsAnalysisCard";
import { ReportModalComponentsProps } from "../types";

interface VitalsAnalysisSummary {
  temperature: string
  pressure: string
  heartRate: string
  saturation: string
  criticalAlerts: string
  riskLevel: string
}

export const renderAIRecommendations: React.FC<ReportModalComponentsProps> = ({ data }) => {
    const recommendations = data.raw.data.analysis.recommendations;
    const summary = data?.raw?.data?.analysis.vitalsAnalysis?.summary || "";

    const parseSummary = (summary: string): VitalsAnalysisSummary => {
        const metrics = {
            temperature: summary.match(/Temperatura:\s([\d.]+)°C/)?.[1] || "00.0",
            pressure: summary.match(/Pressão Arterial:\s([\d/]+)/)?.[1] || "000/00",
            heartRate: summary.match(/Frequência Cardíaca:\s(\d+)\sbpm/)?.[1] || "00",
            saturation: summary.match(/Saturação:\s(\d+)%/)?.[1] || "00",
            criticalAlerts: summary.includes("Sem alertas críticos") ? "None" : "Present",
            riskLevel: summary.match(/Nível de Risco:\s(\w+)/)?.[1] || "Unknown"
        };
        return metrics;
    };
    
    const vitalsAnalysis = parseSummary(summary);
    console.log(vitalsAnalysis);

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
                  temperature: vitalsAnalysis.temperature,
                  pressure: vitalsAnalysis.pressure,
                  heartRate: vitalsAnalysis.heartRate,
                  saturation: vitalsAnalysis.saturation
                },
                alerts: [],
                risk: "low",
                summary: summary || "Todos os sinais vitais estão dentro dos parâmetros normais."
              }}
            />
          </motion.div>
        </div>
      </motion.div>
    );
};