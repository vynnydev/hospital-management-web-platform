import React, { useState, useEffect } from 'react';
import type { 
  INetworkData, 
  IHospital
} from '@/types/hospital-network-types';
import type {
  IStaffData
} from '@/types/staff-types';
import { MapboxHospital } from '@/components/ui/templates/map/MapboxHospital';
import { useNetworkData } from '@/services/hooks/useNetworkData';
import { useResourcesData } from '@/services/hooks/useResourcesData';
import { ResourceFilterBar } from './resources-map/ResourceFilterBar';
import { ResourcesSidebar } from './resources-map/ResourcesSidebar';

export type TResourceCategory = 'all' | 'equipment' | 'supplies' | 'staff';
export type TDepartment = 'all' | 'uti' | 'enfermaria' | 'centro_cirurgico';

interface IResourceManagementMapProps {
  networkData: INetworkData;
  staffData: IStaffData;
}

// Modificação nas props do ResourceManagementMap
interface IResourceManagementMapProps {
    networkData: INetworkData;
    staffData: IStaffData;
    selectedHospitalId: string | null;
    setSelectedHospitalId: React.Dispatch<React.SetStateAction<string | null>>;
  }
  
  export const ResourceManagementMap: React.FC<IResourceManagementMapProps> = ({ 
    networkData, 
    staffData,
    selectedHospitalId,
    setSelectedHospitalId
  }) => {
    const { currentUser } = useNetworkData();
    const resourcesData = useResourcesData();
    
    // Usamos o selectedHospitalId que veio como prop
    const [selectedCategory, setSelectedCategory] = useState<TResourceCategory>('all');
    const [selectedYear, setSelectedYear] = useState('2024');
    const [selectedDepartment, setSelectedDepartment] = useState<TDepartment>('all');
  
    // Selecionar o primeiro hospital por padrão
    useEffect(() => {
      if (networkData?.hospitals?.length && !selectedHospitalId) {
        setSelectedHospitalId(networkData.hospitals[0].id);
      }
    }, [networkData?.hospitals, selectedHospitalId, setSelectedHospitalId]);
  
    const handleHospitalSelect = (id: string) => {
      setSelectedHospitalId(id);
    };
  
    return (
      <div className="relative w-full h-[calc(100vh-4rem)] bg-gray-900 dark:bg-gray-950 rounded-xl overflow-hidden">
        {/* Filters Bar */}
        <ResourceFilterBar 
          hospitals={networkData?.hospitals || []}
          selectedHospital={selectedHospitalId}
          setSelectedHospital={setSelectedHospitalId}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedDepartment={selectedDepartment}
          setSelectedDepartment={setSelectedDepartment}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
        />
  
        {/* Left Sidebar - Statistics */}
        <ResourcesSidebar 
          hospitals={networkData?.hospitals || []}
          staffData={staffData}
          resourcesData={resourcesData}
          selectedHospital={selectedHospitalId}
          selectedCategory={selectedCategory}
          selectedDepartment={selectedDepartment}
          onHospitalSelect={handleHospitalSelect}
        />
  
        {/* Main Map Area */}
        <div className="absolute inset-0 z-10">
          <MapboxHospital 
            hospitals={networkData?.hospitals || []}
            selectedHospital={selectedHospitalId}
            setSelectedHospital={setSelectedHospitalId}
            currentUser={currentUser}
          />
        </div>
      </div>
    );
};