import React from 'react';
import { cn } from '@/lib/utils';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ 
  size = 'md', 
  className 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-8 w-8 border-3'
  };

  return (
    <div 
      className={cn(
        "animate-spin rounded-full border-t-transparent border-purple-600 dark:border-purple-400",
        sizeClasses[size],
        className
      )}
      aria-label="Carregando"
    />
  );
};