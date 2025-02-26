import React from 'react';
import { FolderPlus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';
import { ITemplate } from '@/types/settings-types';
import { TemplateCarousel } from './TemplateCarousel';

interface TemplatesSidebarProps {
  templates: ITemplate[];
  currentCategory: string;
  setCurrentCategory: (category: string) => void;
  onTemplateSelect?: (templateId: string) => void;
}

export const TemplatesSidebar: React.FC<TemplatesSidebarProps> = ({ 
  templates, 
  currentCategory, 
  setCurrentCategory,
  onTemplateSelect
}) => {
  const handleUseTemplate = (templateId: string) => {
    if (onTemplateSelect) {
      onTemplateSelect(templateId);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderPlus className="h-5 w-5 text-blue-500" />
          Templates de Processos
        </CardTitle>
        <CardDescription>
          Selecione um template para começar a editar o workflow
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2 overflow-x-auto py-2 scrollbar-hide">
          <Button 
            size="sm" 
            variant={currentCategory === 'all' ? "default" : "outline"}
            onClick={() => setCurrentCategory('all')}
          >
            Todos
          </Button>
          <Button 
            size="sm" 
            variant={currentCategory === 'geral' ? "default" : "outline"}
            onClick={() => setCurrentCategory('geral')}
          >
            Geral
          </Button>
          <Button 
            size="sm" 
            variant={currentCategory === 'cirurgias' ? "default" : "outline"}
            onClick={() => setCurrentCategory('cirurgias')}
          >
            Cirurgias
          </Button>
          <Button 
            size="sm" 
            variant={currentCategory === 'diagnósticos' ? "default" : "outline"}
            onClick={() => setCurrentCategory('diagnósticos')}
          >
            Diagnósticos
          </Button>
        </div>
        
        {/* Novo componente TemplateCarousel com navegação */}
        <div className="w-full">
          <TemplateCarousel 
            templates={templates}
            currentCategory={currentCategory}
            onTemplateSelect={handleUseTemplate}
          />
        </div>
      </CardContent>
    </Card>
  );
};