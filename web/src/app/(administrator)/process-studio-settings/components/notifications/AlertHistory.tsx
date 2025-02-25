import React from 'react';
import { Bell } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';

interface AlertItem {
  id: string;
  title: string;
  time: string;
  date: string;
  type: 'warning' | 'critical' | 'info';
}

interface AlertHistoryProps {
  alerts: AlertItem[];
  onViewDetails?: (alertId: string) => void;
}

export const AlertHistory: React.FC<AlertHistoryProps> = ({
  alerts,
  onViewDetails
}) => {
  // Função para obter estilos baseados no tipo de alerta
  const getAlertStyles = (type: AlertItem['type']) => {
    switch (type) {
      case 'warning':
        return {
          bg: 'bg-amber-50 dark:bg-amber-900/20',
          border: 'border-amber-200 dark:border-amber-800',
          icon: 'text-amber-500'
        };
      case 'critical':
        return {
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-red-200 dark:border-red-800',
          icon: 'text-red-500'
        };
      case 'info':
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          border: 'border-blue-200 dark:border-blue-800',
          icon: 'text-blue-500'
        };
      default:
        return {
          bg: 'bg-gray-50 dark:bg-gray-900/20',
          border: 'border-gray-200 dark:border-gray-800',
          icon: 'text-gray-500'
        };
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-base">Histórico de Alertas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {alerts.map(alert => {
            const styles = getAlertStyles(alert.type);
            
            return (
              <div 
                key={alert.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${styles.bg} ${styles.border}`}
              >
                <div>
                  <div className="flex items-center">
                    <Bell className={`h-4 w-4 ${styles.icon} mr-2`} />
                    <span className="font-medium">{alert.title}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{alert.date}, {alert.time}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => onViewDetails && onViewDetails(alert.id)}
                >
                  Detalhes
                </Button>
              </div>
            );
          })}

          {alerts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhum alerta recente encontrado.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Alertas de exemplo para uso em outros componentes
export const sampleAlerts: AlertItem[] = [
  {
    id: 'alert-1',
    title: 'Ocupação Emergência: 92%',
    time: '14:35',
    date: 'Hoje',
    type: 'warning'
  },
  {
    id: 'alert-2',
    title: 'UTI Neonatal: Capacidade Máxima',
    time: '10:22',
    date: 'Hoje',
    type: 'critical'
  },
  {
    id: 'alert-3',
    title: 'Estoque: Medicamento Abaixo do Mínimo',
    time: '18:05',
    date: 'Ontem',
    type: 'info'
  }
];