/* eslint-disable react/jsx-no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Sparkles } from 'lucide-react';
import Image from 'next/image';
import { IGeneratedData } from '@/types/ai-types';

interface AIRecommendationCardPressableProps {
  onGenerateImage?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isLoading?: boolean;
  loadingMessage?: string;
  loadingProgress?: number;
  generatedData?: IGeneratedData;
}

export const AIRecommendationCardPressable: React.FC<AIRecommendationCardPressableProps> = ({
  isLoading,
  loadingMessage,
  loadingProgress,
  generatedData,
  onGenerateImage
}) => {
  // Handler para prevenir a propagação do evento
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (onGenerateImage) {
      onGenerateImage(e);
    }
  };

  return (
    <div className="relative p-[1px] rounded-lg bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-700 overflow-hidden mt-4">
      {/* Animated gradient border */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-700 animate-gradient-x" />
      
      {/* Card Content */}
      <button
        onClick={handleClick}
        disabled={isLoading}
        className="relative w-full bg-gray-800 rounded-lg transition-all duration-200 hover:bg-gray-700/95 active:bg-gray-700/90 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          // Loading State
          <div className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <div className="flex-1">
                <p className="text-sm text-white">{loadingMessage}</p>
                {loadingProgress !== undefined && (
                  <p className="text-xs text-gray-400 mt-1">
                    Progresso: {loadingProgress}%
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          // Initial State
          <div className="p-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-6 h-6 text-blue-500" />
              <div className="text-left">
                <p className="text-sm font-medium text-white">
                  Gerar Recomendação
                </p>
                <p className="text-xs text-gray-400">
                  Clique para gerar uma imagem com recomendações de IA
                </p>
              </div>
            </div>
          </div>
        )}
      </button>
    </div>
  );
};