import React from 'react';
import { Brain, Sparkles } from 'lucide-react';
import { Progress } from "@/components/ui/organisms/progress";

interface AnalysisProgressProps {
  progress: number;
}

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({ progress }) => {
  // Função para obter a mensagem de status baseada no progresso
  const getStatusMessage = (progress: number): string => {
    if (progress < 20) {
      return "Coletando dados hospitalares...";
    } else if (progress < 40) {
      return "Analisando padrões de ocupação...";
    } else if (progress < 60) {
      return "Identificando métricas relevantes...";
    } else if (progress < 80) {
      return "Calculando indicadores de desempenho...";
    } else {
      return "Preparando sugestões de métricas personalizadas...";
    }
  };

  return (
    <div className="mb-6 overflow-hidden">
      <div className="bg-indigo-900/30 rounded-xl p-4 border border-indigo-700/30 shadow-inner">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Brain className="h-5 w-5 text-indigo-400 mr-2 animate-pulse" />
            <span className="text-sm font-medium text-indigo-300">Análise com IA em andamento</span>
          </div>
          <span className="text-sm font-bold text-indigo-300">{progress}%</span>
        </div>
        
        <Progress 
          value={progress} 
          className="h-2 bg-indigo-950/50"
        />
        
        <div className="flex items-center justify-between mt-3">
          <p className="text-xs text-indigo-300 italic">
            {getStatusMessage(progress)}
          </p>
          
          {progress >= 50 && (
            <div className="flex items-center text-xs text-amber-300">
              <Sparkles className="h-3 w-3 mr-1 text-amber-400" />
              <span>{Math.min(Math.floor(progress / 10), 8)} métricas encontradas</span>
            </div>
          )}
        </div>
        
        {progress >= 75 && (
          <div className="mt-3 bg-indigo-950/50 p-2 rounded text-xs text-indigo-300 border border-indigo-800/50">
            <p className="mb-1 font-medium text-indigo-200">Descobertas preliminares:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Detectado padrão de alta ocupação em UTIs</li>
              <li>Oportunidade para melhorar tempo de espera</li>
              <li>Eficiência de rotatividade de leitos abaixo do ideal</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};