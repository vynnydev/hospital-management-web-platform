/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/organisms/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/organisms/tabs';
import { Brain, Layers, MessageSquare, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/organisms/button';

// Importações de componentes
import { ChatSection } from './ChatSection';
import { AILibrary } from './AILibrary';
import { MetricForm } from '@/components/ui/templates/hospital-metrics/MetricForm';
import { MetricsManagementSection } from '@/components/ui/templates/metrics/MetricsManagementSection';

// Importações de hooks e tipos
import { useMetrics } from '@/hooks/hospital-metrics/useMetrics';
import { useNetworkData } from '@/hooks/network-hospital/useNetworkData';
import { ICreateMetricPayload, TMetric } from '@/types/hospital-metrics';
import { MetricsDashboard } from '@/components/ui/templates/metrics/custom/ai/MetricsDashboard';
import { useAIInsights } from '@/hooks/AI/ai-analytics/useAIInsights';

/**
 * Componente principal da aba IA Generativa
 * Gerencia o estado global e a navegação entre as diferentes seções
 */
export const AIGenerativeTab: React.FC = () => {
  // Estado para o modo de visualização
  const [activeTab, setActiveTab] = useState('ai');
  const [isDashboardView, setIsDashboardView] = useState(false);
  const [isMetricFormOpen, setIsMetricFormOpen] = useState(false);
  
  // Estado para prévia da métrica a ser gerada pela IA
  const [previewMetric, setPreviewMetric] = useState<ICreateMetricPayload>({
    title: 'Taxa de Ocupação UTI',
    subtitle: 'Ocupação atual dos leitos',
    description: 'Métrica gerada pela IA para monitorar a ocupação da UTI em tempo real',
    type: 'main',
    cardType: 'critical-hospital',
    additionalInfo: {
      label: 'Taxa Atual',
      value: '87%'
    }
  });
  
  // Obter dados da rede hospitalar e insights
  const { networkData, currentUser } = useNetworkData();
  const { insights, loading: insightsLoading, getCriticalInsights } = useAIInsights(currentUser?.hospitalId);
  
  // Hook para gerenciar métricas
  const { 
    metrics, 
    addMetric, 
    isLoading: metricsLoading, 
    error: metricsError, 
    addToPanel 
  } = useMetrics();

  // Alternância entre visão de chat e dashboard
  const toggleDashboardView = () => {
    setIsDashboardView(prev => !prev);
  };
  
  // Criar métrica gerada pela IA
  const handleCreateAIMetric = async (metricData: ICreateMetricPayload) => {
    try {
      const newMetric = await addMetric({
        ...metricData,
        createdBy: 'ai'
      });
      
      if (newMetric) {
        await addToPanel(newMetric);
        return newMetric;
      }
      return null;
    } catch (error) {
      console.error('Erro ao criar métrica via IA:', error);
      return null;
    }
  };
  
  // Criar métrica manualmente
  const handleCreateManualMetric = async (formData: ICreateMetricPayload) => {
    try {
      const newMetric = await addMetric({
        ...formData,
        createdBy: 'manual'
      });
      
      if (newMetric) {
        await addToPanel(newMetric);
        setTimeout(() => {
          setIsDashboardView(true);
        }, 500);
        return newMetric;
      }
      return null;
    } catch (error) {
      console.error('Erro ao criar métrica manual:', error);
      return null;
    }
  };
  
  // Adicionar métrica ao painel
  const handleAddMetricToPanel = async (metric: TMetric) => {
    const success = await addToPanel(metric);
    
    if (success) {
      setTimeout(() => {
        setIsDashboardView(true);
      }, 500);
      return true;
    }
    return false;
  };
  
  // Atualizar a métrica de prévia com base no prompt
  const updatePreviewMetric = (promptText: string) => {
    const prompt = promptText.toLowerCase();
    const newMetricPreview = { ...previewMetric };
    
    // Análise simples do texto do prompt para gerar uma prévia mais relevante
    if (prompt.includes('uti') || prompt.includes('unidade de terapia intensiva')) {
      newMetricPreview.title = 'Taxa de Ocupação UTI';
      newMetricPreview.subtitle = 'Ocupação atual dos leitos';
      newMetricPreview.cardType = 'critical-hospital';
      newMetricPreview.additionalInfo = {
        label: 'Taxa Atual',
        value: '87%'
      }
    } else if (prompt.includes('espera') || prompt.includes('tempo')) {
      newMetricPreview.title = 'Tempo de Espera';
      newMetricPreview.subtitle = 'Tempo médio de atendimento';
      newMetricPreview.cardType = 'waiting';
      newMetricPreview.additionalInfo = {
        label: 'Média Atual',
        value: '4.2h'
      }
    } else if (prompt.includes('equipe') || prompt.includes('staff') || prompt.includes('funcionário')) {
      newMetricPreview.title = 'Déficit de Equipes';
      newMetricPreview.subtitle = 'Dificuldade nas Equipes';
      newMetricPreview.cardType = 'staff';
      newMetricPreview.additionalInfo = {
        label: 'Equipes em Alerta',
        value: '3 de 8 equipes'
      }
    } else if (prompt.includes('higien') || prompt.includes('limpeza') || prompt.includes('equip')) {
      newMetricPreview.title = 'Higienização de Equipamentos';
      newMetricPreview.subtitle = 'Higienização Geral';
      newMetricPreview.cardType = 'maintenance';
      newMetricPreview.additionalInfo = {
        label: 'Equipamentos',
        value: '2'
      }
    } else if (prompt.includes('giro') || prompt.includes('rotatividade') || prompt.includes('leito')) {
      newMetricPreview.title = 'Taxa de Giro';
      newMetricPreview.subtitle = 'Rotatividade de Leitos';
      newMetricPreview.cardType = 'rotation';
      newMetricPreview.additionalInfo = {
        label: 'Média Atual',
        value: '4.2'
      };
    } else if (prompt.includes('burnout') || prompt.includes('estresse') || prompt.includes('risco')) {
      newMetricPreview.title = 'Risco de Burnout';
      newMetricPreview.subtitle = 'Nível de Estresse';
      newMetricPreview.cardType = 'staff';
      newMetricPreview.additionalInfo = {
        label: 'Nível',
        value: '4.5'
      }
    }
    
    setPreviewMetric(newMetricPreview);
    return newMetricPreview;
  }

  return (
    <div className="h-full w-full overflow-auto p-4 bg-gray-900">
      {/* Botão de alternância de visualização */}
      <div className="flex justify-end mb-4">
        <Button
          variant="outline"
          className={`
            flex items-center gap-2 
            ${isDashboardView ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700'}
          `}
          onClick={toggleDashboardView}
        >
          {isDashboardView ? (
            <>
              <MessageSquare className="h-4 w-4" />
              <span>Voltar ao Chat</span>
            </>
          ) : (
            <>
              <BarChart2 className="h-4 w-4" />
              <span>Ver Dashboard</span>
            </>
          )}
        </Button>
      </div>
      
      {/* Visualização principal: Dashboard ou Área de Chat */}
      {isDashboardView ? (
        <MetricsDashboard 
          networkData={networkData}
          metrics={metrics}
          onAddMetric={() => setIsDashboardView(false)}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Coluna principal: Chat e Gerenciamento */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="border-gray-800 bg-gray-900">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Brain className="h-5 w-5 text-purple-500" />
                      Assistente IA Generativa
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Gere configurações personalizadas através de diálogo interativo
                    </CardDescription>
                  </div>
                  
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="bg-gray-800">
                      <TabsTrigger 
                        value="ai"
                        className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                      >
                        <Brain className="h-4 w-4 mr-2" />
                        IA Generativa
                      </TabsTrigger>
                      <TabsTrigger 
                        value="manual"
                        className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                      >
                        <Layers className="h-4 w-4 mr-2" />
                        Gerenciar Métricas
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {activeTab === 'ai' ? (
                  <ChatSection 
                    previewMetric={previewMetric}
                    updatePreviewMetric={updatePreviewMetric}
                    onCreateMetric={handleCreateAIMetric}
                    onShowDashboard={() => setIsDashboardView(true)}
                    onOpenMetricForm={() => setIsMetricFormOpen(true)}
                    insights={insights?.allInsights || []}
                    insightsLoading={insightsLoading}
                  />
                ) : (
                  <MetricsManagementSection 
                    metrics={metrics}
                    onAddMetricToPanel={handleAddMetricToPanel}
                    onOpenMetricForm={() => setIsMetricFormOpen(true)}
                  />
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Coluna lateral: Biblioteca de sugestões e histórico */}
          <AILibrary 
            onHistoryItemSelect={(item) => console.log('Item selecionado:', item)}
            onPromptSelect={(prompt) => console.log('Prompt selecionado:', prompt)}
            onShowAllPrompts={() => console.log('Mostrar todos os prompts')}
          />
        </div>
      )}
      
      {/* Modal de formulário para métrica */}
      <MetricForm
        isOpen={isMetricFormOpen}
        onClose={() => setIsMetricFormOpen(false)}
        onSubmit={handleCreateManualMetric}
        editingMetric={null}
        initialData={activeTab === 'ai' ? previewMetric : undefined}
        title={activeTab === 'ai' ? 'Ajustar Métrica Gerada' : 'Nova Métrica'}
      />
    </div>
  );
};