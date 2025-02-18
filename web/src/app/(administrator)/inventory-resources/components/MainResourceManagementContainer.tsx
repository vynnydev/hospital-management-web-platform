import { Alert, AlertDescription } from '@/components/ui/organisms/alert';
import { useNetworkData } from '@/services/hooks/useNetworkData';
import { useStaffData } from '@/services/hooks/useStaffData';
import { Loader2 } from 'lucide-react';
import React from 'react';
import { ResourceManagementMap } from './ResourceManagementMap';


interface IResourceManagementContainerProps {
  selectedHospitalId?: string;
}

export const MainResourceManagementContainer: React.FC<IResourceManagementContainerProps> = ({
  selectedHospitalId
}) => {
  // Hooks principais
  const { 
    networkData, 
    currentUser, 
    loading: networkLoading, 
    error: networkError 
  } = useNetworkData();

  const {
    staffData,
    loading: staffLoading,
    error: staffError
  } = useStaffData(selectedHospitalId);

  // Estado de carregamento combinado
  const isLoading = networkLoading || staffLoading;

  // Erros combinados
  const hasError = networkError || staffError;
  const errorMessage = networkError || staffError;

  // Verifica se os dados necessários estão presentes
  const hasRequiredData = networkData && staffData;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto" />
          <p className="mt-2 text-gray-600 dark:text-gray-300">Carregando recursos...</p>
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
    <div className="space-y-4">
      {/* Aqui você pode adicionar componentes de header, navegação ou outros elementos comuns */}
      
      {/* Componente principal do mapa de recursos */}
      <ResourceManagementMap
        networkData={networkData}
        staffData={staffData}
      />

      {/* Aqui você pode adicionar componentes adicionais que dependam dos mesmos dados */}
    </div>
  );
};

// HOC para garantir que o dark mode e outros contextos estejam disponíveis
export const ResourceManagementContainerWithProviders: React.FC<IResourceManagementContainerProps> = (props) => {
  return (
    <MainResourceManagementContainer {...props} />
  );
};