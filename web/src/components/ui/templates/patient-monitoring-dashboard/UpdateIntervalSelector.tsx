import React from 'react';
import { CalendarRange } from 'lucide-react';
import { Button } from '@/components/ui/organisms/button';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/organisms/popover';
import { useDashboardConfig } from '../../context/patient-monitoring-dashboard/DashboardConfigContext';

export const UpdateIntervalSelector: React.FC = () => {
  const { refreshInterval, setRefreshInterval, isRealTimeMode } = useDashboardConfig();

  // Intervalos de atualização disponíveis em segundos
  const intervals = [5, 10, 30, 60, 300];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          disabled={!isRealTimeMode}
        >
          <CalendarRange className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400" />
          Intervalo de Atualização
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-900 dark:text-gray-100">Intervalo de Atualização</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Configure a frequência de atualização dos dados
          </p>
        </div>
        <div className="p-3">
          <div className="space-y-2">
            {intervals.map(interval => (
              <div 
                key={interval} 
                className="flex items-center cursor-pointer py-1 hover:bg-gray-50 dark:hover:bg-gray-700 px-2 rounded-md"
                onClick={() => setRefreshInterval(interval)}
              >
                <div className={`w-3 h-3 rounded-full mr-2 ${refreshInterval === interval ? 'bg-blue-600 dark:bg-blue-500 ring-2 ring-blue-200 dark:ring-blue-900 ring-offset-1 dark:ring-offset-gray-800' : 'border border-gray-300 dark:border-gray-600'}`}></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {interval < 60 
                    ? `${interval} segundos` 
                    : `${interval / 60} ${interval === 60 ? 'minuto' : 'minutos'}`}
                </span>
              </div>
            ))}
          </div>
          {!isRealTimeMode && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-amber-500 dark:text-amber-400">
                Ative o modo &quot;Tempo real&quot; para utilizar esta funcionalidade
              </p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};