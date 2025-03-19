/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Target, AlertTriangle, AlertCircle, Sliders, Bell, BadgeCheck } from 'lucide-react';
import { Label } from '@/components/ui/organisms/label';
import { Slider } from '@/components/ui/organisms/slider';
import { Input } from '@/components/ui/organisms/input';
import { Switch } from '@/components/ui/organisms/switch';
import { MetricFormState } from './MetricEditor';

interface MetricThresholdSettingsProps {
  formState: MetricFormState;
  updateThresholds: (field: string, value: number) => void;
}

export const MetricThresholdSettings: React.FC<MetricThresholdSettingsProps> = ({
  formState,
  updateThresholds
}) => {
  // Determinar o valor mínimo e máximo baseado no tipo de métrica
  const getMinMaxForMetric = () => {
    // Para porcentagens, o padrão é 0-100
    if (formState.unit === '%') {
      return { min: 0, max: 100 };
    }
    
    // Para outros tipos, use uma faixa baseada nos valores atuais
    const maxThreshold = Math.max(
      formState.thresholds.target, 
      formState.thresholds.warning, 
      formState.thresholds.critical
    );
    
    return { min: 0, max: maxThreshold * 1.5 || 100 };
  };
  
  const { min, max } = getMinMaxForMetric();
  
  // Para mostrar os valores invertidos (quanto menor, melhor) - por exemplo, tempo de atendimento
  const [invertedScale, setInvertedScale] = React.useState(false);
  
  // Determinar cores com base nos limiares
  const getColorForValue = (value: number) => {
    if (invertedScale) {
      // Lógica invertida - menor é melhor
      if (value <= formState.thresholds.target) return 'bg-green-500';
      if (value <= formState.thresholds.warning) return 'bg-yellow-500';
      return 'bg-red-500';
    } else {
      // Lógica normal - maior é melhor
      if (value >= formState.thresholds.critical) return 'bg-red-500';
      if (value >= formState.thresholds.warning) return 'bg-yellow-500';
      return 'bg-green-500';
    }
  };
  
  return (
    <div className="space-y-4">
      {/* Visualização de limiares */}
      <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
        <h3 className="text-sm font-medium text-gray-300 flex items-center gap-1.5 mb-6">
          <Target className="h-4 w-4 text-blue-500" />
          Prévia de Limiares
        </h3>
        
        <div className="relative h-6 bg-gray-700 rounded-full overflow-hidden mb-6">
          {/* Barra de Critico */}
          <div 
            className="absolute h-full bg-red-500/80 right-0 top-0" 
            style={{ 
              width: invertedScale 
                ? `${(formState.thresholds.critical / max) * 100}%` 
                : `${((max - formState.thresholds.critical) / max) * 100}%` 
            }}
          />
          
          {/* Barra de Alerta */}
          <div 
            className="absolute h-full bg-yellow-500/80 right-0 top-0" 
            style={{ 
              width: invertedScale 
                ? `${(formState.thresholds.warning / max) * 100}%` 
                : `${((max - formState.thresholds.warning) / max) * 100}%` 
            }}
          />
          
          {/* Barra de Meta */}
          <div 
            className="absolute h-full bg-green-500/80 right-0 top-0" 
            style={{ 
              width: invertedScale 
                ? `${(formState.thresholds.target / max) * 100}%` 
                : `${((max - formState.thresholds.target) / max) * 100}%` 
            }}
          />
          
          {/* Marcadores de valores */}
          <div 
            className="absolute h-8 w-0.5 bg-white top-0 transform translate-y-3 rounded-full"
            style={{ left: `${(formState.thresholds.target / max) * 100}%` }}
          />
          <div 
            className="absolute h-8 w-0.5 bg-white top-0 transform translate-y-3 rounded-full"
            style={{ left: `${(formState.thresholds.warning / max) * 100}%` }}
          />
          <div 
            className="absolute h-8 w-0.5 bg-white top-0 transform translate-y-3 rounded-full"
            style={{ left: `${(formState.thresholds.critical / max) * 100}%` }}
          />
        </div>
        
        {/* Crítico */}
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <Label className="flex items-center gap-1.5 text-gray-300">
              <AlertCircle className="h-4 w-4 text-red-500" />
              Limiar Crítico
            </Label>
            <div className="flex items-center gap-1">
              <Input 
                type="number" 
                value={formState.thresholds.critical}
                onChange={(e) => updateThresholds('critical', parseFloat(e.target.value))}
                className="w-20 h-8 p-1 text-center bg-gray-800 border-gray-700 text-white"
              />
              <span className="text-gray-400">{formState.unit}</span>
            </div>
          </div>
          
          <Slider
            value={[formState.thresholds.critical]}
            min={min}
            max={max}
            step={1}
            onValueChange={([value]) => updateThresholds('critical', value)}
          />
          
          <p className="text-xs text-gray-400">
            {invertedScale 
              ? 'Valores maiores que o limiar crítico indicam uma situação crítica.' 
              : 'Valores menores que o limiar crítico indicam uma situação crítica.'}
          </p>
        </div>
      </div>
      
      {/* Configurações de Notificação */}
      <div className="mt-6 pt-6 border-t border-gray-700">
        <h3 className="text-sm font-medium text-gray-300 flex items-center gap-1.5 mb-4">
          <Bell className="h-4 w-4 text-blue-500" />
          Notificações de Limiar
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-800 rounded-md">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-gray-300">Alertar quando atingir nível de alerta</span>
            </div>
            <Switch
              defaultChecked={true}
              className="data-[state=checked]:bg-yellow-600"
            />
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-800 rounded-md">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm text-gray-300">Alertar quando atingir nível crítico</span>
            </div>
            <Switch
              defaultChecked={true}
              className="data-[state=checked]:bg-red-600"
            />
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-800 rounded-md">
            <div className="flex items-center gap-2">
              <BadgeCheck className="h-4 w-4 text-green-500" />
              <span className="text-sm text-gray-300">Alertar quando retornar ao normal</span>
            </div>
            <Switch
              defaultChecked={true}
              className="data-[state=checked]:bg-green-600"
            />
          </div>
        </div>
      </div>
      
      {/* Dicas */}
      <div className="mt-4 p-4 bg-blue-900/20 border border-blue-800/30 rounded-md">
        <h4 className="text-blue-300 text-sm font-medium mb-2 flex items-center gap-1.5">
          <Sliders className="h-4 w-4" />
          Dicas para Definição de Limiares
        </h4>
        <ul className="text-xs space-y-1 text-blue-200">
          <li className="flex items-start gap-1.5">
            <span className="block min-w-4">•</span>
            <span>
              Defina limiares realistas baseados em dados históricos e metas de negócio.
            </span>
          </li>
          <li className="flex items-start gap-1.5">
            <span className="block min-w-4">•</span>
            <span>
              Para métricas onde valores menores são melhores (como tempo de espera), use a opção &quot;Inverter Escala&quot;.
            </span>
          </li>
          <li className="flex items-start gap-1.5">
            <span className="block min-w-4">•</span>
            <span>
              Evite criar muitos alertas configurando limiares bem definidos para evitar &quot;fadiga de alertas&quot;.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};