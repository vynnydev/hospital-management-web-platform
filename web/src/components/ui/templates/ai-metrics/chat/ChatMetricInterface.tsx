import React, { useState, useEffect, useRef } from 'react';
import { 
  Brain, 
  AlertCircle, 
  Send,
  Sparkles,
  MessageSquare,
  MessageCircle
} from 'lucide-react';
import { Button } from "@/components/ui/organisms/button";
import { ScrollArea } from "@/components/ui/organisms/scroll-area";
import { Avatar } from "@/components/ui/organisms/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Textarea } from "@/components/ui/organisms/textarea";
import { AnalysisProgress } from '../AnalysisProgress';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/organisms/tooltip";
import { Badge } from "@/components/ui/organisms/badge";

interface IChatMetricInterfaceProps {
  messages: {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
  }[];
  setMessages: React.Dispatch<React.SetStateAction<{
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
  }[]>>;
  isAnalyzing: boolean;
  analysisProgress: number;
  startAnalysis: () => void;
}

export const ChatMetricInterface: React.FC<IChatMetricInterfaceProps> = ({
  messages,
  setMessages,
  isAnalyzing,
  analysisProgress,
  startAnalysis
}) => {
  // Estado para a mensagem atual no input
  const [currentMessage, setCurrentMessage] = useState('');
  
  // Estado para controlar quando a IA está "pensando"
  const [isThinking, setIsThinking] = useState(false);
  
  // Referência para rolagem automática
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Estado para animação de nova mensagem
  const [newMessageAlert, setNewMessageAlert] = useState(false);

  // Efeito para rolar para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    
    // Mostrar alerta de nova mensagem brevemente
    if (messages.length > 0) {
      setNewMessageAlert(true);
      setTimeout(() => setNewMessageAlert(false), 1500);
    }
  }, [messages]);

  // Função para enviar mensagem
  const sendMessage = () => {
    if (!currentMessage.trim()) return;
    
    // Adicionar mensagem do usuário
    const userMessage = {
      role: 'user' as const,
      content: currentMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsThinking(true);
    
    // Simular resposta da IA após um pequeno delay
    setTimeout(() => {
      // Gerar resposta com base na entrada do usuário
      const aiResponse = generateAIResponse(currentMessage);
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      }]);
      
      setIsThinking(false);
      
      // Se a mensagem do usuário parece ser uma solicitação para criar métricas,
      // iniciar a análise automática
      if (
        currentMessage.toLowerCase().includes('métricas') ||
        currentMessage.toLowerCase().includes('criar') ||
        currentMessage.toLowerCase().includes('gerar') ||
        currentMessage.toLowerCase().includes('novo') ||
        currentMessage.toLowerCase().includes('sugestão')
      ) {
        startAnalysis();
      }
    }, 1500);
  };

  // Função para gerar resposta da IA (simulação)
  const generateAIResponse = (userInput: string): string => {
    // Aqui você pode implementar lógica mais avançada ou integrar com uma API de IA
    const input = userInput.toLowerCase();
    
    if (input.includes('olá') || input.includes('oi') || input.includes('bom dia')) {
      return 'Olá! Como posso ajudar você a criar métricas para o seu dashboard hospitalar hoje?';
    } else if (input.includes('métricas') && input.includes('sugerir')) {
      return 'Posso sugerir várias métricas para seu dashboard. Prefere métricas relacionadas à ocupação, eficiência operacional, satisfação do paciente ou outra área específica?';
    } else if (input.includes('ocupação') || input.includes('leitos')) {
      return 'Para métricas de ocupação, posso sugerir: taxa de ocupação por departamento, tempo médio de permanência, giro de leitos, e índice de disponibilidade de leitos. Gostaria que eu desenvolvesse alguma dessas opções?';
    } else if (input.includes('eficiência') || input.includes('operacional')) {
      return 'Para eficiência operacional, recomendo: tempo médio de atendimento, taxa de readmissão, custo por paciente e índice de produtividade da equipe. Alguma dessas métricas específicas lhe interessa?';
    } else if (input.includes('satisfação') || input.includes('paciente')) {
      return 'Para satisfação do paciente, sugiro: índice NPS (Net Promoter Score), tempo médio de espera, taxa de reclamações e índice de satisfação com atendimento médico. Gostaria de mais detalhes sobre alguma dessas métricas?';
    } else if (input.includes('criar') || input.includes('gerar')) {
      return 'Vou analisar os dados disponíveis e sugerir as métricas mais relevantes para seu contexto. Isso levará apenas alguns instantes.';
    } else if (input.includes('alerta') || input.includes('alertas')) {
      return 'Posso ajudar a criar alertas baseados em métricas importantes. Por exemplo, alertas para alta ocupação da UTI, tempo de espera excessivo ou falta de equipamentos. Qual tipo de alerta você gostaria de configurar?';
    } else if (input.includes('relatório') || input.includes('relatórios')) {
      return 'Posso ajudar a configurar relatórios automáticos com as métricas mais importantes. Esses relatórios podem ser diários, semanais ou mensais. Qual frequência você prefere?';
    } else {
      return 'Entendi sua solicitação. Vou analisar os dados disponíveis para sugerir métricas relevantes para seu contexto. Isso levará apenas alguns instantes.';
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Área de mensagens com rolagem */}
      <div className="relative flex-1 overflow-hidden">
        <ScrollArea className="h-full px-4 py-2">
          <div className="pb-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center p-8">
                <MessageCircle className="h-16 w-16 text-indigo-500/40 mb-4" />
                <h3 className="text-lg font-medium text-gray-400 mb-2">Sem mensagens</h3>
                <p className="text-gray-500 max-w-md">
                  Comece uma conversa com o assistente de IA para obter sugestões de métricas personalizadas.
                </p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`
                    flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}
                    ${index === messages.length - 1 && newMessageAlert ? 'animate-pulse' : ''}
                  `}
                >
                  {message.role !== 'user' && (
                    <Avatar className="h-10 w-10 mr-2 mt-1 border-2 border-indigo-600/40">
                      {message.role === 'assistant' ? (
                        <AvatarImage src="/ai-avatar.png" alt="AI Assistant" />
                      ) : (
                        <AvatarImage src="/system-avatar.png" alt="System" />
                      )}
                      <AvatarFallback className={message.role === 'assistant' ? 'bg-indigo-700' : 'bg-blue-700'}>
                        {message.role === 'assistant' ? (
                          <Brain className="h-5 w-5 text-indigo-200" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-blue-200" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`
                    rounded-2xl p-4 max-w-[85%] break-words shadow-md
                    ${message.role === 'user' 
                      ? 'bg-indigo-600 text-white border border-indigo-500' 
                      : message.role === 'assistant'
                        ? 'bg-gray-800/80 text-gray-100 border border-indigo-800/30'
                        : 'bg-blue-800/50 text-gray-100 border border-blue-700/30'}
                  `}>
                    <div className="flex justify-between items-center mb-1">
                      <Badge variant="outline" className={`
                        text-xs font-medium py-0 px-2 
                        ${message.role === 'user' 
                          ? 'bg-indigo-700/50 text-indigo-100 border-indigo-500' 
                          : message.role === 'assistant' 
                            ? 'bg-indigo-800/30 text-indigo-300 border-indigo-700/30' 
                            : 'bg-blue-800/30 text-blue-300 border-blue-700/30'}
                      `}>
                        {message.role === 'user' ? 'Você' : message.role === 'assistant' ? 'Assistente IA' : 'Sistema'}
                      </Badge>
                      <p className="text-xs text-gray-300">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <p className="text-sm mt-1 leading-relaxed">{message.content}</p>
                  </div>
                  {message.role === 'user' && (
                    <Avatar className="h-10 w-10 ml-2 mt-1 border-2 border-indigo-600/40">
                      <AvatarImage src="/user-avatar.png" alt="You" />
                      <AvatarFallback className="bg-indigo-600">
                        <MessageSquare className="h-5 w-5 text-white" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))
            )}
            
            {isThinking && (
              <div className="flex justify-start">
                <Avatar className="h-10 w-10 mr-2 mt-1 border-2 border-indigo-600/40">
                  <AvatarFallback className="bg-indigo-700">
                    <Brain className="h-5 w-5 text-indigo-200 animate-pulse" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gray-800/80 text-gray-200 rounded-2xl p-4 border border-indigo-800/30 shadow-md">
                  <Badge variant="outline" className="bg-indigo-800/30 text-indigo-300 border-indigo-700/30 text-xs font-medium py-0 px-2 mb-2">
                    Assistente IA
                  </Badge>
                  <div className="flex space-x-2 mt-2">
                    <div className="h-2 w-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="h-2 w-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    <div className="h-2 w-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            {isAnalyzing && (
              <AnalysisProgress progress={analysisProgress} />
            )}
            
            <div ref={messagesEndRef} className="h-4" />
          </div>
        </ScrollArea>
        
        {/* Nova notificação de mensagem */}
        {newMessageAlert && (
          <div className="absolute bottom-4 right-4 animate-bounce">
            <Badge className="bg-indigo-600 text-white py-1 px-2 shadow-lg">
              Nova mensagem
            </Badge>
          </div>
        )}
      </div>
      
      {/* Área fixa de input - Esta parte nunca terá scroll */}
      <div className="border-t border-gray-800 bg-gray-800/50 backdrop-blur-sm">
        {/* Sugestões rápidas */}
        <div className="px-4 pt-3 pb-2 flex justify-between items-center">
          <div className="flex flex-wrap gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setCurrentMessage('Sugira métricas para monitoramento de ocupação hospitalar');
                    }}
                    className="text-xs bg-indigo-800/20 hover:bg-indigo-800/40 text-indigo-300 hover:text-indigo-200"
                  >
                    Ocupação
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="text-xs">Sugestão rápida: Ocupação</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setCurrentMessage('Sugira métricas para eficiência operacional');
                    }}
                    className="text-xs bg-indigo-800/20 hover:bg-indigo-800/40 text-indigo-300 hover:text-indigo-200"
                  >
                    Eficiência
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="text-xs">Sugestão rápida: Eficiência</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setCurrentMessage('Sugira métricas para satisfação de pacientes');
                    }}
                    className="text-xs bg-indigo-800/20 hover:bg-indigo-800/40 text-indigo-300 hover:text-indigo-200"
                  >
                    Satisfação
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="text-xs">Sugestão rápida: Satisfação</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={startAnalysis}
                  disabled={isAnalyzing}
                  className="text-xs text-indigo-300 border-indigo-700 bg-indigo-900/40 hover:bg-indigo-800/60 hover:text-indigo-200"
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  Análise Automática
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="text-xs">Iniciar análise de dados para gerar sugestões</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        {/* Input de mensagem */}
        <div className="px-4 py-3">
          <div className="flex space-x-2">
            <div className="flex-1 bg-gray-900 rounded-xl border border-gray-800 shadow-inner overflow-hidden">
              <Textarea 
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Digite sua mensagem ou peça sugestões de métricas..."
                className="bg-transparent border-none focus:border-none focus:ring-0 text-gray-200 placeholder-gray-500 min-h-[60px] max-h-32 resize-none py-3 px-4"
              />
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    onClick={sendMessage}
                    disabled={!currentMessage.trim() || isThinking}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-auto"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="text-xs">Enviar mensagem</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
};