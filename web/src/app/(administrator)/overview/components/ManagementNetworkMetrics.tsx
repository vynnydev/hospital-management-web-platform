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
import { HospitalNetworkMetrics } from './HospitalNetworkMetrics';
import { IHospital, INetworkData } from '@/types/hospital-network-types';
import { IntegrationsPreviewPressable } from '@/components/ui/organisms/IntegrationsPreviewPressable';
import { ConfigurationAndUserModalMenus } from '@/components/ui/templates/modals/ConfigurationAndUserModalMenus';
import { DashboardModeModalOptions } from '../../../../components/ui/templates/modals/DashboardModeModalOptions';
import { FullscreenModeModal } from '@/components/ui/templates/modals/FullscreenModeModal';

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
  getStatusColor,

  // FOR Analitics TO DepartmentStatus
  getFilteredHospitals,

  // NetworkListHospital and HospitalsLocations
  setSelectedHospital,
  
  // Reposicionamento dos componentes
  isReorderMode,
  setIsReorderMode
}) => {
  const [isIntegrationsOpen, setIsIntegrationsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [defaultSection, setDefaultSection] = useState<string>('integrations');
  const [isDashboardModeModalOpen, setIsDashboardModeModalOpen] = useState(false);
  const [isFullscreenMode, setIsFullscreenMode] = useState(false);
  
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

  const handleModeSelection = (mode: 'fullscreen' | 'reposition') => {
    setIsDashboardModeModalOpen(false);
    
    if (mode === 'fullscreen') {
      setIsFullscreenMode(true);
      setDisplayMode('tv');
    } else if (mode === 'reposition') {
      // Ativa o modo de reposicionamento
      setIsReorderMode?.(true);
    }
  };

  return (
    <>    
      <Card className="w-full bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
        <CardContent className="p-0">
          <div className="flex flex-col space-y-6">
            {/* Network Info Section */}
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {networkData?.networkInfo?.name || 'Rede Hospitalar'}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {filteredHospitals?.length || 0} Hospitais • {currentMetrics?.totalBeds || 0} Leitos
                </p>
              </div>

              {/* Deixar mostrando no maximo 5 com o plus */}
              <div className='mr-[630px]'>
                <IntegrationsPreviewPressable onSelectIntegration={handleOpenModal} hgt='10' wth='10' />

                <ConfigurationAndUserModalMenus 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    defaultSection={defaultSection}
                    user={null}
                />
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Display Mode Toggle Button */}
                <Button
                    onClick={() => setIsDashboardModeModalOpen(true)}
                    variant="outline"
                    size="default"
                    className={`
                      flex items-center space-x-2 
                      ${isReorderMode 
                        ? 'bg-blue-50 hover:bg-blue-100 border-blue-200 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 dark:border-blue-800' 
                        : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 border-gray-200 dark:border-gray-600'}
                      transition-all duration-200
                    `}
                  >
                    <LayoutGrid 
                      size={18} 
                      className={isReorderMode ? "text-blue-500" : "text-gray-500 dark:text-gray-400"} 
                    />
                    <span className={isReorderMode ? "text-blue-600" : ""}>
                      {isReorderMode ? 'Modo Reposição' : 'Modo Dashboard'}
                    </span>
                  </Button>

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
                        <SelectItem value="all">
                          <div className="flex items-center space-x-2">
                            <Users size={18} className="text-gray-500 dark:text-gray-400" />
                            <span>Todas Regiões</span>
                          </div>
                        </SelectItem>
                        {regions.map(region => (
                          <SelectItem key={region} value={region} className='bg-gray-200 dark:bg-gray-700'>
                            <div className="flex items-center space-x-2">
                              <Map size={18} className="text-gray-500 dark:text-gray-400" />
                              <span>{region}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>

            {/* Metrics Cards */}
            <HospitalNetworkMetrics 
                networkData={networkData}
                currentMetrics={currentMetrics}
            />
          </div>
        </CardContent>
      </Card>

      <DashboardModeModalOptions
        isOpen={isDashboardModeModalOpen}
        onClose={() => setIsDashboardModeModalOpen(false)}
        onSelectMode={handleModeSelection}
      />

      <FullscreenModeModal
        isOpen={isFullscreenMode}
        onClose={() => setIsFullscreenMode(false)}

        // IManagementNetworkMetricsProps
        networkData={networkData}
        filteredHospitals={filteredHospitals}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
        setDisplayMode={setDisplayMode}
        displayMode={displayMode}
        currentMetrics={currentMetrics}
        canChangeRegion={canChangeRegion}

        // DepartmentStatus
        selectedHospital={selectedHospital}
        getStatusColor={getStatusColor}

        // Analitics
        getFilteredHospitals={getFilteredHospitals}

        setSelectedHospital={setSelectedHospital}
      />
    </>
  );
};