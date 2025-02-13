import React, { useState } from 'react';
import { LayoutGrid, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { IHospital, INetworkData } from '@/types/hospital-network-types';
import { useNetworkData } from '@/services/hooks/useNetworkData';
import { ReorderableSectionsInOverviewPage } from '../ReorderableSectionsInOverviewPage';
import { Button } from '@/components/ui/organisms/button';
import { RepositionActionsBar } from '@/components/ui/templates/RepositionActionsBar';
  
interface ICurrentMetrics {
    totalBeds: number;
    totalPatients: number;
    averageOccupancy: number;
}

interface FullscreenModeModalForOverviewPageProps {
    isOpen: boolean;
    onClose: () => void;
    networkData: INetworkData;
    filteredHospitals: IHospital[];
    selectedRegion: string;
    setSelectedRegion: React.Dispatch<React.SetStateAction<string>>;
    setDisplayMode: React.Dispatch<React.SetStateAction<"dashboard" | "tv">>;
    displayMode: "dashboard" | "tv";
    currentMetrics: ICurrentMetrics;
    canChangeRegion: boolean | undefined;
    selectedHospital: string | null;
    getStatusColor: (status: "normal" | "attention" | "critical") => string;
    getFilteredHospitals: () => IHospital[];
    setSelectedHospital: React.Dispatch<React.SetStateAction<string | null>>;
}

export const FullscreenModeModalForOverviewPage: React.FC<FullscreenModeModalForOverviewPageProps> = ({
  isOpen,
  onClose,
  networkData,
  selectedRegion,
  setSelectedRegion,
  setDisplayMode,
  displayMode,
  currentMetrics,
  filteredHospitals,
  canChangeRegion,
  selectedHospital,
  getStatusColor,
  getFilteredHospitals,
  setSelectedHospital
}) => {
    const { currentUser } = useNetworkData();

    // Estados para a funcionalidade de reorganização
    const [isReorderMode, setIsReorderMode] = useState<boolean>(false);
    const [initialSectionsOrder, setInitialSectionsOrder] = useState<string[]>([
        'metrics',
        'departments-and-tabs',
        'flow-editor'
    ]);
    const [currentSectionsOrder, setCurrentSectionsOrder] = useState<string[]>([
        'metrics',
        'departments-and-tabs',
        'flow-editor'
    ]);

    const handleSaveLayout = () => {
        setInitialSectionsOrder([...currentSectionsOrder]);
        // Aqui você pode implementar a lógica para salvar no backend
    };

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
              {/* Barra de Ações de Reposicionamento */}
              <div className="relative">
                <RepositionActionsBar
                  isReorderMode={isReorderMode}
                  setIsReorderMode={setIsReorderMode}
                  onSave={handleSaveLayout}
                  initialSectionsOrder={initialSectionsOrder}
                  currentSectionsOrder={currentSectionsOrder}
                />
              </div>

              {/* Cabeçalho com botões de controle */}
              <div className="sticky top-0 z-50 flex justify-between items-center p-6 bg-gradient-to-b from-gray-900/95 to-gray-900/90 backdrop-blur-sm">
                <div>
                  <p className='text-xl font-semibold text-white'>
                    Visão Geral - Modo Monitor
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Botão de modo de reposicionamento */}
                  <Button
                    onClick={() => setIsReorderMode(!isReorderMode)}
                    variant="outline"
                    size="default"
                    className={`
                      flex items-center space-x-2 
                      ${isReorderMode 
                        ? 'bg-blue-50 hover:bg-blue-100 border-blue-200 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 dark:border-blue-800' 
                        : 'bg-gray-800 hover:bg-gray-700 border-gray-700'}
                      transition-all duration-200
                    `}
                  >
                    <LayoutGrid 
                      size={18} 
                      className={isReorderMode ? "text-blue-500" : "text-gray-300"} 
                    />
                    <span className={isReorderMode ? "text-blue-600" : "text-gray-300"}>
                      {isReorderMode ? 'Modo Reposição' : 'Modo Dashboard'}
                    </span>
                  </Button>

                  {/* Botão de fechar */}
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
                    className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors shadow-lg"
                  >
                    <X className="w-6 h-6 text-gray-300" />
                  </motion.button>
                </div>
              </div>
    
              {/* Container de conteúdo */}
              <div className="min-h-screen w-full p-8 space-y-8">
                {isReorderMode ? (
                  <ReorderableSectionsInOverviewPage
                    networkData={networkData}
                    filteredHospitals={filteredHospitals}
                    selectedHospital={selectedHospital}
                    setSelectedHospital={setSelectedHospital}
                    currentUser={currentUser}
                    selectedRegion={selectedRegion}
                    setSelectedRegion={setSelectedRegion}
                    displayMode={displayMode}
                    setDisplayMode={setDisplayMode}
                    currentMetrics={currentMetrics}
                    canChangeRegion={canChangeRegion}
                    getStatusColor={getStatusColor}
                    getFilteredHospitals={getFilteredHospitals}
                    loading={false}
                    isReorderMode={isReorderMode}
                    onSectionsOrderChange={setCurrentSectionsOrder}
                  />
                ) : (
                  <ReorderableSectionsInOverviewPage
                    networkData={networkData}
                    filteredHospitals={filteredHospitals}
                    selectedHospital={selectedHospital}
                    setSelectedHospital={setSelectedHospital}
                    currentUser={currentUser}
                    selectedRegion={selectedRegion}
                    setSelectedRegion={setSelectedRegion}
                    displayMode={displayMode}
                    setDisplayMode={setDisplayMode}
                    currentMetrics={currentMetrics}
                    canChangeRegion={canChangeRegion}
                    getStatusColor={getStatusColor}
                    getFilteredHospitals={getFilteredHospitals}
                    loading={false}
                    isReorderMode={false}
                    onSectionsOrderChange={setCurrentSectionsOrder}
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
    );
};