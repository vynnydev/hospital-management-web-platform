/* eslint-disable @typescript-eslint/no-unused-vars */
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
  Plus, 
  BarChart3,
  Save,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/organisms/button';
import { INetworkData } from '@/types/hospital-network-types';
import { Card } from '@/components/ui/organisms/card';
import { IMetric, IMetricCard } from '@/types/custom-metrics';
import { AlertsSection } from './AlertsSection';
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
  const [editingMetric, setEditingMetric] = useState<IMetricCard | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedSubtitle, setEditedSubtitle] = useState('');

  // Estado para o título da seção de métricas operacionais
  const [metricsTitle, setMetricsTitle] = useState('Métricas Operacionais');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedSectionTitle, setEditedSectionTitle] = useState('');

  // Estado para armazenar as métricas do dashboard
  const [selectedMetrics, setSelectedMetrics] = useState<IMetricCard[]>([]);
  const [availableMetrics, setAvailableMetrics] = useState<IMetric[]>([]);
  
  // Valores estatísticos atuais para uso nos cards
  const [currentStats, setCurrentStats] = useState({
    totalPatients: 45,
    totalBeds: 60
  });

  // Função para carregar as métricas do backend
  const loadMetrics = useCallback(async () => {
    try {
      setIsRefreshing(true);
      
      // Simula uma chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Calcular alguns valores baseados nos dados da rede
      const totalPatients = networkData?.hospitals.reduce((acc, hospital) => 
        acc + (hospital.metrics?.overall?.totalPatients || 0), 0) || 45;
        
      const totalBeds = networkData?.hospitals.reduce((acc, hospital) => 
        acc + (hospital.metrics?.overall?.totalBeds || 0), 0) || 60;
      
      setCurrentStats({
        totalPatients,
        totalBeds
      });
      
      // Métricas para exibição no dashboard
      const metricsData: IMetric[] = [
        {
          id: 'hospital-critico',
          title: "Hospital Crítico",
          value: networkData?.hospitals[0]?.name || 'Hospital 4Health - Itaim',
          subtitle: "Maior Ocupação",
          trend: 2.5,
          color: "red",
          cardType: "hospital-critico",
          icon: ({ className, ...props }) => (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
              <path d="M10 8V6a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2v-2"></path>
              <path d="M19 12H5l7 7-7-7 7-7z"></path>
            </svg>
          ),
          valueSize: 'small',
          additionalInfo: {
            label: "Taxa de Ocupação",
            value: `${networkData?.hospitals[0]?.metrics?.overall?.occupancyRate?.toFixed(1) || '89.5'}%`
          }
        },
        {
          id: 'risco-burnout',
          title: "Risco de Burnout",
          value: "4.5",
          subtitle: "Nível de Estresse",
          trend: 1.8,
          target: 5.0,
          color: "orange",
          cardType: "burnout",
          icon: ({ className, ...props }) => (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          ),
          additionalInfo: {
            label: "Equipes em Alerta",
            value: "3 de 8 equipes"
          }
        },
        {
          id: 'manutencao',
          title: "Manutenção",
          value: "12",
          subtitle: "Leitos em Manutenção",
          trend: -0.5,
          color: "blue",
          cardType: "manutencao",
          icon: ({ className, ...props }) => (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          ),
          additionalInfo: {
            label: "Previsão de Conclusão",
            value: "7 dias"
          }
        },
        {
          id: 'taxa-giro',
          title: "Taxa de Giro",
          value: "4.2",
          subtitle: "Rotatividade de Leitos",
          trend: 1.2,
          target: 8.0,
          color: "cyan",
          cardType: "taxa-giro",
          icon: ({ className, ...props }) => (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
              <path d="M20 8a6 6 0 0 0-8.5-3.5"></path>
              <path d="M12 16v-4h4"></path>
              <path d="M3 12a9 9 0 1 0 15-6.7L12 12"></path>
            </svg>
          ),
          additionalInfo: {
            label: "Média do Setor",
            value: "4.8 pacientes/leito"
          }
        },
        {
          id: 'eficiencia',
          title: "Eficiência Operacional",
          value: "85%",
          subtitle: "Performance Geral",
          trend: 3.2,
          target: 90,
          color: "emerald",
          cardType: "eficiencia",
          icon: ({ className, ...props }) => (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
              <polyline points="16 7 22 7 22 13"></polyline>
            </svg>
          ),
          additionalInfo: {
            label: "Ranking na Rede",
            value: "#2 de 3 hospitais"
          }
        },
        {
          id: 'ocupacao',
          title: "Ocupação Média",
          value: "78.5%",
          subtitle: "Taxa de Ocupação",
          trend: 2.3,
          target: 85,
          color: "violet",
          cardType: "ocupacao",
          icon: ({ className, ...props }) => (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          ),
          additionalInfo: {
            label: "Leitos Ocupados",
            value: `${currentStats.totalPatients}/${currentStats.totalBeds}`
          }
        },
        {
          id: 'variacao',
          title: "Variação de Pacientes",
          value: "12.3%",
          subtitle: "Entre Departamentos",
          trend: -1.5,
          target: 15,
          color: "fuchsia",
          cardType: "variacao",
          icon: ({ className, ...props }) => (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          ),
          additionalInfo: {
            label: "Maior Diferença",
            value: "UTI vs. Enfermaria"
          }
        },
        {
          id: 'treinamento',
          title: "Treinamento Profissional",
          value: "92%",
          subtitle: "Capacitação da Equipe",
          trend: 4.2,
          target: 95,
          color: "teal",
          cardType: "treinamento",
          icon: ({ className, ...props }) => (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
              <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
            </svg>
          ),
          additionalInfo: {
            label: "Profissionais Treinados",
            value: "42 este mês"
          }
        }
      ];
      
      // Atualizar o estado com as métricas carregadas
      setAvailableMetrics(metricsData);
      setSelectedMetrics(metricsData);
      
    } catch (error) {
      console.error('Erro ao carregar métricas:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [networkData, currentStats.totalPatients, currentStats.totalBeds]);

  // Carregar métricas quando o componente for montado
  useEffect(() => {
    loadMetrics();
  }, [loadMetrics]);

  // Função para adicionar uma métrica ao dashboard
  const handleAddMetric = (metric: IMetricCard) => {
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pt-4">
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
            {/* Seção de alertas */}
            <AlertsSection 
              networkData={networkData}
              isEditing={isEditing}
            />
            
            {/* Seção de métricas operacionais */}
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
                    <BarChart3 className="h-5 w-5 text-blue-500" />
                    {metricsTitle}
                    {isEditing && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-gray-400 hover:text-white hover:bg-gray-800 h-6 w-6 p-0 ml-2"
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
                  </div>
                )}
              </div>
              
              {/* Componente de métricas operacionais com cards editáveis */}
              <AdditionalMetricsSection 
                metrics={selectedMetrics}
                isEditing={isEditing}
                onEditMetric={handleEditMetric}
                onRemoveMetric={handleRemoveMetric}
                currentMetrics={currentStats}
              />
            </div>
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
                additionalMetrics={availableMetrics}
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