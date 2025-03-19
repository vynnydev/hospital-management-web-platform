import React from 'react';
import { 
  AlertTriangle, 
  Users, 
  Settings, 
  Clock, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { Card } from '@/components/ui/organisms/card';
import { IAlertMetrics, TSeverity } from '@/types/custom-metrics';
import { Button } from '@/components/ui/organisms/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/organisms/tooltip';

interface AlertsSectionProps {
  alertMetrics: IAlertMetrics;
  isEditing: boolean;
}

export const AlertsSection: React.FC<AlertsSectionProps> = ({ 
  alertMetrics,
  isEditing
}) => {
  // Função para determinar estado do alerta com base na severidade
  const getAlertState = (severity: TSeverity): { status: string; color: string } => {
    switch (severity) {
      case 'high':
        return { status: 'Requer Atenção Imediata', color: 'bg-red-500 text-white' };
      case 'medium':
        return { status: 'Monitoramento Recomendado', color: 'bg-yellow-500 text-white' };
      case 'low':
      default:
        return { status: 'Situação Normal', color: 'bg-green-500 text-white' };
    }
  };

  // Determinar severidade para hospital crítico
  const hospitalSeverity: TSeverity = 
    alertMetrics.hospitalWithHighestOccupancy?.metrics?.overall?.occupancyRate 
      ? (alertMetrics.hospitalWithHighestOccupancy.metrics.overall.occupancyRate > 90 ? 'high' : 'medium')
      : 'low';

  // Determinar severidade para déficit de equipes
  const staffSeverity: TSeverity = alertMetrics.hospitalsBelowStaffingNorms > 1 ? 'high' : 'low';
  
  // Determinar severidade para manutenção de equipamentos
  const maintenanceSeverity: TSeverity = alertMetrics.equipmentMaintenanceAlerts > 1 ? 'high' : 'medium';
  
  // Determinar severidade para tempo de espera
  const waitingSeverity: TSeverity = alertMetrics.emergencyRoomWaitingTime > 4 ? 'high' : 'low';

  // Lista de alertas
  const alertCards = [
    {
      title: "Hospital Crítico",
      subtitle: "Maior Ocupação",
      icon: AlertTriangle,
      value: alertMetrics.hospitalWithHighestOccupancy?.name || 'N/A',
      description: `Taxa de Ocupação: ${alertMetrics.hospitalWithHighestOccupancy?.metrics?.overall?.occupancyRate?.toFixed(1) || 'N/A'}%`,
      gradient: "from-red-400/20 to-rose-500/20 dark:from-red-500/20 dark:to-rose-600/20",
      iconColor: "text-red-500",
      severity: hospitalSeverity
    },
    {
      title: "Déficit de Equipes",
      subtitle: "Dificuldade nas Equipes",
      icon: Users,
      value: alertMetrics.hospitalsBelowStaffingNorms,
      description: "Hospitais abaixo da taxa de ocupação esperada",
      gradient: "from-amber-400/20 to-yellow-500/20 dark:from-amber-500/20 dark:to-yellow-600/20",
      iconColor: "text-amber-500",
      severity: staffSeverity
    },
    {
      title: "Higienização de Equipamentos",
      subtitle: "Higienização Geral",
      icon: Settings,
      value: alertMetrics.equipmentMaintenanceAlerts,
      description: "UTIs com alto risco de indisponibilidade",
      gradient: "from-blue-400/20 to-indigo-500/20 dark:from-blue-500/20 dark:to-indigo-600/20",
      iconColor: "text-blue-500",
      severity: maintenanceSeverity
    },
    {
      title: "Tempo de Espera",
      subtitle: "Espera",
      icon: Clock,
      value: alertMetrics.emergencyRoomWaitingTime.toFixed(1),
      description: "Tempo médio de espera (em horas)",
      gradient: "from-violet-400/20 to-purple-500/20 dark:from-violet-500/20 dark:to-purple-600/20",
      iconColor: "text-violet-500",
      severity: waitingSeverity
    }
  ];

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          Alertas Principais
        </h2>
        
        {isEditing && (
          <Button 
            variant="outline" 
            size="sm"
            className="bg-gray-800 border-gray-700 text-gray-300 hover:text-white"
          >
            Personalizar Alertas
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {alertCards.map((alert, index) => {
          const alertState = getAlertState(alert.severity);
          
          return (
            <Card 
              key={index} 
              className={`relative overflow-hidden border-0 shadow-lg bg-gradient-to-br ${alert.gradient}`}
            >
              {isEditing && (
                <div className="absolute top-2 right-2 z-10">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 rounded-full bg-gray-900/30 hover:bg-gray-900/50"
                        >
                          <AlertTriangle className="h-3.5 w-3.5 text-white" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-gray-900 border-gray-700 text-white">
                        Editar Alerta
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
              
              <div className="p-4">
                <div className="flex items-center mb-2">
                  <div className={`p-2 rounded-full ${alert.iconColor} bg-opacity-20`}>
                    <alert.icon className={`h-5 w-5 ${alert.iconColor}`} />
                  </div>
                  <h3 className="ml-2 font-medium text-gray-200">{alert.title}</h3>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm text-gray-400">{alert.subtitle}</p>
                  <div className="text-2xl font-bold text-white mt-1">{alert.value}</div>
                  <p className="text-sm text-gray-300 mt-1">{alert.description}</p>
                </div>
                
                <div className="mt-4">
                  <div className="flex">
                    <div className="flex-1">
                      <div className="text-sm text-gray-400">Análise comparativa</div>
                      <p className="text-xs text-gray-300 mt-1 line-clamp-2">
                        {alert.severity === 'high' ? 
                          "Acima do limiar crítico. Requer atenção imediata." : 
                          alert.severity === 'medium' ? 
                            "Próximo ao limiar de alerta. Monitoramento recomendado." : 
                            "Dentro dos parâmetros normais de operação."}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className={`mt-4 p-2 rounded-md flex items-center justify-center ${alertState.color}`}>
                  {alert.severity === 'low' ? (
                    <Check className="h-4 w-4 mr-2" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 mr-2" />
                  )}
                  <span className="text-sm font-medium">{alertState.status}</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};