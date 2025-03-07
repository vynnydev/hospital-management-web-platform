import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/organisms/dialog';
import { Button } from '@/components/ui/organisms/button';
import { Input } from '@/components/ui/organisms/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/organisms/tabs';

import { 
  Search, 
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
  Check,
  InfoIcon
} from 'lucide-react';
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
  onSelectMetric: (metric: TMetric) => void;
  availableMainMetrics: TMetric[];
  availableAdditionalMetrics: TMetric[];
}

export const MetricSelectorModal: React.FC<MetricSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectMetric,
  availableMainMetrics,
  availableAdditionalMetrics
}) => {
  // Estado para filtragem
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('main'); // 'main' ou 'additional'
  const [selectedMetric, setSelectedMetric] = useState<TMetric | null>(null);
  
  // Filtrar métricas baseado na busca
  const filteredMainMetrics = availableMainMetrics.filter(metric => 
    metric.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (metric.description && metric.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const filteredAdditionalMetrics = availableAdditionalMetrics.filter(metric => 
    metric.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (metric.description && metric.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Função para limpar a seleção ao fechar o modal
  const handleClose = () => {
    setSelectedMetric(null);
    setSearchTerm('');
    onClose();
  };
  
  // Função para adicionar a métrica selecionada
  const handleAddMetric = () => {
    if (selectedMetric) {
      onSelectMetric(selectedMetric);
      setSelectedMetric(null);
      setSearchTerm('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">Adicionar Métrica ao Painel</DialogTitle>
        </DialogHeader>
        
        {/* Barra de busca */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar métricas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* Abas para métricas principais vs adicionais */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="main" className="flex-1">
              Métricas Principais ({filteredMainMetrics.length})
            </TabsTrigger>
            <TabsTrigger value="additional" className="flex-1">
              Métricas Adicionais ({filteredAdditionalMetrics.length})
            </TabsTrigger>
          </TabsList>
          
          {/* Conteúdo das abas */}
          <TabsContent value="main" className="flex-1 overflow-auto">
            {filteredMainMetrics.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <InfoIcon className="h-12 w-12 mb-2 opacity-30" />
                <p>Nenhuma métrica principal disponível para adicionar</p>
                <p className="text-sm mt-1">
                  {searchTerm ? 'Tente outro termo de busca' : 'Todas as métricas principais já estão no painel'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                {filteredMainMetrics.map(metric => {
                  const IconComponent = metricIcons[metric.cardType] || InfoIcon;
                  const isSelected = selectedMetric?.id === metric.id;
                  
                  return (
                    <button
                      key={metric.id}
                      className={`
                        flex items-start p-4 rounded-lg border text-left
                        ${isSelected 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                          : 'border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700'}
                        transition-colors
                      `}
                      onClick={() => setSelectedMetric(metric)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center">
                          <IconComponent className="h-5 w-5 mr-2 text-blue-500" />
                          <h3 className="font-medium">{metric.title}</h3>
                        </div>
                        {metric.description && (
                          <p className="text-sm text-gray-500 mt-2">{metric.description}</p>
                        )}
                        {metric.isCustom && (
                          <span className="inline-block mt-2 text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full dark:bg-purple-900 dark:text-purple-200">
                            Personalizada
                          </span>
                        )}
                      </div>
                      {isSelected && (
                        <span className="flex-shrink-0 rounded-full p-1 bg-blue-500 text-white">
                          <Check className="h-4 w-4" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="additional" className="flex-1 overflow-auto">
            {filteredAdditionalMetrics.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <InfoIcon className="h-12 w-12 mb-2 opacity-30" />
                <p>Nenhuma métrica adicional disponível para adicionar</p>
                <p className="text-sm mt-1">
                  {searchTerm ? 'Tente outro termo de busca' : 'Todas as métricas adicionais já estão no painel'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                {filteredAdditionalMetrics.map(metric => {
                  const IconComponent = metricIcons[metric.cardType] || InfoIcon;
                  const isSelected = selectedMetric?.id === metric.id;
                  
                  return (
                    <button
                      key={metric.id}
                      className={`
                        flex items-start p-4 rounded-lg border text-left
                        ${isSelected 
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                          : 'border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700'}
                        transition-colors
                      `}
                      onClick={() => setSelectedMetric(metric)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center">
                          <IconComponent className="h-5 w-5 mr-2 text-purple-500" />
                          <h3 className="font-medium">{metric.title}</h3>
                        </div>
                        {metric.description && (
                          <p className="text-sm text-gray-500 mt-2">{metric.description}</p>
                        )}
                        {metric.isCustom && (
                          <span className="inline-block mt-2 text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full dark:bg-purple-900 dark:text-purple-200">
                            Personalizada
                          </span>
                        )}
                        {'additionalInfo' in metric && metric.additionalInfo && (
                          <p className="text-xs text-gray-500 mt-2">
                            {metric.additionalInfo.label}: {metric.additionalInfo.value}
                          </p>
                        )}
                      </div>
                      {isSelected && (
                        <span className="flex-shrink-0 rounded-full p-1 bg-purple-500 text-white">
                          <Check className="h-4 w-4" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleAddMetric} 
            disabled={!selectedMetric}
            className={!selectedMetric ? 'opacity-50 cursor-not-allowed' : ''}
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar ao Painel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};