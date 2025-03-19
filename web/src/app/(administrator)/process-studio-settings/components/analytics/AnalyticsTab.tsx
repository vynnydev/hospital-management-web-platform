/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from 'react';
import { 
  TabsContent 
} from '@/components/ui/organisms/tabs';
import { 
  Edit, 
  RefreshCw, 
  Maximize2, 
  LayoutDashboard, 
  Activity, 
  Plus, 
  Move,
  BarChart,
  Save,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/organisms/button';
import { INetworkData } from '@/types/hospital-network-types';
import { Card } from '@/components/ui/organisms/card';
import { IAlertMetrics, IMetric, TCardType } from '@/types/custom-metrics';
import { AlertsSection } from './AlertsSection';
import { MetricsDashboard } from './metrics/MetricsDashboard';
import { MetricCategoriesSidebar } from './metrics/MetricCategoriesSidebar';
import { CreateMetricPanel } from './metrics/CreateMetricPanel';
import { MetricsGrid } from './metrics/MetricsGrid';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/organisms/dialog';
import { Input } from '@/components/ui/organisms/input';
import { Badge } from '@/components/ui/organisms/badge';
import { AdditionalMetricsSection } from './metrics/AdditionalMetricsSection';

interface IEnhancedAnalyticsTabProps {
  networkData: INetworkData | null;
}

export const AnalyticsTab: React.FC<IEnhancedAnalyticsTabProps> = ({ 
  networkData 
}) => {
  // Estados para gerenciar o modo de visualização e edição
  const [viewMode, setViewMode] = useState<'dashboard' | 'create'>('dashboard');
  const [isEditing, setIsEditing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Estados para modal de edição de métrica
  const [editingMetric, setEditingMetric] = useState<IMetric | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedSubtitle, setEditedSubtitle] = useState('');

  // Estado para armazenar as métricas principais e adicionais
  const [mainMetrics, setMainMetrics] = useState<IAlertMetrics>({
    hospitalWithHighestOccupancy: null,
    hospitalsBelowStaffingNorms: 1,
    equipmentMaintenanceAlerts: 2,
    emergencyRoomWaitingTime: 0.0
  });

  // Métricas adicionais que podem ser adicionadas ao dashboard
  const [additionalMetrics, setAdditionalMetrics] = useState<IMetric[]>([]);

  // Métricas selecionadas para exibição no dashboard
  const [selectedMetrics, setSelectedMetrics] = useState<IMetric[]>([]);
  
  // Estado para controlar o título da seção de métricas operacionais
  const [metricsTitle, setMetricsTitle] = useState('Métricas Operacionais');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedSectionTitle, setEditedSectionTitle] = useState('');

  // Função para carregar as métricas do backend
  const loadMetrics = useCallback(async () => {
    try {
      setIsRefreshing(true);
      
      // Simula uma chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Atualiza métricas principais (alertas)
      const alertMetrics: IAlertMetrics = {
        hospitalWithHighestOccupancy: networkData?.hospitals[0] || null,
        hospitalsBelowStaffingNorms: 1,
        equipmentMaintenanceAlerts: 2,
        emergencyRoomWaitingTime: 0.0
      };
      
      // Atualiza métricas adicionais
      const additionalMetricsData: IMetric[] = [
        {
          id: 'taxa-ocupacao',
          title: "Taxa de Ocupação",
          value: "78.4%",
          subtitle: "Meta: 85%",
          trend: 2.3,
          color: "blue",
          cardType: "gauge" as TCardType,
          icon: Activity,
          chartData: [
            { date: '2025-03-12', value: 76.2 },
            { date: '2025-03-13', value: 75.8 },
            { date: '2025-03-14', value: 77.1 },
            { date: '2025-03-15', value: 77.9 },
            { date: '2025-03-16', value: 78.4 },
            { date: '2025-03-17', value: 78.6 },
            { date: '2025-03-18', value: 78.4 }
          ],
          position: { x: 0, y: 0, w: 6, h: 4 },
          chartType: 'gauge',
          config: {
            target: 85,
            warning: 90,
            critical: 95
          }
        },
        {
          id: 'tempo-permanencia',
          title: "Tempo Médio de Permanência",
          value: "4.7",
          subtitle: "Em dias",
          trend: -0.3,
          color: "purple",
          cardType: "line" as TCardType,
          icon: Activity,
          chartData: [
            { date: '2025-03-12', value: 5.1 },
            { date: '2025-03-13', value: 5.0 },
            { date: '2025-03-14', value: 4.9 },
            { date: '2025-03-15', value: 4.7 },
            { date: '2025-03-16', value: 4.8 },
            { date: '2025-03-17', value: 4.7 },
            { date: '2025-03-18', value: 4.7 }
          ],
          position: { x: 6, y: 0, w: 6, h: 4 },
          chartType: 'line'
        },
        // Adicionando mais métricas com base no que você forneceu
        {
          id: 'risco-burnout',
          title: "Risco de Burnout",
          value: "7.8",
          subtitle: "Nível de Estresse",
          trend: 1.8,
          target: 5.0,
          color: "orange",
          cardType: "burnout" as TCardType,
          icon: Activity,
          additionalInfo: {
            label: "Equipes em Alerta",
            value: "3 de 8 equipes"
          },
          position: { x: 0, y: 4, w: 4, h: 4 },
          chartType: 'gauge',
          config: {
            target: 5,
            warning: 7,
            critical: 8
          }
        },
        {
          id: 'manutencao',
          title: "Manutenção",
          value: "12",
          subtitle: "Leitos em Manutenção",
          trend: -0.5,
          color: "blue",
          cardType: "manutencao" as TCardType,
          icon: Activity,
          additionalInfo: {
            label: "Previsão de Conclusão",
            value: "7 dias"
          },
          position: { x: 4, y: 4, w: 4, h: 4 },
          chartType: 'bar'
        },
        {
          id: 'taxa-giro',
          title: "Taxa de Giro",
          value: "6.2",
          subtitle: "Rotatividade de Leitos",
          trend: 1.2,
          target: 8.0,
          color: "cyan",
          cardType: "taxa-giro" as TCardType,
          icon: Activity,
          additionalInfo: {
            label: "Média do Setor",
            value: "4.8 pacientes/leito"
          },
          position: { x: 8, y: 4, w: 4, h: 4 },
          chartType: 'line'
        }
      ];
      
      setMainMetrics(alertMetrics);
      setAdditionalMetrics(additionalMetricsData);
      setSelectedMetrics(additionalMetricsData);
      
    } catch (error) {
      console.error('Erro ao carregar métricas:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [networkData]);

  // Carregar métricas quando o componente for montado
  useEffect(() => {
    loadMetrics();
  }, [loadMetrics]);

  // Função para adicionar uma métrica ao dashboard
  const handleAddMetric = (metric: IMetric) => {
    setSelectedMetrics(prev => {
      // Verificar se a métrica já existe
      const exists = prev.some(m => m.id === metric.id);
      if (exists) return prev;
      
      // Adicionar ao final
      return [...prev, metric];
    });
  };

  // Função para remover uma métrica do dashboard
  const handleRemoveMetric = (metricId: string) => {
    setSelectedMetrics(prev => prev.filter(m => m.id !== metricId));
  };

  // Função para atualizar o layout das métricas
  const handleUpdateLayout = (layout: any[]) => {
    setSelectedMetrics(prev => 
      prev.map(metric => {
        const layoutItem = layout.find(item => item.i === metric.id);
        if (layoutItem) {
          return {
            ...metric,
            position: {
              x: layoutItem.x,
              y: layoutItem.y,
              w: layoutItem.w,
              h: layoutItem.h
            }
          };
        }
        return metric;
      })
    );
  };
  
  // Função para editar uma métrica
  const handleEditMetric = (metricId: string) => {
    const metric = selectedMetrics.find(m => m.id === metricId);
    if (metric) {
      setEditingMetric(metric);
      setEditedTitle(metric.title);
      setEditedSubtitle(metric.subtitle);
      setIsEditModalOpen(true);
    }
  };
  
  // Função para salvar a edição de uma métrica
  const handleSaveMetricEdit = () => {
    if (!editingMetric) return;
    
    setSelectedMetrics(prev => 
      prev.map(metric => 
        metric.id === editingMetric.id
          ? { ...metric, title: editedTitle, subtitle: editedSubtitle }
          : metric
      )
    );
    
    setIsEditModalOpen(false);
    setEditingMetric(null);
  };
  
  // Função para editar o título da seção
  const handleEditSectionTitle = () => {
    setIsEditingTitle(true);
    setEditedSectionTitle(metricsTitle);
  };
  
  // Função para salvar o título da seção
  const handleSaveSectionTitle = () => {
    setMetricsTitle(editedSectionTitle);
    setIsEditingTitle(false);
  };

  return (
    <TabsContent value="analytics" className="space-y-4">
      <div className={isFullscreen ? "fixed inset-0 z-50 bg-gray-950 p-4 overflow-auto" : ""}>
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Painel Analítico</h1>
            <p className="text-gray-400">Visualize e personalize métricas para monitoramento da operação hospitalar</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              onClick={() => setViewMode('dashboard')}
              className={`${viewMode === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'}`}
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => setViewMode('create')}
              className={`${viewMode === 'create' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'}`}
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar Métrica
            </Button>
          </div>
        </div>
        
        {/* Barra de controle */}
        <Card className="bg-gray-900 border-gray-700 p-3 mb-4">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <div className="flex items-center gap-2">
              <Button 
                variant={isEditing ? "default" : "outline"}
                className={isEditing 
                  ? "bg-blue-600 hover:bg-blue-700 text-white border-none" 
                  : "bg-gray-800 border-gray-700 text-gray-300 hover:text-white"}
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit className="h-4 w-4 mr-2" />
                {isEditing ? "Finalizar Edição" : "Editar Dashboard"}
              </Button>
              
              <Button 
                variant="outline" 
                className="bg-gray-800 border-gray-700 text-gray-300 hover:text-white"
                onClick={loadMetrics}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="text-gray-400 text-sm mr-2">
                {selectedMetrics.length} métricas
              </div>
              
              <Button 
                variant="outline" 
                className="bg-gray-800 border-gray-700 text-gray-300 hover:text-white"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
        
        {viewMode === 'dashboard' ? (
          <>
            {/* Seção de alertas - baseados na primeira imagem */}
            <AlertsSection 
              alertMetrics={mainMetrics} 
              isEditing={isEditing}
            />
            
            {/* Seção de métricas adicionais */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                {isEditingTitle ? (
                  <div className="flex gap-2 items-center">
                    <Input 
                      value={editedSectionTitle}
                      onChange={(e) => setEditedSectionTitle(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white w-64"
                    />
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-green-500 hover:text-green-400 hover:bg-gray-800"
                      onClick={handleSaveSectionTitle}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-gray-400 hover:text-gray-300 hover:bg-gray-800"
                      onClick={() => setIsEditingTitle(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <BarChart className="h-5 w-5 text-blue-500" />
                    {metricsTitle}
                    {isEditing && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-gray-400 hover:text-white hover:bg-gray-800 h-6 w-6 p-0"
                        onClick={handleEditSectionTitle}
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </h2>
                )}
                
                {isEditing && (
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-600 text-white">
                      Modo de Edição
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="bg-gray-800 border-gray-700 text-gray-300 hover:text-white flex items-center gap-1"
                    >
                      <Move className="h-3.5 w-3.5" />
                      Arraste para reorganizar
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Componente para mostrar métricas adicionais como cards */}
              <AdditionalMetricsSection 
                metrics={selectedMetrics}
                isEditing={isEditing}
                onEditMetric={handleEditMetric}
                onRemoveMetric={handleRemoveMetric}
              />
            </div>
            
            {/* Dashboard de métricas - baseado na segunda imagem */}
            <MetricsDashboard 
              metrics={selectedMetrics}
              isEditing={isEditing}
              onEditMetric={handleEditMetric}
              onRemoveMetric={handleRemoveMetric}
              onUpdateLayout={handleUpdateLayout}
            />
          </>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Sidebar com categorias de métricas */}
            <MetricCategoriesSidebar 
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
            
            <div className="lg:col-span-3 space-y-4">
              {/* Painel de criação de métrica */}
              <CreateMetricPanel networkData={networkData} />
              
              {/* Grid de métricas disponíveis */}
              <MetricsGrid 
                additionalMetrics={additionalMetrics}
                selectedCategory={selectedCategory}
                onAddMetric={handleAddMetric}
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Modal para editar métrica */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Editar Métrica</DialogTitle>
            <DialogDescription className="text-gray-400">
              Personalize o título e subtítulo da métrica
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Título</label>
              <Input 
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Subtítulo</label>
              <Input 
                value={editedSubtitle}
                onChange={(e) => setEditedSubtitle(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditModalOpen(false)}
              className="bg-gray-800 border-gray-700 text-gray-300 hover:text-white"
            >
              Cancelar
            </Button>
            <Button onClick={handleSaveMetricEdit}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TabsContent>
  );
};