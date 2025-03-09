import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Carregando...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-64 p-8">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute top-0 w-16 h-16 border-4 border-primary border-opacity-20 rounded-full"></div>
        <div className="absolute top-0 w-16 h-16 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
      </div>
      <p className="text-muted-foreground text-lg">{message}</p>
    </div>
  );
};