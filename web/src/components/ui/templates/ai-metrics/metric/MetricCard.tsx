/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { 
  ArrowUp, 
  ArrowDown, 
  Check, 
  X, 
  AlertCircle,
  Edit3,
  Sparkles,
  Plus
} from 'lucide-react';
import { Button } from "@/components/ui/organisms/button";
import { Badge } from "@/components/ui/organisms/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/organisms/card";
import { motion } from 'framer-motion';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/organisms/tooltip";

// Mapeamento de ícones
import { 
  Activity, 
  AlertTriangle, 
  LineChart, 
  BarChart3, 
  PieChart, 
  Brain 
} from 'lucide-react';
import { IMetricSuggestion } from '@/types/ai-metric';

const iconMap = {
  activity: Activity,
  lineChart: LineChart,
  barChart: BarChart3,
  pieChart: PieChart,
  alert: AlertCircle,
  warning: AlertTriangle,
  brain: Brain,
};

interface MetricCardProps {
  metric: IMetricSuggestion;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onImplement?: (id: string) => void;
  showActions: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  metric,
  onApprove,
  onReject,
  onImplement,
  showActions
}) => {
  // Determine the icon component to use
  const IconComponent = iconMap[metric.icon as keyof typeof iconMap] || Activity;

  // Card gradients with brighter colors
  const getCardGradient = (type: string): string => {
    const gradients: Record<string, string> = {
      'critical-hospital': 'from-red-900/80 to-rose-900/70', 
      'burnout': 'from-amber-900/80 to-orange-900/70',          
      'manutencao': 'from-blue-900/80 to-indigo-900/70',      
      'taxa-giro': 'from-cyan-900/80 to-blue-900/70',       
      'eficiencia': 'from-emerald-900/80 to-green-900/70',      
      'ocupacao': 'from-violet-900/80 to-purple-900/70',        
      'variacao': 'from-pink-900/80 to-fuchsia-900/70',        
      'treinamento': 'from-teal-900/80 to-cyan-900/70'      
    };
    return gradients[type] || 'from-gray-800 to-gray-900'; // Fallback
  };

  // Brighter badge colors
  const priorityColors = {
    high: 'bg-red-800/60 text-red-300 border-red-700/70',
    medium: 'bg-amber-800/60 text-amber-300 border-amber-700/70',
    low: 'bg-blue-800/60 text-blue-300 border-blue-700/70'
  };

  const statusBadgeColors = {
    suggested: '',
    approved: 'bg-green-800/60 text-green-300 border-green-700/70',
    rejected: 'bg-red-800/60 text-red-300 border-red-700/70',
    implemented: 'bg-indigo-800/60 text-indigo-300 border-indigo-700/70'
  };

  const iconBackgrounds = {
    high: 'bg-red-800/60 text-red-300',
    medium: 'bg-amber-800/60 text-amber-300',
    low: 'bg-blue-800/60 text-blue-300'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`
        bg-gradient-to-br ${getCardGradient(metric.cardType)}
        border-gray-700/60 hover:border-indigo-600/80 transition-all
        shadow-lg hover:shadow-xl backdrop-blur-md
        transform hover:scale-[1.01] duration-200
        ${metric.status === 'approved' ? 'border-l-4 border-l-green-500' : 
          metric.status === 'rejected' ? 'border-l-4 border-l-red-500 opacity-60' : 
          metric.status === 'implemented' ? 'border-l-4 border-l-indigo-500' : ''}
      `}>
        <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-xl ${iconBackgrounds[metric.priority]} shadow-inner border border-${metric.priority === 'high' ? 'red' : metric.priority === 'medium' ? 'amber' : 'blue'}-700/30`}>
              <IconComponent className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-medium text-white">{metric.title}</CardTitle>
              <p className="text-xs text-gray-300 mt-1 flex flex-wrap gap-1.5">
                <Badge variant="outline" className="bg-gray-800/70 text-gray-300 border-gray-700/50 shadow-sm">
                  {metric.type === 'main' ? 'Principal' : 'Adicional'}
                </Badge>
                <Badge variant="outline" className="bg-gray-800/70 text-gray-300 border-gray-700/50 shadow-sm">
                  {metric.category}
                </Badge>
                {metric.aiGenerated && (
                  <Badge className="bg-indigo-700/60 text-indigo-200 border-none shadow-sm">
                    <Sparkles className="h-3 w-3 mr-1" />
                    IA
                  </Badge>
                )}
              </p>
            </div>
          </div>
          
          {showActions && (
            <div className="flex space-x-2">
              {metric.status === 'suggested' && onApprove && onReject && (
                <>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => onApprove(metric.id)}
                          className="h-8 w-8 p-0 text-green-400 hover:text-green-300 hover:bg-green-800/50 rounded-full"
                        >
                          <Check className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p className="text-xs">Aprovar</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => onReject(metric.id)}
                          className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-800/50 rounded-full"
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p className="text-xs">Rejeitar</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </>
              )}
              
              {metric.status === 'approved' && onImplement && (
                <Button 
                  size="sm"
                  onClick={() => onImplement(metric.id)}
                  className="bg-green-700 hover:bg-green-600 text-white text-xs h-8 shadow-md transition-colors duration-200"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Implementar
                </Button>
              )}
              
              {metric.status !== 'suggested' && (
                <Badge className={statusBadgeColors[metric.status]}>
                  {metric.status === 'approved' ? 'Aprovada' : 
                   metric.status === 'rejected' ? 'Rejeitada' : 
                   'Implementada'}
                </Badge>
              )}
            </div>
          )}
        </CardHeader>
        
        <CardContent className="p-4 pt-2">
          <p className="text-sm text-gray-300 mb-3">{metric.description}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {metric.value && (
                <div className="bg-gray-800/70 rounded-lg px-3 py-1 shadow-inner border border-gray-700/50">
                  <p className="text-sm font-medium text-indigo-300">
                    {metric.value}
                    <span className="text-xs text-gray-400 ml-1">{metric.unit}</span>
                  </p>
                </div>
              )}
              
              {metric.trend !== undefined && (
                <div className={`flex items-center ${metric.trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {metric.trend > 0 ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
                  <span className="text-xs font-medium">{Math.abs(metric.trend)}%</span>
                </div>
              )}
            </div>
            
            <p className="text-xs text-gray-400">
              {new Intl.DateTimeFormat('pt-BR', { 
                day: '2-digit', 
                month: '2-digit', 
                hour: '2-digit', 
                minute: '2-digit' 
              }).format(metric.createdAt)}
            </p>
          </div>
          
          {metric.status === 'implemented' && (
            <div className="mt-2 pt-2 border-t border-gray-700/50">
              <Badge variant="outline" className="text-green-300 border-green-700/50 bg-green-800/30 flex items-center w-fit">
                <Check className="h-3 w-3 mr-1" />
                Adicionada ao dashboard
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};