/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Sparkles, 
  AlertCircle
} from 'lucide-react';
import { useAlertsProvider } from '../providers/alerts/AlertsProvider';
import { INetworkData } from '@/types/hospital-network-types';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/organisms/tabs";
import { Badge } from "@/components/ui/organisms/badge";
import { ScrollArea } from "@/components/ui/organisms/scroll-area";
import { Alert, AlertTitle } from "@/components/ui/organisms/alert";
import { TAlertPriority, TAlertType } from '@/types/alert-types';
import { ChatMetricInterface } from './chat/ChatMetricInterface';
import { MetricSuggestionList } from './metric/MetricSuggestionList';
import { ApprovedMetricsList } from './metric/ApprovedMetricsList';

// Tipos para as sugestões de métricas
export interface IMetricSuggestion {
  id: string;
  title: string;
  description: string;
  type: 'main' | 'additional';
  cardType: string;
  priority: TAlertPriority;
  category: string;
  icon: string;
  aiGenerated: boolean;
  alertType?: TAlertType;
  createdAt: Date;
  trend?: number;
  value?: number | string;
  unit?: string;
  status: 'suggested' | 'approved' | 'rejected' | 'implemented';
}

interface IAIMetricsGeneratorProps {
  networkData: INetworkData;
  selectedHospital: string | null;
  onMetricCreate: (metricType: string, metricId: string) => Promise<void>;
  onClose: () => void;
}

export const AIMetricsGenerator: React.FC<IAIMetricsGeneratorProps> = ({
  networkData,
  selectedHospital,
  onMetricCreate,
  onClose
}) => {
  // Estado para mensagens do chat
  const [messages, setMessages] = useState<{
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
  }[]>([
    {
      role: 'assistant',
      content: 'Olá! Sou o assistente de geração de métricas baseado em IA. Como posso ajudar você hoje? Posso sugerir métricas personalizadas baseadas na análise dos dados do seu hospital.',
      timestamp: new Date()
    }
  ]);
  
  // Estado para as sugestões de métricas
  const [metricSuggestions, setMetricSuggestions] = useState<IMetricSuggestion[]>([]);
  
  // Estado para métricas aprovadas
  const [approvedMetrics, setApprovedMetrics] = useState<IMetricSuggestion[]>([]);
  
  // Estado para a aba ativa
  const [activeTab, setActiveTab] = useState('chat');
  
  // Estado para a análise em progresso
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Estado para notificações
  const [notification, setNotification] = useState<{
    type: 'success' | 'info' | 'warning' | 'error';
    message: string;
    visible: boolean;
  } | null>(null);
  
  // Acesso ao contexto de alertas
  const { addCustomAlert } = useAlertsProvider();

  // Função para mostrar uma notificação
  const showNotification = (type: 'success' | 'info' | 'warning' | 'error', message: string) => {
    setNotification({ type, message, visible: true });
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  // Função para iniciar análise
  const startAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    showNotification('info', 'Iniciando análise de dados para sugestão de métricas...');
    
    setMessages(prev => [...prev, {
      role: 'system',
      content: 'Iniciando análise de dados para geração de métricas personalizadas...',
      timestamp: new Date()
    }]);
  };

  // Efeito para avançar a barra de progresso da análise
  useEffect(() => {
    if (isAnalyzing && analysisProgress < 100) {
      const timer = setTimeout(() => {
        setAnalysisProgress(prev => Math.min(prev + 5, 100));
      }, 200);
      
      return () => clearTimeout(timer);
    } else if (analysisProgress >= 100) {
      setIsAnalyzing(false);
      // Gerar sugestões de métricas automáticas quando a análise terminar
      generateMetricSuggestions();
    }
  }, [isAnalyzing, analysisProgress]);

  // Função para gerar sugestões de métricas (simulação)
  const generateMetricSuggestions = () => {
    // Aqui você integraria com uma API de IA para gerar sugestões reais
    // com base nos dados do hospital e no histórico de alertas
    
    const newSuggestions: IMetricSuggestion[] = [
      {
        id: `metric-${Date.now()}-1`,
        title: 'Ocupação crítica por departamento',
        description: 'Monitora a taxa de ocupação por departamento e alerta quando estiver acima do limite crítico',
        type: 'main',
        cardType: 'critical-hospital',
        priority: 'high',
        category: 'ocupação',
        icon: 'warning',
        aiGenerated: true,
        alertType: 'occupancy',
        createdAt: new Date(),
        trend: 2.5,
        value: '85%',
        unit: '%',
        status: 'suggested'
      },
      {
        id: `metric-${Date.now()}-2`,
        title: 'Eficiência de giro de leitos',
        description: 'Mede a eficiência na rotatividade dos leitos hospitalares',
        type: 'additional',
        cardType: 'taxa-giro',
        priority: 'medium',
        category: 'eficiência',
        icon: 'lineChart',
        aiGenerated: true,
        alertType: 'operational',
        createdAt: new Date(),
        trend: 1.2,
        value: '5.4',
        unit: 'pacientes/leito',
        status: 'suggested'
      },
      {
        id: `metric-${Date.now()}-3`,
        title: 'Índice de risco de burnout',
        description: 'Avalia o risco de burnout das equipes médicas com base em carga de trabalho',
        type: 'additional',
        cardType: 'burnout',
        priority: 'high',
        category: 'recursos humanos',
        icon: 'alert',
        aiGenerated: true,
        alertType: 'staff',
        createdAt: new Date(),
        trend: -1.8,
        value: '7.2',
        unit: 'pontos',
        status: 'suggested'
      },
      {
        id: `metric-${Date.now()}-4`,
        title: 'Tempo médio de espera emergencial',
        description: 'Monitora o tempo médio de espera para atendimento emergencial',
        type: 'main',
        cardType: 'waiting',
        priority: 'high',
        category: 'atendimento',
        icon: 'activity',
        aiGenerated: true,
        alertType: 'operational',
        createdAt: new Date(),
        trend: 0.7,
        value: '12.5',
        unit: 'minutos',
        status: 'suggested'
      },
      {
        id: `metric-${Date.now()}-5`,
        title: 'Disponibilidade de equipamentos críticos',
        description: 'Monitora a disponibilidade de equipamentos críticos para atendimento',
        type: 'additional',
        cardType: 'manutencao',
        priority: 'medium',
        category: 'equipamentos',
        icon: 'barChart',
        aiGenerated: true,
        alertType: 'equipment',
        createdAt: new Date(),
        trend: 1.5,
        value: '94.2',
        unit: '%',
        status: 'suggested'
      }
    ];
    
    // Adicionar novas sugestões ao estado
    setMetricSuggestions(prev => [...prev, ...newSuggestions]);
    
    // Notificar o usuário através de uma mensagem no chat
    setMessages(prev => [...prev, {
      role: 'system',
      content: `Análise concluída! Encontrei ${newSuggestions.length} sugestões de métricas que podem ser relevantes para o seu contexto. Veja a aba "Sugestões" para mais detalhes.`,
      timestamp: new Date()
    }]);
    
    showNotification('success', `Análise concluída! ${newSuggestions.length} novas métricas foram sugeridas.`);
    
    // Mudar para a aba de sugestões após um breve delay
    setTimeout(() => setActiveTab('suggestions'), 1000);
  };

  // Função para aprovar uma sugestão de métrica
  const approveSuggestion = (suggestionId: string) => {
    const suggestion = metricSuggestions.find(s => s.id === suggestionId);
    if (!suggestion) return;
    
    // Atualizar o status da sugestão
    setMetricSuggestions(prev => 
      prev.map(s => s.id === suggestionId ? {...s, status: 'approved'} : s)
    );
    
    // Adicionar à lista de métricas aprovadas
    setApprovedMetrics(prev => [...prev, {...suggestion, status: 'approved'}]);
    
    showNotification('success', `A métrica "${suggestion.title}" foi aprovada com sucesso!`);
    
    // Criar alerta para notificar a equipe sobre a nova métrica
    if (suggestion.alertType) {
      addCustomAlert({
          title: `Nova métrica aprovada: ${suggestion.title}`,
          message: `Uma nova métrica "${suggestion.title}" foi aprovada e está pronta para implementação.`,
          type: suggestion.alertType as TAlertType,
          priority: suggestion.priority,
          sourceId: suggestion.id,
          hospitalId: selectedHospital || undefined,
          actionRequired: false
      });
    }
  };

  // Função para rejeitar uma sugestão de métrica
  const rejectSuggestion = (suggestionId: string) => {
    const suggestion = metricSuggestions.find(s => s.id === suggestionId);
    if (!suggestion) return;
    
    setMetricSuggestions(prev => 
      prev.map(s => s.id === suggestionId ? {...s, status: 'rejected'} : s)
    );
    
    showNotification('info', `A métrica "${suggestion.title}" foi rejeitada.`);
  };

  // Função para implementar uma métrica aprovada
  const implementMetric = async (metricId: string) => {
    const metric = approvedMetrics.find(m => m.id === metricId);
    if (!metric) return;
    
    try {
      // Chamar a função de callback para criar a métrica
      await onMetricCreate(metric.type, metric.cardType);
      
      // Atualizar o status da métrica
      setApprovedMetrics(prev => 
        prev.map(m => m.id === metricId ? {...m, status: 'implemented'} : m)
      );
      
      showNotification('success', `A métrica "${metric.title}" foi implementada e adicionada ao dashboard!`);
      
      // Criar alerta de sucesso
      addCustomAlert({
          title: `Métrica implementada: ${metric.title}`,
          message: `A métrica "${metric.title}" foi implementada com sucesso e já está disponível em seu dashboard.`,
          type: 'success',
          priority: 'medium',
          sourceId: metric.id,
          hospitalId: selectedHospital || undefined,
          actionRequired: false
      });
      
      // Adicionar mensagem no chat
      setMessages(prev => [...prev, {
        role: 'system',
        content: `A métrica "${metric.title}" foi implementada com sucesso e já está disponível em seu dashboard.`,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Erro ao implementar métrica:', error);
      showNotification('error', `Erro ao implementar a métrica "${metric.title}". Tente novamente.`);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1e2030] text-gray-200">
      {/* Área de notificação - Fixa */}
      {notification && (
        <div className="px-4 pt-2">
          <Alert 
            variant={notification.type === 'error' ? 'destructive' : 'default'}
            className={`
              ${notification.type === 'success' ? 'bg-green-900/30 border-green-600 text-green-200' : ''}
              ${notification.type === 'info' ? 'bg-blue-900/30 border-blue-600 text-blue-200' : ''}
              ${notification.type === 'warning' ? 'bg-amber-900/30 border-amber-600 text-amber-200' : ''}
              ${notification.type === 'error' ? 'bg-red-900/30 border-red-600 text-red-200' : ''}
            `}
          >
            <div className="flex items-center">
              {notification.type === 'success' && <Sparkles className="h-4 w-4 mr-2 text-green-400" />}
              {notification.type === 'info' && <Brain className="h-4 w-4 mr-2 text-blue-400" />}
              {notification.type === 'warning' && <AlertCircle className="h-4 w-4 mr-2 text-amber-400" />}
              {notification.type === 'error' && <AlertCircle className="h-4 w-4 mr-2 text-red-400" />}
              <AlertTitle className="text-sm font-medium mb-0">
                {notification.message}
              </AlertTitle>
            </div>
          </Alert>
        </div>
      )}

      {/* Cabeçalho com informações e título - Fixo */}
      <div className="p-4 border-b border-indigo-800/30 bg-[#1e1e38] flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center">
            <Brain className="h-6 w-6 text-indigo-100" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Assistente IA para Métricas</h2>
            <p className="text-sm text-indigo-200">Gere métricas personalizadas com análise inteligente</p>
          </div>
        </div>
        
        {selectedHospital && (
          <Badge className="bg-indigo-700/50 text-indigo-100 border-indigo-500">
            {networkData.hospitals.find(h => h.id === selectedHospital)?.name || 'Hospital Selecionado'}
          </Badge>
        )}
      </div>

      {/* Abas de navegação - Fixas */}
      <div className="border-b border-gray-800 bg-[#1e2334]">
        <div className="p-2">
          <div className="flex w-full overflow-hidden rounded-lg">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-3 px-6 font-medium text-sm ${
                activeTab === 'chat' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-[#24293e] text-gray-300 hover:bg-indigo-600/20'
              }`}
            >
              Conversa
            </button>
            <button
              onClick={() => setActiveTab('suggestions')}
              className={`flex-1 py-3 px-6 font-medium text-sm flex items-center justify-center ${
                activeTab === 'suggestions' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-[#24293e] text-gray-300 hover:bg-indigo-600/20'
              }`}
            >
              Sugestões 
              {metricSuggestions.filter(s => s.status === 'suggested').length > 0 && (
                <Badge variant="default" className="ml-2 bg-indigo-700 text-white">
                  {metricSuggestions.filter(s => s.status === 'suggested').length}
                </Badge>
              )}
            </button>
            <button
              onClick={() => setActiveTab('approved')}
              className={`flex-1 py-3 px-6 font-medium text-sm flex items-center justify-center ${
                activeTab === 'approved' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-[#24293e] text-gray-300 hover:bg-indigo-600/20'
              }`}
            >
              Aprovadas
              {approvedMetrics.filter(m => m.status === 'approved').length > 0 && (
                <Badge variant="default" className="ml-2 bg-green-600 text-white">
                  {approvedMetrics.filter(m => m.status === 'approved').length}
                </Badge>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Área de conteúdo dinâmico com rolagem */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'chat' && (
          <ChatMetricInterface 
            messages={messages}
            setMessages={setMessages}
            isAnalyzing={isAnalyzing}
            analysisProgress={analysisProgress}
            startAnalysis={startAnalysis}
          />
        )}

        {activeTab === 'suggestions' && (
          <MetricSuggestionList 
            suggestions={metricSuggestions}
            onApprove={approveSuggestion}
            onReject={rejectSuggestion}
          />
        )}

        {activeTab === 'approved' && (
          <ApprovedMetricsList 
            metrics={approvedMetrics} 
            onImplement={implementMetric}
          />
        )}
      </div>
    </div>
  );
};