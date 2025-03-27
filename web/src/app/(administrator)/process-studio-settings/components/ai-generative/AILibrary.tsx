import React from 'react';
import { BarChart4, Bell, Workflow, MessageCircle, RefreshCw, AlertTriangle, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';
import { Skeleton } from '@/components/ui/organisms/skeleton';
import { AIHistoryItem, PromptItem, useAILibrary } from '@/services/hooks/AI/ai-library/useAILibrary';

interface AILibraryProps {
  onHistoryItemSelect?: (item: AIHistoryItem) => void;
  onPromptSelect?: (prompt: PromptItem) => void;
  onShowAllPrompts?: () => void;
}

export const AILibrary: React.FC<AILibraryProps> = ({
  onHistoryItemSelect,
  onPromptSelect,
  onShowAllPrompts
}) => {
  const {
    historyItems,
    promptItems,
    isHistoryLoading,
    isPromptsLoading,
    historyError,
    promptsError,
    refetchHistory,
    refetchPrompts
  } = useAILibrary();

  // Função para renderizar o ícone com base no tipo de item
  const renderTypeIcon = (type: string) => {
    switch (type) {
      case 'metric':
        return <BarChart4 className="h-4 w-4 text-purple-500 mr-2" />;
      case 'alert':
        return <Bell className="h-4 w-4 text-amber-500 mr-2" />;
      case 'workflow':
        return <Workflow className="h-4 w-4 text-blue-500 mr-2" />;
      default:
        return <Sparkles className="h-4 w-4 text-gray-500 mr-2" />;
    }
  };

  // Renderização do histórico de geração
  const renderHistory = () => {
    if (isHistoryLoading) {
      return (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={`skeleton-${i}`} className="p-3 border rounded-lg border-gray-700">
              <div className="flex items-center">
                <Skeleton className="h-4 w-4 rounded-full mr-2" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-3 w-full mt-2" />
              <Skeleton className="h-3 w-24 mt-2" />
            </div>
          ))}
        </div>
      );
    }

    if (historyError) {
      return (
        <div className="flex flex-col items-center justify-center py-4 text-center">
          <AlertTriangle className="h-8 w-8 text-amber-500 mb-2" />
          <p className="text-gray-400 text-sm mb-3">{historyError}</p>
          <Button 
            variant="outline" 
            size="sm"
            className="bg-gray-800 border-gray-700 text-gray-300"
            onClick={refetchHistory}
          >
            <RefreshCw className="h-3 w-3 mr-2" />
            Tentar novamente
          </Button>
        </div>
      );
    }

    if (historyItems.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-4 text-center">
          <p className="text-gray-400 text-sm">Nenhum histórico de geração encontrado.</p>
          <p className="text-gray-500 text-xs mt-1">
            Gere novas métricas ou fluxos de trabalho para ver seu histórico aqui.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {historyItems.map(item => (
          <div 
            key={item.id}
            className="p-3 border rounded-lg border-gray-700 hover:border-purple-600 hover:bg-gray-800/70 transition-all cursor-pointer"
            onClick={() => onHistoryItemSelect && onHistoryItemSelect(item)}
          >
            <div className="flex items-center">
              {renderTypeIcon(item.type)}
              <h4 className="text-sm font-medium text-gray-200">{item.name}</h4>
            </div>
            <p className="text-xs text-gray-400 mt-1">{item.preview}</p>
            <div className="text-xs text-gray-500 mt-1">Criado em {item.date}</div>
          </div>
        ))}
      </div>
    );
  };

  // Renderização da biblioteca de prompts
  const renderPrompts = () => {
    if (isPromptsLoading) {
      return (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={`prompt-skeleton-${i}`} className="p-3 border rounded-lg border-gray-700">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-full mt-2" />
            </div>
          ))}
        </div>
      );
    }

    if (promptsError) {
      return (
        <div className="flex flex-col items-center justify-center py-4 text-center">
          <AlertTriangle className="h-8 w-8 text-amber-500 mb-2" />
          <p className="text-gray-400 text-sm mb-3">{promptsError}</p>
          <Button 
            variant="outline" 
            size="sm"
            className="bg-gray-800 border-gray-700 text-gray-300"
            onClick={refetchPrompts}
          >
            <RefreshCw className="h-3 w-3 mr-2" />
            Tentar novamente
          </Button>
        </div>
      );
    }

    if (promptItems.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-4 text-center">
          <p className="text-gray-400 text-sm">Nenhum prompt disponível.</p>
          <p className="text-gray-500 text-xs mt-1">
            A biblioteca de prompts será atualizada em breve.
          </p>
        </div>
      );
    }

    return (
      <>
        <div className="space-y-2">
          {promptItems.map(prompt => (
            <div 
              key={prompt.id}
              className="p-3 border rounded-lg border-gray-700 hover:bg-gray-800/70 hover:border-purple-600 transition-all cursor-pointer"
              onClick={() => onPromptSelect && onPromptSelect(prompt)}
            >
              <h4 className="text-sm font-medium text-gray-200">{prompt.title}</h4>
              <p className="text-xs text-gray-400 mt-1">
                {prompt.description}
              </p>
            </div>
          ))}
        </div>
        <Button 
          className="w-full mt-3" 
          variant="outline"
          onClick={onShowAllPrompts}
          disabled={isPromptsLoading}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Ver Todos os Prompts
        </Button>
      </>
    );
  };

  return (
    <div className="lg:col-span-1 space-y-4">
      {/* Histórico de Geração */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base text-white flex items-center gap-2">
              <span className="p-1 rounded-md bg-purple-900/50">
                <Sparkles className="h-4 w-4 text-purple-400" />
              </span>
              Histórico de Geração
            </CardTitle>
            
            {!isHistoryLoading && !historyError && historyItems.length > 0 && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-800"
                onClick={refetchHistory}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Adicionando o scroll personalizado */}
          <div className="overflow-y-auto max-h-[280px] pr-1 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
            {renderHistory()}
          </div>
        </CardContent>
      </Card>
      
      {/* Biblioteca de Prompts */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base text-white flex items-center gap-2">
              <span className="p-1 rounded-md bg-blue-900/50">
                <MessageCircle className="h-4 w-4 text-blue-400" />
              </span>
              Biblioteca de Prompts
            </CardTitle>
            
            {!isPromptsLoading && !promptsError && promptItems.length > 0 && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-800"
                onClick={refetchPrompts}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Adicionando o scroll personalizado */}
          <div className="overflow-y-auto max-h-[340px] pr-1 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
            {renderPrompts()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};