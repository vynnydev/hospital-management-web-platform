import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/organisms/dialog";
import { AIMetricsGenerator } from './AIMetricsGenerator';
import { MetricsAlertsIntegration } from './MetricsAlertsIntegration';
import { INetworkData } from '@/types/hospital-network-types';
import { useUserMetrics } from '@/hooks/user/metrics/useUserMetrics';
import { Brain, Bell } from 'lucide-react';
import { AlertsProvider } from '../providers/alerts/AlertsProvider';

interface AdvancedMetricsManagementProps {
  isOpen: boolean;
  onClose: () => void;
  networkData: INetworkData;
  selectedHospital: string | null;
  currentMetrics: {
    totalBeds: number;
    totalPatients: number;
    averageOccupancy: number;
  };
}

export const AdvancedMetricsManagement: React.FC<AdvancedMetricsManagementProps> = ({
  isOpen,
  onClose,
  networkData,
  selectedHospital,
  currentMetrics
}) => {
  const { addToPanel, refreshMetrics } = useUserMetrics();
  const [activeTab, setActiveTab] = useState('ai-generator');

  // Função para criar uma nova métrica
  const handleMetricCreate = async (metricType: string, metricId: string) => {
    try {
      // Usar o serviço de métricas para adicionar ao painel
      await addToPanel(metricId);
      
      // Atualizar a lista de métricas
      await refreshMetrics();
      
      return Promise.resolve();
    } catch (error) {
      console.error('Erro ao adicionar métrica ao painel:', error);
      return Promise.reject(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl p-0 bg-gray-900 border-indigo-800/30 text-white rounded-xl shadow-2xl overflow-hidden">
        {/* Cabeçalho fixo */}
        <DialogHeader className="px-6 pt-6 pb-3 bg-[#1e1e38] border-b border-indigo-900/30">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-indigo-700 flex items-center justify-center mr-3">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-white flex items-center">
                Gestão Avançada de Métricas
              </DialogTitle>
              <DialogDescription className="text-indigo-200">
                Gere, configure e monitore métricas inteligentes para seu dashboard
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        {/* Área de navegação principal fixa */}
        <div className="p-4 bg-[#1e2334] border-b border-gray-800">
          <div className="grid grid-cols-2 gap-4">
            <button 
              className={`py-4 px-6 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                activeTab === 'ai-generator' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-[#24293e] text-gray-300 hover:bg-indigo-600/20'
              }`}
              onClick={() => setActiveTab('ai-generator')}
            >
              <Brain className="h-5 w-5" />
              <span className="font-medium">Geração com IA</span>
            </button>
            <button 
              className={`py-4 px-6 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                activeTab === 'alerts-integration' 
                  ? 'bg-amber-600 text-white' 
                  : 'bg-[#24293e] text-gray-300 hover:bg-amber-600/20'
              }`}
              onClick={() => setActiveTab('alerts-integration')}
            >
              <Bell className="h-5 w-5" />
              <span className="font-medium">Integração com Alertas</span>
            </button>
          </div>
        </div>
        
        {/* Área de conteúdo dinâmico */}
        <div className="h-[70vh] overflow-hidden">
          <AlertsProvider hospitalId={selectedHospital || ''}>
            {activeTab === 'ai-generator' && (
              <AIMetricsGenerator 
                networkData={networkData}
                selectedHospital={selectedHospital}
                onMetricCreate={handleMetricCreate}
                onClose={onClose}
              />
            )}
            
            {activeTab === 'alerts-integration' && (
              <MetricsAlertsIntegration 
                networkData={networkData}
                selectedHospital={selectedHospital}
                currentMetrics={currentMetrics}
              />
            )}
          </AlertsProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
};