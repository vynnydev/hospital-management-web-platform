import { 
    Activity, 
    AlertTriangle, 
    Ambulance, 
    ArrowRight, 
    Calendar, 
    Check, 
    Layers, 
    Lightbulb, 
    Users 
} from "lucide-react";
import { TRecommendationType } from "@/types/ai-assistant-types";

interface RecommendationCardProps {
    id: string;
    type: TRecommendationType;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    actionText: string;
    confidence: number;
    applied: boolean;
    onApply: (id: string) => void;
    compact?: boolean;
  }
  
  /**
   * Componente de cartão para exibir uma recomendação do assistente de IA
   */
  export const RecommendationCard: React.FC<RecommendationCardProps> = ({
    id,
    type,
    title,
    description,
    priority,
    actionText,
    confidence,
    applied,
    onApply,
    compact = false
  }) => {
    // Obter ícone com base no tipo de recomendação
    const getTypeIcon = () => {
      switch (type) {
        case 'resource-optimization':
          return <Layers className="h-4 w-4" />;
        case 'staff-allocation':
          return <Users className="h-4 w-4" />;
        case 'patient-transfer':
          return <Activity className="h-4 w-4" />;
        case 'ambulance-dispatch':
          return <Ambulance className="h-4 w-4" />;
        case 'scheduling':
          return <Calendar className="h-4 w-4" />;
        default:
          return <Lightbulb className="h-4 w-4" />;
      }
    };
    
    // Obter cores com base na prioridade e no estado
    const getCardClasses = () => {
      if (applied) {
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      }
      
      switch (priority) {
        case 'high':
          return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
        case 'medium':
          return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
        case 'low':
          return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
        default:
          return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      }
    };
    
    // Obter classes do ícone de status
    const getStatusIconClasses = () => {
      if (applied) {
        return 'text-green-500 dark:text-green-400';
      }
      
      switch (priority) {
        case 'high':
          return 'text-red-500 dark:text-red-400';
        case 'medium':
          return 'text-amber-500 dark:text-amber-400';
        case 'low':
          return 'text-blue-500 dark:text-blue-400';
        default:
          return 'text-blue-500 dark:text-blue-400';
      }
    };
    
    // Renderizar o status da prioridade
    const renderPriorityBadge = () => {
      let bgColor, textColor;
      
      switch (priority) {
        case 'high':
          bgColor = 'bg-red-100 dark:bg-red-900/40';
          textColor = 'text-red-800 dark:text-red-300';
          break;
        case 'medium':
          bgColor = 'bg-amber-100 dark:bg-amber-900/40';
          textColor = 'text-amber-800 dark:text-amber-300';
          break;
        case 'low':
          bgColor = 'bg-blue-100 dark:bg-blue-900/40';
          textColor = 'text-blue-800 dark:text-blue-300';
          break;
        default:
          bgColor = 'bg-blue-100 dark:bg-blue-900/40';
          textColor = 'text-blue-800 dark:text-blue-300';
      }
      
      return (
        <span className={`px-1.5 py-0.5 rounded-full ${bgColor} ${textColor} text-xs`}>
          {priority === 'high' ? 'Alta' : priority === 'medium' ? 'Média' : 'Baixa'}
        </span>
      );
    };
    
    // Renderizar o componente em modo compacto
    if (compact) {
      return (
        <div className={`p-3 border rounded-lg ${getCardClasses()}`}>
          <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 flex items-start">
            {applied ? (
              <Check className={`h-4 w-4 ${getStatusIconClasses()} mr-1 flex-shrink-0 mt-0.5`} />
            ) : priority === 'high' ? (
              <AlertTriangle className={`h-4 w-4 ${getStatusIconClasses()} mr-1 flex-shrink-0 mt-0.5`} />
            ) : (
              <Lightbulb className={`h-4 w-4 ${getStatusIconClasses()} mr-1 flex-shrink-0 mt-0.5`} />
            )}
            <span>{title}</span>
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 ml-5">
            {description}
          </p>
          
          {!applied && (
            <button 
              className="mt-2 ml-5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center"
              onClick={() => onApply(id)}
            >
              {actionText}
              <ArrowRight className="h-3 w-3 ml-1" />
            </button>
          )}
        </div>
      );
    }
    
    // Renderizar o componente em modo completo
    return (
      <div className={`p-3 border rounded-lg ${getCardClasses()}`}>
        <div className="flex items-start justify-between">
          <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 flex items-center">
            {applied ? (
              <Check className={`h-4 w-4 ${getStatusIconClasses()} mr-1.5 flex-shrink-0`} />
            ) : priority === 'high' ? (
              <AlertTriangle className={`h-4 w-4 ${getStatusIconClasses()} mr-1.5 flex-shrink-0`} />
            ) : (
              <span className="mr-1.5 flex-shrink-0">{getTypeIcon()}</span>
            )}
            {title}
          </h4>
          
          <div className="flex items-center">
            {renderPriorityBadge()}
          </div>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          {description}
        </p>
        
        <div className="flex justify-between items-center mt-3">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Confiança: {Math.round(confidence * 100)}%
          </div>
          
          {!applied && (
            <button 
              className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center"
              onClick={() => onApply(id)}
            >
              {actionText}
              <ArrowRight className="h-3 w-3 ml-1" />
            </button>
          )}
        </div>
      </div>
    );
  };