import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/organisms/alert';
import { AlertTriangle } from 'lucide-react';

interface ErrorMessageProps {
  error: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
  return (
    <Alert variant="destructive" className="my-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
      <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
      <AlertTitle className="text-red-800 dark:text-red-300">Erro</AlertTitle>
      <AlertDescription className="text-red-700 dark:text-red-400">{error}</AlertDescription>
    </Alert>
  );
};