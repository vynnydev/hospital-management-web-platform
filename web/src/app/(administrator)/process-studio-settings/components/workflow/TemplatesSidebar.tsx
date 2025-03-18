import React from 'react';
import { FolderPlus, Search, Filter, Tag, AlertCircle, Activity, Clipboard, Microscope, Stethoscope } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';
import { Input } from '@/components/ui/organisms/input';
import { IWorkflowTemplate } from '@/types/workflow/customize-process-by-workflow-types';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/organisms/accordion';
import { Badge } from '@/components/ui/organisms/badge';
import { Checkbox } from '@/components/ui/organisms/checkbox';
import { workflowTemplates } from '@/utils/workflowTemplates';

// Tipo para as categorias do sistema
type CategoryType = 'geral' | 'cirurgias' | 'diagnósticos' | 'emergência' | string;

// Interface para as props do TemplatesSidebar
interface TemplatesSidebarProps {
  templates: IWorkflowTemplate[];
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
  // Obter as categorias únicas dos templates usando um objeto como mapa
  const categoriesMap: Record<string, boolean> = {};
  templates.forEach(template => {
    categoriesMap[template.category] = true;
  });
  const categories: string[] = Object.keys(categoriesMap);
  
  // Ícones para cada categoria
  const categoryIcons: Record<string, JSX.Element> = {
    'geral': <Clipboard className="h-4 w-4" />,
    'cirurgias': <Activity className="h-4 w-4" />,
    'diagnósticos': <Microscope className="h-4 w-4" />,
    'emergência': <AlertCircle className="h-4 w-4" />,
    'default': <Tag className="h-4 w-4" />
  };
  
  // Cores para cada categoria
  const categoryColors: Record<string, string> = {
    'geral': 'bg-blue-100 text-blue-800 border-blue-300',
    'cirurgias': 'bg-green-100 text-green-800 border-green-300',
    'diagnósticos': 'bg-purple-100 text-purple-800 border-purple-300',
    'emergência': 'bg-red-100 text-red-800 border-red-300',
    'default': 'bg-gray-100 text-gray-800 border-gray-300'
  };
  
  // Função auxiliar para obter ícone por categoria
  const getCategoryIcon = (category: CategoryType): JSX.Element => {
    return categoryIcons[category] || categoryIcons.default;
  };
  
  // Função auxiliar para obter cor por categoria
  const getCategoryColor = (category: CategoryType): string => {
    return categoryColors[category] || categoryColors.default;
  };
  
  // Função para selecionar o template
  const handleUseTemplate = (templateId: string): void => {
    if (onTemplateSelect) {
      onTemplateSelect(templateId);
    }
  };

  return (
    <Card className="w-full bg-gray-900 border-gray-700">
      <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-900 pb-4 border-b border-gray-700">
        <CardTitle className="flex items-center gap-2 text-white">
          <FolderPlus className="h-5 w-5 text-blue-500" />
          Templates de Processos
        </CardTitle>
        <CardDescription className="text-gray-400">
          Filtrar e selecionar processos hospitalares
        </CardDescription>
        
        <div className="mt-2 relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input 
            placeholder="Buscar templates..." 
            className="pl-8 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
          />
        </div>
      </CardHeader>
      
      <CardContent className="p-4 space-y-4">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-1">
            <Filter className="h-4 w-4" />
            Categorias
          </p>
          
          <div className="flex flex-wrap gap-1">
            <Button 
              size="sm" 
              variant={currentCategory === 'all' ? "default" : "outline"}
              onClick={() => setCurrentCategory('all')}
              className={currentCategory === 'all' 
                ? "bg-blue-600 hover:bg-blue-700 text-white" 
                : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700"}
            >
              Todos
              <Badge variant="secondary" className="ml-1 px-1.5 text-xs">
                {templates.length}
              </Badge>
            </Button>
            
            {categories.map((category) => (
              <Button 
                key={category}
                size="sm" 
                variant={currentCategory === category ? "default" : "outline"}
                onClick={() => setCurrentCategory(category)}
                className={currentCategory === category 
                  ? "bg-blue-600 hover:bg-blue-700 text-white" 
                  : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700 flex items-center gap-1"}
              >
                {getCategoryIcon(category)}
                <span className="capitalize">{category}</span>
                <Badge variant="secondary" className="ml-1 px-1.5 text-xs">
                  {templates.filter(t => t.category === category).length}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
        
        <Accordion type="single" collapsible className="space-y-2">
          <AccordionItem value="complexity" className="border-gray-700">
            <AccordionTrigger className="text-gray-200 hover:text-white hover:no-underline py-2">
              <span className="flex items-center gap-2 text-sm font-medium">
                <Activity className="h-4 w-4 text-blue-500" />
                Complexidade
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-1">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox id="complexity-low" className="border-gray-600" />
                  <label htmlFor="complexity-low" className="text-sm text-gray-300">Baixa complexidade</label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="complexity-medium" className="border-gray-600" />
                  <label htmlFor="complexity-medium" className="text-sm text-gray-300">Média complexidade</label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="complexity-high" className="border-gray-600" />
                  <label htmlFor="complexity-high" className="text-sm text-gray-300">Alta complexidade</label>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="department" className="border-gray-700">
            <AccordionTrigger className="text-gray-200 hover:text-white hover:no-underline py-2">
              <span className="flex items-center gap-2 text-sm font-medium">
                <Stethoscope className="h-4 w-4 text-blue-500" />
                Departamentos
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-1">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox id="dept-reception" className="border-gray-600" />
                  <label htmlFor="dept-reception" className="text-sm text-gray-300">Recepção</label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="dept-emergency" className="border-gray-600" />
                  <label htmlFor="dept-emergency" className="text-sm text-gray-300">Emergência</label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="dept-surgery" className="border-gray-600" />
                  <label htmlFor="dept-surgery" className="text-sm text-gray-300">Centro Cirúrgico</label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="dept-lab" className="border-gray-600" />
                  <label htmlFor="dept-lab" className="text-sm text-gray-300">Laboratório</label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="dept-icu" className="border-gray-600" />
                  <label htmlFor="dept-icu" className="text-sm text-gray-300">UTI</label>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <div className="pt-4 border-t border-gray-700">
          <p className="text-sm font-medium text-gray-400 mb-3">Templates Recentes</p>
          <div className="space-y-2.5">
            {workflowTemplates.slice(0, 3).map(template => (
              <div 
                key={template.id}
                className="group p-2.5 rounded-md bg-gray-800 border border-gray-700 hover:bg-gray-750 hover:border-gray-600 cursor-pointer transition-all"
                onClick={() => handleUseTemplate(template.id)}
              >
                <div className="flex items-start gap-2">
                  <div className={`p-1.5 rounded ${getCategoryColor(template.category)} flex items-center justify-center`}>
                    {getCategoryIcon(template.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-200 mb-0.5 truncate group-hover:text-white">
                      {template.name}
                    </h4>
                    <p className="text-xs text-gray-400 truncate group-hover:text-gray-300">
                      {template.baseNodes.length} etapas • {template.slaSettings?.length || 0} alertas
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};