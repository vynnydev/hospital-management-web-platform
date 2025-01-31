import React from 'react';
import { Accessibility, Eye, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/organisms/button';
import { TFontSize } from '../../types/types';

interface AccessibilityBarProps {
  isHighContrast: boolean;
  setIsHighContrast: React.Dispatch<React.SetStateAction<boolean>>;
  showAudioControls: boolean;
  setShowAudioControls: React.Dispatch<React.SetStateAction<boolean>>;
  fontSize: TFontSize;
  setFontSize: (size: TFontSize) => void;
}

export const AccessibilityBar: React.FC<AccessibilityBarProps> = ({
  isHighContrast,
  setIsHighContrast,
  showAudioControls,
  setShowAudioControls,
  fontSize,
  setFontSize,
}) => {
  return (
    <div className="bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-600 p-3 rounded-xl mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Accessibility className="w-5 h-5 text-blue-500" />
          <span className="text-sm font-medium">Recursos de Acessibilidade</span>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsHighContrast(!isHighContrast)}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-all"
            aria-label={isHighContrast ? "Desativar Alto Contraste" : "Ativar Alto Contraste"}
          >
            <Eye className="w-5 h-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAudioControls(!showAudioControls)}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-all"
            aria-label={showAudioControls ? "Desativar Controles de Áudio" : "Ativar Controles de Áudio"}
          >
            <Volume2 className="w-5 h-5" />
          </Button>
          
          <select
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value as TFontSize)}
            className="p-2 rounded-lg bg-transparent border border-gray-200 dark:border-gray-500"
            aria-label="Tamanho da Fonte"
          >
            <option value="normal">Fonte: Normal</option>
            <option value="large">Fonte: Grande</option>
            <option value="extra-large">Fonte: Extra Grande</option>
          </select>
        </div>
      </div>
    </div>
  );
};