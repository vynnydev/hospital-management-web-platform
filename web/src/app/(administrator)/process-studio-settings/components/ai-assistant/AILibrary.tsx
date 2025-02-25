import React from 'react';
import { BarChart4, Bell, Workflow, MessageCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';

interface AIHistoryItem {
  id: string;
  name: string;
  type: 'metric' | 'alert' | 'workflow' | string;
  date: string;
  preview: string;
}

interface PromptItem {
  id: string;
  title: string;
  description: string;
}

interface AILibraryProps {
  historyItems: AIHistoryItem[];
  promptItems?: PromptItem[];
  onHistoryItemSelect?: (item: AIHistoryItem) => void;
  onPromptSelect?: (prompt: PromptItem) => void;
  onShowAllPrompts?: () => void;
}

export const AILibrary: React.FC<AILibraryProps> = ({
  historyItems,
  promptItems = [],
  onHistoryItemSelect,
  onPromptSelect,
  onShowAllPrompts
}) => {
  return (
    <div className="lg:col-span-1 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Histórico de Geração</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {historyItems.map(item => (
            <div 
              key={item.id}
              className="p-3 border rounded-lg border-gray-200 dark:border-gray-700 hover:border-purple-500 cursor-pointer"
              onClick={() => onHistoryItemSelect && onHistoryItemSelect(item)}
            >
              <div className="flex items-center">
                {item.type === 'metric' && <BarChart4 className="h-4 w-4 text-purple-500 mr-2" />}
                {item.type === 'alert' && <Bell className="h-4 w-4 text-amber-500 mr-2" />}
                {item.type === 'workflow' && <Workflow className="h-4 w-4 text-blue-500 mr-2" />}
                <h4 className="text-sm font-medium">{item.name}</h4>
              </div>
              <p className="text-xs text-gray-500 mt-1">{item.preview}</p>
              <div className="text-xs text-gray-400 mt-1">Criado em {item.date}</div>
            </div>
          ))}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Biblioteca de Prompts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {promptItems.map(prompt => (
            <div 
              key={prompt.id}
              className="p-3 border rounded-lg border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
              onClick={() => onPromptSelect && onPromptSelect(prompt)}
            >
              <h4 className="text-sm font-medium">{prompt.title}</h4>
              <p className="text-xs text-gray-500 mt-1">
                {prompt.description}
              </p>
            </div>
          ))}
          <Button 
            className="w-full mt-2" 
            variant="outline"
            onClick={onShowAllPrompts}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Ver Todos os Prompts
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

// Exemplos para uso em outros componentes
export const defaultHistoryItems: AIHistoryItem[] = [
  { 
    id: 'ai1', 
    name: 'Taxa de Readmissão UTI', 
    type: 'metric', 
    date: '18/02/2025', 
    preview: 'Métrica para acompanhar pacientes que retornam à UTI em até 48h' 
  },
  { 
    id: 'ai2', 
    name: 'Alerta de Superlotação', 
    type: 'alert', 
    date: '15/02/2025', 
    preview: 'Notificação quando ocupação ultrapassa 90% da capacidade' 
  },
  { 
    id: 'ai3', 
    name: 'Fluxo de Isolamento', 
    type: 'workflow', 
    date: '10/02/2025', 
    preview: 'Processo para isolamento de pacientes com doenças infecciosas' 
  }
];

export const defaultPromptItems: PromptItem[] = [
  {
    id: 'prompt1',
    title: 'Dashboard Operacional',
    description: 'Crie um dashboard para monitoramento operacional com foco em ocupação e fluxo de pacientes'
  },
  {
    id: 'prompt2',
    title: 'Alertas Financeiros',
    description: 'Configure alertas para métricas financeiras críticas com base em metas trimestrais'
  },
  {
    id: 'prompt3',
    title: 'Fluxo de Emergência',
    description: 'Crie um processo otimizado para atendimento de emergência com base em classificação de risco'
  }
];