/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/prefer-as-const */
import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/organisms/button';
import { ITemplate } from '@/types/settings-types';

interface TemplateCardProps {
  template: ITemplate;
  onSelect?: (templateId: string) => void;
}

// Componente para o card individual de template
export const TemplateCard: React.FC<TemplateCardProps> = ({ template, onSelect }) => {
  const handleUseTemplate = () => {
    if (onSelect) {
      onSelect(template.id);
    }
  };

  return (
    <div 
      className="min-w-[240px] max-w-[280px] h-[200px] p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer flex flex-col"
    >
      <h4 className="font-medium text-gray-900 dark:text-white">{template.name}</h4>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex-grow">{template.description}</p>
      <div className="flex justify-end mt-3">
        <Button 
          size="sm" 
          variant="outline" 
          className="text-xs"
          onClick={handleUseTemplate}
        >
          Usar Template
        </Button>
      </div>
    </div>
  );
};

interface TemplateCarouselProps {
  templates: ITemplate[];
  currentCategory: string;
  onTemplateSelect?: (templateId: string) => void;
}

// Componente de carrossel
export const TemplateCarousel: React.FC<TemplateCarouselProps> = ({ 
  templates,
  currentCategory,
  onTemplateSelect
}) => {
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  // Filtra os templates com base na categoria atual
  const filteredTemplates = currentCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === currentCategory);
  
  // Define quantos cards aparecem por página baseado no tamanho da tela
  const getCardsPerPage = () => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width < 640) return 1;      // Mobile
      if (width < 1024) return 2;     // Tablet
      if (width < 1280) return 3;     // Desktop pequeno
      return 4;                       // Desktop grande
    }
    return 3; // Valor padrão se window não estiver disponível
  };

  const cardsPerPage = getCardsPerPage();
  const totalPages = Math.ceil(filteredTemplates.length / cardsPerPage);

  // Atualiza os botões de navegação quando a categoria ou o número de templates muda
  useEffect(() => {
    setCurrentPage(0);
    setShowLeftButton(false);
    setShowRightButton(totalPages > 1);
  }, [currentCategory, totalPages]);

  // Função para navegar para a página anterior
  const goToPreviousPage = () => {
    if (currentPage > 0) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      setShowLeftButton(newPage > 0);
      setShowRightButton(newPage < totalPages - 1);
      scrollToPage(newPage);
    }
  };

  // Função para navegar para a próxima página
  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      setShowLeftButton(true);
      setShowRightButton(newPage < totalPages - 1);
      scrollToPage(newPage);
    }
  };

  // Função para rolar até a página especificada
  const scrollToPage = (page: number) => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.offsetWidth / cardsPerPage;
      carouselRef.current.scrollTo({
        left: page * cardsPerPage * cardWidth,
        behavior: 'smooth'
      });
    }
  };

  // Ajusta o estado dos botões quando a dimensão da janela muda
  useEffect(() => {
    const handleResize = () => {
      const newCardsPerPage = getCardsPerPage();
      const newTotalPages = Math.ceil(filteredTemplates.length / newCardsPerPage);
      setShowRightButton(currentPage < newTotalPages - 1);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentPage, filteredTemplates.length]);

  // Renderiza os templates visíveis na página atual
  const visibleTemplates = filteredTemplates.slice(
    currentPage * cardsPerPage,
    (currentPage + 1) * cardsPerPage
  );

  // Se não houver templates, mostra uma mensagem
  if (filteredTemplates.length === 0) {
    return (
      <div className="text-center p-6 bg-gray-800 rounded-lg text-gray-400">
        Nenhum template encontrado para esta categoria.
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Botão de navegação esquerda */}
      {showLeftButton && (
        <Button 
          variant="secondary" 
          size="icon" 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-700 text-white rounded-full h-10 w-10 shadow-lg"
          onClick={goToPreviousPage}
          aria-label="Página anterior"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      )}

      {/* Container principal do carrossel */}
      <div 
        ref={carouselRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 px-4"
        style={{ 
          transition: 'transform 0.3s ease'
        }}
      >
        {visibleTemplates.map(template => (
          <div key={template.id} className="h-48">
            <TemplateCard 
              template={template} 
              onSelect={onTemplateSelect}
            />
          </div>
        ))}
      </div>

      {/* Botão de navegação direita */}
      {showRightButton && (
        <Button 
          variant="secondary" 
          size="icon" 
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-700 text-white rounded-full h-10 w-10 shadow-lg"
          onClick={goToNextPage}
          aria-label="Próxima página"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      )}

      {/* Indicadores de página */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <div 
              key={idx} 
              className={`h-2 w-2 rounded-full ${
                idx === currentPage ? 'bg-blue-500' : 'bg-gray-500'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};