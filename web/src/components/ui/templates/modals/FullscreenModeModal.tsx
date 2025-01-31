import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { IHospital, INetworkData } from '@/types/hospital-network-types';
import { useNetworkData } from '@/services/hooks/useNetworkData';
import { ReorderableSectionsInDashboardModeTV } from '../ReorderableSectionsInDashboardModeTV';
  
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
    const { currentUser } = useNetworkData();

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
                    <p className='p-2 text-xl font-semibold -mt-12 mb-8 pl-12'>Modo Dashboard - Monitor</p>
                </div>


                <ReorderableSectionsInDashboardModeTV
                    networkData={networkData}
                    filteredHospitals={filteredHospitals}
                    selectedHospital={selectedHospital}
                    setSelectedHospital={setSelectedHospital}
                    currentUser={currentUser}
                    selectedRegion={selectedRegion}
                    setSelectedRegion={setSelectedRegion}
                    setDisplayMode={setDisplayMode}
                    displayMode={displayMode}
                    currentMetrics={currentMetrics}
                    canChangeRegion={canChangeRegion}
                    getStatusColor={getStatusColor}
                    getFilteredHospitals={getFilteredHospitals}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
    );
};