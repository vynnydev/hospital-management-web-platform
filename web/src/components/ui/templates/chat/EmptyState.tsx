import React from 'react';
import { MessageCircle, User, Users, Sparkles } from 'lucide-react';
import { IEmptyStateProps } from '@/types/chat-types';

export const EmptyState: React.FC<IEmptyStateProps> = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-8">
      <MessageCircle className="h-16 w-16 text-blue-200 dark:text-blue-800 mb-4" />
      <h3 className="text-xl font-medium text-gray-700 dark:text-gray-400 mb-2">Chat Cognitiva</h3>
      <p className="text-gray-500 dark:text-gray-500 text-center max-w-md mb-8">
        Selecione um contato para iniciar uma conversa ou utilize o assistente IA para obter ajuda rápida com questões clínicas.
      </p>
      
      <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3">
            <User className="h-5 w-5" />
          </div>
          <span className="text-sm text-gray-700 dark:text-gray-300 text-center">Colegas</span>
        </div>
        
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-green-600 dark:text-green-400 mb-3">
            <Users className="h-5 w-5" />
          </div>
          <span className="text-sm text-gray-700 dark:text-gray-300 text-center">Equipes</span>
        </div>
        
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-sm text-gray-700 dark:text-gray-300 text-center">IA Assistente</span>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-500">
          Todas as conversas são criptografadas e seguem as normas de privacidade LGPD.
        </p>
      </div>
    </div>
  );
};