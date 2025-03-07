/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/organisms/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/organisms/tabs';
import { Brain, Layers, MessageSquare, AlertTriangle, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/organisms/button';
import { ChatInterface } from './ChatInterface';
import { AIPreview, AlertPreview, WorkflowPreview } from './AIPreview';
import { AILibrary, defaultHistoryItems, defaultPromptItems } from './AILibrary';
import { useMetrics } from '@/services/hooks/hospital-metrics/useMetrics';
import { ICreateMetricPayload, TMetric } from '@/types/hospital-metrics';
import { MetricManager } from '@/components/ui/templates/hospital-metrics/MetricManager';
import { Spinner } from '@/components/ui/organisms/spinner';
import { MetricForm } from '@/components/ui/templates/hospital-metrics/MetricForm';
import { MetricPreview } from './MetricPreview';

interface Message {
  id: string;
  type: 'system' | 'user' | 'assistant';
  content: string | React.ReactNode;
}

export const AIGenerativeTab: React.FC = () => {
  // Estado para o chat e IA
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiContentType, setAiContentType] = useState('metric');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('ai');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Estados para controle de UI
  const [isMetricFormOpen, setIsMetricFormOpen] = useState(false);
  
  // Hook para gerenciar métricas
  const { 
    metrics, 
    addMetric, 
    isLoading: metricsLoading, 
    error: metricsError, 
    addToPanel 
  } = useMetrics();
  
  // Estado para mensagens do chat
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'system-1',
      type: 'system',
      content: 'Olá! Sou seu assistente para configuração hospitalar. Posso ajudar a criar métricas, fluxos de trabalho, alertas e outros elementos. Como posso ajudar hoje?'
    }
  ]);
  
  // Estado para prévia da métrica a ser gerada
  const [previewMetric, setPreviewMetric] = useState<ICreateMetricPayload>({
    title: 'Taxa de Ocupação UTI',
    subtitle: 'Ocupação atual dos leitos',
    description: 'Métrica gerada pela IA para monitorar a ocupação da UTI em tempo real',
    type: 'main',
    cardType: 'critical-hospital',
    additionalInfo: {
      label: 'Taxa Atual',
      value: '87%'
    }
  });
  
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
    
    // Limpar o campo de entrada
    setAiPrompt('');
    
    // Segurança para garantir que newUserMessage.content é uma string
    let prompt = '';
    if (typeof newUserMessage.content === 'string') {
      prompt = newUserMessage.content.toLowerCase();
    }
    
    // Ajustar modelo de métrica baseado no prompt do usuário
    let newMetricPreview = { ...previewMetric };
    
    // Análise simples do texto do prompt para gerar uma prévia mais relevante
    if (prompt.includes('uti') || prompt.includes('unidade de terapia intensiva')) {
      newMetricPreview.title = 'Taxa de Ocupação UTI';
      newMetricPreview.subtitle = 'Ocupação atual dos leitos';
      newMetricPreview.cardType = 'critical-hospital';
    } else if (prompt.includes('espera') || prompt.includes('tempo')) {
      newMetricPreview.title = 'Tempo de Espera';
      newMetricPreview.subtitle = 'Tempo médio de atendimento';
      newMetricPreview.cardType = 'waiting';
      newMetricPreview.additionalInfo = {
        label: 'Média Atual',
        value: '4.2h'
      };
    } else if (prompt.includes('equipe') || prompt.includes('staff') || prompt.includes('funcionário')) {
      newMetricPreview.title = 'Déficit de Equipes';
      newMetricPreview.subtitle = 'Dificuldade nas Equipes';
      newMetricPreview.cardType = 'staff';
      newMetricPreview.additionalInfo = {
        label: 'Equipes em Alerta',
        value: '3 de 8 equipes'
      };
    }
    
    setPreviewMetric(newMetricPreview);
    
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
                  Entendi! Posso criar uma métrica personalizada baseada na sua solicitação.
                  Aqui está uma prévia de como ficaria um painel de métricas com base nas informações que você forneceu:
                </p>
                <ul className="list-disc pl-5 mt-2 mb-3">
                  <li>{newMetricPreview.title}</li>
                  <li>{newMetricPreview.subtitle}</li>
                  {newMetricPreview.description && <li>{newMetricPreview.description}</li>}
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
                  Compreendi! Vou criar um fluxo de trabalho baseado na sua solicitação.
                  Aqui está uma prévia de como ficaria:
                </p>
                <p className="mt-2 mb-3">
                  O fluxo inclui etapas para admissão, triagem, avaliação médica e acompanhamento.
                  Cada etapa tem seus próprios responsáveis e tempos esperados.
                </p>
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
                  Entendi sua necessidade! Criei um sistema de alerta baseado na sua solicitação.
                  Aqui está uma prévia:
                </p>
                <p className="mt-2 mb-3">
                  Este alerta será disparado quando a ocupação da UTI ultrapassar 85% por mais de 15 minutos,
                  notificando a equipe responsável via e-mail e dashboard.
                </p>
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
                  Compreendi sua solicitação! Criei um relatório personalizado com base nas informações fornecidas.
                  Você pode revisar a prévia abaixo e fazer ajustes nos parâmetros conforme necessário.
                </p>
                <p className="mt-2">
                  Quando estiver satisfeito com o resultado, clique em &quot;Aplicar&quot; para gerar o relatório completo.
                </p>
              </>
            )
          };
      }
      
      setMessages(prev => [...prev, aiResponse]);
      setIsGenerating(false);
    }, 2500);
  };

  // Gerar uma métrica a partir da IA
  const handleGenerateAIMetric = async () => {
    // Adicionar a métrica ao sistema
    const newMetric = await addMetric(previewMetric);
    
    if (newMetric) {
      // Adicionar ao painel
      await addToPanel(newMetric);
      
      // Adicionar mensagem de confirmação ao chat
      const confirmationMessage: Message = {
        id: `system-${Date.now()}`,
        type: 'system',
        content: (
          <>
            <p className="font-medium">
              ✅ Métrica adicionada com sucesso!
            </p>
            <p className="text-sm mt-1">
              A métrica &quot;{previewMetric.title}&quot; foi adicionada ao seu painel. 
              Você pode gerenciá-la na aba &quot;Gerenciar Métricas&quot;.
            </p>
          </>
        )
      };
      
      setMessages(prev => [...prev, confirmationMessage]);
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
    }
  };
  
  // Criar métrica manualmente
  const handleCreateManualMetric = async (formData: ICreateMetricPayload) => {
    const newMetric = await addMetric({
      ...formData,
      createdBy: 'manual'
    });
    
    if (newMetric) {
      // Adicionar ao painel padrão
      await addToPanel(newMetric);
      return newMetric;
    }
    return null;
  };
  
  // Handlers para os componentes
  const handleHistoryItemSelect = (item: any) => {
    // Aqui você implementaria a lógica para carregar um item do histórico
    
    // Adicionar mensagem ao chat sobre o item selecionado
    const historyMessage: Message = {
      id: `system-${Date.now()}`,
      type: 'system',
      content: `Carregando "${item.name}" do histórico...`
    };
    
    setMessages(prev => [...prev, historyMessage]);
  };

  const handlePromptSelect = (prompt: any) => {
    setAiPrompt(prompt.description);
  };

  const handleShowAllPrompts = () => {
    // Implementar modal ou navegação para todos os prompts
  };

  const handleAdjustPreview = () => {
    // Abrir modal de edição de métrica com os dados da prévia
    setIsMetricFormOpen(true);
  };

  const handleApplyPreview = () => {
    handleGenerateAIMetric();
  };
  
  const handleAddMetricToPanel = async (metric: TMetric) => {
    // Adicionar a métrica ao painel
    const success = await addToPanel(metric);
    
    if (success) {
      // Adicionar mensagem de confirmação ao chat
      const confirmationMessage: Message = {
        id: `system-${Date.now()}`,
        type: 'system',
        content: (
          <>
            <p className="font-medium">
              ✅ Métrica adicionada ao painel!
            </p>
            <p className="text-sm mt-1">
              A métrica &quot;{metric.title}&quot; foi adicionada ao seu painel principal.
            </p>
          </>
        )
      };
      
      setMessages(prev => [...prev, confirmationMessage]);
      return true;
    }
    
    return false;
  };

  // Renderizar a prévia apropriada com base no tipo de conteúdo
  const renderPreview = () => {
    switch (aiContentType) {
      case 'metric':
        return (
          <MetricPreview 
            value={previewMetric.additionalInfo?.value || "87%"} 
            title={previewMetric.title}
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
          <div className="p-4 border rounded-lg bg-white dark:bg-gray-800">
            <h4 className="text-sm font-medium">Relatório Personalizado</h4>
            <p className="text-sm text-gray-500 mt-2">
              Prévia do relatório com base nos parâmetros fornecidos...
            </p>
          </div>
        );
    }
  };

  return (
    <div className="h-full w-full overflow-auto p-4 bg-gray-900">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Painel de Chat e Geração */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-gray-800 bg-gray-900">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Brain className="h-5 w-5 text-purple-500" />
                    Assistente IA Generativa
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Gere configurações personalizadas através de diálogo interativo
                  </CardDescription>
                </div>
                
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
                  <TabsList className="bg-gray-800">
                    <TabsTrigger 
                      value="ai"
                      className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                    >
                      <Brain className="h-4 w-4 mr-2" />
                      IA Generativa
                    </TabsTrigger>
                    <TabsTrigger 
                      value="manual"
                      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                      <Layers className="h-4 w-4 mr-2" />
                      Gerenciar Métricas
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <TabsContent value="ai" className="mt-0 space-y-4">
                {/* Interface de Chat */}
                <div ref={chatContainerRef} className="border rounded-lg h-96 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4">
                  {messages.map((message) => {
                    if (message.type === 'system' || message.type === 'assistant') {
                      return (
                        <div key={message.id} className="flex items-start mb-4">
                          <div className="mr-2 mt-1">
                            {message.type === 'system' ? (
                              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                <MessageSquare className="h-4 w-4 text-gray-500 dark:text-gray-300" />
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                                <Brain className="h-4 w-4 text-purple-500" />
                              </div>
                            )}
                          </div>
                          <div className={`
                            rounded-lg p-3 max-w-[85%]
                            ${message.type === 'system' 
                              ? 'bg-gray-100 dark:bg-gray-800' 
                              : 'bg-purple-100 dark:bg-purple-900/50'}
                          `}>
                            {typeof message.content === 'string' ? (
                              <p className="text-sm text-gray-800 dark:text-gray-200">
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
                          <div className="bg-blue-100 dark:bg-blue-900/50 rounded-lg p-3 max-w-[85%]">
                            {typeof message.content === 'string' ? (
                              <p className="text-sm text-gray-800 dark:text-gray-200">
                                {message.content}
                              </p>
                            ) : (
                              message.content
                            )}
                          </div>
                          <div className="ml-2 mt-1">
                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-500">Eu</span>
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
                    onAdjust={handleAdjustPreview}
                    onApply={handleApplyPreview}
                  />
                )}
              </TabsContent>
              
              <TabsContent value="manual" className="mt-0">
                {metricsLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <Spinner size="lg" className="text-purple-500" />
                    <span className="ml-3 text-gray-400">Carregando métricas...</span>
                  </div>
                ) : metricsError ? (
                  <div className="flex flex-col items-center justify-center h-64 text-red-400">
                    <AlertTriangle className="h-10 w-10 mb-2" />
                    <p>{metricsError}</p>
                    <Button 
                      onClick={() => window.location.reload()} 
                      variant="outline"
                      className="mt-4 bg-red-900/20 border-red-800 text-red-300"
                    >
                      Tentar novamente
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium text-white">Métricas Personalizadas</h3>
                      <Button 
                        onClick={() => setIsMetricFormOpen(true)}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Criar Nova Métrica
                      </Button>
                    </div>
                    
                    <MetricManager onAddToPanel={handleAddMetricToPanel} />
                  </div>
                )}
              </TabsContent>
            </CardContent>
          </Card>
        </div>
        
        {/* Biblioteca AI */}
        <AILibrary 
          historyItems={defaultHistoryItems}
          promptItems={defaultPromptItems}
          onHistoryItemSelect={handleHistoryItemSelect}
          onPromptSelect={handlePromptSelect}
          onShowAllPrompts={handleShowAllPrompts}
        />
      </div>
      
      {/* Modal de formulário para métrica */}
      <MetricForm
        isOpen={isMetricFormOpen}
        onClose={() => setIsMetricFormOpen(false)}
        onSubmit={handleCreateManualMetric}
        editingMetric={null}
        initialData={activeTab === 'ai' ? previewMetric : undefined}
        title={activeTab === 'ai' ? 'Ajustar Métrica Gerada' : 'Nova Métrica'}
      />
    </div>
  );
};