import React from 'react';
import { Brain } from 'lucide-react';
import { Button } from '@/components/ui/organisms/button';
import { Input } from '@/components/ui/organisms/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/organisms/select';

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
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  inputValue,
  contentType,
  onInputChange,
  onContentTypeChange,
  onSendMessage
}) => {
  return (
    <div className="space-y-4">
      {/* Interface tipo chat */}
      <div className="border rounded-lg h-96 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4">
        {messages.map((message) => {
          if (message.type === 'system' || message.type === 'assistant') {
            return (
              <div key={message.id} className="flex items-start mb-4">
                <div className="bg-purple-100 dark:bg-purple-900/50 rounded-lg p-3 max-w-[85%]">
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
              </div>
            );
          }
        })}
      </div>
      
      {/* Entrada do usuário com seletor de tipo */}
      <div className="flex items-center space-x-2">
        <Select 
          value={contentType}
          onValueChange={onContentTypeChange}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Tipo de conteúdo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="metric">Métrica</SelectItem>
            <SelectItem value="workflow">Fluxo</SelectItem>
            <SelectItem value="alert">Alerta</SelectItem>
            <SelectItem value="report">Relatório</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="flex-1 relative">
          <Input
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="pr-10"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSendMessage();
              }
            }}
          />
          <Button 
            variant="ghost" 
            size="sm"
            className="absolute right-0 top-0 h-full"
            onClick={onSendMessage}
          >
            <Brain className="h-4 w-4 text-purple-500" />
          </Button>
        </div>
      </div>
    </div>
  );
};