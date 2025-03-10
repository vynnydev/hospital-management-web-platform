import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';
import { useAlerts, Alert } from './AlertsProvider';

interface AlertBannerProps {
  onCreateChat?: (alert: Alert) => void;
  maxAlerts?: number;
  autoHideAfter?: number; // em milissegundos, 0 para não ocultar automaticamente
  showOnlyPriority?: ('high' | 'medium' | 'low')[];
}

/**
 * Banner para mostrar alertas críticos no topo do chat
 */
export const AlertBanner: React.FC<AlertBannerProps> = ({
  onCreateChat,
  maxAlerts = 3,
  autoHideAfter = 0,  // 0 = não ocultar automaticamente
  showOnlyPriority = ['high']
}) => {
  const { alerts, markAsRead, dismissAlert } = useAlerts();
  const [isVisible, setIsVisible] = useState(true);
  const [activeAlertIndex, setActiveAlertIndex] = useState(0);
  const [autoHideTimeoutId, setAutoHideTimeoutId] = useState<NodeJS.Timeout | null>(null);

  // Filtrar alertas relevantes
  const relevantAlerts = alerts
    .filter(alert => !alert.read && showOnlyPriority.includes(alert.priority))
    .slice(0, maxAlerts);

  // Reset do índice ativo se não houver mais alertas ou se o número diminuir
  useEffect(() => {
    if (relevantAlerts.length === 0) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
      if (activeAlertIndex >= relevantAlerts.length) {
        setActiveAlertIndex(0);
      }
    }
  }, [relevantAlerts.length, activeAlertIndex]);

  // Configura o timer para ocultar automaticamente o banner
  useEffect(() => {
    if (autoHideAfter > 0 && isVisible && relevantAlerts.length > 0) {
      // Limpa qualquer timer existente
      if (autoHideTimeoutId) {
        clearTimeout(autoHideTimeoutId);
      }
      
      // Configura novo timer
      const timeoutId = setTimeout(() => {
        setIsVisible(false);
      }, autoHideAfter);
      
      setAutoHideTimeoutId(timeoutId);
      
      // Limpa o timer quando o componente for desmontado
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [autoHideAfter, isVisible, relevantAlerts.length]);

  // Navegação entre alertas
  const goToNextAlert = () => {
    if (activeAlertIndex < relevantAlerts.length - 1) {
      setActiveAlertIndex(prev => prev + 1);
    } else {
      setActiveAlertIndex(0); // Voltar ao primeiro
    }
  };

  const goToPrevAlert = () => {
    if (activeAlertIndex > 0) {
      setActiveAlertIndex(prev => prev - 1);
    } else {
      setActiveAlertIndex(relevantAlerts.length - 1); // Ir para o último
    }
  };

  // Criar chat a partir do alerta
  const handleCreateChat = (alert: Alert) => {
    if (onCreateChat) {
      onCreateChat(alert);
    }
    markAsRead(alert.id);
  };

  // Se não houver alertas ou o banner estiver oculto, não renderizar
  if (relevantAlerts.length === 0 || !isVisible) {
    return null;
  }

  // Alerta atual
  const currentAlert = relevantAlerts[activeAlertIndex];

  return (
    <div className="relative mb-4">
      <div className={`
        w-full px-4 py-3 rounded-lg 
        ${currentAlert.priority === 'high' 
          ? 'bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800' 
          : currentAlert.priority === 'medium'
            ? 'bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800'
            : 'bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800'
        }
      `}>
        {/* Conteúdo do alerta */}
        <div className="flex items-start">
          <div className={`
            p-1 rounded-full flex-shrink-0 mr-3
            ${currentAlert.priority === 'high' 
              ? 'bg-red-200 dark:bg-red-800 text-red-700 dark:text-red-300' 
              : currentAlert.priority === 'medium'
                ? 'bg-amber-200 dark:bg-amber-800 text-amber-700 dark:text-amber-300'
                : 'bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-300'
            }
          `}>
            <AlertTriangle className="h-5 w-5" />
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between">
              <h4 className={`
                font-medium text-sm 
                ${currentAlert.priority === 'high' 
                  ? 'text-red-800 dark:text-red-200' 
                  : currentAlert.priority === 'medium'
                    ? 'text-amber-800 dark:text-amber-200'
                    : 'text-blue-800 dark:text-blue-200'
                }
              `}>
                {currentAlert.title}
              </h4>
              
              <div className="flex">
                {/* Contador de alertas */}
                {relevantAlerts.length > 1 && (
                  <span className={`
                    text-xs rounded-full px-2 py-0.5 mr-2
                    ${currentAlert.priority === 'high' 
                      ? 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200' 
                      : currentAlert.priority === 'medium'
                        ? 'bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200'
                        : 'bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200'
                    }
                  `}>
                    {activeAlertIndex + 1}/{relevantAlerts.length}
                  </span>
                )}
                
                {/* Botão para fechar */}
                <button
                  className={`
                    p-0.5 rounded-full 
                    ${currentAlert.priority === 'high' 
                      ? 'hover:bg-red-200 dark:hover:bg-red-800 text-red-700 dark:text-red-300' 
                      : currentAlert.priority === 'medium'
                        ? 'hover:bg-amber-200 dark:hover:bg-amber-800 text-amber-700 dark:text-amber-300'
                        : 'hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300'
                    }
                  `}
                  onClick={() => dismissAlert(currentAlert.id)}
                  aria-label="Fechar alerta"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <p className={`
              text-sm mt-1 
              ${currentAlert.priority === 'high' 
                ? 'text-red-700 dark:text-red-300' 
                : currentAlert.priority === 'medium'
                  ? 'text-amber-700 dark:text-amber-300'
                  : 'text-blue-700 dark:text-blue-300'
              }
            `}>
              {currentAlert.message}
            </p>
            
            {/* Ações */}
            <div className="mt-2 flex justify-between items-center">
              {/* Navegação entre alertas */}
              {relevantAlerts.length > 1 && (
                <div className="flex">
                  <button
                    className={`
                      p-1 rounded-md text-xs flex items-center
                      ${currentAlert.priority === 'high' 
                        ? 'hover:bg-red-200 dark:hover:bg-red-800 text-red-700 dark:text-red-300' 
                        : currentAlert.priority === 'medium'
                          ? 'hover:bg-amber-200 dark:hover:bg-amber-800 text-amber-700 dark:text-amber-300'
                          : 'hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300'
                      }
                    `}
                    onClick={goToPrevAlert}
                    aria-label="Alerta anterior"
                  >
                    <ChevronLeft className="h-3 w-3 mr-1" />
                    <span>Anterior</span>
                  </button>
                  
                  <button
                    className={`
                      p-1 rounded-md text-xs flex items-center ml-2
                      ${currentAlert.priority === 'high' 
                        ? 'hover:bg-red-200 dark:hover:bg-red-800 text-red-700 dark:text-red-300' 
                        : currentAlert.priority === 'medium'
                          ? 'hover:bg-amber-200 dark:hover:bg-amber-800 text-amber-700 dark:text-amber-300'
                          : 'hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300'
                      }
                    `}
                    onClick={goToNextAlert}
                    aria-label="Próximo alerta"
                  >
                    <span>Próximo</span>
                    <ChevronRight className="h-3 w-3 ml-1" />
                  </button>
                </div>
              )}
              
              {/* Botão para criar chat */}
              <button
                className={`
                  px-3 py-1 rounded text-xs font-medium flex items-center
                  ${currentAlert.priority === 'high' 
                    ? 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200 hover:bg-red-300 dark:hover:bg-red-700' 
                    : currentAlert.priority === 'medium'
                      ? 'bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 hover:bg-amber-300 dark:hover:bg-amber-700'
                      : 'bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 hover:bg-blue-300 dark:hover:bg-blue-700'
                  }
                `}
                onClick={() => handleCreateChat(currentAlert)}
              >
                <MessageSquare className="h-3 w-3 mr-1" />
                Iniciar Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};