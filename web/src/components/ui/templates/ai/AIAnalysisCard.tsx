import React from 'react';
import { useRouter } from 'next/router';
import { Activity, Bot, ArrowRight } from 'lucide-react';

interface AIAnalysisCardProps {
  className?: string;
}

export const AIAnalysisCard: React.FC<AIAnalysisCardProps> = ({ className }) => {
  const router = useRouter();

  const navigateToAIAnalysis = () => {
    router.push('/ai-analysis');
  };

  return (
    <div 
      className={`bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-900 rounded-lg shadow-lg overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl ${className}`}
      onClick={navigateToAIAnalysis}
    >
      <div className="p-6 text-white">
        <div className="flex items-center mb-4">
          <div className="bg-white/20 rounded-full p-3">
            <Bot className="h-7 w-7" />
          </div>
          <div className="ml-4">
            <h3 className="text-xl font-bold">Análises IA</h3>
            <p className="text-blue-100 text-sm">Insights e recomendações inteligentes</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white/10 rounded-lg p-3">
            <Activity className="h-5 w-5 mb-2" />
            <p className="text-sm font-medium">Análise Preditiva</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <Bot className="h-5 w-5 mb-2" />
            <p className="text-sm font-medium">Recomendações</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-sm text-blue-100">
            Utilize IA para otimizar a gestão hospitalar
          </p>
          <button className="flex items-center justify-center bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors">
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Indicador de novidade (opcional) */}
      <div className="absolute top-3 right-3 bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded-full">
        Novo
      </div>
    </div>
  );
};

// Card menor para uso em dashboards ou menus compactos
export const AIAnalysisCardCompact: React.FC<AIAnalysisCardProps> = ({ className }) => {
  const router = useRouter();

  const navigateToAIAnalysis = () => {
    router.push('/ai-analysis');
  };

  return (
    <div 
      className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${className}`}
      onClick={navigateToAIAnalysis}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-blue-100 dark:bg-blue-900/50 rounded-full p-2 text-blue-600 dark:text-blue-400">
              <Activity className="h-5 w-5" />
            </div>
            <div className="ml-3">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">Análises IA</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Insights inteligentes
              </p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400 dark:text-gray-500" />
        </div>
      </div>
    </div>
  );
};