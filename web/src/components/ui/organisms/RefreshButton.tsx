import React from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/organisms/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/organisms/tooltip';
import { useDashboardConfig } from '../context/patient-monitoring-dashboard/DashboardConfigContext';


export const RefreshButton: React.FC = () => {
  const { isRefreshing, handleRefresh } = useDashboardConfig();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <Loader2 className="h-4 w-4 text-gray-700 dark:text-gray-300 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 text-gray-700 dark:text-gray-300" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Atualizar dados manualmente</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};