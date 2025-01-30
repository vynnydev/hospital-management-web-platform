import React from 'react';

interface LoadingCardProps {
  message: string;
  isLoading: boolean;
}

export const AILoadingCard: React.FC<LoadingCardProps> = ({ message, isLoading }) => {
  return (
    <div className="p-0.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 relative overflow-hidden group">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 animate-gradient-x-slow opacity-75" />
      
      {/* Content container */}
      <div className="bg-gray-800/90 backdrop-blur-sm px-6 py-3 rounded-full relative">
        <div className="flex items-center justify-center gap-3">
          {isLoading && (
            <div className="flex-shrink-0 w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin-slow" />
          )}
          <span className="text-white font-medium transition-all duration-500">
            {isLoading ? message : 'Clique para gerar'}
          </span>
        </div>
        
        {/* Bottom light effect */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse-slow" />
      </div>
    </div>
  );
};