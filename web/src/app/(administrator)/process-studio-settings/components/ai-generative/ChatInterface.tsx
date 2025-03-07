/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Brain, Send, Sparkles, BarChart2, Bell, GitBranch, FileText } from 'lucide-react';
import { Button } from '@/components/ui/organisms/button';
import { Input } from '@/components/ui/organisms/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/organisms/select';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  type: 'system' | 'user' | 'assistant';
  content: string | React.ReactNode;
}

interface ChatInterfaceProps {
  messages: Message[];
  inputValue: string;
  contentType: string;
  onInputChange: (value: string) => void;
  onContentTypeChange: (value: string) => void;
  onSendMessage: () => void;
  disabled?: boolean;
}

// Sugestões de prompts para mostrar ao usuário
const promptSuggestions = [
  {
    type: 'metric',
    suggestions: [
      "Crie uma métrica para monitorar tempo médio de permanência na UTI",
      "Preciso de uma métrica para acompanhar taxa de reinternação",
      "Quero uma métrica para monitorar a ocupação dos leitos de emergência"
    ]
  },
  {
    type: 'workflow',
    suggestions: [
      "Crie um fluxo para admissão de pacientes na emergência",
      "Preciso de um processo para transferência entre departamentos",
      "Quero um fluxo de trabalho para alta hospitalar"
    ]
  },
  {
    type: 'alert',
    suggestions: [
      "Crie um alerta para quando a ocupação de UTI ultrapassar 90%",
      "Preciso de um alerta para notificar quando houver mais de 5 pacientes em espera",
      "Quero um alerta para monitorar equipamentos em manutenção"
    ]
  },
  {
    type: 'report',
    suggestions: [
      "Crie um relatório mensal de performance das UTIs",
      "Preciso de um relatório comparativo entre departamentos",
      "Quero um relatório de indicadores financeiros"
    ]
  }
];

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  inputValue,
  contentType,
  onInputChange,
  onContentTypeChange,
  onSendMessage,
  disabled = false
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Escolher sugestões com base no tipo de conteúdo selecionado
  const currentSuggestions = promptSuggestions.find(s => s.type === contentType)?.suggestions || [];
  
  // Alternar sugestões quando o tipo de conteúdo muda
  useEffect(() => {
    setShowSuggestions(true);
    
    // Ocultar sugestões após um tempo
    const timer = setTimeout(() => {
      setShowSuggestions(false);
    }, 15000);
    
    return () => clearTimeout(timer);
  }, [contentType]);
  
  // Ícones para os diferentes tipos de conteúdo
  const contentTypeIcons = {
    metric: <BarChart2 className="h-4 w-4" />,
    workflow: <GitBranch className="h-4 w-4" />,
    alert: <Bell className="h-4 w-4" />,
    report: <FileText className="h-4 w-4" />
  };
  
  // Selecionar uma sugestão de prompt
  const handleSelectSuggestion = (suggestion: string) => {
    onInputChange(suggestion);
    setShowSuggestions(false);
  };
  
  // Verificar se o botão de envio deve estar ativo
  const canSend = inputValue.trim().length > 0 && !disabled;
  
  return (
    <div className="space-y-4">
      {/* Sugestões de prompts */}
      <div className={cn(
        "transition-all duration-300 space-y-2 overflow-hidden",
        showSuggestions ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
      )}>
        <p className="text-xs text-gray-400 dark:text-gray-400 flex items-center">
          <Sparkles className="h-3 w-3 mr-1" />
          Experimente perguntar:
        </p>
        <div className="flex flex-wrap gap-2">
          {currentSuggestions.map((suggestion, index) => (
            <button
              key={index}
              className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full px-3 py-1.5 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
              onClick={() => handleSelectSuggestion(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
      
      {/* Entrada do usuário com seletor de tipo */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <Select 
          value={contentType}
          onValueChange={onContentTypeChange}
          disabled={disabled}
        >
          <SelectTrigger className="w-full sm:w-40 bg-gray-800 border-gray-700 text-white">
            <span className="flex items-center">
              {contentTypeIcons[contentType as keyof typeof contentTypeIcons]}
              <span className="ml-2">
                <SelectValue placeholder="Tipo de conteúdo" />
              </span>
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="metric" className="flex items-center">
              <span className="flex items-center">
                <BarChart2 className="h-4 w-4 mr-2" />
                Métrica
              </span>
            </SelectItem>
            <SelectItem value="workflow">
              <span className="flex items-center">
                <GitBranch className="h-4 w-4 mr-2" />
                Fluxo
              </span>
            </SelectItem>
            <SelectItem value="alert">
              <span className="flex items-center">
                <Bell className="h-4 w-4 mr-2" />
                Alerta
              </span>
            </SelectItem>
            <SelectItem value="report">
              <span className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Relatório
              </span>
            </SelectItem>
          </SelectContent>
        </Select>
        
        <div className="flex-1 relative w-full">
          <Input
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Digite sua mensagem para a IA..."
            className="pr-10 bg-gray-800 border-gray-700 text-white"
            disabled={disabled}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && canSend) {
                e.preventDefault();
                onSendMessage();
              }
            }}
          />
          <Button 
            size="sm"
            className={cn(
              "absolute right-1 top-1 h-8 w-8 p-0 rounded-full flex items-center justify-center",
              canSend 
                ? "bg-purple-600 hover:bg-purple-700 text-white" 
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            )}
            disabled={!canSend || disabled}
            onClick={onSendMessage}
          >
            {disabled ? (
              <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-gray-400 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      
      {/* Texto informativo */}
      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
        <Brain className="h-3 w-3 mr-1 text-purple-500" />
        Assistente IA pode gerar métricas, fluxos, alertas e relatórios com base em suas instruções.
      </p>
    </div>
  );
};