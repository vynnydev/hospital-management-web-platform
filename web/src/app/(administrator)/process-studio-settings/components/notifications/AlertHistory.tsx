import React from 'react';
import { Bell, ChevronRight, Filter, AlertTriangle, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';
import { TAlertStatus } from '@/types/alert-types';

interface AlertItem {
  id: string;
  title: string;
  time: string;
  date: string;
  type: 'warning' | 'critical' | 'info';
  status?: TAlertStatus;
}

interface AlertHistoryProps {
  alerts: AlertItem[];
  onViewDetails?: (alertId: string) => void;
  title?: string;
  showFilters?: boolean;
}

export const AlertHistory: React.FC<AlertHistoryProps> = ({
  alerts,
  onViewDetails,
  title = "Histórico de Alertas",
  showFilters = false
}) => {
  // Estados para filtros
  const [typeFilter, setTypeFilter] = React.useState<string>('all');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [dateFilter, setDateFilter] = React.useState<string>('all');
  
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

  // Obter ícone baseado no status
  const getStatusIcon = (status?: TAlertStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-gray-500" />;
      case 'acknowledged':
        return <AlertTriangle className="h-4 w-4 text-blue-500" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'dismissed':
        return <XCircle className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };
  
  // Filtrar alertas
  const filteredAlerts = alerts.filter(alert => {
    // Filtro por tipo
    if (typeFilter !== 'all' && alert.type !== typeFilter) {
      return false;
    }
    
    // Filtro por status
    if (statusFilter !== 'all' && alert.status !== statusFilter) {
      return false;
    }
    
    // Filtro por data
    if (dateFilter === 'today' && !alert.date.includes('Hoje')) {
      return false;
    } else if (dateFilter === 'yesterday' && !alert.date.includes('Ontem')) {
      return false;
    } else if (dateFilter === 'older' && (alert.date.includes('Hoje') || alert.date.includes('Ontem'))) {
      return false;
    }
    
    return true;
  });

  return (
    <Card className="mt-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">{title}</CardTitle>
        
        {showFilters && (
          <div className="flex items-center space-x-2">
            <div className="relative">
              <select
                className="border border-gray-300 dark:border-gray-600 rounded-md text-xs pl-6 pr-2 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 appearance-none"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">Todos tipos</option>
                <option value="critical">Críticos</option>
                <option value="warning">Avisos</option>
                <option value="info">Informativos</option>
              </select>
              <Filter className="h-3 w-3 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
            </div>
            
            <div className="relative">
              <select
                className="border border-gray-300 dark:border-gray-600 rounded-md text-xs pl-6 pr-2 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 appearance-none"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Todos status</option>
                <option value="pending">Pendentes</option>
                <option value="acknowledged">Reconhecidos</option>
                <option value="resolved">Resolvidos</option>
                <option value="dismissed">Descartados</option>
              </select>
              <AlertTriangle className="h-3 w-3 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
            </div>
            
            <div className="relative">
              <select
                className="border border-gray-300 dark:border-gray-600 rounded-md text-xs pl-6 pr-2 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 appearance-none"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="all">Todas datas</option>
                <option value="today">Hoje</option>
                <option value="yesterday">Ontem</option>
                <option value="older">Mais antigos</option>
              </select>
              <Clock className="h-3 w-3 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Nenhum alerta encontrado.
            </div>
          ) : (
            filteredAlerts.map(alert => {
              const styles = getAlertStyles(alert.type);
              
              return (
                <div 
                  key={alert.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${styles.bg} ${styles.border}`}
                >
                  <div className="flex items-start">
                    <Bell className={`h-4 w-4 ${styles.icon} mr-2 mt-0.5`} />
                    <div>
                      <div className="font-medium">{alert.title}</div>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <span>{alert.date}, {alert.time}</span>
                        {alert.status && (
                          <div className="flex items-center ml-2">
                            {getStatusIcon(alert.status)}
                            <span className="ml-1 capitalize">
                              {alert.status === 'pending' ? 'Pendente' :
                               alert.status === 'acknowledged' ? 'Reconhecido' :
                               alert.status === 'resolved' ? 'Resolvido' : 'Descartado'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs"
                    onClick={() => onViewDetails && onViewDetails(alert.id)}
                  >
                    <span className="mr-1">Detalhes</span>
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};