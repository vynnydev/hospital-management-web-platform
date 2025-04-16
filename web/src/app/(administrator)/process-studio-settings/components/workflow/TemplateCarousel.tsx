/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/prefer-as-const */
import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/organisms/button';
import { IWorkflowTemplate } from '@/types/workflow/workflow-types';

interface TemplateCarouselProps {
  templates: IWorkflowTemplate[];
  onSelectTemplate: (templateId: string) => void;
  maxVisibleItems?: number;
}

export const TemplateCarousel: React.FC<TemplateCarouselProps> = ({
  templates,
  onSelectTemplate,
  maxVisibleItems = 5
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [visibleTemplates, setVisibleTemplates] = useState<IWorkflowTemplate[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Inicializa os templates visíveis
  useEffect(() => {
    updateVisibleTemplates(0);
  }, [templates]);

  // Atualiza os templates visíveis com base no índice atual
  const updateVisibleTemplates = (startIndex: number) => {
    if (templates.length === 0) return;
    
    const endIndex = Math.min(startIndex + maxVisibleItems, templates.length);
    const visible = templates.slice(startIndex, endIndex);
    
    setVisibleTemplates(visible);
    setCurrentIndex(startIndex);
    setShowLeftArrow(startIndex > 0);
    setShowRightArrow(endIndex < templates.length);
  };

  // Manipula navegação para a esquerda
  const handlePrevious = () => {
    if (currentIndex === 0) return;
    const newIndex = Math.max(0, currentIndex - maxVisibleItems);
    updateVisibleTemplates(newIndex);
  };

  // Manipula navegação para a direita
  const handleNext = () => {
    if (currentIndex + maxVisibleItems >= templates.length) return;
    const newIndex = currentIndex + maxVisibleItems;
    updateVisibleTemplates(newIndex);
  };

  // Manipula a seleção de um template
  const handleSelectTemplate = (templateId: string) => {
    onSelectTemplate(templateId);
  };

  return (
    <div className="relative w-full">
      {/* Botão de navegação esquerdo */}
      {showLeftArrow && (
        <Button
          variant="secondary"
          size="icon"
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800/70 hover:bg-gray-800 shadow-md rounded-full h-8 w-8"
          onClick={handlePrevious}
        >
          <ChevronLeft className="h-5 w-5 text-white" />
        </Button>
      )}

      {/* Container para os templates visíveis */}
      <div className="relative overflow-hidden">
        <div 
          className="flex gap-4 transition-all duration-300 ease-in-out justify-center"
          ref={containerRef}
        >
          {visibleTemplates.map((template) => (
            <div
              key={template.id}
              className="w-64 p-4 border rounded-md bg-gray-800 text-white flex flex-col"
            >
              <h3 className="font-medium">{template.name}</h3>
              <p className="text-sm text-gray-300 my-2 h-16 overflow-hidden">{template.description}</p>
              <Button
                className="w-full mt-auto"
                onClick={() => handleSelectTemplate(template.id)}
              >
                Usar Template
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Botão de navegação direito */}
      {showRightArrow && (
        <Button
          variant="secondary"
          size="icon"
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800/70 hover:bg-gray-800 shadow-md rounded-full h-8 w-8"
          onClick={handleNext}
        >
          <ChevronRight className="h-5 w-5 text-white" />
        </Button>
      )}

      {/* Indicadores de página */}
      {templates.length > maxVisibleItems && (
        <div className="flex justify-center mt-4 gap-1">
          {Array.from({ length: Math.ceil(templates.length / maxVisibleItems) }).map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full ${index * maxVisibleItems === currentIndex ? 'bg-blue-500' : 'bg-gray-500'}`}
              onClick={() => updateVisibleTemplates(index * maxVisibleItems)}
            />
          ))}
        </div>
      )}
    </div>
  );
};