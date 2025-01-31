import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { IHospital, INetworkData } from '@/types/hospital-network-types';
import { ManagementNetworkMetrics } from '@/app/(administrator)/overview/components/ManagementNetworkMetrics';
import { DepartmentStatus } from '@/app/(administrator)/overview/components/DepartmentStatus';
import { ModernTabs } from '@/app/(administrator)/overview/components/ModernTabs';
import { NetworkListHospital } from '@/app/(administrator)/overview/components/NetworkListHospital';
import { OccupancyRateCharts } from '@/app/(administrator)/overview/components/OccupancyRateCharts';
import { HospitalsLocations } from '@/app/(administrator)/overview/components/HospitalsLocations';
import { AIAnalyticsMetrics } from '@/app/(administrator)/overview/components/AIAnalyticsMetrics';
import { MessageCenter } from '@/app/(administrator)/overview/components/MessageCenter';
import { useNetworkData } from '@/services/hooks/useNetworkData';
import { IHospitalMetrics } from '@/app/(administrator)/patient-management/types/types';
import { FlowEditor } from '@/app/(administrator)/overview/components/workflow/FlowEditor';
  
interface ICurrentMetrics {
    totalBeds: number;
    totalPatients: number;
    averageOccupancy: number;
}
  

interface FullscreenModeModalProps {
    isOpen: boolean;
    onClose: () => void;

    // IManagementNetworkMetricsProps, NetworkListHospital and OccupancyRateCharts
    networkData: INetworkData;
    filteredHospitals: IHospital[];
    selectedRegion: string;
    setSelectedRegion: React.Dispatch<React.SetStateAction<string>>;
    setDisplayMode: React.Dispatch<React.SetStateAction<"dashboard" | "tv">>;
    displayMode: "dashboard" | "tv";
    currentMetrics: ICurrentMetrics;
    canChangeRegion: boolean | undefined;

    // DepartmentStatus
    selectedHospital: string | null,
    getStatusColor: (status: "normal" | "attention" | "critical") => string

    // Analitics
    getFilteredHospitals: () => IHospital[],

    // NetworkListHospital and HospitalsLocations
    setSelectedHospital: React.Dispatch<React.SetStateAction<string | null>>
}

export const FullscreenModeModal: React.FC<FullscreenModeModalProps> = ({
  isOpen,
  onClose,

  // IManagementNetworkMetricsProps
  networkData,
  selectedRegion,
  setSelectedRegion,
  setDisplayMode,
  displayMode,
  currentMetrics,
  filteredHospitals,
  canChangeRegion,

  // DepartmentStatus
  selectedHospital,
  getStatusColor,

  // Analitics
  getFilteredHospitals,

  // NetworkListHospital and HospitalsLocations
  setSelectedHospital
}) => {
    const { currentUser, loading, error: networkError } = useNetworkData();
    const [isIntegrationsOpen, setIsIntegrationsOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [defaultSection, setDefaultSection] = useState<string>('integrations');
    const [isDashboardModeModalOpen, setIsDashboardModeModalOpen] = useState(false);
    const [isFullscreenMode, setIsFullscreenMode] = useState(false);

    return (
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                transition: {
                  type: "spring",
                  duration: 0.5
                }
              }}
              exit={{ 
                opacity: 0,
                scale: 0.8,
                transition: {
                  duration: 0.3
                }
              }}
              className="fixed top-0 left-0 right-0 bottom-0 w-screen h-screen z-50 bg-white dark:bg-gray-900 overflow-y-auto"
            >
              {/* Botão de fechar fixo no topo */}
              <div className="sticky top-6 z-50 flex justify-end px-6">
                <motion.button
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: {
                      delay: 0.2
                    }
                  }}
                  onClick={onClose}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-lg"
                >
                  <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </motion.button>
              </div>
    
              {/* Container de conteúdo com padding e espaçamento apropriados */}
              <div className="min-h-screen w-full p-8 space-y-4">
                <div>
                    <p className='p-2 text-xl font-semibold'>Modo Dashboard - Monitor</p>
                </div>
                {/* Primeiro Card */}
                <div className="mt-8 bg-gradient-to-r from-blue-700 to-cyan-700 rounded-md shadow-md">
                  <div className="p-4 bg-gray-800 rounded-md">
                        {/* Header Section */}
                        <ManagementNetworkMetrics 
                            networkData={networkData}
                            filteredHospitals={filteredHospitals}
                            selectedRegion={selectedRegion}
                            setSelectedRegion={setSelectedRegion}
                            setDisplayMode={setDisplayMode}
                            displayMode={displayMode}
                            currentMetrics={currentMetrics}
                            canChangeRegion={canChangeRegion}

                            // FOR FullscreenModeModal TO DepartmentStatus
                            selectedHospital={selectedHospital}
                            getStatusColor={getStatusColor}

                            // FOR Analitics TO DepartmentStatus
                            getFilteredHospitals={getFilteredHospitals}

                              // NetworkListHospital and HospitalsLocations
                            setSelectedHospital={setSelectedHospital}
                        />
                  </div>
                </div>
    
                {/* Segundo Card */}
                <div className="mt-4 bg-gradient-to-r from-blue-700 to-cyan-700 rounded-md shadow-md">
                  <div className="p-4 bg-gray-800 rounded-md">
                    <DepartmentStatus 
                      networkData={networkData}
                      selectedHospital={selectedHospital}
                      getStatusColor={getStatusColor}
                    />
    
                    {/* ModernTabs Section */}
                    <div className="mt-4">
                      <ModernTabs>
                        {{
                          overview: (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                              <NetworkListHospital 
                                filteredHospitals={filteredHospitals}
                                setSelectedHospital={setSelectedHospital}
                                currentUser={currentUser}
                              />
                              <OccupancyRateCharts 
                                filteredHospitals={filteredHospitals}
                              />
                            </div>
                          ),
                          hospitalsLocations: (
                            <div className="mt-4">
                              <HospitalsLocations
                                hospitals={networkData?.hospitals}
                                currentUser={currentUser} 
                                selectedHospital={selectedHospital} 
                                setSelectedHospital={setSelectedHospital}          
                              />
                            </div>
                          ),
                          analytics: (
                            <div className="mt-4">
                              <AIAnalyticsMetrics 
                                filteredHospitals={getFilteredHospitals() || []}
                                currentUser={currentUser}
                              />
                            </div>
                          ),
                          messageCenter: (
                            <div className="mt-4">
                              <MessageCenter 
                                networkData={networkData}
                                currentUser={currentUser}
                                loading={loading}
                              />
                            </div>
                          )
                        }}
                      </ModernTabs>
                    </div>

                  </div>
                </div>

                <FlowEditor networkData={networkData}/>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
    );
};