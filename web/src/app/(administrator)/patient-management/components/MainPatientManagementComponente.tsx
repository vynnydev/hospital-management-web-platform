import React, { useState, useEffect } from 'react';
import { PatientTaskManagement } from './PatientTaskManagement';
import { useNetworkData } from '@/services/hooks/useNetworkData';
import { HospitalNetworkComponent } from './HospitalNetworkComponent';

export const MainPatientManagementComponente: React.FC = () => {
  const { networkData, currentUser, loading, error } = useNetworkData();
  const [selectedHospital, setSelectedHospital] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [fontSize, setFontSize] = useState<'small' | 'normal' | 'large' | 'extra-large'>('normal');

  // Efeito para selecionar automaticamente o hospital quando o usuário só tem acesso a um
  useEffect(() => {
    if (currentUser && networkData?.hospitals && !currentUser.permissions.includes('VIEW_ALL_HOSPITALS')) {
      const userHospital = networkData.hospitals.find(h => h.id === currentUser.hospitalId);
      if (userHospital) {
        setSelectedHospital(userHospital.id);
      }
    }
  }, [currentUser, networkData]);

  // Filtrar pacientes com base no departamento selecionado
  const getFilteredPatients = () => {
    if (!selectedHospital || !networkData) return [];
    
    const hospital = networkData.hospitals.find(h => h.id === selectedHospital);
    if (!hospital) return [];

    const allPatients = hospital.departments.flatMap(dept => 
      dept.beds.filter(bed => bed.patient).map(bed => ({
        ...bed.patient,
        department: dept.name
      }))
    );

    if (!selectedArea) return allPatients;

    return allPatients.filter(patient => patient.department.toLowerCase() === selectedArea.toLowerCase());
  };

  // Handler para mudança de hospital
  const handleHospitalSelect = (hospitalId: string) => {
    setSelectedHospital(hospitalId);
    setSelectedArea('');
  };

  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* Hospital Network Component */}
      <HospitalNetworkComponent
        networkInfo={networkData?.networkInfo}
        hospitals={networkData?.hospitals}
        currentUser={currentUser}
        onHospitalSelect={handleHospitalSelect}
        selectedHospital={selectedHospital}
        loading={loading}
        error={error}
      />

      {/* Patient Management Section */}
      {selectedHospital && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="col-span-2">
            <PatientTaskManagement
              patients={getFilteredPatients()}
              selectedArea={selectedArea}
              onSelect={() => {}}
              departments={{}}
              data={{
                capacity: { total: { maxBeds: 0, maxOccupancy: 0 }, departmental: {} },
                overall: {
                  occupancyRate: 0,
                  totalPatients: 0,
                  availableBeds: 0,
                  avgStayDuration: 0,
                  turnoverRate: 0,
                  totalBeds: 0,
                  lastUpdate: new Date().toISOString(),
                  periodComparison: {
                    occupancy: { value: 0, trend: 'up' },
                    patients: { value: 0, trend: 'up' },
                    beds: { value: 0, trend: 'up' }
                  }
                }
              }}
              onClose={() => {}}
              fontSize={fontSize}
              setFontSize={setFontSize}
              loading={loading}
              error={error}
              onRetry={() => window.location.reload()}
            />
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/5 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl flex items-center space-x-3">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-700 dark:text-gray-300">Carregando dados...</span>
          </div>
        </div>
      )}
    </div>
  );
};