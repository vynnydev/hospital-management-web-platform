/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { useNetworkData } from '@/services/hooks/network-hospital/useNetworkData';
import { 
  Activity, 
  TrendingUp, 
  ChevronDown, 
  ChevronUp, 
  Calendar, 
  Clock, 
  BarChart3,
  Users,
  Bed,
  Heart,
  PieChart,
  Bell,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { 
  TPredictionTimeframe, 
  TPredictionConfidence, 
  TPredictionTrend, 
  IPredictionCategory 
} from '@/types/ai-analytics-types';

interface PredictiveAnalysisProps {
  hospitalId: string;
}

// Interface para a previsão individual
interface Prediction {
  id: string;
  title: string;
  value: string | number;
  timeframe: TPredictionTimeframe;
  confidence: TPredictionConfidence;
  change: number;
  trend: TPredictionTrend;
}

export const PredictiveAnalysis: React.FC<PredictiveAnalysisProps> = ({ hospitalId }) => {
  const { networkData, loading: networkLoading } = useNetworkData();
  const [expandedCategory, setExpandedCategory] = useState<string | null>('occupancy');
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('7d');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const hospital = networkData?.hospitals.find(h => h.id === hospitalId);
  
  // Verificar se temos dados do hospital
  if (!hospital) {
    return (
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-center">
        <AlertCircle className="h-10 w-10 text-amber-500 dark:text-amber-400 mx-auto mb-2" />
        <h4 className="text-gray-700 dark:text-gray-200 font-medium mb-1">
          Dados do hospital não disponíveis
        </h4>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Não foi possível acessar os dados para este hospital. Tente selecionar outro hospital ou tente novamente mais tarde.
        </p>
      </div>
    );
  }
  
  // Gerar dados de previsão baseados nos dados do hospital
  const predictionCategories: IPredictionCategory[] = [
    {
      id: 'occupancy',
      title: 'Previsão de Ocupação',
      description: 'Análise preditiva de leitos e capacidade hospitalar',
      trend: hospital.metrics.overall.periodComparison.occupancy.trend,
      trendPercentage: hospital.metrics.overall.periodComparison.occupancy.value,
      icon: <Bed className="h-5 w-5" />,
      color: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30',
      predictions: [
        {
          id: 'pred-1',
          title: 'Taxa de Ocupação em 24h',
          value: `${(hospital.metrics.overall.occupancyRate + (Math.random() * 2 - 1)).toFixed(1)}%`,
          timeframe: '24h',
          confidence: 0.92,
          change: 1.2,
          trend: 'up',
          category: 'occupancy',
          timestamp: new Date()
        },
        {
          id: 'pred-2',
          title: 'Taxa de Ocupação em 7 dias',
          value: `${(hospital.metrics.overall.occupancyRate + (Math.random() * 5 - 2.5)).toFixed(1)}%`,
          timeframe: '7d',
          confidence: 0.85,
          change: -2.3,
          trend: 'down',
          category: 'occupancy',
          timestamp: new Date()
        },
        {
          id: 'pred-3',
          title: 'Leitos disponíveis em 24h',
          value: Math.round(hospital.metrics.overall.availableBeds * (1 + (Math.random() * 0.2 - 0.1))),
          timeframe: '24h',
          confidence: 0.90,
          change: -3.5,
          trend: 'down',
          category: 'occupancy',
          timestamp: new Date()
        },
        {
          id: 'pred-4',
          title: 'Tempo médio de internação',
          value: `${(hospital.metrics.overall.avgStayDuration * (1 + (Math.random() * 0.1 - 0.05))).toFixed(1)} dias`,
          timeframe: '30d',
          confidence: 0.82,
          change: 0.8,
          trend: 'up',
          category: 'occupancy',
          timestamp: new Date()
        }
      ]
    },
    {
      id: 'admissions',
      title: 'Previsão de Admissões',
      description: 'Análise de tendências para novas admissões e altas',
      trend: 'up',
      trendPercentage: 3.5,
      icon: <Users className="h-5 w-5" />,
      color: 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30',
      predictions: [
        {
          id: 'pred-5',
          title: 'Novas admissões em 24h',
          value: Math.round(hospital.metrics.overall.totalPatients * 0.05 * (1 + (Math.random() * 0.2 - 0.1))),
          timeframe: '24h',
          confidence: 0.87,
          change: 2.5,
          trend: 'up',
          category: 'admissions',
          timestamp: new Date()
        },
        {
          id: 'pred-6',
          title: 'Altas previstas em 24h',
          value: Math.round(hospital.metrics.overall.totalPatients * 0.04 * (1 + (Math.random() * 0.2 - 0.1))),
          timeframe: '24h',
          confidence: 0.89,
          change: 1.2,
          trend: 'up',
          category: 'admissions',
          timestamp: new Date()
        },
        {
          id: 'pred-7',
          title: 'Demanda de emergência',
          value: Math.round(hospital.metrics.overall.totalPatients * 0.08 * (1 + (Math.random() * 0.3 - 0.15))),
          timeframe: '24h',
          confidence: 0.78,
          change: 4.5,
          trend: 'up',
          category: 'admissions',
          timestamp: new Date()
        }
      ]
    },
    {
      id: 'resources',
      title: 'Previsão de Recursos',
      description: 'Previsões sobre necessidades de recursos humanos e materiais',
      trend: 'up',
      trendPercentage: 2.8,
      icon: <BarChart3 className="h-5 w-5" />,
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30',
      predictions: [
        {
          id: 'pred-8',
          title: 'Necessidade de enfermeiros',
          value: Math.round(hospital.metrics.overall.totalPatients * 0.3 * (1 + (Math.random() * 0.15 - 0.07))),
          timeframe: '7d',
          confidence: 0.83,
          change: 3.2,
          trend: 'up',
          category: 'resources',
          timestamp: new Date()
        },
        {
          id: 'pred-9',
          title: 'Utilização de UTI',
          value: `${(hospital.metrics.departmental.uti?.occupancy || 80) + (Math.random() * 5 - 2.5)}%`,
          timeframe: '24h',
          confidence: 0.88,
          change: 1.5,
          trend: 'up',
          category: 'resources',
          timestamp: new Date()
        },
        {
          id: 'pred-10',
          title: 'Demanda de ambulâncias',
          value: Math.round(5 * (1 + (Math.random() * 0.4 - 0.2))),
          timeframe: '24h',
          confidence: 0.75,
          change: -1.8,
          trend: 'down',
          category: 'resources',
          timestamp: new Date()
        }
      ]
    },
    {
      id: 'clinical',
      title: 'Previsões Clínicas',
      description: 'Análise de tendências clínicas e epidemiológicas',
      trend: 'down',
      trendPercentage: 1.5,
      icon: <Heart className="h-5 w-5" />,
      color: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30',
      predictions: [
        {
          id: 'pred-11',
          title: 'Readmissões previstas',
          value: `${(4.5 + (Math.random() * 1 - 0.5)).toFixed(1)}%`,
          timeframe: '30d',
          confidence: 0.81,
          change: -1.2,
          trend: 'down',
          category: 'clinical',
          timestamp: new Date()
        },
        {
          id: 'pred-12',
          title: 'Complicações pós-operatórias',
          value: `${(3.2 + (Math.random() * 0.8 - 0.4)).toFixed(1)}%`,
          timeframe: '7d',
          confidence: 0.84,
          change: -2.3,
          trend: 'down',
          category: 'clinical',
          timestamp: new Date()
        },
        {
          id: 'pred-13',
          title: 'Pacientes com potencial alta',
          value: Math.round(hospital.metrics.overall.totalPatients * 0.12 * (1 + (Math.random() * 0.2 - 0.1))),
          timeframe: '24h',
          confidence: 0.86,
          change: 3.7,
          trend: 'up',
          category: 'clinical',
          timestamp: new Date()
        }
      ]
    }
  ];
  
  // Estado de carregamento
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="flex flex-col items-center">
          <RefreshCw className="h-8 w-8 text-purple-600 dark:text-purple-400 animate-spin mb-2" />
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Processando análises preditivas...
          </p>
        </div>
      </div>
    );
  }

  // Estado de erro
  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
        <AlertCircle className="h-10 w-10 text-red-500 dark:text-red-400 mx-auto mb-2" />
        <h4 className="text-red-700 dark:text-red-300 font-medium mb-1">
          Erro ao carregar previsões
        </h4>
        <p className="text-red-600 dark:text-red-400 text-sm">
          {error}
        </p>
        <button
          onClick={() => setError(null)}
          className="mt-4 px-3 py-1.5 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-300 rounded-md text-sm font-medium hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    );
  }
  
  // Filtrar previsões com base no timeframe selecionado
  const filterPredictionsByTimeframe = (predictions: Prediction[]) => {
    if (timeframe === '24h') {
      return predictions.filter(p => p.timeframe === '24h');
    } else if (timeframe === '7d') {
      return predictions.filter(p => p.timeframe === '7d');
    } else {
      return predictions.filter(p => p.timeframe === '30d');
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
          <Activity className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
          Análise Preditiva
        </h3>
        
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
          <button
            className={`px-3 py-1 text-sm ${
              timeframe === '24h' 
                ? 'bg-blue-600 dark:bg-blue-700 text-white' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            onClick={() => setTimeframe('24h')}
          >
            24h
          </button>
          <button
            className={`px-3 py-1 text-sm ${
              timeframe === '7d' 
                ? 'bg-blue-600 dark:bg-blue-700 text-white' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            onClick={() => setTimeframe('7d')}
          >
            7 dias
          </button>
          <button
            className={`px-3 py-1 text-sm ${
              timeframe === '30d' 
                ? 'bg-blue-600 dark:bg-blue-700 text-white' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            onClick={() => setTimeframe('30d')}
          >
            30 dias
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {predictionCategories.slice(0, 4).map(category => {
          // Filtrar previsões para o timeframe atual
          const relevantPredictions = filterPredictionsByTimeframe(category.predictions);
          const primaryPrediction = relevantPredictions[0]; // Primeira previsão relevante
          
          return (
            <div 
              key={category.id}
              className="bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 overflow-hidden"
            >
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${category.color}`}>
                      {category.icon}
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {category.title}
                      </h4>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        {category.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <button 
                      onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                      className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400"
                      aria-label="Expandir"
                    >
                      {expandedCategory === category.id ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                
                {primaryPrediction && (
                  <div className="mt-4">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-gray-600 dark:text-gray-300 text-sm">{primaryPrediction.title}</span>
                      <span className="text-gray-500 dark:text-gray-400 text-xs">
                        Confiança: {typeof primaryPrediction.confidence === 'number' 
                          ? `${(primaryPrediction.confidence * 100).toFixed(0)}%`
                          : primaryPrediction.confidence}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-baseline">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        {primaryPrediction.value}
                      </span>
                      
                      <div className={`flex items-center text-sm ${
                        primaryPrediction.trend === 'up' 
                          ? 'text-green-600 dark:text-green-400' 
                          : primaryPrediction.trend === 'down'
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {primaryPrediction.trend === 'up' 
                          ? '↑' 
                          : primaryPrediction.trend === 'down' 
                            ? '↓' 
                            : '−'
                        } 
                        {Math.abs(primaryPrediction.change).toFixed(1)}%
                      </div>
                    </div>
                    
                    <div className="mt-1 flex items-center text-gray-500 dark:text-gray-400 text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      Previsão para {primaryPrediction.timeframe === '24h' 
                        ? '24 horas' 
                        : primaryPrediction.timeframe === '7d' 
                          ? '7 dias' 
                          : '30 dias'}
                    </div>
                  </div>
                )}
              </div>
              
              {expandedCategory === category.id && (
                <div className="px-4 pb-4 pt-2 border-t border-gray-200 dark:border-gray-600">
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Previsões detalhadas
                  </h5>
                  
                  <div className="space-y-3">
                    {relevantPredictions.slice(1).map(prediction => (
                      <div key={prediction.id} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                            {prediction.title}
                          </span>
                          <span className={`text-xs ${
                            prediction.trend === 'up' 
                              ? 'text-green-600 dark:text-green-400' 
                              : prediction.trend === 'down'
                                ? 'text-red-600 dark:text-red-400'
                                : 'text-gray-600 dark:text-gray-400'
                          }`}>
                            {prediction.trend === 'up' 
                              ? '↑' 
                              : prediction.trend === 'down' 
                                ? '↓' 
                                : '−'
                            } 
                            {Math.abs(prediction.change).toFixed(1)}%
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-gray-900 dark:text-gray-100 font-semibold">
                            {prediction.value}
                          </span>
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <Clock className="h-3 w-3 mr-1" />
                            {prediction.timeframe === '24h' 
                              ? '24 horas' 
                              : prediction.timeframe === '7d' 
                                ? '7 dias' 
                                : '30 dias'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
          <Bell className="h-4 w-4 text-amber-600 dark:text-amber-400 mr-2" />
          Alertas preditivos
        </h4>
        
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="bg-amber-100 dark:bg-amber-800/50 text-amber-600 dark:text-amber-400 rounded-full p-2">
              <TrendingUp className="h-5 w-5" />
            </div>
            
            <div>
              <h5 className="font-medium text-amber-800 dark:text-amber-300">
                Aumento previsto na demanda de UTI
              </h5>
              <p className="text-amber-700 dark:text-amber-400 text-sm mt-1">
                Os modelos preditivos indicam um possível aumento de 15% na demanda por leitos de UTI nos próximos 3 dias. 
                Considere revisar as escalas de equipe e a disponibilidade de recursos.
              </p>
              
              <div className="flex mt-3">
                <button className="text-xs bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 px-3 py-1 rounded-full">
                  Ver detalhes da previsão
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};