/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import React, { useState, useEffect } from 'react';

import { PatientRegistrationContainer } from './PatientRegistrationContainer';
import { StaffAssignmentContainer } from './StaffAssignmentContainer';
import { CareEventsContainer } from './CareEventsContainer';

import { AlertMessage } from '@/components/ui/templates/common/AlertMessage';
import { TabContainer } from '@/components/ui/templates/common/Tabs';

import { IPatient } from '@/types/hospital-network-types';
import { useDigitalCareAppContext } from '@/services/contexts/DigitalCareAppContexts';
import { AlertTriangle, Info } from 'lucide-react';

interface DigitalCareContainerProps {}

export const DigitalCareContainer: React.FC<DigitalCareContainerProps> = () => {
  const { 
    selectedHospital,
    networkData,
    loading,
    error,
    permissions
  } = useDigitalCareAppContext();
  
  // Estado local para mensagens de sistema
  const [systemMessage, setSystemMessage] = useState<{
    type: 'success' | 'error' | 'warning' | 'info';
    text: string;
  } | null>(null);
  
  // Extrair pacientes do hospital selecionado
  const patients = React.useMemo(() => {
    if (!selectedHospital) return [];
    
    const patientList: IPatient[] = [];
    
    selectedHospital.departments.forEach(dept => {
      dept.rooms.forEach(room => {
        room.beds.forEach(bed => {
          if (bed.patient) {
            patientList.push({
              ...bed.patient,
              department: dept.name,
              bedId: bed.id,
              roomNumber: room.roomNumber,
              floor: bed.floor
            } as IPatient);
          }
        });
      });
    });
    
    return patientList;
  }, [selectedHospital]);
  
  // Se não houver hospital selecionado, exibir mensagem
  if (!loading && (!networkData?.hospitals || networkData.hospitals.length === 0)) {
    return (
      <div className="rounded-lg p-8 text-center bg-gray-200 dark:bg-gray-900/40">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-lg font-medium text-yellow-400 mb-2">Nenhum hospital disponível</h2>
        <p className="text-yellow-300">Não foi possível encontrar hospitais disponíveis para seu usuário.</p>
        <p className="text-yellow-300 mt-2">Verifique suas permissões ou entre em contato com o administrador do sistema.</p>
      </div>
    );
  }
  
  // Se não houver hospital selecionado, mas há hospitais disponíveis
  if (!loading && !selectedHospital && networkData?.hospitals && networkData.hospitals.length > 0) {
    return (
      <div className="rounded-lg p-8 text-center bg-gray-800 dark:bg-gray-800">
        <Info className="h-12 w-12 text-blue-500 mx-auto mb-4" />
        <h2 className="text-lg font-medium text-blue-400 mb-2">Selecione um hospital</h2>
        <p className="text-blue-300">Por favor, selecione um hospital no slider acima para visualizar o atendimento digital.</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="rounded-lg p-8 text-center bg-gray-800 dark:bg-gray-800">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-lg font-medium text-red-400 mb-2">Erro ao carregar dados</h2>
        <p className="text-red-300">{error}</p>
      </div>
    );
  }
  
  // Define as abas do sistema de atendimento
  const tabs = [
    {
      id: 'novo-paciente',
      label: 'Registro de Pacientes',
      content: (
        <PatientRegistrationContainer 
          hospital={selectedHospital}
          setSystemMessage={setSystemMessage}
        />
      )
    },
    {
      id: 'atribuir-equipe',
      label: 'Atribuir Equipe Médica',
      content: (
        <StaffAssignmentContainer 
          hospital={selectedHospital}
          patients={patients}
          setSystemMessage={setSystemMessage}
        />
      )
    },
    {
      id: 'eventos-atendimento',
      label: 'Eventos de Atendimento',
      content: (
        <CareEventsContainer 
          hospital={selectedHospital}
          patients={patients}
          setSystemMessage={setSystemMessage}
        />
      )
    }
  ];
  
  return (
    <div className="space-y-6 px-4 py-4">
      {/* Sistema de mensagens */}
      {systemMessage && (
        <div className="mb-6">
          <AlertMessage 
            type={systemMessage.type} 
            message={systemMessage.text}
            onClose={() => setSystemMessage(null)}
          />
        </div>
      )}
      
      {/* Cartões de métricas do hospital */}
      {selectedHospital && (
        <div className="bg-gray-700 dark:bg-gray-800 shadow-sm rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-900/30 dark:bg-blue-900/30 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-300">Total de Leitos</p>
              <p className="text-2xl font-semibold text-blue-200">{selectedHospital.metrics.overall.totalBeds}</p>
              <p className="text-xs text-blue-400">
                {selectedHospital.metrics.overall.periodComparison.beds.trend === 'up' ? (
                  <span className="text-green-400">↑ {selectedHospital.metrics.overall.periodComparison.beds.value}</span>
                ) : (
                  <span className="text-red-400">↓ {selectedHospital.metrics.overall.periodComparison.beds.value}</span>
                )}
                {' em relação ao período anterior'}
              </p>
            </div>
            
            <div className="bg-green-900/30 dark:bg-green-900/30 rounded-lg p-4">
              <p className="text-sm font-medium text-green-300">Taxa de Ocupação</p>
              <p className="text-2xl font-semibold text-green-200">{selectedHospital.metrics.overall.occupancyRate}%</p>
              <p className="text-xs text-green-400">
                {selectedHospital.metrics.overall.periodComparison.occupancy.trend === 'up' ? (
                  <span className="text-green-400">↑ {selectedHospital.metrics.overall.periodComparison.occupancy.value}%</span>
                ) : (
                  <span className="text-red-400">↓ {selectedHospital.metrics.overall.periodComparison.occupancy.value}%</span>
                )}
                {' em relação ao período anterior'}
              </p>
            </div>
            
            <div className="bg-purple-900/30 dark:bg-purple-900/30 rounded-lg p-4">
              <p className="text-sm font-medium text-purple-300">Total de Pacientes</p>
              <p className="text-2xl font-semibold text-purple-200">{selectedHospital.metrics.overall.totalPatients}</p>
              <p className="text-xs text-purple-400">
                {selectedHospital.metrics.overall.periodComparison.patients.trend === 'up' ? (
                  <span className="text-green-400">↑ {selectedHospital.metrics.overall.periodComparison.patients.value}</span>
                ) : (
                  <span className="text-red-400">↓ {selectedHospital.metrics.overall.periodComparison.patients.value}</span>
                )}
                {' em relação ao período anterior'}
              </p>
            </div>
            
            <div className="bg-yellow-900/30 dark:bg-yellow-900/30 rounded-lg p-4">
              <p className="text-sm font-medium text-yellow-300">Leitos Disponíveis</p>
              <p className="text-2xl font-semibold text-yellow-200">{selectedHospital.metrics.overall.availableBeds}</p>
              <p className="text-xs text-yellow-400">
                Duração média de internação: {selectedHospital.metrics.overall.avgStayDuration} dias
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Sistema de abas principal */}
      <TabContainer tabs={tabs} defaultTab="novo-paciente" />
    </div>
  );
};