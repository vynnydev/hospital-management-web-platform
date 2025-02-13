/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Button } from "@/components/ui/organisms/button";
import { Card, CardContent } from "@/components/ui/organisms/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/organisms/select";
import { 
  Monitor, 
  Users, 
  Building2, 
  Bed, 
  ChevronDown,
  Activity,
  Map,
  Settings,
  Puzzle,
  LayoutGrid,
  Maximize2
} from 'lucide-react';
import { AdditionalHospitalMetrics } from './AdditionalHospitalMetrics';
import { IHospital, INetworkData } from '@/types/hospital-network-types';
import { IntegrationsPreviewPressable } from '@/components/ui/organisms/IntegrationsPreviewPressable';
import { ConfigurationAndUserModalMenus } from '@/components/ui/templates/modals/ConfigurationAndUserModalMenus';
import { MainHospitalAlertMetrics } from './MainHospitalAlertMetrics';

interface IHospitalMetrics {
  unit: {
    state: string;
    name?: string;
  };
}

interface ICurrentMetrics {
  totalBeds: number;
  totalPatients: number;
  averageOccupancy: number;
}

interface IManagementNetworkMetricsProps {
  networkData: INetworkData;
  filteredHospitals: IHospital[];
  selectedRegion: string;
  setSelectedRegion: React.Dispatch<React.SetStateAction<string>>;
  setDisplayMode: React.Dispatch<React.SetStateAction<"dashboard" | "tv">>;
  displayMode: "dashboard" | "tv";
  currentMetrics: ICurrentMetrics;
  canChangeRegion: boolean | undefined;

  // FOR FullscreenModeModal TO DepartmentStatus
  selectedHospital: string | null,
  getStatusColor: (status: "normal" | "attention" | "critical") => string

  // FOR Analitics TO DepartmentStatus
  getFilteredHospitals: () => IHospital[]

  // NetworkListHospital and HospitalsLocations
  setSelectedHospital: React.Dispatch<React.SetStateAction<string | null>>

  // Reposicionamento dos componentes
  isReorderMode?: boolean;
  setIsReorderMode?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ManagementNetworkMetrics: React.FC<IManagementNetworkMetricsProps> = ({
  networkData,
  selectedRegion,
  setSelectedRegion,
  setDisplayMode,
  displayMode,
  currentMetrics,
  filteredHospitals,
  canChangeRegion,

  // FOR FullscreenModeModal TO DepartmentStatus
  selectedHospital,
}) => {
  const [activeSection, setActiveSection] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [defaultSection, setDefaultSection] = useState<string>('integrations');
  
  const handleOpenModal = () => {
    setIsModalOpen(true);
    setDefaultSection('integrations');
  };

  const regions = React.useMemo(() => { 
    if (!networkData?.hospitals?.length) return [];
    
    return networkData.hospitals.reduce<string[]>((acc: string[], hospital: { unit: { state: string } }) => {
      if (!acc.includes(hospital?.unit?.state)) {
        acc.push(hospital.unit.state);
      }
      return acc;
    }, [] as string[]);
  }, [networkData?.hospitals]);

  return (
    <>    
      <Card className="w-full bg-white dark:bg-gray-800 shadow-lg rounded-3xl p-6">
        <CardContent className="p-0">
          <div className="flex flex-col space-y-6">
            {/* Network Info Section */}
            <div className="flex justify-between items-start">
              <div className="flex flex-row space-x-4">
                <div className='space-y-2'>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {networkData?.networkInfo?.name || 'Rede Hospitalar'}
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {filteredHospitals?.length || 0} Hospitais • {currentMetrics?.totalBeds || 0} Leitos
                  </p>
                </div>

                {/* Deixar mostrando no maximo 5 com o plus */}
                <div>
                  <IntegrationsPreviewPressable onSelectIntegration={handleOpenModal} hgt='10' wth='10' />

                  <ConfigurationAndUserModalMenus 
                      isOpen={isModalOpen}
                      onClose={() => setIsModalOpen(false)}
                      defaultSection={defaultSection}
                      user={null}
                  />
                </div>
              </div>

              
              <div className="flex items-center space-x-4">

                  {canChangeRegion && (
                    <div className="relative">
                      <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                        <SelectTrigger className="w-64 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                          <div className="flex items-center space-x-2">
                            <Map size={18} className="text-gray-500 dark:text-gray-400" />
                            <SelectValue placeholder="Selecione a região" />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          {/* Item para todas as regiões */}
                          <SelectItem value="all">
                            <div className="flex items-center space-x-2">
                              <Users size={18} className="text-gray-500 dark:text-gray-400" />
                              <span>Todas as Regiões</span>
                            </div>
                          </SelectItem>

                          {/* Lista de regiões com estados */}
                          {regions.map(region => (
                            <SelectItem key={region} value={region} className='bg-gray-200 dark:bg-gray-700'>
                              <div className="flex items-center space-x-2">
                                <Map size={18} className="text-gray-500 dark:text-gray-400" />
                                <span>Unidades - {region}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
              </div>
            </div>

            <MainHospitalAlertMetrics 
                networkData={networkData}
                currentMetrics={currentMetrics}
                selectedHospital={selectedHospital}
                selectedRegion={selectedRegion}
            />

            {/* Metrics Cards */}
            <AdditionalHospitalMetrics 
                networkData={networkData}
                currentMetrics={currentMetrics}
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
};