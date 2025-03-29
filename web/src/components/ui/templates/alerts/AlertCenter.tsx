/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Bell, MessageCircle, Sparkles, X } from 'lucide-react';
import { AlertBadge } from './AlertBadge';
import { AlertList } from './AlertList';
import { AlertDetail } from './AlertDetail';
import { Button } from '@/components/ui/organisms/button';
import { useNetworkData } from '@/services/hooks/network-hospital/useNetworkData';
import { AlertsProvider, useAlertsProvider } from '../providers/alerts/AlertsProvider';
import { IAlert } from '@/types/alert-types';

interface AlertCenterProps {
  hospitalId?: string;
  onSendMessage?: (message: string) => void;
  position?: 'top-right' | 'bottom-right' | 'bottom-left' | 'top-left';
  showFloatingButton?: boolean;
}

const AlertCenterContent: React.FC<Omit<AlertCenterProps, 'hospitalId'>> = ({
  onSendMessage,
  position = 'bottom-right',
  showFloatingButton = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<IAlert | null>(null);
  const { alerts, unreadCount, markAllAsRead } = useAlertsProvider();
  const { currentUser } = useNetworkData();
  
  // Fechar painel ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Se clicou fora do painel e ele está aberto, fechar
      if (isOpen && !target.closest('.alert-center-panel') && !target.closest('.alert-center-button')) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  // Posicionamento do painel
  const getPanelPosition = () => {
    switch (position) {
      case 'top-right':
        return 'top-16 right-4';
      case 'bottom-right':
        return 'bottom-16 right-4';
      case 'bottom-left':
        return 'bottom-16 left-4';
      case 'top-left':
        return 'top-16 left-4';
      default:
        return 'bottom-16 right-4';
    }
  };
  
  // Manipular a seleção de alerta
  const handleAlertSelect = (alert: IAlert) => {
    setSelectedAlert(alert);
  };
  
  // Manipular ações em alertas
  const handleAlertAction = (alert: IAlert, action: string) => {
    // Se o callback onSendMessage foi fornecido, enviar uma mensagem relacionada à ação
    if (onSendMessage) {
      switch (action) {
        case 'detalhes':
          onSendMessage(`Solicitando mais detalhes sobre o alerta: ${alert.title}`);
          break;
        case 'protocolo-emergência':
          onSendMessage(`Iniciando protocolo de emergência para: ${alert.title}. Por favor, confirmem recebimento.`);
          break;
        case 'preparar-recepção':
          onSendMessage(`Preparando recepção para ambulância com paciente em condição: ${alert.message}. Equipe médica, favor posicionar.`);
          break;
        case 'solicitar-recursos':
          onSendMessage(`Solicitando recursos adicionais para atender: ${alert.title}. Detalhes: ${alert.message}`);
          break;
        default:
          onSendMessage(`Tomando ação "${action}" no alerta: ${alert.title}`);
      }
    }
    
    // Voltar para a lista de alertas
    setSelectedAlert(null);
  };
  
  return (
    <>
      {/* Botão flutuante do AlertCenter */}
      {showFloatingButton && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`alert-center-button -mt-[550px] left-80 fixed ${position.replace('-', ' ')} z-40 p-2 rounded-full shadow-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all ${
            isOpen ? 'scale-110' : 'scale-100'
          }`}
        >
          <AlertBadge showCount={true} size="md" className="m-0" />
        </button>
      )}
      
      {/* Painel de Alertas */}
      {isOpen && (
        <div className={`alert-center-panel fixed ${getPanelPosition()} z-50 w-96 max-h-[80vh] rounded-xl shadow-xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-200 ease-in-out`}>
          {/* Cabeçalho */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-800 text-white">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              <h3 className="font-medium">Centro de Alertas</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-red-500 rounded-full text-xs font-bold">
                  {unreadCount} {unreadCount === 1 ? 'novo' : 'novos'}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs px-2 py-1 bg-white/20 hover:bg-white/30 rounded-md transition-colors"
                >
                  Marcar todos como lidos
                </button>
              )}
              
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Conteúdo */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {selectedAlert ? (
              <AlertDetail
                alert={selectedAlert}
                onBack={() => setSelectedAlert(null)}
                onTakeAction={handleAlertAction}
                showHospitalInfo={true}
              />
            ) : (
              <AlertList
                onAlertSelect={handleAlertSelect}
                className="max-h-full flex-1"
              />
            )}
            
            {/* Footer */}
            {!selectedAlert && (
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {alerts.filter(a => a.status !== 'dismissed' && a.status !== 'resolved').length} alertas ativos
                </span>
                
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs flex items-center gap-1 text-gray-600 dark:text-gray-300"
                    onClick={() => {
                      setIsOpen(false);
                      if (onSendMessage) {
                        onSendMessage('Abrindo o chat para discutir os alertas recentes');
                      }
                    }}
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    Chat
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs flex items-center gap-1 text-indigo-600 dark:text-indigo-400"
                    onClick={() => {
                      setIsOpen(false);
                      // Aqui você poderia abrir o painel de IA
                    }}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Sugestões IA
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

// Componente principal que inclui o provedor de alertas
export const AlertCenter: React.FC<AlertCenterProps> = ({ 
  hospitalId,
  ...otherProps
}) => {
  return (
    <AlertsProvider hospitalId={hospitalId}>
      <AlertCenterContent {...otherProps} />
    </AlertsProvider>
  );
};