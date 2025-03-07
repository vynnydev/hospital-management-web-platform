/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useNetworkData } from '@/services/hooks/network-hospital/useNetworkData';
import { usePermissions } from '@/services/hooks/auth/usePermissions';
import PatientRegistrationContainer from './PatientRegistrationContainer';
import EnhancedPatientList from './EnhancedPatientList';
import PatientAssignmentForm from './PatientAssignmentForm';
import HospitalSelector from './HospitalSelector';

enum AttendanceTab {
  PatientList = 'patient-list',
  PatientRegistration = 'patient-registration',
  PatientAssignment = 'patient-assignment',
}

export const DigitalAttendancePage = () => {
  const { networkData, currentUser, loading, error } = useNetworkData();
  const { isAdmin, isHospitalManager } = usePermissions();
  const [activeTab, setActiveTab] = useState<AttendanceTab>(AttendanceTab.PatientList);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedAdmissionId, setSelectedAdmissionId] = useState<string | null>(null);
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>('');
  
  // Definir hospital padrão com base nas permissões do usuário
  useEffect(() => {
    if (networkData && currentUser) {
      if (isHospitalManager && currentUser.hospitalId) {
        // Se for gerente de hospital, usar o hospital associado ao usuário
        setSelectedHospitalId(currentUser.hospitalId);
      } else if (isAdmin && networkData.hospitals.length > 0) {
        // Se for admin, usar o primeiro hospital por padrão
        setSelectedHospitalId(networkData.hospitals[0].id);
      }
    }
  }, [networkData, currentUser, isHospitalManager, isAdmin]);
  
  const handleSelectPatientForAssignment = (patientId: string, admissionId: string) => {
    setSelectedPatientId(patientId);
    setSelectedAdmissionId(admissionId);
    setActiveTab(AttendanceTab.PatientAssignment);
  };
  
  const handleHospitalChange = (hospitalId: string) => {
    setSelectedHospitalId(hospitalId);
  };

  // Obter informações do hospital selecionado
  const selectedHospital = networkData?.hospitals.find(h => h.id === selectedHospitalId);
  
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 dark:border-primary-400"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-white dark:bg-gray-900">
        <div className="max-w-lg p-6 bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Erro ao carregar dados</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }
  
  if (!currentUser) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-white dark:bg-gray-900">
        <div className="max-w-lg p-6 bg-yellow-50 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Acesso não autorizado</h2>
          <p>Você precisa estar logado para acessar esta página.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="px-4 py-6 bg-white dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h1 className="text-3xl font-bold text-primary-900 dark:text-primary-400 mb-4 md:mb-0">Atendimento Digital</h1>
        
        {/* Seletor de Hospital - Apenas para administradores ou se houver mais de um hospital */}
        {isAdmin && networkData?.hospitals && networkData.hospitals.length > 1 && (
          <div className="w-full md:w-[380px]">
            <HospitalSelector
              selectedHospitalId={selectedHospitalId}
              onSelect={handleHospitalChange}
            />
          </div>
        )}
      </div>
      
      {/* Abas */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-2">
            <button
              className={`inline-block py-3 px-4 text-sm font-medium ${
                activeTab === AttendanceTab.PatientList
                  ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600'
              }`}
              onClick={() => setActiveTab(AttendanceTab.PatientList)}
            >
              Lista de Pacientes
            </button>
          </li>
          <li className="mr-2">
            <button
              className={`inline-block py-3 px-4 text-sm font-medium ${
                activeTab === AttendanceTab.PatientRegistration
                  ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600'
              }`}
              onClick={() => setActiveTab(AttendanceTab.PatientRegistration)}
            >
              Novo Paciente
            </button>
          </li>
          {selectedPatientId && (
            <li className="mr-2">
              <button
                className={`inline-block py-3 px-4 text-sm font-medium ${
                  activeTab === AttendanceTab.PatientAssignment
                    ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => setActiveTab(AttendanceTab.PatientAssignment)}
              >
                Atribuição de Paciente
              </button>
            </li>
          )}
        </ul>
      </div>
      
      {/* Conteúdo da Aba Ativa */}
      <div className="mt-6">
        {activeTab === AttendanceTab.PatientList && selectedHospital && (
          <EnhancedPatientList 
            hospital={selectedHospital}
            onSelectPatientForAssignment={handleSelectPatientForAssignment}
          />
        )}
        
        {activeTab === AttendanceTab.PatientRegistration && (
          <PatientRegistrationContainer 
            hospitalId={selectedHospitalId}
            onSuccess={(patientId) => {
              setSelectedPatientId(patientId);
              setActiveTab(AttendanceTab.PatientList);
            }}
          />
        )}
        
        {activeTab === AttendanceTab.PatientAssignment && selectedPatientId && (
          <PatientAssignmentForm
            patientId={selectedPatientId}
            admissionId={selectedAdmissionId || undefined}
            onSuccess={() => {
              setActiveTab(AttendanceTab.PatientList);
              setSelectedPatientId(null);
              setSelectedAdmissionId(null);
            }}
          />
        )}
      </div>
    </div>
  );
};