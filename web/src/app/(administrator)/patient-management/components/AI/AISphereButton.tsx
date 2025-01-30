import React from 'react';
import { Sparkles } from 'lucide-react';

interface AIButtonProps {
  onClick: () => void;
  isLoading: boolean;
  loadingMessage?: string;
  className?: string;
  disabled?: boolean;
  size?: number;
  spinnerSize?: number;
}

export const AISphereButton: React.FC<AIButtonProps> = ({
  onClick,
  isLoading,
  loadingMessage = 'Carregando...',
  className = '',
  disabled = false,
  size = 192,
  spinnerSize = 32,
}) => {
  const buttonStyle = {
    width: `${size}px`,
    height: `${size}px`,
  };

  const spinnerStyle = {
    width: `${spinnerSize}px`,
    height: `${spinnerSize}px`,
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`group relative focus:outline-none ${className}`}
      style={buttonStyle}
    >
      {/* Outer Glow Effect */}
      <div className="absolute inset-[-10%] animate-pulse-slow">
        <div className="absolute inset-0 rounded-full blur-2xl bg-gradient-to-br from-teal-400/30 via-cyan-400/30 to-blue-400/30" />
      </div>

      {/* Main Button Container */}
      <div className="absolute inset-0">
        {/* Primary Sphere */}
        <div className="absolute inset-0 rounded-full overflow-hidden backdrop-blur-sm">
          {/* Base Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-500" />
          
          {/* Inner Circles - Neural Network Effect */}
          <div className="absolute inset-[15%] rounded-full border border-white/10">
            <div className="absolute inset-[15%] rounded-full border border-white/10">
              <div className="absolute inset-[15%] rounded-full border border-white/10">
                <div className="absolute inset-[15%] rounded-full bg-white/5" />
              </div>
            </div>
          </div>
          
          {/* Animated Dots */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/40 rounded-full animate-pulse-slow" />
            <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-white/30 rounded-full animate-pulse-slow delay-100" />
            <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-white/20 rounded-full animate-pulse-slow delay-200" />
          </div>
          
          {/* Center Icon */}
          {!isLoading && (
            <div className="absolute inset-[35%] flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white/70 animate-pulse-slow" />
            </div>
          )}
          
          {/* Glass Effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/20" />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <div 
                className="border-3 border-white/30 border-t-white rounded-full animate-spin"
                style={spinnerStyle}
              />
              <span className="text-white text-sm font-medium">{loadingMessage}</span>
            </div>
          </div>
        )}
      </div>
    </button>
  );
};