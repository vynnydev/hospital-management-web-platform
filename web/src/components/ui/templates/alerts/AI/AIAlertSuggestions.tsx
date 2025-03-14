/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Brain, 
  CheckCircle2, 
  Lightbulb, 
  Loader, 
  Sparkles, 
  MessageSquare,
  X,
  ChevronRight
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/organisms/scroll-area';
import { Button } from '@/components/ui/organisms/button';
import { useNetworkData } from '@/services/hooks/network-hospital/useNetworkData';
import type { IHospital } from '@/types/hospital-network-types';
import { useAlerts } from '../../providers/alerts/AlertsProvider';
import { IAlert, TAlertType } from '@/types/alert-types';

interface AIAlertSuggestionsProps {
  selectedHospitalId?: string;
  onCreateAlert?: (alertData: Partial<IAlert>) => void;
  onViewAlerts?: () => void;
  className?: string;
}

// Representação de uma sugestão de IA
interface AISuggestion {
  id: string;
  type: TAlertType;
  title: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  actions: string[];
  confidence: number;
  reasoning: string;
  hospitals: string[];
}

export const AIAlertSuggestions: React.FC<AIAlertSuggestionsProps> = ({
  selectedHospitalId,
  onCreateAlert,
  onViewAlerts,
  className = ''
}) => {
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<AISuggestion | null>(null);
  const { addCustomAlert } = useAlerts();
  const { networkData } = useNetworkData();

  // Simular a busca de sugestões da IA
  useEffect(() => {
    const fetchSuggestions = async () => {
      setLoading(true);
      
      // Em uma implementação real, isso viria da API de IA
      // Simulação de atraso de rede
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Sugestões simuladas - em uma implementação real, isso seria gerado pela IA
      const mockSuggestions: AISuggestion[] = [
        {
          id: 'sug-001',
          type: 'resource',
          title: 'Baixo estoque de oxigênio',
          message: 'Análise preditiva indica que o estoque de oxigênio atingirá níveis críticos em 48h no Hospital 4Health Itaim. Recomenda-se reabastecimento imediato.',
          priority: 'medium',
          actions: ['Solicitar reabastecimento', 'Revisar uso atual', 'Analisar tendências'],
          confidence: 0.89,
          reasoning: 'Baseado no consumo das últimas 72h e nas previsões de admissão para os próximos dias.',
          hospitals: ['RD4H-SP-ITAIM']
        },
        {
          id: 'sug-002',
          type: 'patient-arrival',
          title: 'Aumento previsto de pacientes',
          message: 'Dados meteorológicos indicam uma frente fria nos próximos 3 dias, que historicamente correlaciona-se com um aumento de 25% nas admissões respiratórias.',
          priority: 'medium',
          actions: ['Preparar equipe respiratória', 'Revisar leitos disponíveis', 'Verificar estoque de medicamentos'],
          confidence: 0.78,
          reasoning: 'Análise de dados históricos de admissões dos últimos 2 anos correlacionados com mudanças climáticas.',
          hospitals: ['RD4H-SP-ITAIM', 'RD4H-SP-MORUMBI', 'RD4H-RJ-COPA']
        },
        {
          id: 'sug-003',
          type: 'emergency',
          title: 'Ocupação crítica iminente na UTI',
          message: 'Análise de tendência indica que a UTI atingirá ocupação acima de 95% nas próximas 6 horas. Pacientes críticos em ambulatório e emergência podem necessitar de transferência.',
          priority: 'high',
          actions: ['Avaliar transferências', 'Antecipar altas possíveis', 'Alocar recursos adicionais'],
          confidence: 0.92,
          reasoning: 'Baseado na taxa atual de ocupação (89%), admissões previstas e tempo médio de permanência dos pacientes atuais.',
          hospitals: ['RD4H-SP-ITAIM']
        }
      ];
      
      // Filtrar sugestões por hospital se um hospital específico foi selecionado
      const filteredSuggestions = selectedHospitalId
        ? mockSuggestions.filter(sug => sug.hospitals.includes(selectedHospitalId))
        : mockSuggestions;
      
      setSuggestions(filteredSuggestions);
      setLoading(false);
    };
    
    fetchSuggestions();
  }, [selectedHospitalId]);

  // Aplicar uma sugestão da IA
  const applySuggestion = (suggestion: AISuggestion) => {
    suggestion.hospitals.forEach(hospitalId => {
      addCustomAlert({
        title: suggestion.title,
        message: suggestion.message,
        type: suggestion.type,
        priority: suggestion.priority,
        actionRequired: true,
        hospitalId,
        metadata: {
          aiGenerated: true,
          confidence: suggestion.confidence,
          reasoning: suggestion.reasoning,
          suggestedActions: suggestion.actions
        }
      });
    });
    
    // Se um callback foi fornecido, chamar
    if (onViewAlerts) {
      onViewAlerts();
    }
  };

  // Criar alerta com base na sugestão
  const createAlertFromSuggestion = (suggestion: AISuggestion) => {
    if (onCreateAlert) {
      onCreateAlert({
        title: suggestion.title,
        message: suggestion.message,
        type: suggestion.type,
        priority: suggestion.priority,
        metadata: {
          aiGenerated: true,
          confidence: suggestion.confidence,
          reasoning: suggestion.reasoning,
          suggestedActions: suggestion.actions
        }
      });
    }
  };

  // Se estiver exibindo os detalhes de uma sugestão
  if (selectedSuggestion) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden ${className}`}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSelectedSuggestion(null)}
              className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="font-medium text-gray-900 dark:text-gray-100">Detalhes da Sugestão</h3>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>IA</span>
            </span>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center
                ${selectedSuggestion.type === 'emergency' 
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400'
                  : selectedSuggestion.type === 'ambulance'
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400'
                    : selectedSuggestion.type === 'patient-arrival'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-500 dark:text-green-400'
                      : 'bg-amber-100 dark:bg-amber-900/30 text-amber-500 dark:text-amber-400'
                }`}
              >
                {selectedSuggestion.type === 'emergency' ? (
                  <AlertTriangle className="w-6 h-6" />
                ) : selectedSuggestion.type === 'patient-arrival' ? (
                  <MessageSquare className="w-6 h-6" />
                ) : (
                  <Lightbulb className="w-6 h-6" />
                )}
              </div>
              
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {selectedSuggestion.title}
                </h2>
                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    selectedSuggestion.priority === 'high'
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                      : selectedSuggestion.priority === 'medium'
                        ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                        : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  }`}>
                    Prioridade {selectedSuggestion.priority === 'high' ? 'Alta' : selectedSuggestion.priority === 'medium' ? 'Média' : 'Baixa'}
                  </span>
                  
                  <span className="flex items-center gap-1.5">
                    <Brain className="w-3.5 h-3.5" />
                    Confiança: {Math.round(selectedSuggestion.confidence * 100)}%
                  </span>
                </div>
              </div>
            </div>
            
            {/* Message */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Descrição
              </h3>
              <p className="text-gray-800 dark:text-gray-200 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                {selectedSuggestion.message}
              </p>
            </div>
            
            {/* Reasoning */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Raciocínio da IA
              </h3>
              <p className="text-gray-800 dark:text-gray-200 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800/50">
                {selectedSuggestion.reasoning}
              </p>
            </div>
            
            {/* Suggested Actions */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Ações Sugeridas
              </h3>
              <ul className="space-y-2">
                {selectedSuggestion.actions.map((action, index) => (
                  <li key={index} className="flex items-start gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-500 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-800 dark:text-gray-200">{action}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Affected Hospitals */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Hospitais Afetados
              </h3>
              <div className="space-y-2">
                {selectedSuggestion.hospitals.map(hospitalId => {
                  const hospital = networkData?.hospitals.find(h => h.id === hospitalId);
                  return (
                    <div key={hospitalId} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                            {hospital?.name || 'Hospital Desconhecido'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {hospital?.unit.city}, {hospital?.unit.state}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-600">
                        {hospital?.metrics.overall.occupancyRate}% ocupação
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setSelectedSuggestion(null)}
                className="flex-1"
              >
                Voltar
              </Button>
              <Button
                onClick={() => applySuggestion(selectedSuggestion)}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Aplicar Sugestão
              </Button>
            </div>
            
            <div className="flex justify-end">
              <Button
                variant="link"
                onClick={() => createAlertFromSuggestion(selectedSuggestion)}
                className="text-indigo-600 dark:text-indigo-400"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Personalizar como alerta
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
          <h3 className="font-medium text-gray-900 dark:text-gray-100">Sugestões da IA</h3>
        </div>
        
        <span className="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded-full flex items-center gap-1">
          <Brain className="w-3 h-3" />
          <span>Assistente H24</span>
        </span>
      </div>
      
      {/* Content */}
      <div className="p-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-center">
              Analisando dados para sugestões inteligentes...
            </p>
          </div>
        ) : suggestions.length > 0 ? (
          <div className="space-y-4">
            {suggestions.map(suggestion => (
              <div
                key={suggestion.id}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                onClick={() => setSelectedSuggestion(suggestion)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center
                      ${suggestion.type === 'emergency' 
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400'
                        : suggestion.type === 'ambulance'
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400'
                          : suggestion.type === 'patient-arrival'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-500 dark:text-green-400'
                            : 'bg-amber-100 dark:bg-amber-900/30 text-amber-500 dark:text-amber-400'
                      }`}
                    >
                      {suggestion.type === 'emergency' ? (
                        <AlertTriangle className="w-4 h-4" />
                      ) : suggestion.type === 'patient-arrival' ? (
                        <MessageSquare className="w-4 h-4" />
                      ) : (
                        <Lightbulb className="w-4 h-4" />
                      )}
                    </div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                      {suggestion.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      suggestion.priority === 'high'
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                        : suggestion.priority === 'medium'
                          ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                          : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    }`}>
                      {suggestion.priority === 'high' ? 'Alta' : suggestion.priority === 'medium' ? 'Média' : 'Baixa'}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {Math.round(suggestion.confidence * 100)}%
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
                  {suggestion.message}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {suggestion.hospitals.map(hospitalId => {
                      const hospital = networkData?.hospitals.find(h => h.id === hospitalId);
                      return (
                        <span key={hospitalId} className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300">
                          {hospital?.name.replace('Hospital 4Health - ', '') || 'Hospital'}
                        </span>
                      );
                    })}
                  </div>
                  
                  <button className="text-xs text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline">
                    Ver detalhes
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-gray-700 dark:text-gray-300 font-medium mb-1">Nenhuma sugestão disponível</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md">
              A IA não encontrou sugestões relevantes para o contexto atual. Continue monitorando para futuras recomendações.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};