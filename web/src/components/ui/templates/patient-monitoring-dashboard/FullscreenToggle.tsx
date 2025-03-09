import React, { useState, useEffect } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/organisms/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/organisms/tooltip';

export const FullscreenToggle: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  
  // Monitorar mudanças no estado da tela cheia
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      const dashboardElement = document.getElementById('dashboard-container');
      if (dashboardElement) {
        dashboardElement.requestFullscreen().catch(err => {
          console.error(`Erro ao tentar entrar em modo de tela cheia: ${err.message}`);
        });
      } else {
        document.documentElement.requestFullscreen().catch(err => {
          console.error(`Erro ao tentar entrar em modo de tela cheia: ${err.message}`);
        });
      }
    } else {
      document.exitFullscreen().catch(err => {
        console.error(`Erro ao tentar sair do modo de tela cheia: ${err.message}`);
      });
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4 text-gray-700 dark:text-gray-300" />
            ) : (
              <Maximize2 className="h-4 w-4 text-gray-700 dark:text-gray-300" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isFullscreen ? 'Sair da tela cheia' : 'Modo tela cheia'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};