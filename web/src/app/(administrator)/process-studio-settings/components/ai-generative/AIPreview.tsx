/* eslint-disable react/display-name */
import React from 'react';
import { Button } from "@/components/ui/organisms/button";
import { Card } from "@/components/ui/organisms/card";
import { Settings, Check } from 'lucide-react';

interface AIPreviewProps {
  title: string;
  previewContent: React.ReactNode;
  onAdjust: () => void;
  onApply: () => void;
}

export const AIPreview: React.FC<AIPreviewProps> = ({
  title,
  previewContent,
  onAdjust,
  onApply
}) => {
  return (
    <Card className="border-purple-800/30 bg-gradient-to-r from-purple-900/10 to-indigo-900/10 overflow-hidden">
      <div className="p-4">
        <h3 className="text-lg font-medium text-white mb-3 flex items-center">
          <div className="p-1.5 rounded-md bg-purple-900/50 border border-purple-800/50 mr-2">
            <Check className="h-4 w-4 text-purple-400" />
          </div>
          Prévia Gerada: {title}
        </h3>
        
        <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-4 my-3">
          {previewContent}
        </div>
        
        <div className="flex justify-end mt-4 space-x-2">
          <Button 
            variant="outline" 
            onClick={onAdjust}
            className="bg-gray-800 hover:bg-gray-700 border-gray-700 text-gray-300 flex items-center gap-1"
          >
            <Settings className="h-4 w-4 mr-1" />
            Ajustar
          </Button>
          <Button 
            onClick={onApply}
            className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1"
          >
            <Check className="h-4 w-4 mr-1" />
            Aplicar
          </Button>
        </div>
      </div>
    </Card>
  );
};