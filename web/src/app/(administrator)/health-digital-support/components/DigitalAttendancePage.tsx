/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import { NextPage } from 'next';
import { useNetworkData } from '@/services/hooks/network-hospital/useNetworkData';
import { usePermissions } from '@/services/hooks/auth/usePermissions';
import PatientRegistrationContainer from './PatientRegistrationContainer';
import PatientList from './PatientList';
import PatientAssignmentForm from './PatientAssignmentForm';

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
  
  const handleSelectPatientForAssignment = (patientId: string, admissionId: string) => {
    setSelectedPatientId(patientId);
    setSelectedAdmissionId(admissionId);
    setActiveTab(AttendanceTab.PatientAssignment);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="max-w-lg p-6 bg-red-50 text-red-700 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Erro ao carregar dados</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }
  
  if (!currentUser) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="max-w-lg p-6 bg-yellow-50 text-yellow-700 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Acesso não autorizado</h2>
          <p>Você precisa estar logado para acessar esta página.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-6 bg-gray-200 dark:bg-gray-800">
      <h1 className="text-3xl font-bold text-primary-900 mb-6">Atendimento Digital</h1>
      
      {/* Abas */}
      <div className="border-b border-gray-200 mb-6">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-2">
            <button
              className={`inline-block py-3 px-4 text-sm font-medium ${
                activeTab === AttendanceTab.PatientList
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300'
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
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300'
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
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300'
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
        {activeTab === AttendanceTab.PatientList && (
          <PatientList 
            onSelectPatientForAssignment={handleSelectPatientForAssignment}
          />
        )}
        
        {activeTab === AttendanceTab.PatientRegistration && (
          <PatientRegistrationContainer 
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