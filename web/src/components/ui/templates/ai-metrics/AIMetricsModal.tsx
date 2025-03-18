import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/organisms/dialog";
import { Brain } from 'lucide-react';
import { AIMetricsGenerator } from './AIMetricsGenerator';
import { INetworkData } from '@/types/hospital-network-types';
import { useUserMetrics } from '@/services/hooks/user/metrics/useUserMetrics';

interface AIMetricsModalProps {
  isOpen: boolean;
  onClose: () => void;
  networkData: INetworkData;
  selectedHospital: string | null;
}

export const AIMetricsModal: React.FC<AIMetricsModalProps> = ({
  isOpen,
  onClose,
  networkData,
  selectedHospital
}) => {
  const { addToPanel, refreshMetrics } = useUserMetrics();

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
      <DialogContent className="max-w-5xl p-0 bg-gray-950 border-gray-800 text-white overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="flex items-center text-xl font-bold text-white">
            <Brain className="h-6 w-6 text-indigo-400 mr-2" />
            Assistente IA Generativa
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Gere métricas personalizadas através de diálogo interativo com a IA
          </DialogDescription>
        </DialogHeader>
        
        <div className="h-[70vh]">
          <AIMetricsGenerator 
            networkData={networkData}
            selectedHospital={selectedHospital}
            onMetricCreate={handleMetricCreate}
            onClose={onClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};