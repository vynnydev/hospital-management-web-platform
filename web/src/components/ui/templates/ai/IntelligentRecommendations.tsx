/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNetworkData } from '@/hooks/network-hospital/useNetworkData';
import { useAmbulanceData } from '@/hooks/ambulance/useAmbulanceData';
import { useStaffData } from '@/hooks/staffs/useStaffData';
import { useAlertsProvider } from '../providers/alerts/AlertsProvider';
import { 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Users, 
  Bed, 
  Ambulance, 
  ChevronDown, 
  ChevronUp,
  RefreshCw,
  Clock,
  AlertCircle
} from 'lucide-react';

interface RecommendationItem {
  id: string;
  title: string;
  description: string;
  type: 'staff' | 'beds' | 'ambulance' | 'patient';
  impact: 'high' | 'medium' | 'low';
  aiConfidence: number;
  timeToImplement: string;
  potentialBenefit: string;
  detailedSteps?: string[];
  implemented: boolean;
  dismissed: boolean;
}

interface IntelligentRecommendationsProps {
  hospitalId: string;
}

export const IntelligentRecommendations: React.FC<IntelligentRecommendationsProps> = ({ hospitalId }) => {
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [activeRecommendation, setActiveRecommendation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'staff' | 'beds' | 'ambulance' | 'patient'>('all');
  const [error, setError] = useState<string | null>(null);

  const { networkData } = useNetworkData();
  const { ambulanceData } = useAmbulanceData(hospitalId);
  const { staffData } = useStaffData(hospitalId);
  const { alerts } = useAlertsProvider();

  // Verificar se os dados do hospital estão disponíveis
  const hospital = networkData?.hospitals.find(h => h.id === hospitalId);

  // Função para gerar recomendações baseadas nos dados do sistema
  useEffect(() => {
    if (networkData && staffData && ambulanceData && hospital) {
      generateRecommendations();
    }
  }, [networkData, staffData, ambulanceData, hospitalId, hospital]);

  const generateRecommendations = () => {
    setIsLoading(true);
    setError(null);
    
    // Verificar se os dados necessários estão disponíveis
    if (!hospital) {
      setError('Dados do hospital não disponíveis');
      setIsLoading(false);
      return;
    }
    
    // Simulação de tempo de processamento de IA
    setTimeout(() => {
      try {
        // Lógica para gerar recomendações baseadas nos dados
        const occupancyRate = hospital.metrics.overall.occupancyRate;
        
        // Acessar com segurança as propriedades aninhadas de staffMetrics
        // Verificando cada nível para evitar erros de undefined
        const staffMetricsUti = staffData?.staffMetrics?.[hospitalId]?.departmental?.['uti'];
        const utiNurses = staffMetricsUti?.staffDistribution?.nurses;
        const utiDoctors = staffMetricsUti?.staffDistribution?.doctors;
        
        const ambulances = ambulanceData?.ambulances[hospitalId] || [];
        const pendingRequests = ambulanceData?.requests[hospitalId]?.filter(r => r.status === 'pending') || [];
        
        const newRecommendations: RecommendationItem[] = [];
        
        // Recomendação baseada na taxa de ocupação
        if (occupancyRate > 85) {
          newRecommendations.push({
            id: 'rec-1',
            title: 'Redistribuição de pacientes',
            description: 'A taxa de ocupação está acima de 85%, recomendamos a redistribuição de pacientes não-críticos para outras unidades ou setores com menor ocupação.',
            type: 'beds',
            impact: 'high',
            aiConfidence: 0.92,
            timeToImplement: '24-48 horas',
            potentialBenefit: 'Redução da taxa de ocupação para níveis seguros e melhoria no atendimento a pacientes críticos',
            detailedSteps: [
              'Identificar pacientes estáveis em recuperação que podem ser transferidos',
              'Verificar disponibilidade em outros setores ou unidades',
              'Priorizar transferências com base em necessidades clínicas',
              'Comunicar equipe médica e familiares'
            ],
            implemented: false,
            dismissed: false
          });
        }
        
        // Recomendação baseada nas métricas de equipe - COM VERIFICAÇÃO DE UNDEFINED
        if (utiNurses !== undefined && utiDoctors !== undefined && utiNurses < utiDoctors * 2) {
          newRecommendations.push({
            id: 'rec-2',
            title: 'Ajuste na proporção enfermeiros/médicos na UTI',
            description: 'A proporção atual de enfermeiros por médico na UTI está abaixo do recomendado. Considere ampliar o quadro de enfermagem para melhorar a qualidade do atendimento.',
            type: 'staff',
            impact: 'medium',
            aiConfidence: 0.88,
            timeToImplement: '1-2 semanas',
            potentialBenefit: 'Melhoria nos indicadores de segurança do paciente e redução da carga de trabalho',
            detailedSteps: [
              'Revisar escala atual de enfermeiros na UTI',
              'Verificar disponibilidade de profissionais para realocação temporária',
              'Iniciar processo seletivo para contratação de novos enfermeiros se necessário',
              'Ajustar escala considerando distribuição por turnos'
            ],
            implemented: false,
            dismissed: false
          });
        }
        
        // Recomendação baseada nas ambulâncias
        const availableAmbulances = ambulances.filter(a => a.status === 'available');
        if (availableAmbulances.length < 2 && pendingRequests.length > 0) {
          newRecommendations.push({
            id: 'rec-3',
            title: 'Ampliação da frota de ambulâncias disponíveis',
            description: 'Há requisições pendentes e poucas ambulâncias disponíveis. Recomendamos a realocação de recursos para aumentar a disponibilidade do serviço de transporte emergencial.',
            type: 'ambulance',
            impact: 'high',
            aiConfidence: 0.85,
            timeToImplement: '24-72 horas',
            potentialBenefit: 'Redução no tempo de resposta a emergências e melhoria no atendimento a pacientes críticos',
            implemented: false,
            dismissed: false
          });
        }
        
        // Recomendação baseada nos alertas
        const highPriorityAlerts = alerts?.filter(a => a.priority === 'high' && a.hospitalId === hospitalId) || [];
        if (highPriorityAlerts.length > 2) {
          newRecommendations.push({
            id: 'rec-4',
            title: 'Revisão dos protocolos de resposta a alertas críticos',
            description: `Existem ${highPriorityAlerts.length} alertas de alta prioridade ativos. Recomendamos uma revisão nos protocolos de resposta e atribuição clara de responsabilidades.`,
            type: 'patient',
            impact: 'high',
            aiConfidence: 0.90,
            timeToImplement: 'Imediato',
            potentialBenefit: 'Resposta mais rápida a situações críticas e redução de riscos aos pacientes',
            implemented: false,
            dismissed: false
          });
        }
        
        // Recomendação baseada na taxa de rotatividade
        if (hospital.metrics.overall.turnoverRate < 8) {
          newRecommendations.push({
            id: 'rec-5',
            title: 'Otimização do processo de alta hospitalar',
            description: 'A taxa de rotatividade de leitos está abaixo do ideal. Recomendamos a revisão e otimização dos processos de alta hospitalar para aumentar a eficiência do uso de leitos.',
            type: 'beds',
            impact: 'medium',
            aiConfidence: 0.87,
            timeToImplement: '1-2 semanas',
            potentialBenefit: 'Aumento na disponibilidade de leitos e redução do tempo médio de internação',
            detailedSteps: [
              'Implementar protocolo de alta programada desde a admissão',
              'Iniciar preparativos para alta 24h antes da data prevista',
              'Otimizar fluxo de documentação e prescrição de medicamentos para alta',
              'Monitorar indicadores de readmissão para garantir qualidade'
            ],
            implemented: false,
            dismissed: false
          });
        }
        
        setRecommendations(newRecommendations);
      } catch (err) {
        setError('Erro ao gerar recomendações. Tente novamente mais tarde.');
        console.error('Erro ao gerar recomendações:', err);
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  // Função para marcar recomendação como implementada
  const markAsImplemented = (id: string) => {
    setRecommendations(prev => 
      prev.map(rec => 
        rec.id === id 
          ? { ...rec, implemented: true, dismissed: false } 
          : rec
      )
    );
  };

  // Função para dispensar recomendação
  const dismissRecommendation = (id: string) => {
    setRecommendations(prev => 
      prev.map(rec => 
        rec.id === id 
          ? { ...rec, dismissed: true, implemented: false } 
          : rec
      )
    );
  };

  // Filtrar recomendações
  const filteredRecommendations = recommendations.filter(rec => 
    !rec.dismissed && 
    (filter === 'all' || rec.type === filter)
  );

  // Cor baseada no impacto
  const getImpactColor = (impact: 'high' | 'medium' | 'low') => {
    switch (impact) {
      case 'high':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
      case 'medium':
        return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20';
      case 'low':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
    }
  };

  // Ícone baseado no tipo
  const getTypeIcon = (type: 'staff' | 'beds' | 'ambulance' | 'patient') => {
    switch (type) {
      case 'staff':
        return <Users className="h-5 w-5" />;
      case 'beds':
        return <Bed className="h-5 w-5" />;
      case 'ambulance':
        return <Ambulance className="h-5 w-5" />;
      case 'patient':
        return <Clock className="h-5 w-5" />;
    }
  };

  // Renderizar estado de carregamento
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="flex flex-col items-center">
          <RefreshCw className="h-8 w-8 text-blue-600 dark:text-blue-400 animate-spin mb-2" />
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Processando dados e gerando recomendações...
          </p>
        </div>
      </div>
    );
  }

  // Renderizar estado de erro
  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
        <AlertCircle className="h-10 w-10 text-red-500 dark:text-red-400 mx-auto mb-2" />
        <h4 className="text-red-700 dark:text-red-300 font-medium mb-1">
          Não foi possível gerar recomendações
        </h4>
        <p className="text-red-600 dark:text-red-400 text-sm">
          {error}
        </p>
        <button
          onClick={generateRecommendations}
          className="mt-4 px-3 py-1.5 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-300 rounded-md text-sm font-medium hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
          <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
          Recomendações Inteligentes
        </h3>
        
        <div className="flex space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="border border-gray-300 dark:border-gray-600 rounded-md text-sm p-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
          >
            <option value="all">Todos os tipos</option>
            <option value="staff">Equipe</option>
            <option value="beds">Leitos</option>
            <option value="ambulance">Ambulâncias</option>
            <option value="patient">Pacientes</option>
          </select>
          
          <button 
            onClick={generateRecommendations}
            className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md p-1 hover:bg-blue-200 dark:hover:bg-blue-800/50"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {filteredRecommendations.length === 0 ? (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-center">
          <Sparkles className="h-10 w-10 text-blue-500 dark:text-blue-400 mx-auto mb-2" />
          <h4 className="text-gray-700 dark:text-gray-200 font-medium mb-1">
            Nenhuma recomendação ativa
          </h4>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Todas as recomendações foram implementadas ou dispensadas, ou não há dados suficientes para gerar recomendações.
          </p>
          <button
            onClick={generateRecommendations}
            className="mt-4 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-md text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-800/40 transition-colors"
          >
            Gerar novas recomendações
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRecommendations.map((rec) => (
            <div 
              key={rec.id} 
              className="bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 overflow-hidden"
            >
              <div 
                className="p-4 cursor-pointer"
                onClick={() => setActiveRecommendation(activeRecommendation === rec.id ? null : rec.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${
                      rec.type === 'staff' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' :
                      rec.type === 'beds' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                      rec.type === 'ambulance' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' :
                      'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                    }`}>
                      {getTypeIcon(rec.type)}
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {rec.title}
                      </h4>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        {rec.description}
                      </p>
                      
                      <div className="flex items-center mt-2 space-x-3">
                        <span className={`text-xs font-medium rounded-full px-2 py-0.5 ${getImpactColor(rec.impact)}`}>
                          Impacto {rec.impact === 'high' ? 'Alto' : rec.impact === 'medium' ? 'Médio' : 'Baixo'}
                        </span>
                        
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Confiança da IA: {(rec.aiConfidence * 100).toFixed(0)}%
                        </span>
                        
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {rec.timeToImplement}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <button 
                      className="p-1 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                      aria-label="Expandir"
                    >
                      {activeRecommendation === rec.id ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              
              {activeRecommendation === rec.id && (
                <div className="px-4 pb-4">
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Benefício potencial
                    </h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {rec.potentialBenefit}
                    </p>
                    
                    {rec.detailedSteps && (
                      <>
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Passos para implementação
                        </h5>
                        <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 mb-4 space-y-1">
                          {rec.detailedSteps.map((step, idx) => (
                            <li key={idx}>{step}</li>
                          ))}
                        </ul>
                      </>
                    )}
                    
                    <div className="flex space-x-2 mt-3">
                      <button
                        onClick={() => markAsImplemented(rec.id)}
                        className="flex items-center px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-md text-sm font-medium hover:bg-green-200 dark:hover:bg-green-800/40 transition-colors"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Implementar
                      </button>
                      
                      <button
                        onClick={() => dismissRecommendation(rec.id)}
                        className="flex items-center px-3 py-1.5 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Descartar
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
            </div>
          ))}
          
          {/* Histórico de recomendações implementadas */}
          {recommendations.some(r => r.implemented) && (
            <div className="mt-6 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mr-1" />
                Recomendações implementadas
              </h4>
              
              <div className="space-y-2">
                {recommendations.filter(r => r.implemented).map((rec) => (
                  <div 
                    key={rec.id} 
                    className="bg-white dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-start">
                      <div className={`p-1.5 rounded-lg mr-3 ${
                        rec.type === 'staff' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' :
                        rec.type === 'beds' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                        rec.type === 'ambulance' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' :
                        'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                      }`}>
                        {getTypeIcon(rec.type)}
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-gray-800 dark:text-gray-200 text-sm">
                          {rec.title}
                        </h5>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {rec.description.substring(0, 100)}...
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};