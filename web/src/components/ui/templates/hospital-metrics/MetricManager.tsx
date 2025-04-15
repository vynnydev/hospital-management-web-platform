/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';
import { 
  AlertTriangle, 
  Users, 
  Settings, 
  Clock,
  Activity,
  TrendingUp,
  RotateCcw,
  GraduationCap,
  Users2,
  Plus,
  Edit,
  Trash2,
  Search,
  Layers,
  Brain,
  Filter,
  X
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/organisms/tabs';
import { Input } from '@/components/ui/organisms/input';
import { MetricForm } from './MetricForm';
import { ICreateMetricPayload, TMetric } from '@/types/hospital-metrics';
import { useMetrics } from '@/hooks/hospital-metrics/useMetrics';

import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/organisms/select';

import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/organisms/alert-dialog';

// Mapeamento de ícones para diferentes tipos de métricas
const metricIcons: Record<string, React.ElementType> = {
  'critical-hospital': AlertTriangle,
  'staff': Users,
  'maintenance': Settings,
  'waiting': Clock,
  'hospital-critico': AlertTriangle,
  'burnout': Users,
  'manutencao': Settings,
  'taxa-giro': RotateCcw,
  'eficiencia': TrendingUp,
  'ocupacao': Activity,
  'variacao': Users2,
  'treinamento': GraduationCap
};

interface MetricManagerProps {
  onAddToPanel?: (metric: TMetric) => void;
}

export const MetricManager: React.FC<MetricManagerProps> = ({ onAddToPanel }) => {
  // Hooks e estado
  const { 
    metrics, 
    isLoading, 
    error, 
    addMetric, 
    updateMetric, 
    removeMetric, 
    fetchMetrics
  } = useMetrics();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMetric, setEditingMetric] = useState<TMetric | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'main' | 'additional' | 'custom'>('all');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [metricToDelete, setMetricToDelete] = useState<TMetric | null>(null);
  
  // Filtrar métricas
  const filteredMetrics = metrics.filter(metric => {
    // Filtrar por termo de busca
    const matchesSearch = 
      metric.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (metric.description && metric.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filtrar por tipo
    let matchesType = true;
    if (filterType === 'main') {
      matchesType = metric.type === 'main';
    } else if (filterType === 'additional') {
      matchesType = metric.type === 'additional';
    } else if (filterType === 'custom') {
      matchesType = metric.isCustom;
    }
    
    return matchesSearch && matchesType;
  });
  
  // Agrupar métricas por tipo
  const mainMetrics = filteredMetrics.filter(metric => metric.type === 'main');
  const additionalMetrics = filteredMetrics.filter(metric => metric.type === 'additional');
  
  // Handlers
  const handleAddMetric = async (formData: ICreateMetricPayload): Promise<TMetric | null> => {
    try {
      const newMetric = await addMetric(formData);
      return newMetric; // Certifique-se que addMetric retorna a métrica adicionada
    } catch (error) {
      console.error('Erro ao adicionar métrica:', error);
      return null;
    }
  };
  
  const handleUpdateMetric = async (formData: ICreateMetricPayload): Promise<TMetric | null> => {
    if (editingMetric) {
      try {
        const updatedMetric = await updateMetric(editingMetric.id, formData);
        return updatedMetric; // Certifique-se que updateMetric retorna a métrica atualizada
      } catch (error) {
        console.error('Erro ao atualizar métrica:', error);
        return null;
      }
    }
    return null;
  };
  
  const handleDeleteMetric = async () => {
    if (metricToDelete) {
      await removeMetric(metricToDelete.id);
      setMetricToDelete(null);
      setDeleteConfirmOpen(false);
    }
  };
  
  const openEditForm = (metric: TMetric) => {
    setEditingMetric(metric);
    setIsFormOpen(true);
  };
  
  const confirmDelete = (metric: TMetric) => {
    setMetricToDelete(metric);
    setDeleteConfirmOpen(true);
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setFilterType('all');
  };
  
  // Renderizar um card de métrica
  const renderMetricCard = (metric: TMetric) => {
    const IconComponent = metricIcons[metric.cardType] || Activity;
    
    return (
      <div 
        key={metric.id} 
        className="relative group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all duration-200"
      >
        {/* Badge para métricas personalizadas */}
        {metric.isCustom && (
          <div className="absolute top-2 right-2 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs px-2 py-1 rounded-full">
            Personalizada
          </div>
        )}
        
        <div className="p-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
              <IconComponent className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">{metric.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {metric.subtitle || (metric.type === 'main' ? 'Métrica Principal' : 'Métrica Adicional')}
              </p>
            </div>
          </div>
          
          {metric.description && (
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
              {metric.description}
            </p>
          )}
          
          <div className="mt-4 flex justify-between items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Criado em {new Date(metric.createdAt).toLocaleDateString()}
            </span>
            
            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 w-8 p-0" 
                onClick={() => openEditForm(metric)}
              >
                <Edit className="h-4 w-4" />
                <span className="sr-only">Editar</span>
              </Button>
              
              {metric.isCustom && (
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-600" 
                  onClick={() => confirmDelete(metric)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Excluir</span>
                </Button>
              )}
              
              {onAddToPanel && (
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 w-8 p-0 text-blue-500 hover:text-blue-600" 
                  onClick={() => onAddToPanel(metric)}
                >
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Adicionar ao Painel</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <Card className="border-gray-800 bg-gray-100 dark:bg-gray-900 w-full">
      <CardContent className='pt-6'>
        {/* Barra de pesquisa e filtros */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
          <div className="relative w-full sm:w-auto flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar métricas..."
              className="pl-10 bg-gray-800 border-gray-700 text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => setSearchTerm('')}
              >
                <X className="h-4 w-4 text-gray-400 hover:text-white" />
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
              <SelectTrigger className="w-full sm:w-40 bg-gray-800 border-gray-700 text-white">
                <Filter className="h-4 w-4 mr-2 text-gray-400" />
                <SelectValue placeholder="Filtrar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="main">Principais</SelectItem>
                <SelectItem value="additional">Adicionais</SelectItem>
                <SelectItem value="custom">Personalizadas</SelectItem>
              </SelectContent>
            </Select>
            
            <Button onClick={() => { setEditingMetric(null); setIsFormOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Métrica
            </Button>
            
            {(searchTerm || filterType !== 'all') && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Limpar Filtros
              </Button>
            )}
          </div>
        </div>
        
        {/* Estado de carregamento e erros */}
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
        )}
        
        {error && !isLoading && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 p-4 rounded-lg text-red-800 dark:text-red-200 mb-6">
            <p>{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2" 
              onClick={fetchMetrics}
            >
              Tentar Novamente
            </Button>
          </div>
        )}
        
        {/* Tabs para os diferentes tipos de métricas */}
        {!isLoading && !error && (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4 w-full sm:w-auto bg-gray-800">
              <TabsTrigger value="all" className="data-[state=active]:bg-gray-700 text-white">
                Todas ({filteredMetrics.length})
              </TabsTrigger>
              <TabsTrigger value="main" className="data-[state=active]:bg-gray-700 text-white">
                Principais ({mainMetrics.length})
              </TabsTrigger>
              <TabsTrigger value="additional" className="data-[state=active]:bg-gray-700 text-white">
                Adicionais ({additionalMetrics.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              {filteredMetrics.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Layers className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>Nenhuma métrica encontrada</p>
                  <p className="text-sm mt-2">
                    {searchTerm || filterType !== 'all' 
                      ? 'Tente ajustar seus filtros' 
                      : 'Clique em "Nova Métrica" para começar'
                    }
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredMetrics.map(metric => renderMetricCard(metric))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="main" className="mt-0">
              {mainMetrics.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>Nenhuma métrica principal encontrada</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mainMetrics.map(metric => renderMetricCard(metric))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="additional" className="mt-0">
              {additionalMetrics.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>Nenhuma métrica adicional encontrada</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {additionalMetrics.map(metric => renderMetricCard(metric))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
      
      {/* Form para adicionar/editar métricas */}
      <MetricForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={editingMetric ? handleUpdateMetric : handleAddMetric}
        editingMetric={editingMetric}
        title={editingMetric ? 'Editar Métrica' : 'Nova Métrica'}
      />
      
      {/* Diálogo de confirmação para excluir */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Métrica</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a métrica &quot;{metricToDelete?.title}&quot;? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteMetric}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};