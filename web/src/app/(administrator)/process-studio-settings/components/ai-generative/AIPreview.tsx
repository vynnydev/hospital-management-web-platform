import React from 'react';
import { Button } from "@/components/ui/organisms/button";

interface AIPreviewProps {
  title: string;
  previewContent: React.ReactNode;
  onAdjust: () => void;
  onApply: () => void;
}

export const AIPreview: React.FC<AIPreviewProps> = ({
  title,
  previewContent,
  onAdjust,
  onApply
}) => {
  return (
    <div className="border rounded-lg p-4 border-purple-200 dark:border-purple-800">
      <h3 className="text-lg font-medium text-purple-900 dark:text-purple-200 mb-3">
        Prévia: {title}
      </h3>
      
      {previewContent}
      
      <div className="flex justify-end mt-4 space-x-2">
        <Button size="sm" variant="outline" onClick={onAdjust}>Ajustar</Button>
        <Button size="sm" onClick={onApply}>Aplicar</Button>
      </div>
    </div>
  );
};

// components/AIPreview/MetricPreview.tsx
interface MetricPreviewProps {
  value: string;
  trend?: number;
  title?: string;
  subtitle?: string;
}

export const MetricPreview: React.FC<MetricPreviewProps> = ({ 
  value, 
  trend,
  title = "Taxa de Ocupação",
  subtitle = "Ocupação atual dos leitos"
}) => (
  <div className="grid grid-cols-2 gap-4">
    <div className="border rounded-lg p-3 bg-white dark:bg-gray-800">
      <h4 className="text-sm font-medium">{title}</h4>
      <div className="text-2xl font-bold mt-2">{value}</div>
      <div className="h-2 bg-gray-200 rounded-full mt-2">
        <div 
          className="h-2 bg-amber-500 rounded-full" 
          style={{width: `${typeof value === 'string' && value.includes('%') 
            ? parseFloat(value) 
            : 80}%`}}
        ></div>
      </div>
    </div>
    
    <div className="border rounded-lg p-3 bg-white dark:bg-gray-800">
      <h4 className="text-sm font-medium">{subtitle}</h4>
      <div className="text-2xl font-bold mt-2">4.2 dias</div>
      {trend !== undefined && (
        <div className="text-xs text-gray-500 mt-1">
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(1)} vs semana anterior
        </div>
      )}
    </div>
  </div>
);

// components/AIPreview/AlertPreview.tsx
export const AlertPreview: React.FC = () => (
  <div className="space-y-2">
    <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
      <div>
        <div className="flex items-center">
          <span className="w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
          <span className="font-medium">Aviso: Ocupação UTI acima de 85%</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Disparado quando a ocupação persistir por mais de 15 minutos
        </p>
      </div>
    </div>
    <div className="p-3 border rounded-lg border-gray-200 dark:border-gray-700">
      <h4 className="text-sm font-medium">Configurações do Alerta</h4>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2 text-xs">
        <div className="text-gray-500">Condição:</div>
        <div>Taxa de ocupação {'>'} 85%</div>
        <div className="text-gray-500">Severidade:</div>
        <div>Aviso</div>
        <div className="text-gray-500">Notificações:</div>
        <div>Email, Dashboard</div>
      </div>
    </div>
  </div>
);

// components/AIPreview/WorkflowPreview.tsx
export const WorkflowPreview: React.FC = () => (
  <div className="border rounded-lg p-3 bg-white dark:bg-gray-800">
    <h4 className="text-sm font-medium">Fluxo: Admissão de Emergência</h4>
    <div className="flex items-center justify-between mt-3 text-xs">
      <div className="flex-1 text-center">Triagem</div>
      <div className="w-4">→</div>
      <div className="flex-1 text-center">Avaliação Médica</div>
      <div className="w-4">→</div>
      <div className="flex-1 text-center">Exames</div>
      <div className="w-4">→</div>
      <div className="flex-1 text-center">Conduta</div>
    </div>
    <div className="mt-3 text-xs text-gray-500">
      <div>Tempo estimado: 45 minutos</div>
      <div>Pontos críticos: 2</div>
      <div>Recursos necessários: 4</div>
    </div>
  </div>
);