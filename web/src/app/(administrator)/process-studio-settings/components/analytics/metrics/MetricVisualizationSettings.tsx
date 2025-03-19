/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { LineChart, BarChart, PieChart, Gauge, CreditCard, Palette, Eye, Grid, Zap, HelpCircle as TooltipIcon, MoveVertical } from 'lucide-react';
import { Label } from '@/components/ui/organisms/label';
import { Switch } from '@/components/ui/organisms/switch';
import { MetricFormState } from './MetricEditor';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/organisms/tooltip';

// Tipos de visualização de métricas
const chartTypes = [
  { id: 'line', name: 'Linha', icon: LineChart, description: 'Ideal para tendências ao longo do tempo' },
  { id: 'bar', name: 'Barras', icon: BarChart, description: 'Comparações entre categorias distintas' },
  { id: 'pie', name: 'Pizza', icon: PieChart, description: 'Distribuição proporcional de valores' },
  { id: 'gauge', name: 'Medidor', icon: Gauge, description: 'Visualização de progresso em relação a uma meta' },
  { id: 'card', name: 'Cartão', icon: CreditCard, description: 'Exibição simples de valor numérico' }
];

// Cores disponíveis para a métrica
const colorOptions = [
  { id: 'text-blue-500', name: 'Azul', color: '#3b82f6' },
  { id: 'text-green-500', name: 'Verde', color: '#22c55e' },
  { id: 'text-red-500', name: 'Vermelho', color: '#ef4444' },
  { id: 'text-yellow-500', name: 'Amarelo', color: '#eab308' },
  { id: 'text-purple-500', name: 'Roxo', color: '#a855f7' },
  { id: 'text-indigo-500', name: 'Índigo', color: '#6366f1' },
  { id: 'text-pink-500', name: 'Rosa', color: '#ec4899' },
  { id: 'text-orange-500', name: 'Laranja', color: '#f97316' },
  { id: 'text-teal-500', name: 'Teal', color: '#14b8a6' },
  { id: 'text-cyan-500', name: 'Ciano', color: '#06b6d4' }
];

interface MetricVisualizationSettingsProps {
  formState: MetricFormState;
  updateFormState: (field: string, value: any) => void;
  updateAdvancedSettings: (field: string, value: boolean) => void;
}

export const MetricVisualizationSettings: React.FC<MetricVisualizationSettingsProps> = ({
  formState,
  updateFormState,
  updateAdvancedSettings
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <Label className="text-gray-300 font-medium">Tipo de Visualização</Label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {chartTypes.map(type => {
            const Icon = type.icon;
            const isSelected = formState.chartType === type.id;
            return (
              <div 
                key={type.id}
                className={`
                  flex flex-col items-center p-3 rounded-lg cursor-pointer transition-all
                  ${isSelected 
                    ? 'bg-blue-700/30 border-2 border-blue-500' 
                    : 'bg-gray-800 border border-gray-700 hover:border-gray-500'
                  }
                `}
                onClick={() => updateFormState('chartType', type.id)}
              >
                <Icon className={`h-6 w-6 mb-2 ${isSelected ? 'text-blue-400' : 'text-gray-400'}`} />
                <span className={`text-sm ${isSelected ? 'text-blue-300' : 'text-gray-300'}`}>
                  {type.name}
                </span>
              </div>
            );
          })}
        </div>
        
        <div className="mt-1 text-xs text-gray-400">
          {chartTypes.find(type => type.id === formState.chartType)?.description}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label className="flex items-center gap-1 text-gray-300">
          <Palette className="h-4 w-4 text-blue-500" />
          <span>Cor Principal</span>
        </Label>
        <div className="flex flex-wrap gap-2">
          {colorOptions.map(colorOption => (
            <TooltipProvider key={colorOption.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className={`
                      w-8 h-8 rounded-full border-2 transition-all
                      ${formState.iconColor === colorOption.id 
                        ? 'border-white scale-110 shadow-glow' 
                        : 'border-transparent'
                      }
                    `}
                    style={{ backgroundColor: colorOption.color }}
                    onClick={() => updateFormState('iconColor', colorOption.id)}
                  />
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-gray-900 border-gray-700 text-white">
                  {colorOption.name}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
      
      {/* Configurações avançadas */}
      <div className="space-y-4 mt-6 pt-4 border-t border-gray-700">
        <h3 className="text-sm font-medium text-gray-300 flex items-center gap-1.5">
          <Eye className="h-4 w-4 text-blue-500" />
          Configurações de Exibição
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between space-x-4 p-3 bg-gray-800 rounded-md">
            <div className="flex items-center space-x-2">
              <Grid className="h-4 w-4 text-gray-400" />
              <Label htmlFor="show-grid" className="text-sm text-gray-300">
                Exibir Grade
              </Label>
            </div>
            <Switch
              id="show-grid"
              checked={formState.advanced.showGrid}
              onCheckedChange={(checked) => updateAdvancedSettings('showGrid', checked)}
              className="data-[state=checked]:bg-blue-600"
            />
          </div>
          
          <div className="flex items-center justify-between space-x-4 p-3 bg-gray-800 rounded-md">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-gray-400" />
              <Label htmlFor="enable-animation" className="text-sm text-gray-300">
                Ativar Animações
              </Label>
            </div>
            <Switch
              id="enable-animation"
              checked={formState.advanced.enableAnimation}
              onCheckedChange={(checked) => updateAdvancedSettings('enableAnimation', checked)}
              className="data-[state=checked]:bg-blue-600"
            />
          </div>
          
          <div className="flex items-center justify-between space-x-4 p-3 bg-gray-800 rounded-md">
            <div className="flex items-center space-x-2">
              <TooltipIcon className="h-4 w-4 text-gray-400" />
              <Label htmlFor="show-tooltips" className="text-sm text-gray-300">
                Mostrar Tooltips
              </Label>
            </div>
            <Switch
              id="show-tooltips"
              checked={formState.advanced.showTooltips}
              onCheckedChange={(checked) => updateAdvancedSettings('showTooltips', checked)}
              className="data-[state=checked]:bg-blue-600"
            />
          </div>
          
          <div className="flex items-center justify-between space-x-4 p-3 bg-gray-800 rounded-md">
            <div className="flex items-center space-x-2">
              <MoveVertical className="h-4 w-4 text-gray-400" />
              <Label htmlFor="responsive-height" className="text-sm text-gray-300">
                Altura Responsiva
              </Label>
            </div>
            <Switch
              id="responsive-height"
              checked={formState.advanced.responsiveHeight}
              onCheckedChange={(checked) => updateAdvancedSettings('responsiveHeight', checked)}
              className="data-[state=checked]:bg-blue-600"
            />
          </div>
        </div>
        
        {formState.chartType !== 'card' && formState.chartType !== 'gauge' && (
          <div className="flex items-center justify-between space-x-4 p-3 bg-gray-800 rounded-md mt-2">
            <div className="flex items-center space-x-2">
              <div className="text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="8" width="18" height="4" rx="1" />
                  <path d="M6 12v4" />
                  <path d="M18 12v4" />
                  <path d="M12 12v4" />
                  <path d="M4 16h16" />
                </svg>
              </div>
              <Label htmlFor="show-legend" className="text-sm text-gray-300">
                Exibir Legenda
              </Label>
            </div>
            <Switch
              id="show-legend"
              checked={formState.advanced.showLegend}
              onCheckedChange={(checked) => updateAdvancedSettings('showLegend', checked)}
              className="data-[state=checked]:bg-blue-600"
            />
          </div>
        )}
      </div>
      
      {/* Dicas de visualização */}
      <div className="mt-4 p-4 bg-blue-900/20 border border-blue-800/30 rounded-md">
        <h4 className="text-blue-300 text-sm font-medium mb-2 flex items-center gap-1.5">
          <LineChart className="h-4 w-4" />
          Dicas de Visualização
        </h4>
        <ul className="text-xs space-y-1 text-blue-200">
          <li className="flex items-start gap-1.5">
            <span className="block min-w-4">•</span>
            <span>
              <strong>Gráficos de Linha:</strong> Ideais para mostrar tendências ao longo do tempo.
            </span>
          </li>
          <li className="flex items-start gap-1.5">
            <span className="block min-w-4">•</span>
            <span>
              <strong>Gráficos de Barras:</strong> Perfeitos para comparar categorias entre si.
            </span>
          </li>
          <li className="flex items-start gap-1.5">
            <span className="block min-w-4">•</span>
            <span>
              <strong>Medidores:</strong> Úteis para métricas que têm alvos ou limites definidos.
            </span>
          </li>
          <li className="flex items-start gap-1.5">
            <span className="block min-w-4">•</span>
            <span>
              <strong>Cartões:</strong> Simples e diretos para valores numéricos importantes.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};