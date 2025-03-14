/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, 
  FileText, 
  Paperclip, 
  Plus, 
  Send, 
  Sparkles, 
  X 
} from 'lucide-react';
import { Button } from '@/components/ui/organisms/button';
import type { IAppUser } from '@/types/auth-types';
import { useAlerts } from '@/components/ui/templates/providers/alerts/AlertsProvider';

interface ChatComposerWithAlertsProps {
  onSendMessage: (message: string, attachments?: File[]) => void;
  placeholder?: string;
  currentUser?: IAppUser;
  disabled?: boolean;
  showAIAssistant?: boolean;
}

interface AIRecommendation {
  id: string;
  text: string;
  category: string;
}

export const ChatComposerWithAlerts: React.FC<ChatComposerWithAlertsProps> = ({
  onSendMessage,
  placeholder = 'Digite uma mensagem...',
  currentUser,
  disabled = false,
  showAIAssistant = true
}) => {
  const [message, setMessage] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiSuggestions, setAISuggestions] = useState<AIRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const { alerts } = useAlerts();
  
  // Auto-expand textarea
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [message]);
  
  // Gerar sugestões baseadas no conteúdo atual e contexto
  useEffect(() => {
    if (showAIPanel) {
      setIsLoading(true);
      
      // Simular delay de API
      const timeoutId = setTimeout(() => {
        // Em uma implementação real, isso viria da API de IA
        // Aqui estamos usando dados simulados
        
        // Algumas sugestões padrão
        const defaultSuggestions: AIRecommendation[] = [
          { id: '1', text: 'Bom dia! Como posso ajudar hoje?', category: 'greetings' },
          { id: '2', text: 'Estou analisando os resultados do paciente e entro em contato em breve.', category: 'followup' },
          { id: '3', text: 'Podemos agendar uma reunião para discutir o caso?', category: 'meetings' },
        ];
        
        // Sugestões baseadas em alertas ativos
        const alertBasedSuggestions: AIRecommendation[] = [];
        
        // Verificar alertas não lidos
        const unreadAlerts = alerts.filter(a => 
          !a.read && (a.status === 'pending' || a.status === 'acknowledged')
        );
        
        if (unreadAlerts.length > 0) {
          // Gerar sugestões relevantes para os tipos mais comuns de alertas
          const emergencyAlerts = unreadAlerts.filter(a => a.type === 'emergency');
          const ambulanceAlerts = unreadAlerts.filter(a => a.type === 'ambulance');
          const resourceAlerts = unreadAlerts.filter(a => a.type === 'resource');
          
          if (emergencyAlerts.length > 0) {
            alertBasedSuggestions.push({ 
              id: 'e1', 
              text: `Atenção equipe! Temos ${emergencyAlerts.length} alerta${emergencyAlerts.length > 1 ? 's' : ''} de emergência que requer${emergencyAlerts.length > 1 ? 'em' : ''} atenção imediata.`, 
              category: 'emergency' 
            });
            
            // Adicionar sugestão específica para o primeiro alerta se houver apenas um
            if (emergencyAlerts.length === 1) {
              alertBasedSuggestions.push({ 
                id: 'e2', 
                text: `Iniciando protocolo de emergência para: ${emergencyAlerts[0].title}. Por favor, confirmem recebimento.`, 
                category: 'emergency' 
              });
            }
          }
          
          if (ambulanceAlerts.length > 0) {
            alertBasedSuggestions.push({ 
              id: 'a1', 
              text: `Preparar equipe para recepção de paciente(s) em ${ambulanceAlerts.length} ambulância${ambulanceAlerts.length > 1 ? 's' : ''} a caminho.`, 
              category: 'ambulance' 
            });
            
            // Primeiro alerta de ambulância se houver
            if (ambulanceAlerts.length === 1 && ambulanceAlerts[0].metadata?.estimatedArrival) {
              const eta = new Date(ambulanceAlerts[0].metadata.estimatedArrival);
              alertBasedSuggestions.push({ 
                id: 'a2', 
                text: `Ambulância chegando às ${eta.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}. Favor preparar equipe de recepção.`, 
                category: 'ambulance' 
              });
            }
          }
          
          if (resourceAlerts.length > 0) {
            alertBasedSuggestions.push({ 
              id: 'r1', 
              text: `Precisamos verificar disponibilidade de recursos conforme alertas recentes.`, 
              category: 'resource' 
            });
          }
        }
        
        // Combinar sugestões
        const combinedSuggestions = [
          ...alertBasedSuggestions,
          ...defaultSuggestions
        ].slice(0, 5); // Limitar a 5 sugestões
        
        setAISuggestions(combinedSuggestions);
        setIsLoading(false);
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [showAIPanel, alerts]);
  
  // Manipular anexo de arquivos
  const handleFileAttach = () => {
    fileInputRef.current?.click();
  };
  
  // Manipular mudança de arquivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setAttachedFiles(prev => [...prev, ...Array.from(files)]);
    }
    
    // Limpar input para permitir selecionar o mesmo arquivo novamente
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Remover arquivo anexado
  const handleRemoveFile = (fileName: string) => {
    setAttachedFiles(prev => prev.filter(file => file.name !== fileName));
  };
  
  // Enviar mensagem
  const handleSendMessage = () => {
    if (message.trim() || attachedFiles.length > 0) {
      onSendMessage(message, attachedFiles);
      setMessage('');
      setAttachedFiles([]);
      setShowAIPanel(false);
    }
  };
  
  // Aplicar sugestão da IA
  const handleApplySuggestion = (suggestion: string) => {
    setMessage(suggestion);
    setShowAIPanel(false);
    
    // Focar na textarea após aplicar sugestão
    setTimeout(() => {
      textAreaRef.current?.focus();
    }, 100);
  };
  
  // Detectar Enter para enviar mensagem (Shift+Enter para nova linha)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Textarea */}
      <div className="px-4 pt-4">
        <textarea
          ref={textAreaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 resize-none min-h-[100px] max-h-[200px] border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:outline-none"
        />
      </div>
      
      {/* Arquivos anexados */}
      {attachedFiles.length > 0 && (
        <div className="px-4 pt-2">
          <div className="flex flex-wrap gap-2">
            {attachedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-full pl-3 pr-1 py-1"
              >
                <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-xs text-gray-700 dark:text-gray-300 max-w-[120px] truncate">
                  {file.name}
                </span>
                <button
                  onClick={() => handleRemoveFile(file.name)}
                  className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* AI Assistant Panel */}
      {showAIPanel && (
        <div className="px-4 pt-3">
          <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-3 border border-indigo-100 dark:border-indigo-800/50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Sugestões do Assistente</h3>
              </div>
              <button
                onClick={() => setShowAIPanel(false)}
                className="p-1 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-800 text-indigo-500 dark:text-indigo-400"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            
            {isLoading ? (
              <div className="py-4 flex justify-center">
                <div className="animate-spin h-5 w-5 border-2 border-indigo-500 dark:border-indigo-400 border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <div className="space-y-1.5">
                {aiSuggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    onClick={() => handleApplySuggestion(suggestion.text)}
                    className="w-full text-left p-2 text-sm bg-white dark:bg-gray-800 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors"
                  >
                    {suggestion.text}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Footer */}
      <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 mt-3">
        <div className="flex items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
          />
          <button
            onClick={handleFileAttach}
            disabled={disabled}
            className={`p-2 rounded-full ${
              disabled
                ? 'text-gray-400 dark:text-gray-600'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title="Anexar arquivo"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          
          {showAIAssistant && (
            <button
              onClick={() => setShowAIPanel(!showAIPanel)}
              disabled={disabled}
              className={`p-2 rounded-full ${
                showAIPanel
                  ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                  : disabled
                    ? 'text-gray-400 dark:text-gray-600'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              title="Assistente de escrita"
            >
              <Sparkles className="w-5 h-5" />
            </button>
          )}
          
          <button
            className={`p-2 rounded-full ${
              disabled
                ? 'text-gray-400 dark:text-gray-600'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title="Incluir alerta"
            disabled={disabled}
          >
            <Bell className="w-5 h-5" />
          </button>
          
          <button
            className={`p-2 rounded-full ${
              disabled
                ? 'text-gray-400 dark:text-gray-600'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title="Mais opções"
            disabled={disabled}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        
        <Button
          onClick={handleSendMessage}
          disabled={disabled || (!message.trim() && attachedFiles.length === 0)}
          className={`px-5 py-2 ${
            disabled || (!message.trim() && attachedFiles.length === 0)
              ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
              : 'bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800'
          } text-white rounded-lg flex items-center gap-2`}
        >
          <span>Enviar</span>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};