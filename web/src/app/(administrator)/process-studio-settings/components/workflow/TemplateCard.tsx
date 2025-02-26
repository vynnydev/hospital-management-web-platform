import React from 'react';
import { Button } from '@/components/ui/organisms/button';
import { ITemplate } from '@/types/settings-types';

interface TemplateCardProps {
  template: ITemplate;
  onUseTemplate: (templateId: string) => void;
}

// Componente para o card individual de template
export const TemplateCard: React.FC<TemplateCardProps> = ({ 
  template, 
  onUseTemplate 
}) => {
  const handleUseTemplate = () => {
    onUseTemplate(template.id);
  };

  return (
    <div className="w-full h-full p-6 rounded-lg border border-gray-700 bg-gray-800 text-white flex flex-col">
      <h3 className="text-lg font-medium mb-2">{template.name}</h3>
      <p className="text-sm text-gray-300 mb-4 flex-grow">{template.description}</p>
      <Button 
        onClick={handleUseTemplate}
        className="w-full"
      >
        Usar Template
      </Button>
    </div>
  );
};