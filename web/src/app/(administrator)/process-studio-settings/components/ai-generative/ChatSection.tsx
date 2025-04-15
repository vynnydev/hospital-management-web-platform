/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from 'react';
import { Brain, MessageSquare, Zap, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/organisms/button';
import { Spinner } from '@/components/ui/organisms/spinner';
import { ChatInterface } from './ChatInterface';
import { AIPreview } from './AIPreview';
import { ICreateMetricPayload } from '@/types/hospital-metrics';
import { IHospitalInsight, IPredictiveInsight, ISystemInsight } from '@/hooks/AI/ai-analytics/useAIInsights';
import { MetricPreviewCard } from './MetricPreviewCard';
import { AlertPreview } from './alert/AlertPreview';
import { WorkflowPreview } from './alert/WorkflowPreview';
import { AIInsights } from '@/components/ui/templates/metrics/custom/ai/AIInsights';


interface Message {
  id: string;
  type: 'system' | 'user' | 'assistant';
  content: string | React.ReactNode;
}

interface ChatSectionProps {
  previewMetric: ICreateMetricPayload;
  updatePreviewMetric: (prompt: string) => ICreateMetricPayload;
  onCreateMetric: (metricData: ICreateMetricPayload) => Promise<any>;
  onShowDashboard: () => void;
  onOpenMetricForm: () => void;
  insights: (ISystemInsight | IHospitalInsight | IPredictiveInsight)[];
  insightsLoading?: boolean;
}

export const ChatSection: React.FC<ChatSectionProps> = ({
  previewMetric,
  updatePreviewMetric,
  onCreateMetric,
  onShowDashboard,
  onOpenMetricForm,
  insights,
  insightsLoading = false
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'system-1',
      type: 'system',
      content: 'Olá! Sou seu assistente para configuração hospitalar. Posso ajudar a criar métricas, fluxos de trabalho, alertas e outros elementos baseados nos dados do seu hospital. Como posso ajudar hoje?'
    }
  ]);
  
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiContentType, setAiContentType] = useState('metric');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Rolar para a parte inferior do chat quando novas mensagens são adicionadas
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
  // Funções para manipulação da interface de chat
  const handleSendMessage = () => {
    if (!aiPrompt.trim()) return;
  
    // Adicionar mensagem do usuário
    const newUserMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: aiPrompt
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    
    // Simular processamento de IA
    setIsGenerating(true);
    
    // Mostrar indicador de digitação
    const typingIndicator: Message = {
      id: `typing-${Date.now()}`,
      type: 'assistant',
      content: (
        <div className="flex space-x-2 items-center">
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce"></div>
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce delay-75"></div>
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce delay-150"></div>
        </div>
      )
    };
    
    setMessages(prev => [...prev, typingIndicator]);
    
    // Atualizar a prévia da métrica baseada no prompt
    const updatedPreview = updatePreviewMetric(aiPrompt);
    
    // Limpar o campo de entrada
    setAiPrompt('');
    
    // Também mostrar insights após alguns prompts específicos
    const prompt = aiPrompt.toLowerCase();
    if (prompt.includes('análise') || prompt.includes('insight') || prompt.includes('tendência')) {
      setTimeout(() => {
        setShowInsights(true);
      }, 3000);
    }
    
    // Simular resposta da IA após um breve atraso
    setTimeout(() => {
      // Remover indicador de digitação
      setMessages(prev => prev.filter(msg => msg.id !== typingIndicator.id));
      
      // Gerar resposta baseada no tipo de conteúdo
      let aiResponse: Message;
      
      switch (aiContentType) {
        case 'metric':
          aiResponse = {
            id: `assistant-${Date.now()}`,
            type: 'assistant',
            content: (
              <>
                <p>
                  Analisei os dados do seu hospital e posso criar uma métrica personalizada baseada na sua solicitação.
                  Com base nas tendências recentes e nos dados disponíveis, sugiro uma métrica com as seguintes características:
                </p>
                <ul className="list-disc pl-5 mt-2 mb-3">
                  <li><strong>{updatedPreview.title}</strong> - foco principal do monitoramento</li>
                  <li>{updatedPreview.subtitle} - contexto específico da métrica</li>
                  <li>Atualização em tempo real com dados do sistema hospitalar</li>
                </ul>
                <p>
                  Você pode visualizar a prévia abaixo e personalizar conforme necessário. 
                  Quando estiver satisfeito, clique em &quot;Aplicar&quot; para adicionar esta métrica ao seu painel.
                </p>
              </>
            )
          };
          break;
          
        case 'workflow':
          aiResponse = {
            id: `assistant-${Date.now()}`,
            type: 'assistant',
            content: (
              <>
                <p>
                  Analisei os processos atuais do seu hospital e criei um fluxo de trabalho otimizado para sua solicitação.
                  Este fluxo foi desenvolvido considerando os gargalos identificados nos dados operacionais:
                </p>
                <ul className="list-disc pl-5 mt-2 mb-3">
                  <li>Redução de 25% no tempo de espera entre etapas</li>
                  <li>Notificação automática para responsáveis por etapas atrasadas</li>
                  <li>Pontos de verificação para garantir qualidade e segurança</li>
                </ul>
                <p>
                  Você pode visualizar a prévia abaixo e ajustar conforme necessário.
                  Quando estiver satisfeito, clique em &quot;Aplicar&quot; para adicionar este fluxo ao sistema.
                </p>
              </>
            )
          };
          break;
          
        case 'alert':
          aiResponse = {
            id: `assistant-${Date.now()}`,
            type: 'assistant',
            content: (
              <>
                <p>
                  Com base na análise dos dados históricos do seu hospital, criei um sistema de alerta inteligente para sua solicitação.
                  Este alerta utiliza os seguintes parâmetros:
                </p>
                <ul className="list-disc pl-5 mt-2 mb-3">
                  <li>Limiar adaptativo que se ajusta automaticamente com base nos padrões de ocupação</li>
                  <li>Alertas graduais com diferentes níveis de severidade (85%, 90%, 95%)</li>
                  <li>Notificação para múltiplos canais: dashboard, email e aplicativo móvel</li>
                </ul>
                <p>
                  Você pode revisar a prévia abaixo e ajustar os parâmetros conforme necessário.
                  Quando estiver satisfeito, clique em &quot;Aplicar&quot; para ativar este alerta.
                </p>
              </>
            )
          };
          break;
          
        default:
          aiResponse = {
            id: `assistant-${Date.now()}`,
            type: 'assistant',
            content: (
              <>
                <p>
                  Analisei os dados disponíveis e criei um relatório personalizado com métricas relevantes para sua solicitação.
                  Este relatório inclui:
                </p>
                <ul className="list-disc pl-5 mt-2 mb-3">
                  <li>Visão histórica de tendências dos últimos 3 meses</li>
                  <li>Comparativos com benchmarks do setor hospitalar</li>
                  <li>Projeções com base em modelos preditivos</li>
                </ul>
                <p>
                  Você pode visualizar a prévia abaixo e fazer ajustes nos parâmetros conforme necessário.
                  Quando estiver satisfeito, clique em &quot;Aplicar&quot; para gerar o relatório completo.
                </p>
              </>
            )
          };
      }
      
      setMessages(prev => [...prev, aiResponse]);
      setIsGenerating(false);
    }, 2500);
  };
  
  // Função para lidar com o botão "Ver Mais Insights"
  const handleMoreInsights = () => {
    setShowInsights(true);
    
    // Adicionar mensagem sobre insights ao chat
    const insightMessage: Message = {
      id: `assistant-${Date.now()}`,
      type: 'assistant',
      content: (
        <>
          <p className="font-medium">
            📊 Analisei os dados do seu hospital e identifiquei alguns insights importantes:
          </p>
          <ul className="list-disc pl-5 mt-2">
            {insights.slice(0, 3).map((insight, index) => (
              <li key={index} className="mb-1">
                <span className={`font-medium ${
                  insight.severity === 'high' ? 'text-red-500' : 
                  insight.severity === 'medium' ? 'text-amber-500' : 
                  'text-blue-500'
                }`}>
                  {insight.title}:
                </span>{' '}
                {insight.description.substring(0, 100)}
                {insight.description.length > 100 ? '...' : ''}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-sm">
            Visualize estes insights na seção de análises ou gere métricas específicas para monitorá-los.
          </p>
        </>
      )
    };
    
    setMessages(prev => [...prev, insightMessage]);
  };
  
  // Gerar uma métrica a partir da IA
  const handleGenerateAIMetric = async () => {
    // Adicionar a métrica ao sistema
    const newMetric = await onCreateMetric(previewMetric);
    
    if (newMetric) {
      // Adicionar mensagem de confirmação ao chat
      const confirmationMessage: Message = {
        id: `system-${Date.now()}`,
        type: 'system',
        content: (
          <>
            <p className="font-medium text-green-500">
              ✅ Métrica criada com sucesso!
            </p>
            <p className="text-sm mt-1">
              A métrica &quot;{previewMetric.title}&quot; foi adicionada ao seu painel. 
              Você pode gerenciá-la na visualização do Dashboard.
            </p>
          </>
        )
      };
      
      setMessages(prev => [...prev, confirmationMessage]);
      
      // Mostrar visualização do dashboard após a criação
      setTimeout(() => {
        onShowDashboard();
      }, 1000);
      
      return true;
    } else {
      // Mensagem de erro
      const errorMessage: Message = {
        id: `system-${Date.now()}`,
        type: 'system',
        content: (
          <>
            <p className="font-medium text-red-500">
              ❌ Erro ao adicionar métrica
            </p>
            <p className="text-sm mt-1">
              Ocorreu um erro ao adicionar a métrica. Por favor, tente novamente.
            </p>
          </>
        )
      };
      
      setMessages(prev => [...prev, errorMessage]);
      return false;
    }
  };
  
  // Renderizar a prévia apropriada com base no tipo de conteúdo
  const renderPreview = () => {
    switch (aiContentType) {
      case 'metric':
        return (
          <MetricPreviewCard
            title={previewMetric.title}
            value={previewMetric.additionalInfo?.value || "87%"}
            subtitle={previewMetric.subtitle}
            trend={-0.3}
          />
        );
      case 'alert':
        return <AlertPreview />;
      case 'workflow':
        return <WorkflowPreview />;
      default:
        return (
          <div className="p-4 border rounded-lg bg-gray-800 border-gray-700">
            <h4 className="text-sm font-medium text-white">Relatório Personalizado</h4>
            <p className="text-sm text-gray-400 mt-2">
              Prévia do relatório com base nos parâmetros fornecidos...
            </p>
          </div>
        );
    }
  };
  
  return (
    <>
      {/* Botão de insights - mostrar apenas se tiver mensagens e insights disponíveis */}
      {messages.length > 1 && !showInsights && insights.length > 0 && (
        <Button 
          variant="outline" 
          className="w-full bg-gradient-to-r from-blue-900/40 to-purple-900/40 border-blue-800/50 hover:from-blue-900/60 hover:to-purple-900/60 text-white"
          onClick={handleMoreInsights}
        >
          <Zap className="h-4 w-4 mr-2 text-yellow-500" />
          Ver Insights da IA sobre os dados do hospital
        </Button>
      )}
      
      {/* Insights da IA (mostrados condicionalmente) */}
      {showInsights && (
        <AIInsights 
          insights={insights}
          loading={insightsLoading}
          onClose={() => setShowInsights(false)}
        />
      )}
      
      {/* Interface de Chat */}
      <div ref={chatContainerRef} className="border border-gray-800 rounded-lg h-96 overflow-y-auto bg-gray-900 p-4">
        {messages.map((message) => {
          if (message.type === 'system' || message.type === 'assistant') {
            return (
              <div key={message.id} className="flex items-start mb-4">
                <div className="mr-2 mt-1">
                  {message.type === 'system' ? (
                    <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center">
                      <MessageSquare className="h-4 w-4 text-gray-400" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-purple-900/50 border border-purple-700 flex items-center justify-center">
                      <Brain className="h-4 w-4 text-purple-400" />
                    </div>
                  )}
                </div>
                <div className={`
                  rounded-lg p-3 max-w-[85%]
                  ${message.type === 'system' 
                    ? 'bg-gray-800 border border-gray-700' 
                    : 'bg-purple-900/30 border border-purple-800/50'}
                `}>
                  {typeof message.content === 'string' ? (
                    <p className="text-sm text-gray-200">
                      {message.content}
                    </p>
                  ) : (
                    message.content
                  )}
                </div>
              </div>
            );
          } else {
            return (
              <div key={message.id} className="flex items-start justify-end mb-4">
                <div className="bg-blue-900/30 border border-blue-800/50 rounded-lg p-3 max-w-[85%]">
                  {typeof message.content === 'string' ? (
                    <p className="text-sm text-gray-200">
                      {message.content}
                    </p>
                  ) : (
                    message.content
                  )}
                </div>
                <div className="ml-2 mt-1">
                  <div className="w-8 h-8 rounded-full bg-blue-900/50 border border-blue-700 flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-400">Eu</span>
                  </div>
                </div>
              </div>
            );
          }
        })}
        
        {/* Indicador de animação IA enquanto gera */}
        {isGenerating && (
          <div className="flex items-center justify-center py-4">
            <div className="flex space-x-2">
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse delay-100"></div>
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse delay-200"></div>
            </div>
          </div>
        )}
        
        {/* Mensagem quando não há insights disponíveis */}
        {insightsLoading && (
          <div className="flex items-center justify-center p-4 bg-gray-800/50 rounded-lg border border-gray-700 mb-4">
            <Spinner size="sm" className="text-purple-500 mr-2" />
            <span className="text-gray-400 text-sm">Analisando dados do hospital...</span>
          </div>
        )}
        
        {!insightsLoading && insights.length === 0 && showInsights && (
          <div className="flex items-center justify-center p-4 bg-gray-800/50 rounded-lg border border-gray-700 mb-4">
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
            <span className="text-gray-400 text-sm">Nenhum insight disponível no momento.</span>
          </div>
        )}
      </div>
      
      {/* Entrada do usuário */}
      <ChatInterface 
        messages={messages}
        inputValue={aiPrompt}
        contentType={aiContentType}
        onInputChange={setAiPrompt}
        onContentTypeChange={setAiContentType}
        onSendMessage={handleSendMessage}
        disabled={isGenerating}
      />
      
      {/* Prévia do item gerado */}
      {messages.length > 1 && (
        <AIPreview 
          title={
            aiContentType === 'metric' 
              ? previewMetric.title || 'Painel de UTI' 
              : aiContentType === 'workflow'
                ? 'Fluxo de Trabalho' 
                : aiContentType === 'alert'
                  ? 'Sistema de Alertas'
                  : 'Relatório Personalizado'
          }
          previewContent={renderPreview()}
          onAdjust={onOpenMetricForm}
          onApply={handleGenerateAIMetric}
        />
      )}
    </>
  );
};