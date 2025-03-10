/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { usePatientManagement } from '@/services/hooks/digital-care-service/usePatientManagement';
import { IHospital } from '@/types/hospital-network-types';
import { IPatientRegistration } from '@/types/patient-types';
import EnhancedPatientCard from './EnhancedPatientCard';
import PatientSearch from './PatientSearch';
import PatientFilters from './PatientFilters';
import Link from 'next/link';

interface EnhancedPatientListProps {
  hospital: IHospital;
  onSelectPatientForAssignment?: (patientId: string, admissionId: string) => void;
}

export default function EnhancedPatientList({ 
  hospital, 
  onSelectPatientForAssignment 
}: EnhancedPatientListProps) {
  const { patients, admissions, isLoading, error, searchPatients, filterPatients } = usePatientManagement();
  const [displayedPatients, setDisplayedPatients] = useState<IPatientRegistration[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<IPatientRegistration[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 10;
  
  // Filtrar pacientes por hospital
  useEffect(() => {
    if (patients && hospital) {
      // Lógica para identificar pacientes do hospital atual
      // Vamos usar os IDs de admissão para filtrar os pacientes que estão no hospital
      const hospitalAdmissions = admissions.filter(admission => {
        const admissionBed = hospital.departments
          .flatMap(dept => dept.rooms)
          .flatMap(room => room.beds)
          .find(bed => bed.id === admission.bedId);
        
        return !!admissionBed;
      });
      
      // Cria um conjunto de IDs de pacientes do hospital usando Array.from em vez de spread operator
      const hospitalPatientIds = Array.from(
        new Set(hospitalAdmissions.map(admission => admission.patientId))
      );
      
      const hospitalPatients = patients.filter(patient => 
        hospitalPatientIds.includes(patient.id || '')
      );
      
      setFilteredPatients(hospitalPatients);
    }
  }, [patients, admissions, hospital]);
  
  // Aplicar busca e filtros sempre que os valores mudarem
  useEffect(() => {
    let result = filteredPatients;
    
    // Aplicar busca
    if (searchTerm) {
      result = searchPatients(searchTerm).filter(patient => 
        filteredPatients.some(p => p.id === patient.id)
      );
    }
    
    // Aplicar filtros ativos
    if (Object.keys(activeFilters).length > 0) {
      result = filterPatients(activeFilters).filter(patient => 
        filteredPatients.some(p => p.id === patient.id)
      );
    }
    
    setDisplayedPatients(result);
    setCurrentPage(1); // Voltar para a primeira página quando a busca ou filtros mudarem
  }, [filteredPatients, searchTerm, activeFilters, searchPatients, filterPatients]);
  
  // Calcular pacientes da página atual
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = displayedPatients.slice(indexOfFirstPatient, indexOfLastPatient);
  
  // Calcular total de páginas
  const totalPages = Math.ceil(displayedPatients.length / patientsPerPage);
  
  // Lidar com a mudança na busca
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };
  
  // Lidar com a mudança nos filtros
  const handleFilterChange = (filters: Record<string, any>) => {
    setActiveFilters(filters);
  };
  
  // Lidar com a navegação entre páginas
  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500 dark:border-primary-400"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md">
        Erro ao carregar pacientes: {error}
      </div>
    );
  }
  
  return (
    <div className="space-y-6">      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 className="text-2xl font-bold text-primary-900 dark:text-primary-400 mb-4 md:mb-0">
            Pacientes - {hospital?.name}
          </h2>
          <Link 
            href="/pacientes/novo" 
            className="px-4 py-2 bg-primary-600 dark:bg-primary-700 text-white rounded-md hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
          >
            Novo Paciente
          </Link>
        </div>
        
        <div className="mb-6 grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <PatientSearch onSearch={handleSearch} />
          </div>
          <div className="lg:col-span-1">
            <PatientFilters onChange={handleFilterChange} activeFilters={activeFilters} />
          </div>
        </div>
        
        {displayedPatients.length === 0 ? (
          <div className="p-8 text-center bg-gray-50 dark:bg-gray-700 rounded-md">
            <p className="text-gray-500 dark:text-gray-400 mb-2">Nenhum paciente encontrado neste hospital.</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm">Tente ajustar seus critérios de busca ou filtros.</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {currentPatients.map((patient) => (
                <EnhancedPatientCard 
                  key={patient.id} 
                  patient={patient} 
                  onSelectForAssignment={onSelectPatientForAssignment}
                />
              ))}
            </div>
            
            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === 1
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                    }`}
                  >
                    Anterior
                  </button>
                  
                  <div className="flex space-x-1">
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index}
                        onClick={() => paginate(index + 1)}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === index + 1
                            ? 'bg-primary-600 dark:bg-primary-700 text-white'
                            : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === totalPages
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                    }`}
                  >
                    Próxima
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}