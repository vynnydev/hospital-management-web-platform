import React, { useState, useEffect } from 'react';
import { IPatient } from '@/types/hospital-network-types';

interface PatientSelectorProps {
  patients: IPatient[];
  onSelect: (patient: IPatient) => void;
  selectedPatientId?: string;
}

export const PatientSelector: React.FC<PatientSelectorProps> = ({ 
  patients, 
  onSelect, 
  selectedPatientId 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPatients, setFilteredPatients] = useState<IPatient[]>(patients);
  
  // Atualizar pacientes filtrados quando a lista de pacientes ou o termo de busca mudar
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPatients(patients);
      return;
    }
    
    const lowercasedSearch = searchTerm.toLowerCase();
    const filtered = patients.filter(patient => 
      patient.name.toLowerCase().includes(lowercasedSearch) ||
      patient.id.toLowerCase().includes(lowercasedSearch) ||
      patient.diagnosis.toLowerCase().includes(lowercasedSearch)
    );
    
    setFilteredPatients(filtered);
  }, [patients, searchTerm]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handlePatientClick = (patient: IPatient) => {
    onSelect(patient);
  };
  
  // Função para obter status de exibição do paciente
  const getPatientStatusDisplay = (patient: IPatient) => {
    const status = patient.careHistory?.statusHistory[0]?.status || 'Não definido';
    const department = patient.careHistory?.statusHistory[0]?.department || 'Não definido';
    
    return {
      status,
      department,
      color: getStatusColor(status)
    };
  };
  
  // Função para determinar a cor do badge de status
  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      'Aguardando Atendimento': 'bg-yellow-100 text-yellow-800',
      'Em Procedimento': 'bg-blue-100 text-blue-800',
      'Em Recuperação': 'bg-green-100 text-green-800',
      'Em Observação': 'bg-purple-100 text-purple-800',
      'Alta': 'bg-gray-100 text-gray-800'
    };
    
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="mb-4">
        <label htmlFor="patient-search" className="block text-sm font-medium text-gray-700">
          Buscar Paciente
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <input
            type="text"
            id="patient-search"
            placeholder="Digite o nome, ID ou diagnóstico do paciente..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="focus:ring-blue-500 focus:border-blue-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      <div className="border border-gray-200 rounded-md overflow-hidden">
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-10 gap-4 text-sm font-medium text-gray-700">
            <div className="col-span-4">Nome</div>
            <div className="col-span-3">Diagnóstico</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1">Ação</div>
          </div>
        </div>
        
        <div className="max-h-64 overflow-y-auto">
          {filteredPatients.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              Nenhum paciente encontrado
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredPatients.map(patient => {
                const { status, department, color } = getPatientStatusDisplay(patient);
                return (
                  <li key={patient.id} className={`px-4 py-3 hover:bg-gray-50 ${selectedPatientId === patient.id ? 'bg-blue-50' : ''}`}>
                    <div className="grid grid-cols-10 gap-4 items-center text-sm">
                      <div className="col-span-4">
                        <p className="font-medium text-gray-900 truncate">{patient.name}</p>
                        <p className="text-xs text-gray-500">ID: {patient.id}</p>
                      </div>
                      <div className="col-span-3">
                        <p className="text-gray-600 truncate">{patient.diagnosis}</p>
                      </div>
                      <div className="col-span-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
                          {status}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">{department}</p>
                      </div>
                      <div className="col-span-1 text-right">
                        <button
                          onClick={() => handlePatientClick(patient)}
                          className="inline-flex items-center p-1 border border-transparent rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};