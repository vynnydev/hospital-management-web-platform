/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { useNetworkData } from '@/services/hooks/network-hospital/useNetworkData';
import type { IHospital } from '@/types/hospital-network-types';
import { useAlerts } from '@/components/ui/templates/providers/alerts/AlertsProvider';
import { AlertDetail } from '@/components/ui/templates/alerts/AlertDetail';
import { CreateAlertForm } from '@/components/ui/templates/alerts/CreateAlertForm';
import { AIAlertSuggestions } from '@/components/ui/templates/alerts/AI/AIAlertSuggestions';
import { SelectedHospitalsTag } from '../SelectedHospitalsTag';
import { HospitalsList } from '../HospitalsList';
import { AlertList } from '@/components/ui/templates/alerts/AlertList';
import { IAlert } from '@/types/alert-types';

interface ChatAlertsTabProps {
  initialHospital?: string;
  onSendMessage?: (message: string) => void;
}

type ViewMode = 'list' | 'detail' | 'create' | 'suggestions' | 'hospitals';

export const ChatAlertsTab: React.FC<ChatAlertsTabProps> = ({
  initialHospital,
  onSendMessage
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedAlert, setSelectedAlert] = useState<IAlert | null>(null);
  const [selectedHospitals, setSelectedHospitals] = useState<IHospital[]>([]);
  const { alerts } = useAlerts();
  const { networkData } = useNetworkData();
  
  // Retorna os hospitais disponíveis do networkData
  const availableHospitals = networkData?.hospitals || [];
  
  // Função para lidar com a seleção de hospitais
  const handleHospitalSelect = (hospitalId: string) => {
    const hospital = availableHospitals.find(h => h.id === hospitalId);
    
    if (!hospital) return;
    
    // Verificar se o hospital já está selecionado
    const isAlreadySelected = selectedHospitals.some(h => h.id === hospitalId);
    
    if (isAlreadySelected) {
      // Remover o hospital da seleção
      setSelectedHospitals(prev => prev.filter(h => h.id !== hospitalId));
    } else {
      // Adicionar o hospital à seleção
      setSelectedHospitals(prev => [...prev, hospital]);
    }
  };
  
  // Função para remover um hospital da seleção
  const handleRemoveHospital = (hospitalId: string) => {
    setSelectedHospitals(prev => prev.filter(h => h.id !== hospitalId));
  };
  
  // Função para lidar com a seleção de um alerta
  const handleAlertSelect = (alert: IAlert) => {
    setSelectedAlert(alert);
    setViewMode('detail');
  };
  
  // Função para lidar com ações em alertas
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
    setViewMode('list');
  };
  
  // Função para lidar com a criação de um novo alerta
  const handleCreateAlertSuccess = () => {
    // Voltar para a lista de alertas após criar um novo alerta
    setViewMode('list');
    setSelectedHospitals([]);
  };
  
  // Função para lidar com o cancelamento da criação de alerta
  const handleCreateAlertCancel = () => {
    setViewMode('list');
  };
  
  // Função para lidar com sugestões da IA
  const handleAISuggestion = (alertData: Partial<IAlert>) => {
    // Se foi solicitado para criar um alerta com base na sugestão da IA
    setViewMode('create');
  };
  
  // Renderizar o conteúdo com base no modo de visualização atual
  const renderContent = () => {
    switch (viewMode) {
      case 'detail':
        return (
          <AlertDetail
            alert={selectedAlert}
            onBack={() => setViewMode('list')}
            onTakeAction={handleAlertAction}
            showHospitalInfo={true}
          />
        );
        
      case 'create':
        return (
          <CreateAlertForm
                selectedHospitals={selectedHospitals}
                onCancel={handleCreateAlertCancel}
                onSuccess={handleCreateAlertSuccess} 
                hospitalId={networkData?.hospitals[0]?.id || ''}          
            />
        );
        
      case 'suggestions':
        return (
          <AIAlertSuggestions
            selectedHospitalId={selectedHospitals.length === 1 ? selectedHospitals[0].id : undefined}
            onCreateAlert={handleAISuggestion}
            onViewAlerts={() => setViewMode('list')}
          />
        );
        
      case 'hospitals':
        return (
          <>
            <SelectedHospitalsTag
              hospitals={availableHospitals}
              selectedHospitals={selectedHospitals}
              onRemove={handleRemoveHospital}
            />
            
            <HospitalsList
              hospitals={availableHospitals}
              selectedHospitals={selectedHospitals.map(h => h.id)}
              onHospitalSelect={handleHospitalSelect}
            />
          </>
        );
        
      case 'list':
      default:
        return (
          <AlertList
            selectedHospitalId={selectedHospitals.length === 1 ? selectedHospitals[0].id : undefined}
            onAlertSelect={handleAlertSelect}
          />
        );
    }
  };
  
  // Determinar qual botão de navegação está ativo
  const isButtonActive = (mode: ViewMode) => viewMode === mode;
  
  return (
    <div className="space-y-4">
      {/* Barra de navegação */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 ${
              isButtonActive('list')
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Alertas
            {alerts.filter(a => !a.read && (a.status === 'pending' || a.status === 'acknowledged')).length > 0 && (
              <span className="ml-1 w-5 h-5 flex items-center justify-center bg-red-500 text-white text-xs rounded-full">
                {alerts.filter(a => !a.read && (a.status === 'pending' || a.status === 'acknowledged')).length}
              </span>
            )}
          </button>
          
          <button
            onClick={() => setViewMode('suggestions')}
            className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 ${
              isButtonActive('suggestions')
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Sugestões IA
          </button>
          
          <button
            onClick={() => setViewMode('hospitals')}
            className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 ${
              isButtonActive('hospitals')
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Hospitais
            {selectedHospitals.length > 0 && (
              <span className="ml-1 w-5 h-5 flex items-center justify-center bg-blue-500 text-white text-xs rounded-full">
                {selectedHospitals.length}
              </span>
            )}
          </button>
        </div>
        
        <button
          onClick={() => setViewMode('create')}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center gap-1"
          disabled={selectedHospitals.length === 0 && viewMode !== 'hospitals'}
        >
          Criar Alerta
        </button>
      </div>
      
      {/* Conteúdo principal */}
      <div>
        {renderContent()}
      </div>
    </div>
  );
};