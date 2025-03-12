import React from 'react';
import { 
  Lightbulb, 
  AlertTriangle, 
  Check, 
  ArrowRight 
} from 'lucide-react';
import { IRecommendation } from '@/types/ai-assistant-types';

interface RecommendationsViewProps {
  recommendations: IRecommendation[];
  onApplyRecommendation: (recommendation: IRecommendation) => void;
  setCurrentView: (view: 'welcome' | 'recommendations' | 'alerts') => void;
}

export const RecommendationsView: React.FC<RecommendationsViewProps> = ({
  recommendations,
  onApplyRecommendation,
  setCurrentView
}) => {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-800 dark:text-gray-200 flex items-center">
          <Lightbulb className="h-5 w-5 mr-1 text-amber-500" />
          Recomendações Inteligentes
        </h3>
        <button 
          className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
          onClick={() => setCurrentView('welcome')}
        >
          Voltar
        </button>
      </div>
      
      <div className="space-y-3">
        {recommendations.length > 0 ? (
          recommendations.map(recommendation => (
            <div 
              key={recommendation.id}
              className={`p-3 ${
                recommendation.applied 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                  : recommendation.priority === 'high'
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                    : recommendation.priority === 'medium'
                      ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
                      : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
              } border rounded-lg`}
            >
              <div className="flex items-start justify-between">
                <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 flex items-center">
                  {recommendation.applied ? (
                    <Check className="h-4 w-4 text-green-500 dark:text-green-400 mr-1.5 flex-shrink-0" />
                  ) : recommendation.priority === 'high' ? (
                    <AlertTriangle className="h-4 w-4 text-red-500 dark:text-red-400 mr-1.5 flex-shrink-0" />
                  ) : (
                    <Lightbulb className="h-4 w-4 text-amber-500 dark:text-amber-400 mr-1.5 flex-shrink-0" />
                  )}
                  {recommendation.title}
                </h4>
                
                <div className="flex items-center text-xs">
                  <span className={`
                    px-1.5 py-0.5 rounded-full 
                    ${recommendation.priority === 'high' 
                      ? 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300' 
                      : recommendation.priority === 'medium'
                        ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300'
                        : 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300'
                    }
                  `}>
                    {recommendation.priority === 'high' ? 'Alta' : recommendation.priority === 'medium' ? 'Média' : 'Baixa'}
                  </span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {recommendation.description}
              </p>
              
              <div className="flex justify-between items-center mt-3">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Confiança: {Math.round(recommendation.confidence * 100)}%
                </div>
                
                {!recommendation.applied && (
                  <button 
                    className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center"
                    onClick={() => onApplyRecommendation(recommendation)}
                  >
                    {recommendation.actionText}
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-6 text-gray-500 dark:text-gray-400">
            <div className="w-12 h-12 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3">
              <Lightbulb className="h-6 w-6 text-gray-400 dark:text-gray-500" />
            </div>
            <p>Nenhuma recomendação disponível no momento</p>
            <p className="text-xs mt-1">Recomendações serão geradas com base na análise de dados e atividades do hospital</p>
          </div>
        )}
      </div>
    </div>
  );
};