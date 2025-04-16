/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, Clock, Activity, Users, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/organisms/button';
import { Card } from '@/components/ui/organisms/card';
import { motion } from 'framer-motion';
import { IWorkflowTemplate } from '@/types/workflow/workflow-types';

type TCategoryType = 'geral' | 'cirurgias' | 'diagnósticos' | 'emergência' | string;

// Interface para o objeto de cores retornado pela função getCategoryColors
interface CategoryColors {
  gradientFrom: string;
  gradientTo: string;
  iconBg: string;
  badgeBg: string;
}

// Função auxiliar para obter cores por categoria
const getCategoryColors = (category: TCategoryType): CategoryColors => {
  switch (category) {
    case 'geral':
      return {
        gradientFrom: 'from-blue-500',
        gradientTo: 'to-blue-700',
        iconBg: 'bg-blue-600',
        badgeBg: 'bg-blue-700'
      };
    case 'cirurgias':
      return {
        gradientFrom: 'from-green-500',
        gradientTo: 'to-green-700',
        iconBg: 'bg-green-600',
        badgeBg: 'bg-green-700'
      };
    case 'diagnósticos':
      return {
        gradientFrom: 'from-purple-500',
        gradientTo: 'to-purple-700',
        iconBg: 'bg-purple-600',
        badgeBg: 'bg-purple-700'
      };
    case 'emergência':
      return {
        gradientFrom: 'from-red-500',
        gradientTo: 'to-red-700',
        iconBg: 'bg-red-600',
        badgeBg: 'bg-red-700'
      };
    default:
      return {
        gradientFrom: 'from-gray-600',
        gradientTo: 'to-gray-800',
        iconBg: 'bg-gray-700',
        badgeBg: 'bg-gray-700'
      };
  }
};

// Componente para o ícone da categoria
type CategoryIconProps = {
    category: TCategoryType;
  };
  
  const CategoryIcon = ({ category }: CategoryIconProps): JSX.Element => {
    switch (category) {
      case 'geral':
        return <CheckCircle className="h-5 w-5" />;
      case 'cirurgias':
        return <Activity className="h-5 w-5" />;
      case 'diagnósticos':
        return <Clock className="h-5 w-5" />;
      case 'emergência':
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <Users className="h-5 w-5" />;
    }
  };

interface TemplateCardProps {
  template: IWorkflowTemplate;
  onSelect: (id: string) => void;
}

// Componente de cartão de template individual
const TemplateCard: React.FC<TemplateCardProps> = ({ template, onSelect }) => {
  const colors = getCategoryColors(template.category);
  
  return (
    <Card 
      className={`w-full h-64 overflow-hidden bg-gradient-to-br ${colors.gradientFrom} ${colors.gradientTo} text-white shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl border-none`}
    >
      <div className="p-5 flex flex-col h-full">
        <div className="flex justify-between items-start mb-3">
          <div className={`p-2 rounded-full ${colors.iconBg} flex items-center justify-center`}>
            <CategoryIcon category={template.category} />
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${colors.badgeBg} bg-opacity-80`}>
            {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
          </span>
        </div>
        
        <h3 className="text-xl font-bold mb-2">{template.name}</h3>
        
        <p className="text-sm opacity-90 mb-3 flex-grow overflow-hidden">
          {template.description}
        </p>
        
        <div className="mt-auto">
          <div className="flex justify-between text-xs mb-2 opacity-80">
            <span>{template.baseNodes.length} etapas</span>
            <span>{template.slaSettings?.length || 0} alertas</span>
          </div>
          
          <Button
            className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 border-none"
            onClick={() => onSelect(template.id)}
          >
            Usar Template
          </Button>
        </div>
      </div>
    </Card>
  );
};

interface EnhancedTemplateCarouselProps {
  templates: IWorkflowTemplate[];
  onSelectTemplate: (templateId: string) => void;
  maxVisibleItems?: number;
  isRecommendation?: boolean;
}

export const EnhancedTemplateCarousel: React.FC<EnhancedTemplateCarouselProps> = ({
  templates,
  onSelectTemplate,
  maxVisibleItems = 3,
  isRecommendation = false
}) => {
    const [showLeftArrow, setShowLeftArrow] = useState<boolean>(false);
    const [showRightArrow, setShowRightArrow] = useState<boolean>(true);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [scrollWidth, setScrollWidth] = useState<number>(0);
    const [containerWidth, setContainerWidth] = useState<number>(0);
    const [itemWidth, setItemWidth] = useState<number>(0);
    const containerRef = useRef<HTMLDivElement | null>(null);

  // Calcular larguras e configurar observador de redimensionamento
  useEffect(() => {
    if (containerRef.current) {
      const updateDimensions = () => {
        if (containerRef.current) {
          const containerWidth = containerRef.current.clientWidth;
          const itemCount = templates.length;
          
          // Se tivermos poucos templates, divida o contêiner igualmente
          // Caso contrário, calcule a largura com base nos itens visíveis
          const calculatedWidth = itemCount <= maxVisibleItems
            ? containerWidth / itemCount
            : containerWidth / maxVisibleItems;
          
          // Largura mínima de 280px por item
          const finalWidth = Math.max(280, calculatedWidth - 16); // 16px para gap
          
          setContainerWidth(containerWidth);
          setItemWidth(finalWidth);
          setScrollWidth(finalWidth * itemCount);
          
          // Atualize os estados de setas com base nas novas dimensões
          updateArrowStates(currentIndex);
        }
      };
      
      updateDimensions();
      
      const resizeObserver = new ResizeObserver(updateDimensions);
      resizeObserver.observe(containerRef.current);
      
      return () => {
        if (containerRef.current) {
          resizeObserver.unobserve(containerRef.current);
        }
      };
    }
  }, [templates.length, maxVisibleItems, currentIndex]);

  // Atualizar estados de navegação com base no índice atual
  const updateArrowStates = (index: number): void => {
    if (containerRef.current) {
      const maxScroll: number = scrollWidth - containerWidth;
      const newScroll: number = index * (itemWidth + 16); // 16px para gap
      
      setShowLeftArrow(newScroll > 0);
      setShowRightArrow(newScroll < maxScroll - 10); // 10px de tolerância
    }
  };

  // Manipula navegação para a esquerda
  const handlePrevious = () => {
    if (currentIndex === 0) return;
    const newIndex = Math.max(0, currentIndex - 1);
    setCurrentIndex(newIndex);
    updateArrowStates(newIndex);
  };

  // Manipula navegação para a direita
  const handleNext = () => {
    if (currentIndex >= templates.length - maxVisibleItems) return;
    const newIndex = currentIndex + 1;
    setCurrentIndex(newIndex);
    updateArrowStates(newIndex);
  };

  // Manipula a seleção de um template
  const handleSelectTemplate = (templateId: string) => {
    onSelectTemplate(templateId);
  };

  // Se não houver templates, mostrar mensagem
  if (templates.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center border border-dashed border-gray-600 rounded-md p-4 text-center">
        <div className="text-gray-400">
          <p className="mb-2">Nenhum template disponível nesta categoria.</p>
          <p className="text-sm">Tente selecionar outra categoria ou criar um novo template.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Botão de navegação esquerdo */}
      {showLeftArrow && (
        <button
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-slate-800/80 hover:bg-slate-700 shadow-lg rounded-full h-10 w-10 flex items-center justify-center transition-all duration-200 border border-slate-600"
          onClick={handlePrevious}
          aria-label="Ver templates anteriores"
        >
          <ChevronLeft className="h-5 w-5 text-white" />
        </button>
      )}

      {/* Container para os templates visíveis */}
      <div className="relative overflow-hidden" ref={containerRef}>
        <motion.div 
          className="flex gap-4 w-max"
          animate={{
            x: -currentIndex * (itemWidth + 16) // 16px para gap
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {templates.map((template) => (
            <div
              key={template.id}
              className="flex-shrink-0"
              style={{ width: `${itemWidth}px` }}
            >
              <TemplateCard 
                template={template} 
                onSelect={handleSelectTemplate} 
              />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Botão de navegação direito */}
      {showRightArrow && (
        <button
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-slate-800/80 hover:bg-slate-700 shadow-lg rounded-full h-10 w-10 flex items-center justify-center transition-all duration-200 border border-slate-600"
          onClick={handleNext}
          aria-label="Ver mais templates"
        >
          <ChevronRight className="h-5 w-5 text-white" />
        </button>
      )}

      {/* Indicadores de página */}
      {templates.length > maxVisibleItems && (
        <div className="flex justify-center mt-4 gap-1">
          {Array.from({ length: Math.ceil(templates.length - maxVisibleItems + 1) }).map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-blue-500 w-4' : 'bg-gray-500'
              }`}
              onClick={() => {
                setCurrentIndex(index);
                updateArrowStates(index);
              }}
              aria-label={`Ir para página ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};