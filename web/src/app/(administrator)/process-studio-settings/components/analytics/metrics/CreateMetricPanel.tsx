/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { 
  Activity,
  FileText,
  Code,
  Gauge,
  CreditCard,
  LineChart,
  BarChart,
  PieChart,
  Plus,
  Database,
  Save,
  Trash2,
  BarChart3,
  Clock,
  Calculator,
  Percent,
  Monitor
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';
import { Input } from '@/components/ui/organisms/input';
import { Textarea } from '@/components/ui/organisms/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/organisms/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/organisms/tabs';
import { Label } from '@/components/ui/organisms/label';
import { Slider } from '@/components/ui/organisms/slider';
import { INetworkData } from '@/types/hospital-network-types';
import { v4 as uuidv4 } from 'uuid';
import { IMetric, TChartType } from '@/types/custom-metrics';
import { Switch } from '@/components/ui/organisms/switch';

interface CreateMetricPanelProps {
    networkData: INetworkData | null;
    onSaveMetric?: (metric: IMetric) => void;
  }
  
  export const CreateMetricPanel: React.FC<CreateMetricPanelProps> = ({
    networkData,
    onSaveMetric
  }) => {
    // Estados para o formulário
    const [metricTitle, setMetricTitle] = useState('Nova Métrica');
    const [metricSubtitle, setMetricSubtitle] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('operational');
    const [selectedChartType, setSelectedChartType] = useState<TChartType>('gauge');
    const [dataSource, setDataSource] = useState('beds');
    const [formula, setFormula] = useState('');
    const [unit, setUnit] = useState('%');
    const [refreshInterval, setRefreshInterval] = useState('hourly');
    const [targetValue, setTargetValue] = useState(85);
    const [warningValue, setWarningValue] = useState(90);
    const [criticalValue, setCriticalValue] = useState(95);
    const [selectedColor, setSelectedColor] = useState('blue');
    
    // Tipos de gráficos disponíveis
    const chartTypes = [
      { type: 'gauge', name: 'Medidor', icon: Gauge, description: 'Visualização de progresso em relação a uma meta' },
      { type: 'line', name: 'Linha', icon: LineChart, description: 'Ideal para tendências ao longo do tempo' },
      { type: 'bar', name: 'Barras', icon: BarChart, description: 'Comparações entre categorias distintas' },
      { type: 'pie', name: 'Pizza', icon: PieChart, description: 'Distribuição proporcional de valores' },
      { type: 'card', name: 'Cartão', icon: CreditCard, description: 'Exibição simples de valor numérico' }
    ];
    
    // Fontes de dados disponíveis
    const dataSources = [
      { id: 'beds', name: 'Leitos', description: 'Ocupação e disponibilidade de leitos' },
      { id: 'patients', name: 'Pacientes', description: 'Dados demográficos e clínicos' },
      { id: 'admissions', name: 'Admissões', description: 'Entrada e saída de pacientes' },
      { id: 'billing', name: 'Faturamento', description: 'Receitas e despesas' },
      { id: 'staff', name: 'Equipe', description: 'Recursos humanos e produtividade' },
      { id: 'infections', name: 'Infecções', description: 'Controle de infecção hospitalar' },
      { id: 'custom', name: 'Personalizado', description: 'Fonte de dados manual' }
    ];
    
    // Cores disponíveis
    const colorOptions = [
      { id: 'blue', name: 'Azul', color: '#3b82f6' },
      { id: 'green', name: 'Verde', color: '#22c55e' },
      { id: 'red', name: 'Vermelho', color: '#ef4444' },
      { id: 'yellow', name: 'Amarelo', color: '#eab308' },
      { id: 'purple', name: 'Roxo', color: '#a855f7' },
      { id: 'indigo', name: 'Índigo', color: '#6366f1' },
      { id: 'pink', name: 'Rosa', color: '#ec4899' },
      { id: 'orange', name: 'Laranja', color: '#f97316' },
      { id: 'teal', name: 'Teal', color: '#14b8a6' },
      { id: 'cyan', name: 'Ciano', color: '#06b6d4' }
    ];
    
    // Função para salvar a métrica
    const handleSaveMetric = () => {
      if (!onSaveMetric) return;
      
      // Criar objeto de métrica
      const newMetric: IMetric = {
        id: uuidv4(),
        title: metricTitle,
        subtitle: metricSubtitle || `Meta: ${targetValue}%`,
        value: 0, // Será atualizado com dados reais
        color: selectedColor,
        cardType: selectedChartType,
        icon: Activity, // Ícone padrão, será mapeado no componente
        position: { x: 0, y: 0, w: 6, h: 4 }, // Posição padrão
        chartType: selectedChartType,
        config: {
          target: targetValue,
          warning: warningValue,
          critical: criticalValue
        },
        chartData: [] // Será atualizado com dados reais
      };
      
      onSaveMetric(newMetric);
      
      // Resetar formulário
      setMetricTitle('Nova Métrica');
      setMetricSubtitle('');
      setFormula('');
    };
    
    return (
      <Card className="bg-gray-900 border-gray-700 shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-800 to-indigo-800 p-5 border-b border-gray-700">
          <CardTitle className="flex items-center gap-2 text-white">
            <BarChart3 className="h-5 w-5 text-white" />
            Criar Nova Métrica
          </CardTitle>
          <CardDescription className="text-blue-200">
            Configure uma métrica personalizada para adicionar ao seu dashboard
          </CardDescription>
        </CardHeader>
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid grid-cols-4 p-1 bg-gray-800 rounded-none border-b border-gray-700">
            <TabsTrigger value="general" className="data-[state=active]:bg-gray-700">
              Geral
            </TabsTrigger>
            <TabsTrigger value="data" className="data-[state=active]:bg-gray-700">
              Dados
            </TabsTrigger>
            <TabsTrigger value="visualization" className="data-[state=active]:bg-gray-700">
              Visualização
            </TabsTrigger>
            <TabsTrigger value="thresholds" className="data-[state=active]:bg-gray-700">
              Limiares
            </TabsTrigger>
          </TabsList>
          
          <CardContent className="p-0">
            <TabsContent value="general" className="p-4 mt-0">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Título da Métrica</Label>
                    <Input 
                      value={metricTitle} 
                      onChange={(e) => setMetricTitle(e.target.value)}
                      placeholder="Ex: Taxa de Ocupação de Leitos"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-gray-300">Subtítulo (opcional)</Label>
                    <Input 
                      value={metricSubtitle}
                      onChange={(e) => setMetricSubtitle(e.target.value)}
                      placeholder="Ex: Leitos ocupados vs. disponíveis"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-gray-300">Categoria</Label>
                  <Select 
                    value={selectedCategory}
                    onValueChange={(value) => setSelectedCategory(value)}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="operational" className="text-white hover:bg-gray-700 focus:bg-gray-700 focus:text-white">
                        Operacionais
                      </SelectItem>
                      <SelectItem value="financial" className="text-white hover:bg-gray-700 focus:bg-gray-700 focus:text-white">
                        Financeiras
                      </SelectItem>
                      <SelectItem value="clinical" className="text-white hover:bg-gray-700 focus:bg-gray-700 focus:text-white">
                        Clínicas
                      </SelectItem>
                      <SelectItem value="satisfaction" className="text-white hover:bg-gray-700 focus:bg-gray-700 focus:text-white">
                        Satisfação
                      </SelectItem>
                      <SelectItem value="hr" className="text-white hover:bg-gray-700 focus:bg-gray-700 focus:text-white">
                        Recursos Humanos
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-gray-300">Cor</Label>
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map(color => (
                      <button
                        key={color.id}
                        type="button"
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          selectedColor === color.id ? 'border-white scale-110' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color.color }}
                        onClick={() => setSelectedColor(color.id)}
                        aria-label={`Cor ${color.name}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="data" className="p-4 mt-0">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300 flex items-center gap-1">
                      <Database className="h-4 w-4 text-blue-500" />
                      Fonte de Dados
                    </Label>
                    <Select 
                      value={dataSource}
                      onValueChange={(value) => setDataSource(value)}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Selecione uma fonte de dados" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {dataSources.map(source => (
                          <SelectItem 
                            key={source.id} 
                            value={source.id}
                            className="text-white hover:bg-gray-700 focus:bg-gray-700 focus:text-white"
                          >
                            <div>
                              <div className="font-medium">{source.name}</div>
                              <div className="text-xs text-gray-400">{source.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
  
                  <div className="space-y-2">
                    <Label className="text-gray-300 flex items-center gap-1">
                      <Clock className="h-4 w-4 text-blue-500" />
                      Intervalo de Atualização
                    </Label>
                    <Select 
                      value={refreshInterval}
                      onValueChange={(value) => setRefreshInterval(value)}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Selecione o intervalo" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="realtime" className="text-white hover:bg-gray-700 focus:bg-gray-700 focus:text-white">
                          Tempo real
                        </SelectItem>
                        <SelectItem value="hourly" className="text-white hover:bg-gray-700 focus:bg-gray-700 focus:text-white">
                          A cada hora
                        </SelectItem>
                        <SelectItem value="daily" className="text-white hover:bg-gray-700 focus:bg-gray-700 focus:text-white">
                          Diário
                        </SelectItem>
                        <SelectItem value="weekly" className="text-white hover:bg-gray-700 focus:bg-gray-700 focus:text-white">
                          Semanal
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
  
                <div className="space-y-2">
                  <Label className="text-gray-300 flex items-center gap-1">
                    <Calculator className="h-4 w-4 text-blue-500" />
                    Fórmula de Cálculo
                  </Label>
                  <Textarea 
                    value={formula}
                    onChange={(e) => setFormula(e.target.value)}
                    placeholder="Ex: (leitos_ocupados / total_leitos) * 100"
                    rows={2}
                    className="bg-gray-800 border-gray-700 text-white resize-none font-mono text-sm"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300 flex items-center gap-1">
                      <Percent className="h-4 w-4 text-blue-500" />
                      Unidade de Medida
                    </Label>
                    <Select 
                      value={unit}
                      onValueChange={(value) => setUnit(value)}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Selecione a unidade" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="%" className="text-white hover:bg-gray-700 focus:bg-gray-700 focus:text-white">
                          Porcentagem (%)
                        </SelectItem>
                        <SelectItem value="R$" className="text-white hover:bg-gray-700 focus:bg-gray-700 focus:text-white">
                          Reais (R$)
                        </SelectItem>
                        <SelectItem value="dias" className="text-white hover:bg-gray-700 focus:bg-gray-700 focus:text-white">
                          Dias
                        </SelectItem>
                        <SelectItem value="horas" className="text-white hover:bg-gray-700 focus:bg-gray-700 focus:text-white">
                          Horas
                        </SelectItem>
                        <SelectItem value="min" className="text-white hover:bg-gray-700 focus:bg-gray-700 focus:text-white">
                          Minutos
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="visualization" className="p-4 mt-0">
              <div className="space-y-4">
                <Label className="text-gray-300">Tipo de Visualização</Label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {chartTypes.map(chart => {
                    const Icon = chart.icon;
                    const isSelected = selectedChartType === chart.type;
                    return (
                      <div 
                        key={chart.type}
                        className={`
                          flex flex-col items-center p-3 rounded-lg cursor-pointer transition-all
                          ${isSelected 
                            ? 'bg-blue-700/30 border-2 border-blue-500' 
                            : 'bg-gray-800 border border-gray-700 hover:border-gray-500'
                          }
                        `}
                        onClick={() => setSelectedChartType(chart.type as TChartType)}
                      >
                        <Icon className={`h-6 w-6 mb-2 ${isSelected ? 'text-blue-400' : 'text-gray-400'}`} />
                        <span className={`text-sm ${isSelected ? 'text-blue-300' : 'text-gray-300'}`}>
                          {chart.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-1 text-xs text-gray-400">
                  {chartTypes.find(c => c.type === selectedChartType)?.description}
                </div>
                
                <div className="space-y-4 mt-6 pt-4 border-t border-gray-700">
                  <h3 className="text-sm font-medium text-gray-300 flex items-center gap-1.5">
                    <Monitor className="h-4 w-4 text-blue-500" />
                    Configurações de Exibição
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between space-x-4 p-3 bg-gray-800 rounded-md">
                      <div className="flex items-center space-x-2">
                        <div className="text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="8" width="18" height="4" rx="1" />
                            <path d="M4 16h16" />
                          </svg>
                        </div>
                        <Label htmlFor="show-grid" className="text-sm text-gray-300">
                          Exibir Grade
                        </Label>
                      </div>
                      <Switch
                        id="show-grid"
                        defaultChecked={true}
                        className="data-[state=checked]:bg-blue-600"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between space-x-4 p-3 bg-gray-800 rounded-md">
                      <div className="flex items-center space-x-2">
                        <div className="text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M12 6v6l4 2"/>
                          </svg>
                        </div>
                        <Label htmlFor="show-history" className="text-sm text-gray-300">
                          Exibir Histórico
                        </Label>
                      </div>
                      <Switch
                        id="show-history"
                        defaultChecked={true}
                        className="data-[state=checked]:bg-blue-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="thresholds" className="p-4 mt-0">
              <div className="space-y-6">
                {/* Meta */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <Label className="text-gray-300">
                      Meta / Valor Ideal
                    </Label>
                    <div className="flex items-center gap-1">
                      <Input 
                        type="number" 
                        value={targetValue}
                        onChange={(e) => setTargetValue(parseFloat(e.target.value))}
                        className="w-20 h-8 p-1 text-center bg-gray-800 border-gray-700 text-white"
                      />
                      <span className="text-gray-400">{unit}</span>
                    </div>
                  </div>
                  
                  <Slider
                    value={[targetValue]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={([value]) => setTargetValue(value)}
                    className="mt-4"
                  />
                  
                  <p className="text-xs text-gray-400">
                    Valores maiores ou iguais ao valor de meta são considerados ideais.
                  </p>
                </div>
                
                {/* Alerta */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <Label className="text-gray-300">
                      Limiar de Alerta
                    </Label>
                    <div className="flex items-center gap-1">
                      <Input 
                        type="number" 
                        value={warningValue}
                        onChange={(e) => setWarningValue(parseFloat(e.target.value))}
                        className="w-20 h-8 p-1 text-center bg-gray-800 border-gray-700 text-white"
                      />
                      <span className="text-gray-400">{unit}</span>
                    </div>
                  </div>
                  
                  <Slider
                    value={[warningValue]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={([value]) => setWarningValue(value)}
                  />
                  
                  <p className="text-xs text-gray-400">
                    Valores entre a meta e o alerta receberão um alerta amarelo.
                  </p>
                </div>
                
                {/* Crítico */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <Label className="text-gray-300">
                      Limiar Crítico
                    </Label>
                    <div className="flex items-center gap-1">
                      <Input 
                        type="number" 
                        value={criticalValue}
                        onChange={(e) => setCriticalValue(parseFloat(e.target.value))}
                        className="w-20 h-8 p-1 text-center bg-gray-800 border-gray-700 text-white"
                      />
                      <span className="text-gray-400">{unit}</span>
                    </div>
                  </div>
                  
                  <Slider
                    value={[criticalValue]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={([value]) => setCriticalValue(value)}
                  />
                  
                  <p className="text-xs text-gray-400">
                    Valores maiores que o limiar crítico indicam uma situação crítica.
                  </p>
                </div>
                
                <div className="bg-gray-800 p-4 rounded-md mt-4">
                  <div className="relative h-6 bg-gray-700 rounded-full overflow-hidden mb-6">
                    {/* Barra de Critico */}
                    <div 
                      className="absolute h-full bg-red-500/80 right-0 top-0" 
                      style={{ width: `${100 - criticalValue}%` }}
                    />
                    
                    {/* Barra de Alerta */}
                    <div 
                      className="absolute h-full bg-yellow-500/80 right-0 top-0" 
                      style={{ width: `${100 - warningValue}%` }}
                    />
                    
                    {/* Barra de Meta */}
                    <div 
                      className="absolute h-full bg-green-500/80 right-0 top-0" 
                      style={{ width: `${100 - targetValue}%` }}
                    />
                    
                    {/* Marcadores de valores */}
                    <div 
                      className="absolute h-8 w-0.5 bg-white top-0 rounded-full"
                      style={{ left: `${targetValue}%` }}
                    />
                    <div 
                      className="absolute h-8 w-0.5 bg-white top-0 rounded-full"
                      style={{ left: `${warningValue}%` }}
                    />
                    <div 
                      className="absolute h-8 w-0.5 bg-white top-0 rounded-full"
                      style={{ left: `${criticalValue}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>0{unit}</span>
                    <span>100{unit}</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </CardContent>
          
          <CardFooter className="flex justify-end gap-2 p-4 bg-gray-800 border-t border-gray-700">
            <Button 
              variant="outline" 
              className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSaveMetric}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Criar Métrica
            </Button>
          </CardFooter>
        </Tabs>
      </Card>
    );
};