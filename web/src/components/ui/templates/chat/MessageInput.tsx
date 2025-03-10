import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Sparkles, PenTool } from 'lucide-react';
import { IMessageInputProps } from '@/types/chat-types';
import { WritingAssistant } from './WritingAssistant';

export const MessageInput: React.FC<IMessageInputProps> = ({
  messageInput,
  setMessageInput,
  sendMessage,
  placeholder,
  aiSuggestion,
  setAiSuggestion
}) => {
  const [showWritingAssistant, setShowWritingAssistant] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focar no input quando o componente for montado
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Função para lidar com o envio da mensagem
  const handleSendMessage = () => {
    if (messageInput.trim()) {
      sendMessage(messageInput);
      setMessageInput('');
      setShowWritingAssistant(false);
    }
  };

  // Função para lidar com a tecla Enter
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Função para selecionar uma sugestão do auxiliar de escrita
  const handleSuggestionSelect = (text: string) => {
    setMessageInput(text);
    // Focar no input após selecionar uma sugestão
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  // Função para utilizar a sugestão do AI
  const handleAiSuggestionUse = () => {
    if (aiSuggestion) {
      setMessageInput(aiSuggestion);
      setAiSuggestion(null);
      // Focar no input após selecionar a sugestão
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  return (
    <div className="p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
      {/* Assistente de escrita ou sugestão da IA */}
      {showWritingAssistant ? (
        <WritingAssistant 
          onSuggestionSelect={handleSuggestionSelect} 
          inputText={messageInput}
          onClose={() => setShowWritingAssistant(false)}
        />
      ) : aiSuggestion ? (
        <div className="flex mb-3">
          <button 
            className="flex items-center px-3 py-1.5 text-sm bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
            onClick={handleAiSuggestionUse}
          >
            <Sparkles className="h-4 w-4 mr-1.5" />
            {aiSuggestion}
          </button>
        </div>
      ) : (
        <div className="flex mb-3">
          <button 
            onClick={() => setShowWritingAssistant(true)}
            className="flex items-center px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <PenTool className="h-4 w-4 mr-1.5" />
            <span>Auxiliar de escrita</span>
          </button>
        </div>
      )}
      
      {/* Área principal de input */}
      <div className="flex items-center">
        <button 
          className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Anexar arquivo"
        >
          <Paperclip className="h-5 w-5" />
        </button>
        
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg mx-2 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
        />
        
        <button 
          className="p-2 text-white bg-blue-600 dark:bg-blue-700 rounded-full hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:hover:bg-blue-600 dark:disabled:hover:bg-blue-700"
          onClick={handleSendMessage}
          disabled={!messageInput.trim()}
          aria-label="Enviar mensagem"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};