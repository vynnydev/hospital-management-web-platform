import React from 'react';
import { RefreshCw } from 'lucide-react';

export const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center">
        <RefreshCw className="h-10 w-10 text-blue-600 dark:text-blue-400 animate-spin mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Carregando informações...</p>
      </div>
    </div>
  );
};