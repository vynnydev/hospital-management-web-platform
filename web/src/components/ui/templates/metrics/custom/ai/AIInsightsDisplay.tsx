/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/organisms/card';
import { 
  Lightbulb, 
  AlertTriangle, 
  Activity, 
  Filter, 
  RefreshCw, 
  Clock, 
  TrendingUp,
  List,
  Grid,
  Zap,
  User,
  Bed,
  Shield,
  Clipboard,
  Settings,
  Truck,
  DollarSign,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/organisms/button';
import { Badge } from '@/components/ui/organisms/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/organisms/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/organisms/select';
import { Spinner } from '@/components/ui/organisms/spinner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/organisms/tooltip';
import { IInsight, TInsightCategory, TInsightSeverity, useAIInsights } from '@/services/hooks/AI/ai-analytics/useAIInsights';

interface AIInsightsDisplayProps {
  hospitalId?: string;
  onClose?: () => void;
  compact?: boolean;
}

export const AIInsightsDisplay: React.FC<AIInsightsDisplayProps> = ({
  hospitalId,
  onClose,
  compact = false
}) => {
  // Estados para filtragem
  const [category, setCategory] = useState<TInsightCategory | undefined>(undefined);
  const [severity, setSeverity] = useState<TInsightSeverity | undefined>(undefined);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  
  // Usar o hook personalizado
  const { 
    insights, 
    metadata, 
    loading, 
    error, 
    getCriticalInsights,
    refreshInsights
  } = useAIInsights(hospitalId, category, severity);
  
  // Função para obter ícone baseado na categoria
  const getCategoryIcon = (category: TInsightCategory) => {
    switch (category) {
      case 'occupancy':
        return <Bed className="h-5 w-5" />;
      case 'staff':
        return <User className="h-5 w-5" />;
      case 'equipment':
        return <Shield className="h-5 w-5" />;
      case 'clinical':
        return <Clipboard className="h-5 w-5" />;
      case 'operational':
        return <Settings className="h-5 w-5" />;
      case 'ambulance':
        return <Truck className="h-5 w-5" />;
      case 'financial':
        return <DollarSign className="h-5 w-5" />;
      case 'supply':
        return <Truck className="h-5 w-5" />;
      default:
        return <Lightbulb className="h-5 w-5" />;
    }
  };
  
  // Função para obter cor baseada na severidade
  const getSeverityColor = (severity: TInsightSeverity) => {
    switch (severity) {
      case 'high':
        return {
          bg: 'bg-red-900/20',
          border: 'border-red-800',
          text: 'text-red-400',
          icon: <AlertTriangle className="h-5 w-5 text-red-500" />
        };
      case 'medium':
        return {
          bg: 'bg-amber-900/20',
          border: 'border-amber-800',
          text: 'text-amber-400',
          icon: <Activity className="h-5 w-5 text-amber-500" />
        };
      default:
        return {
          bg: 'bg-blue-900/20',
          border: 'border-blue-800',
          text: 'text-blue-400',
          icon: <Lightbulb className="h-5 w-5 text-blue-500" />
        };
    }
  };
  
  // Função para formatar a data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Renderizar card para cada insight
  const renderInsightCard = (insight: IInsight, index: number) => {
    const colors = getSeverityColor(insight.severity);
    const categoryIcon = getCategoryIcon(insight.category);
    
    return (
      <Card 
        key={insight.id || index}
        className={`${colors.bg} border ${colors.border} hover:shadow-md transition-shadow`}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex-shrink-0">
              {colors.icon}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className={`font-medium ${colors.text}`}>{insight.title}</h3>
                <Badge variant="outline" className="text-xs bg-gray-900/50 border-gray-700">
                  {insight.category}
                </Badge>
              </div>
              
              <p className="text-sm text-gray-300 mt-1 mb-2">{insight.description}</p>
              
              {'timeframe' in insight && insight.timeframe && (
                <div className="flex items-center text-xs text-gray-400 mb-2">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>Previsão para: {insight.timeframe}</span>
                </div>
              )}
              
              {'affectedDepartments' in insight && insight.affectedDepartments && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {insight.affectedDepartments.map((dept, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {dept}
                    </Badge>
                  ))}
                </div>
              )}
              
              {'affectedHospitals' in insight && insight.affectedHospitals && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {insight.affectedHospitals.map((hospital, i) => (
                    <Badge key={i} variant="outline" className="text-xs bg-gray-800 border-gray-700">
                      {hospital.replace('RD4H-', '')}
                    </Badge>
                  ))}
                </div>
              )}
              
              {!compact && (
                <div className="mt-3">
                  <p className="text-xs text-gray-400 mb-1">Ações sugeridas:</p>
                  <ul className="list-disc list-inside text-xs text-gray-300 space-y-1">
                    {insight.suggestedActions.map((action, i) => (
                      <li key={i}>{action}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="flex justify-between items-center mt-3 text-xs text-gray-400">
                <div className="flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>{(insight.confidence * 100).toFixed(0)}% confiança</span>
                </div>
                <div>{formatDate(insight.timestamp)}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  // Renderizar visualização do grid
  const renderGrid = (insightsList: IInsight[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {insightsList.map((insight, index) => renderInsightCard(insight, index))}
    </div>
  );
  
  // Renderizar visualização da lista
  const renderList = (insightsList: IInsight[]) => (
    <div className="space-y-3">
      {insightsList.map((insight, index) => renderInsightCard(insight, index))}
    </div>
  );
  
  // Conteúdo principal para o caso de carregamento
  if (loading) {
    return (
      <Card className="bg-gradient-to-r from-gray-900 to-blue-900/30 border-blue-800/50 p-4">
        <div className="flex flex-col items-center justify-center py-8">
          <Spinner size="lg" className="text-blue-500 mb-4" />
          <p className="text-gray-400">Carregando insights da IA...</p>
        </div>
      </Card>
    );
  }
  
  // Conteúdo principal para o caso de erro
  if (error) {
    return (
      <Card className="bg-gradient-to-r from-gray-900 to-red-900/30 border-red-800/50 p-4">
        <div className="flex flex-col items-center justify-center py-8">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
          <p className="text-red-400 mb-2">Erro ao carregar insights</p>
          <p className="text-gray-400 text-sm mb-4">{error}</p>
          <Button 
            variant="outline" 
            onClick={refreshInsights}
            className="bg-gray-800 border-gray-700"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Tentar novamente
          </Button>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="bg-gradient-to-r from-gray-900 to-blue-900/30 border-blue-800/50 p-4 relative">
      {/* Botão de fechar, se a função onClose for fornecida */}
      {onClose && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-2 top-2 h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-800/50"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-full bg-blue-900/50 border border-blue-700">
          <Lightbulb className="h-5 w-5 text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-white">Insights da IA</h3>
          <p className="text-sm text-gray-400">
            {metadata ? `Última atualização: ${formatDate(metadata.lastUpdated)}` : 'Análise automática baseada em dados recentes do hospital'}
          </p>
        </div>
      </div>
      
      {/* Filtros e controles */}
      <div className="flex flex-wrap justify-between items-center gap-2 mb-4 bg-gray-800/50 p-3 rounded-md border border-gray-700">
        <div className="flex flex-wrap gap-2">
          <Select 
            value={category} 
            onValueChange={(value) => setCategory(value as TInsightCategory || undefined)}
          >
            <SelectTrigger className="w-36 bg-gray-800 border-gray-700">
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2 text-gray-400" />
                <SelectValue placeholder="Categoria" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="">Todas</SelectItem>
              <SelectItem value="occupancy">Ocupação</SelectItem>
              <SelectItem value="staff">Equipes</SelectItem>
              <SelectItem value="equipment">Equipamentos</SelectItem>
              <SelectItem value="clinical">Clínico</SelectItem>
              <SelectItem value="operational">Operacional</SelectItem>
              <SelectItem value="ambulance">Ambulância</SelectItem>
              <SelectItem value="financial">Financeiro</SelectItem>
              <SelectItem value="supply">Suprimentos</SelectItem>
            </SelectContent>
          </Select>
          
          <Select 
            value={severity} 
            onValueChange={(value) => setSeverity(value as TInsightSeverity || undefined)}
          >
            <SelectTrigger className="w-36 bg-gray-800 border-gray-700">
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 text-gray-400" />
                <SelectValue placeholder="Severidade" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="">Todas</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="medium">Média</SelectItem>
              <SelectItem value="low">Baixa</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline" 
                  size="icon"
                  className={`h-9 w-9 bg-gray-800 border-gray-700 ${viewMode === 'list' ? 'text-blue-400' : 'text-gray-400'}`}
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Visualização em lista</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline" 
                  size="icon"
                  className={`h-9 w-9 bg-gray-800 border-gray-700 ${viewMode === 'grid' ? 'text-blue-400' : 'text-gray-400'}`}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Visualização em grade</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline" 
                  size="icon"
                  className="h-9 w-9 bg-gray-800 border-gray-700 text-gray-400"
                  onClick={refreshInsights}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Atualizar insights</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      {/* Tabs para categorias de insights */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-gray-800 border border-gray-700 p-1 mb-4">
          <TabsTrigger value="all">
            Todos
            <Badge variant="secondary" className="ml-1.5 px-1.5 py-0 text-xs">
              {insights.allInsights.length}
            </Badge>
          </TabsTrigger>
          
          <TabsTrigger value="systemWide">
            Sistema
            {insights.systemWide.length > 0 && (
              <Badge variant="secondary" className="ml-1.5 px-1.5 py-0 text-xs">
                {insights.systemWide.length}
              </Badge>
            )}
          </TabsTrigger>
          
          <TabsTrigger value="hospitalSpecific">
            Hospital
            {insights.hospitalSpecific.length > 0 && (
              <Badge variant="secondary" className="ml-1.5 px-1.5 py-0 text-xs">
                {insights.hospitalSpecific.length}
              </Badge>
            )}
          </TabsTrigger>
          
          <TabsTrigger value="predictive">
            Preditivos
            {insights.predictive.length > 0 && (
              <Badge variant="secondary" className="ml-1.5 px-1.5 py-0 text-xs">
                {insights.predictive.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          {insights.allInsights.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Lightbulb className="h-12 w-12 text-gray-600 mb-4" />
              <p className="text-gray-400 mb-2">Nenhum insight encontrado</p>
              <p className="text-gray-500 text-sm mb-4">Tente ajustar os filtros ou atualizar os dados</p>
            </div>
          ) : (
            viewMode === 'grid' ? renderGrid(insights.allInsights) : renderList(insights.allInsights)
          )}
        </TabsContent>
        
        <TabsContent value="systemWide" className="mt-0">
          {insights.systemWide.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Lightbulb className="h-12 w-12 text-gray-600 mb-4" />
              <p className="text-gray-400 mb-2">Nenhum insight de sistema encontrado</p>
              <p className="text-gray-500 text-sm mb-4">Tente ajustar os filtros ou atualizar os dados</p>
            </div>
          ) : (
            viewMode === 'grid' ? renderGrid(insights.systemWide) : renderList(insights.systemWide)
          )}
        </TabsContent>
        
        <TabsContent value="hospitalSpecific" className="mt-0">
          {insights.hospitalSpecific.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Lightbulb className="h-12 w-12 text-gray-600 mb-4" />
              <p className="text-gray-400 mb-2">Nenhum insight específico de hospital encontrado</p>
              <p className="text-gray-500 text-sm mb-4">{hospitalId ? `Não há insights disponíveis para ${hospitalId}` : 'Selecione um hospital específico para ver insights detalhados'}</p>
            </div>
          ) : (
            viewMode === 'grid' ? renderGrid(insights.hospitalSpecific) : renderList(insights.hospitalSpecific)
          )}
        </TabsContent>
        
        <TabsContent value="predictive" className="mt-0">
          {insights.predictive.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Lightbulb className="h-12 w-12 text-gray-600 mb-4" />
              <p className="text-gray-400 mb-2">Nenhuma previsão encontrada</p>
              <p className="text-gray-500 text-sm mb-4">Tente ajustar os filtros ou atualizar os dados</p>
            </div>
          ) : (
            viewMode === 'grid' ? renderGrid(insights.predictive) : renderList(insights.predictive)
          )}
        </TabsContent>
      </Tabs>
      
      {/* Resumo de insights e metadados */}
      {metadata && !compact && (
        <div className="mt-6 pt-4 border-t border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-blue-500" />
            <h4 className="text-sm font-medium text-gray-300">Estatísticas de Insights</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800/60 rounded-md p-3 border border-gray-700">
              <p className="text-xs text-gray-400 mb-1">Por Severidade</p>
              <div className="flex justify-between text-sm">
                <span className="text-red-400">Alta: {metadata.insightCount.bySeverity.high || 0}</span>
                <span className="text-amber-400">Média: {metadata.insightCount.bySeverity.medium || 0}</span>
                <span className="text-blue-400">Baixa: {metadata.insightCount.bySeverity.low || 0}</span>
              </div>
            </div>
            
            <div className="bg-gray-800/60 rounded-md p-3 border border-gray-700">
              <p className="text-xs text-gray-400 mb-1">Total de Insights</p>
              <div className="text-lg font-semibold text-white">{metadata.insightCount.total}</div>
            </div>
            
            <div className="bg-gray-800/60 rounded-md p-3 border border-gray-700">
              <p className="text-xs text-gray-400 mb-1">Motor de IA</p>
              <div className="text-sm text-gray-300">{metadata.insightEngine}</div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};