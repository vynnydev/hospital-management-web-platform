// components/resources/MainResourceManagementContainer.tsx
import React, { useState } from 'react';
import { useNetworkData } from '@/hooks/network-hospital/useNetworkData';
import { useStaffData } from '@/hooks/staffs/useStaffData';
import { ResourceManagementMap } from './ResourceManagementMap';
import { Alert, AlertDescription } from '@/components/ui/organisms/alert';
import { Loader2 } from 'lucide-react';

export const MainResourceManagementContainer: React.FC = () => {
  // Estado interno para o hospital selecionado
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(null);
  
  // Hooks principais
  const { 
    networkData, 
    loading: networkLoading, 
    error: networkError 
  } = useNetworkData();

  const {
    staffData,
    loading: staffLoading,
    error: staffError
  } = useStaffData();

  // Estado de carregamento combinado
  const isLoading = networkLoading || staffLoading;

  // Erros combinados
  const hasError = networkError || staffError;
  const errorMessage = networkError || staffError;

  // Verifica se os dados necessários estão presentes
  const hasRequiredData = networkData && staffData;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-gray-800 dark:bg-gray-900 rounded-xl shadow-lg">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto" />
          <p className="mt-2 text-gray-300 dark:text-gray-400">Carregando recursos...</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertDescription>
          Erro ao carregar dados: {errorMessage}
        </AlertDescription>
      </Alert>
    );
  }

  if (!hasRequiredData) {
    return (
      <Alert className="mb-4">
        <AlertDescription>
          Não foi possível carregar os dados necessários. Tente novamente mais tarde.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="h-full">
      <ResourceManagementMap
        networkData={networkData}
        staffData={staffData}
        selectedHospitalId={selectedHospitalId}
        setSelectedHospitalId={setSelectedHospitalId}
      />
    </div>
  );
};

// HOC para garantir que o dark mode e outros contextos estejam disponíveis
export const ResourceManagementContainerWithProviders: React.FC = () => {
  return (
    <MainResourceManagementContainer />
  );
};