import React from 'react';
import { PanelLeft, FilePlus, Activity, CreditCard, Hospital, UserCheck, Users } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';

// Definição de categoria de métrica
interface MetricCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
}

interface MetricCategoriesSidebarProps {
  categories: MetricCategory[];
  activeCategory?: string;
  onCategorySelect?: (id: string) => void;
}

export const MetricCategoriesSidebar: React.FC<MetricCategoriesSidebarProps> = ({ 
  categories,
  activeCategory,
  onCategorySelect 
}) => {
  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PanelLeft className="h-5 w-5 text-blue-500" />
          Categorias de Métricas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {categories.map(category => {
          const Icon = category.icon;
          return (
            <div 
              key={category.id}
              className={`flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer ${
                activeCategory === category.id ? 'bg-gray-50 dark:bg-gray-800' : ''
              }`}
              onClick={() => onCategorySelect && onCategorySelect(category.id)}
            >
              <Icon className={`h-5 w-5 mr-2 ${category.color}`} />
              <span>{category.name}</span>
              <span className="ml-auto text-sm text-gray-500">12</span>
            </div>
          );
        })}
        <Button className="w-full mt-4">
          <FilePlus className="h-4 w-4 mr-2" />
          Nova Categoria
        </Button>
      </CardContent>
    </Card>
  );
};

// Exportando também as categorias padrão para uso em outros componentes
export const defaultMetricCategories: MetricCategory[] = [
  { id: 'operational', name: 'Operacionais', icon: Activity, color: 'text-blue-500' },
  { id: 'financial', name: 'Financeiras', icon: CreditCard, color: 'text-green-500' },
  { id: 'clinical', name: 'Clínicas', icon: Hospital, color: 'text-red-500' },
  { id: 'satisfaction', name: 'Satisfação', icon: UserCheck, color: 'text-yellow-500' },
  { id: 'hr', name: 'Recursos Humanos', icon: Users, color: 'text-purple-500' }
];