/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Send, 
  Sparkles, 
  BarChart2, 
  Bell, 
  GitBranch, 
  FileText, 
  Zap, 
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/organisms/button';
import { Input } from '@/components/ui/organisms/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/organisms/select';
import { Badge } from '@/components/ui/organisms/badge';
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

/**
 * Componente de interface de chat para interação com a IA
 * Permite digitar prompts e selecionar o tipo de conteúdo a ser gerado
 */
export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  inputValue,
  contentType,
  onInputChange,
  onContentTypeChange,
  onSendMessage,
  disabled = false
}) => {
  const [showSuggestions, setShowSuggestions] = useState(true);
  
  // Sugestões de prompts para cada tipo de conteúdo
  const promptSuggestions = {
    metric: [
      "Crie uma métrica para monitorar tempo médio de permanência na UTI",
      "Preciso de uma métrica para acompanhar taxa de reinternação",
      "Quero uma métrica para monitorar a ocupação dos leitos de emergência",
      "Gere um dashboard para acompanhar equipes do setor de oncologia",
      "Me ajude a criar uma métrica para déficit de equipamentos"
    ],
    workflow: [
      "Crie um fluxo para admissão de pacientes na emergência",
      "Preciso de um processo para transferência entre departamentos",
      "Quero um fluxo de trabalho para alta hospitalar",
      "Desenhe um fluxo de trabalho para isolamento de pacientes com doenças contagiosas",
      "Crie um processo para gestão de ambulâncias e atendimento pré-hospitalar"
    ],
    alert: [
      "Crie um alerta para quando a ocupação de UTI ultrapassar 90%",
      "Preciso de um alerta para notificar quando houver mais de 5 pacientes em espera",
      "Quero um alerta para monitorar equipamentos em manutenção",
      "Configure alertas para quando o tempo de espera exceder 30 minutos",
      "Crie uma notificação para quando o nível de estresse da equipe estiver alto"
    ],
    report: [
      "Crie um relatório mensal de performance das UTIs",
      "Preciso de um relatório comparativo entre departamentos",
      "Quero um relatório de indicadores financeiros",
      "Gere um relatório sobre o tempo médio de atendimento entre setores",
      "Crie um relatório para análise de eficiência operacional do hospital"
    ]
  };
  
  // Exemplos de insights que a IA pode sugerir
  const aiSuggestions = [
    {
      type: 'insight',
      text: 'Mostrar insights sobre tendências de ocupação',
      icon: <Activity className="h-3 w-3" />,
      color: 'bg-purple-900/30 border-purple-800/50 text-purple-300'
    },
    {
      type: 'performance',
      text: 'Análise de performance entre hospitais',
      icon: <BarChart2 className="h-3 w-3" />,
      color: 'bg-blue-900/30 border-blue-800/50 text-blue-300'
    },
    {
      type: 'staffing',
      text: 'Identificar déficit de equipes',
      icon: <Zap className="h-3 w-3" />,
      color: 'bg-green-900/30 border-green-800/50 text-green-300'
    }
  ];
  
  // Escolher sugestões com base no tipo de conteúdo selecionado
  const currentSuggestions = promptSuggestions[contentType as keyof typeof promptSuggestions] || [];
  
  // Alternar sugestões quando o tipo de conteúdo muda
  useEffect(() => {
    setShowSuggestions(true);
    
    // Ocultar sugestões após um tempo
    const timer = setTimeout(() => {
      setShowSuggestions(false);
    }, 15000);
    
    return () => clearTimeout(timer);
  }, [contentType, messages.length]);
  
  // Ícones para os diferentes tipos de conteúdo
  const contentTypeIcons = {
    metric: <BarChart2 className="h-4 w-4" />,
    workflow: <GitBranch className="h-4 w-4" />,
    alert: <Bell className="h-4 w-4" />,
    report: <FileText className="h-4 w-4" />
  };
  
  // Cores para os diferentes tipos de conteúdo
  const contentTypeColors = {
    metric: 'text-blue-500',
    workflow: 'text-green-500',
    alert: 'text-amber-500',
    report: 'text-purple-500'
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
        showSuggestions && messages.length < 3 ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-400 flex items-center">
            <Sparkles className="h-3 w-3 mr-1 text-purple-500" />
            Experimente perguntar:
          </p>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-gray-500 h-6 hover:text-white hover:bg-gray-800"
            onClick={() => setShowSuggestions(false)}
          >
            Ocultar
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-1">
          {currentSuggestions.map((suggestion, index) => (
            <button
              key={index}
              className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-full px-3 py-1.5 border border-gray-700 hover:border-gray-600 transition-colors"
              onClick={() => handleSelectSuggestion(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
        
        <div className="flex flex-wrap gap-1.5">
          {aiSuggestions.map((suggestion, index) => (
            <Badge
              key={index} 
              variant="outline"
              className={`flex items-center gap-1 cursor-pointer ${suggestion.color}`}
              onClick={() => handleSelectSuggestion(`Gere ${suggestion.text.toLowerCase()}`)}
            >
              <Zap className="h-3 w-3 text-yellow-500" />
              {suggestion.icon}
              <span>{suggestion.text}</span>
            </Badge>
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
            <span className="flex items-center mb-4">
              {/* {contentTypeIcons[contentType as keyof typeof contentTypeIcons]} */}
              <span className="ml-2">
                <SelectValue placeholder="Tipo de conteúdo" />
              </span>
            </span>
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="metric" className="text-gray-200 focus:bg-gray-700 focus:text-white">
              <span className="flex items-center">
                <BarChart2 className="h-4 w-4 mr-2 text-blue-500" />
                Métrica
              </span>
            </SelectItem>
            <SelectItem value="workflow" className="text-gray-200 focus:bg-gray-700 focus:text-white">
              <span className="flex items-center">
                <GitBranch className="h-4 w-4 mr-2 text-green-500" />
                Fluxo
              </span>
            </SelectItem>
            <SelectItem value="alert" className="text-gray-200 focus:bg-gray-700 focus:text-white">
              <span className="flex items-center">
                <Bell className="h-4 w-4 mr-2 text-amber-500" />
                Alerta
              </span>
            </SelectItem>
            <SelectItem value="report" className="text-gray-200 focus:bg-gray-700 focus:text-white">
              <span className="flex items-center">
                <FileText className="h-4 w-4 mr-2 text-purple-500" />
                Relatório
              </span>
            </SelectItem>
          </SelectContent>
        </Select>
        
        <div className="flex-1 relative w-full">
          <Input
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder={`Digite sua mensagem para a IA (Gerando ${contentType})...`}
            className="pr-10 bg-gray-800 border-gray-700 text-white pl-9"
            disabled={disabled}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && canSend) {
                e.preventDefault();
                onSendMessage();
              }
            }}
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Brain className={`h-4 w-4 ${contentTypeColors[contentType as keyof typeof contentTypeColors]}`} />
          </div>
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
      <p className="text-xs text-gray-500 flex items-center">
        <Brain className="h-3 w-3 mr-1 text-purple-500" />
        <span>A IA analisa dados em tempo real para gerar {
          contentType === 'metric' ? 'métricas personalizadas' : 
          contentType === 'workflow' ? 'fluxos de trabalho otimizados' : 
          contentType === 'alert' ? 'alertas inteligentes' : 
          'relatórios analíticos'
        } com base no contexto hospitalar.</span>
      </p>
    </div>
  );
};