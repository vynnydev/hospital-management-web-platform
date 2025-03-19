import React, { useState } from 'react';
import { 
  Activity, 
  CreditCard,
  Hospital,
  UserCheck,
  Users,
  Search,
  Filter,
  ListFilter
} from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '@/components/ui/organisms/card';
import { Input } from '@/components/ui/organisms/input';
import { Badge } from '@/components/ui/organisms/badge';
import { IMetricCategory } from '@/types/custom-metrics';

interface MetricCategoriesSidebarProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export const MetricCategoriesSidebar: React.FC<MetricCategoriesSidebarProps> = ({
  selectedCategory,
  onSelectCategory
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Lista de categorias de métricas
  const categories: IMetricCategory[] = [
    {
      id: 'operational',
      name: 'Operacionais',
      description: 'Métricas de eficiência operacional',
      icon: Activity,
      color: 'text-blue-500',
      count: 12
    },
    {
      id: 'financial',
      name: 'Financeiras',
      description: 'Indicadores financeiros e faturamento',
      icon: CreditCard,
      color: 'text-green-500',
      count: 8
    },
    {
      id: 'clinical',
      name: 'Clínicas',
      description: 'Métricas assistenciais e de qualidade',
      icon: Hospital,
      color: 'text-red-500',
      count: 9
    },
    {
      id: 'satisfaction',
      name: 'Satisfação',
      description: 'Índices de satisfação e NPS',
      icon: UserCheck,
      color: 'text-yellow-500',
      count: 5
    },
    {
      id: 'hr',
      name: 'Recursos Humanos',
      description: 'Métricas de gestão de equipes',
      icon: Users,
      color: 'text-purple-500',
      count: 6
    }
  ];
  
  // Filtrar categorias pela pesquisa
  const filteredCategories = searchQuery
    ? categories.filter(cat => 
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : categories;

  return (
    <Card className="bg-gray-900 border-gray-700 shadow-md h-full">
      <CardHeader className="border-b border-gray-700 px-4 py-4">
        <CardTitle className="flex items-center gap-2 text-white">
          <ListFilter className="h-5 w-5 text-blue-500" />
          Categorias de Métricas
        </CardTitle>
        
        <div className="relative mt-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input 
            placeholder="Buscar categorias..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
          />
        </div>
      </CardHeader>
      
      <CardContent className="p-2 space-y-1 h-[calc(100%-6rem)] overflow-auto">
        <div 
          className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
            selectedCategory === 'all' 
              ? 'bg-blue-600/20 border border-blue-500/30' 
              : 'hover:bg-gray-800 border border-transparent'
          }`}
          onClick={() => onSelectCategory('all')}
        >
          <div className={`${selectedCategory === 'all' 
            ? 'bg-blue-600' 
            : 'bg-gray-800'} p-2 rounded-lg text-gray-300`}>
            <Filter className="h-4 w-4" />
          </div>
          
          <div className="ml-3 flex-1 min-w-0">
            <span className={`block text-sm font-medium ${
              selectedCategory === 'all' ? 'text-white' : 'text-gray-300'
            }`}>
              Todas as Categorias
            </span>
          </div>
          
          <Badge 
            variant={selectedCategory === 'all' ? "default" : "outline"} 
            className={`ml-auto ${
              selectedCategory === 'all' 
                ? 'bg-blue-500 hover:bg-blue-500 text-white border-none' 
                : 'bg-transparent border-gray-700 text-gray-400'
            }`}
          >
            {categories.reduce((sum, cat) => sum + cat.count, 0)}
          </Badge>
        </div>
        
        {filteredCategories.map(category => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.id;
          
          return (
            <div 
              key={category.id}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'bg-blue-600/20 border border-blue-500/30' 
                  : 'hover:bg-gray-800 border border-transparent'
              }`}
              onClick={() => onSelectCategory(category.id)}
            >
              <div className={`${isSelected
                ? 'bg-blue-600' 
                : 'bg-gray-800'} p-2 rounded-lg ${category.color}`}>
                <Icon className="h-4 w-4" />
              </div>
              
              <div className="ml-3 flex-1 min-w-0">
                <span className={`block text-sm font-medium ${
                  isSelected ? 'text-white' : 'text-gray-300'
                }`}>
                  {category.name}
                </span>
                
                <span className="block text-xs text-gray-400 truncate mt-0.5">
                  {category.description}
                </span>
              </div>
              
              <Badge 
                variant={isSelected ? "default" : "outline"} 
                className={`ml-auto ${
                  isSelected
                    ? 'bg-blue-500 hover:bg-blue-500 text-white border-none' 
                    : 'bg-transparent border-gray-700 text-gray-400'
                }`}
              >
                {category.count}
              </Badge>
            </div>
          );
        })}
        
        {filteredCategories.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 text-gray-500">
            <Search className="h-6 w-6 mb-2" />
            <p className="text-sm">Nenhuma categoria encontrada</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};