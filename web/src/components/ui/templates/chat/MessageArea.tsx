import React from 'react';
import { Loader, User, Sparkles } from 'lucide-react';
import { IMessage, IMessageAreaProps } from '@/types/chat-types';

// Componente para uma única mensagem
const MessageBubble: React.FC<{
  message: IMessage;
  isUserMessage: boolean;
  formatTime: (date: Date) => string;
}> = ({ message, isUserMessage, formatTime }) => {
  return (
    <div className={`flex mb-4 ${isUserMessage ? 'justify-end' : 'justify-start'}`}>
      {!isUserMessage && (
        <div className="mr-2 flex-shrink-0">
          {message.sender.role === 'ai' ? (
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/70 flex items-center justify-center text-indigo-600 dark:text-indigo-300">
              <Sparkles className="h-4 w-4" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/70 flex items-center justify-center text-blue-600 dark:text-blue-300">
              <User className="h-4 w-4" />
            </div>
          )}
        </div>
      )}
      
      <div className={`max-w-[70%] ${isUserMessage ? 'order-1' : 'order-2'}`}>
        {!isUserMessage && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{message.sender.name}</p>
        )}
        
        <div className={`p-3 rounded-lg ${
          message.type === 'ai-suggestion' 
            ? 'bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 text-gray-800 dark:text-gray-200' 
            : isUserMessage 
              ? 'bg-blue-600 text-white' 
              : 'bg-white dark:bg-gray-700 border dark:border-gray-600 text-gray-800 dark:text-gray-200'
        }`}>
          <p className="text-sm">{message.content}</p>
          
          {message.type === 'ai-suggestion' && message.metadata?.suggestion && (
            <div className="mt-2 pt-2 border-t border-indigo-200 dark:border-indigo-800">
              <p className="text-xs font-medium text-indigo-700 dark:text-indigo-300">Sugestão:</p>
              <p className="text-sm text-indigo-800 dark:text-indigo-200">{message.metadata.suggestion}</p>
            </div>
          )}
        </div>
        
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {formatTime(message.timestamp)}
          {isUserMessage && message.isRead && (
            <span className="ml-1">✓</span>
          )}
        </p>
      </div>
    </div>
  );
};

// Componente para indicador de digitação
const TypingIndicator: React.FC = () => {
  return (
    <div className="flex mb-4 justify-start">
      <div className="mr-2 flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/70 flex items-center justify-center text-indigo-600 dark:text-indigo-300">
          <Sparkles className="h-4 w-4" />
        </div>
      </div>
      <div className="bg-white dark:bg-gray-700 border dark:border-gray-600 p-3 rounded-lg">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

// Componente principal da área de mensagens
export const MessageArea: React.FC<IMessageAreaProps> = ({
  messages,
  isLoading,
  isTyping,
  formatTime,
  formatDate,
  messageEndRef
}) => {
  return (
    <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-800/50">
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <Loader className="h-8 w-8 text-blue-600 dark:text-blue-500 animate-spin" />
        </div>
      ) : (
        <>
          {messages.map((message, index) => {
            const isUserMessage = message.sender.id === 'current-user';
            const showTimestamp = index === 0 || 
              formatDate(messages[index - 1].timestamp) !== formatDate(message.timestamp);
            
            return (
              <React.Fragment key={message.id}>
                {showTimestamp && (
                  <div className="flex justify-center my-4">
                    <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-300">
                      {formatDate(message.timestamp)}
                    </span>
                  </div>
                )}
                
                <MessageBubble 
                  message={message}
                  isUserMessage={isUserMessage}
                  formatTime={formatTime}
                />
              </React.Fragment>
            );
          })}
          
          {isTyping && <TypingIndicator />}
          
          {/* Referência para rolagem automática */}
          <div ref={messageEndRef} />
        </>
      )}
    </div>
  );
};