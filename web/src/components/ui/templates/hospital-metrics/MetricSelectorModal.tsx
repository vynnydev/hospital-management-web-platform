/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useMemo } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/organisms/dialog";
import { Button } from "@/components/ui/organisms/button";
import { 
  Check, 
  X, 
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
  Search,
  Filter,
  Layers
} from 'lucide-react';
import { Input } from "@/components/ui/organisms/input";
import { Badge } from "@/components/ui/organisms/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/organisms/tabs";
import { TMetric } from '@/types/hospital-metrics';

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

interface MetricSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMetric: (metricId: string) => Promise<boolean | void>;
  visibleMainMetrics: string[];
  visibleAdditionalMetrics: string[];
  allMetrics: TMetric[];
}

export const MetricSelectorModal: React.FC<MetricSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectMetric,
  visibleMainMetrics,
  visibleAdditionalMetrics,
  allMetrics
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState('main');
  const [addingMetricId, setAddingMetricId] = useState<string | null>(null);
  
  // Filtrar métricas principais e adicionais que não estão visíveis
  const availableMainMetrics = useMemo(() => {
    return allMetrics.filter(metric => 
      metric.type === 'main' && 
      !visibleMainMetrics.includes(metric.id) &&
      (searchTerm === '' || 
        metric.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (metric.description && metric.description.toLowerCase().includes(searchTerm.toLowerCase())))
    );
  }, [allMetrics, visibleMainMetrics, searchTerm]);
  
  const availableAdditionalMetrics = useMemo(() => {
    return allMetrics.filter(metric => 
      metric.type === 'additional' && 
      !visibleAdditionalMetrics.includes(metric.id) &&
      (searchTerm === '' || 
        metric.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (metric.description && metric.description.toLowerCase().includes(searchTerm.toLowerCase())))
    );
  }, [allMetrics, visibleAdditionalMetrics, searchTerm]);
  
  // Contagem de métricas disponíveis
  const availableMainCount = availableMainMetrics.length;
  const availableAdditionalCount = availableAdditionalMetrics.length;
  
  // Verificar se há métricas disponíveis para adicionar
  const hasAvailableMetrics = availableMainCount > 0 || availableAdditionalCount > 0;
  
  // Função para adicionar uma métrica
  const handleAddMetric = async (metricId: string) => {
    setIsAdding(true);
    setAddingMetricId(metricId);
    
    try {
      await onSelectMetric(metricId);
    } catch (error) {
      console.error('Erro ao adicionar métrica:', error);
    } finally {
      setIsAdding(false);
      setAddingMetricId(null);
    }
  };
  
  // Renderizar uma métrica na lista
  const renderMetricItem = (metric: TMetric) => {
    const IconComponent = metricIcons[metric.cardType] || Activity;
    const isAddinginProgress = isAdding && addingMetricId === metric.id;
    
    return (
      <div 
        key={metric.id}
        className="flex items-start justify-between p-4 bg-gray-800 rounded-xl border border-gray-700 hover:border-blue-500 hover:bg-gray-700/80 transition-all duration-200"
      >
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-gray-700">
            <IconComponent className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h4 className="font-medium text-white">{metric.title}</h4>
            <p className="text-sm text-gray-400 mt-1">{metric.subtitle || metric.description || ''}</p>
            {metric.isCustom && (
              <Badge variant="outline" className="mt-2 bg-purple-900/30 text-purple-300 border-purple-600">
                Personalizada
              </Badge>
            )}
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white border-blue-800"
          onClick={() => handleAddMetric(metric.id)}
          disabled={isAdding}
        >
          {isAddinginProgress ? (
            <div className="w-4 h-4 rounded-full border-2 border-t-transparent border-white animate-spin mr-1" />
          ) : (
            <Plus className="w-4 h-4 mr-1" />
          )}
          Adicionar
        </Button>
      </div>
    );
  };
  
  // Limpar pesquisa
  const clearSearch = () => {
    setSearchTerm('');
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white mb-4 flex items-center">
            <Layers className="h-5 w-5 text-blue-400 mr-2" />
            Adicionar Métricas ao Painel
          </DialogTitle>
        </DialogHeader>
        
        {/* Barra de pesquisa */}
        <div className="mb-6">
          <div className="relative">
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
                onClick={clearSearch}
              >
                <X className="h-4 w-4 text-gray-400 hover:text-white" />
              </button>
            )}
          </div>
        </div>
        
        {hasAvailableMetrics ? (
          <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-4 w-full sm:w-auto bg-gray-800">
                <TabsTrigger 
                  value="main" 
                  className="data-[state=active]:bg-blue-700 text-white"
                >
                  Métricas Principais ({availableMainCount})
                </TabsTrigger>
                <TabsTrigger 
                  value="additional" 
                  className="data-[state=active]:bg-purple-700 text-white"
                >
                  Métricas Adicionais ({availableAdditionalCount})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="main" className="mt-0">
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {availableMainMetrics.length > 0 ? (
                    availableMainMetrics.map(metric => renderMetricItem(metric))
                  ) : (
                    <div className="py-10 flex flex-col items-center justify-center text-center">
                      <Search className="w-12 h-12 text-gray-500 mb-4" />
                      <p className="text-gray-400">
                        {searchTerm
                          ? 'Nenhuma métrica principal encontrada com este termo de busca'
                          : 'Todas as métricas principais já estão no seu painel'}
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="additional" className="mt-0">
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {availableAdditionalMetrics.length > 0 ? (
                    availableAdditionalMetrics.map(metric => renderMetricItem(metric))
                  ) : (
                    <div className="py-10 flex flex-col items-center justify-center text-center">
                      <Search className="w-12 h-12 text-gray-500 mb-4" />
                      <p className="text-gray-400">
                        {searchTerm
                          ? 'Nenhuma métrica adicional encontrada com este termo de busca'
                          : 'Todas as métricas adicionais já estão no seu painel'}
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="py-10 flex flex-col items-center justify-center text-center">
            <Check className="w-12 h-12 text-green-500 mb-4" />
            <p className="text-lg text-gray-300 text-center mb-2">Todas as métricas disponíveis já estão no seu painel</p>
            <p className="text-sm text-gray-500">
              {searchTerm
                ? 'Tente limpar o termo de busca para ver mais métricas disponíveis'
                : 'Você pode personalizar seu painel removendo métricas que não precisa'}
            </p>
          </div>
        )}
        
        <DialogFooter>
          <Button 
            variant="outline" 
            className="bg-gray-800 hover:bg-gray-700 text-white border-gray-700"
            onClick={onClose}
          >
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};