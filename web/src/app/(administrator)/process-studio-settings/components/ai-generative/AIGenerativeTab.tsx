/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/organisms/card';
import { Brain } from 'lucide-react';
import { ChatInterface } from './ChatInterface';
import { AIPreview, MetricPreview, AlertPreview, WorkflowPreview } from './AIPreview';
import { AILibrary, defaultHistoryItems, defaultPromptItems } from './AILibrary';

interface Message {
  id: string;
  type: 'system' | 'user' | 'assistant';
  content: string | React.ReactNode;
}

export const AIGenerativeTab: React.FC = () => {
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiContentType, setAiContentType] = useState('metric');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'system-1',
      type: 'system',
      content: 'Olá! Sou seu assistente para configuração hospitalar. Posso ajudar a criar métricas, fluxos de trabalho, alertas e outros elementos. Como posso ajudar hoje?'
    },
    {
      id: 'user-1',
      type: 'user',
      content: 'Preciso de um painel para monitorar desempenho da UTI.'
    },
    {
      id: 'assistant-1',
      type: 'assistant',
      content: (
        <>
          <p>
            Posso criar um painel de UTI para você. Que métricas você gostaria de incluir? 
            Algumas opções populares são:
          </p>
          <ul className="list-disc pl-5 mt-2">
            <li>Taxa de ocupação de leitos de UTI</li>
            <li>Tempo médio de permanência</li>
            <li>Taxa de mortalidade</li>
            <li>Taxa de readmissão em 48h</li>
            <li>Infecções hospitalares</li>
          </ul>
        </>
      )
    }
  ]);

  // Funções para manipulação da interface de chat
  const handleSendMessage = () => {
    if (!aiPrompt.trim()) return;
    
    // Adicionar mensagem do usuário
    const newUserMessage: Message = {
      id: `user-${messages.length + 1}`,
      type: 'user',
      content: aiPrompt
    };
    
    setMessages([...messages, newUserMessage]);
    setAiPrompt('');
    
    // Simular resposta do assistente (em uma aplicação real, isso viria da API)
    setTimeout(() => {
      const newAssistantMessage: Message = {
        id: `assistant-${messages.length + 2}`,
        type: 'assistant',
        content: `Compreendi. Vou criar um ${aiContentType === 'metric' ? 'painel de métricas' : 
                  aiContentType === 'workflow' ? 'fluxo de trabalho' : 
                  aiContentType === 'alert' ? 'sistema de alertas' : 'relatório'} 
                  baseado na sua solicitação.`
      };
      
      setMessages(prev => [...prev, newAssistantMessage]);
    }, 1000);
  };

  // Handlers para os componentes
  const handleHistoryItemSelect = (item: any) => {
    console.log('Item do histórico selecionado:', item);
    // Implementar lógica para carregar um item do histórico
  };

  const handlePromptSelect = (prompt: any) => {
    console.log('Prompt selecionado:', prompt);
    setAiPrompt(prompt.description);
  };

  const handleShowAllPrompts = () => {
    console.log('Ver todos os prompts');
    // Implementar modal ou navegação para a biblioteca completa de prompts
  };

  const handleAdjustPreview = () => {
    console.log('Ajustar prévia');
    // Implementar lógica para ajustar as configurações da prévia
  };

  const handleApplyPreview = () => {
    console.log('Aplicar prévia');
    // Implementar lógica para aplicar a configuração gerada
  };

  // Renderizar a prévia apropriada com base no tipo de conteúdo
  const renderPreview = () => {
    switch (aiContentType) {
      case 'metric':
        return <MetricPreview value="87" trend={-0.3} />;
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
              <CardTitle className="flex items-center gap-2 text-white">
                <Brain className="h-5 w-5 text-purple-500" />
                Assistente IA Generativa
              </CardTitle>
              <CardDescription className="text-gray-400">
                Gere configurações personalizadas através de diálogo interativo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Interface de Chat */}
              <ChatInterface 
                messages={messages}
                inputValue={aiPrompt}
                contentType={aiContentType}
                onInputChange={setAiPrompt}
                onContentTypeChange={setAiContentType}
                onSendMessage={handleSendMessage}
              />
              
              {/* Prévia do item gerado */}
              <AIPreview 
                title="Painel de UTI"
                previewContent={renderPreview()}
                onAdjust={handleAdjustPreview}
                onApply={handleApplyPreview}
              />
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
    </div>
  );
};