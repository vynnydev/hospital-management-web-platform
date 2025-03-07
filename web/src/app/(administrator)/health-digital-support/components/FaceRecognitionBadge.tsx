import { useMemo } from 'react';

interface FaceRecognitionBadgeProps {
  patientId: string;
}

type FaceRecognitionStatus = 'verified' | 'processing' | 'unverified';

export default function FaceRecognitionBadge({ patientId }: FaceRecognitionBadgeProps) {
  // Função para determinar qual ícone de reconhecimento facial mostrar
  const status: FaceRecognitionStatus = useMemo(() => {
    // Simulação: baseado no ID do paciente para demonstração
    const patientIdNumber = parseInt(patientId.replace(/\D/g, '') || '0');
    
    if (patientIdNumber % 3 === 0) {
      return 'verified'; // Verificado
    } else if (patientIdNumber % 3 === 1) {
      return 'processing'; // Em processamento
    } else {
      return 'unverified'; // Não verificado
    }
  }, [patientId]);

  const getBadgeTitle = () => {
    switch (status) {
      case 'verified':
        return 'Identidade verificada por reconhecimento facial';
      case 'processing':
        return 'Verificação de identidade em andamento';
      case 'unverified':
        return 'Identidade não verificada';
      default:
        return 'Status de verificação desconhecido';
    }
  };

  return (
    <div className="absolute -top-1 -right-1">
      {status === 'verified' && (
        <div 
          className="w-5 h-5 bg-green-500 dark:bg-green-400 rounded-full flex items-center justify-center" 
          title={getBadgeTitle()}
        >
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
      )}
      {status === 'processing' && (
        <div 
          className="w-5 h-5 bg-yellow-500 dark:bg-yellow-400 rounded-full flex items-center justify-center animate-pulse" 
          title={getBadgeTitle()}
        >
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
      )}
      {status === 'unverified' && (
        <div 
          className="w-5 h-5 bg-red-500 dark:bg-red-400 rounded-full flex items-center justify-center" 
          title={getBadgeTitle()}
        >
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
        </div>
      )}
    </div>
  );
}