'use client'
import React, { useState } from 'react';
import { LayoutGrid, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import type { INetworkData } from '@/types/hospital-network-types';
import type { IAppUser } from '@/types/auth-types';
import type { IHospitalStaffMetrics, IStaffTeam } from '@/types/staff-types';

// Componentes
import { DepartmentAreaCardsWithDifferentUI } from '@/components/ui/templates/DepartmentAreaCardsWithDifferentUI';
import { HospitalNetworkComponentWithDifferenteUI } from '@/components/ui/templates/HospitalNetworkComponentWithDifferenteUI';
import { StaffPredictiveAnalysis } from '@/app/(administrator)/predictive-analysis/components/StaffPredictiveAnalysis';
import { TeamAnalyticsBoard } from '@/app/(administrator)/predictive-analysis/components/TeamAnalyticsBoard';
import { AnalysisChartStaffPredictive } from '@/app/(administrator)/predictive-analysis/components/AnalysisChartStaffPredictive';
import { RepositionActionsBar } from '../RepositionActionsBar';
import { Button } from '@/components/ui/organisms/button';
import { ReorderableSectionsInPredictiveAnalysisPage } from '../ReorderableSectionsInPredictiveAnalysisPage';

interface IDepartmentMetric {
  area: string;
  count: number;
  capacity: number;
  occupancy: number;
}

interface FullscreenModeModalInPredictiveAnalysisPageProps {
  isOpen: boolean;
  onClose: () => void;
  
  // Dados principais
  networkData: INetworkData | null;
  currentUser: IAppUser | null;
  staffData: {
    staffTeams: { [hospitalId: string]: IStaffTeam[] };
    staffMetrics: { [hospitalId: string]: IHospitalStaffMetrics };
  } | null;
  
  // Estados e controles
  selectedDepartment: string;
  selectedHospital: string | null;
  departments: IDepartmentMetric[];
  currentHospitalTeams: IStaffTeam[];
  
  // Callbacks
  onDepartmentSelect: (department: string) => void;
  onHospitalSelect: (hospitalId: string) => void;
  setSelectedDepartment: (dept: string) => void;
  
  // Estados auxiliares
  loading: boolean;
  error: string | null;
}

export const FullscreenModeModalInPredictiveAnalysisPage: React.FC<FullscreenModeModalInPredictiveAnalysisPageProps> = ({
  isOpen,
  onClose,
  networkData,
  currentUser,
  staffData,
  selectedDepartment,
  selectedHospital,
  departments,
  currentHospitalTeams,
  onDepartmentSelect,
  onHospitalSelect,
  setSelectedDepartment,
  loading,
  error,
}) => {
    // Estados para a funcionalidade de reorganização
    const [isReorderMode, setIsReorderMode] = useState<boolean>(false);
    const [initialSectionsOrder, setInitialSectionsOrder] = useState<string[]>([
        'department-areas',
        'predictive-analysis',
        'hospital-network',
        'team-analytics',
        'analysis-chart'
    ]);
    const [currentSectionsOrder, setCurrentSectionsOrder] = useState<string[]>([
        'department-areas',
        'predictive-analysis',
        'hospital-network',
        'team-analytics',
        'analysis-chart'
    ]);

    const handleSaveLayout = () => {
        setInitialSectionsOrder([...currentSectionsOrder]);
        // Implementar a lógica para salvar no backend
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
              <RepositionActionsBar
                isReorderMode={isReorderMode}
                setIsReorderMode={setIsReorderMode}
                onSave={handleSaveLayout}
                initialSectionsOrder={initialSectionsOrder}
                currentSectionsOrder={currentSectionsOrder}
              />
    
              {/* Cabeçalho com botões de controle */}
              <div className="sticky top-0 z-50 flex justify-between items-center p-6 bg-gradient-to-b from-gray-900/95 to-gray-900/90 backdrop-blur-sm">
                <div>
                  <p className='text-xl font-semibold'>
                    Análise Preditiva - Modo Monitor
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
                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-lg"
                  >
                    <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                  </motion.button>
                </div>
              </div>
    
              {/* Container de conteúdo */}
              <div className="min-h-screen w-full p-8 space-y-8">
                {isReorderMode ? (
                  <ReorderableSectionsInPredictiveAnalysisPage
                    networkData={networkData}
                    currentUser={currentUser}
                    staffData={staffData}
                    selectedDepartment={selectedDepartment}
                    selectedHospital={selectedHospital}
                    departments={departments}
                    currentHospitalTeams={currentHospitalTeams}
                    onDepartmentSelect={onDepartmentSelect}
                    onHospitalSelect={onHospitalSelect}
                    setSelectedDepartment={setSelectedDepartment}
                    loading={loading}
                    error={error}
                    isReorderMode={isReorderMode}
                    onSectionsOrderChange={setCurrentSectionsOrder}
                  />
                ) : (
                  <>
                    <div className='p-4'>                      
                      <ReorderableSectionsInPredictiveAnalysisPage
                        networkData={networkData}
                        currentUser={currentUser}
                        staffData={staffData}
                        selectedDepartment={selectedDepartment}
                        selectedHospital={selectedHospital}
                        departments={departments}
                        currentHospitalTeams={currentHospitalTeams}
                        onDepartmentSelect={onDepartmentSelect}
                        onHospitalSelect={onHospitalSelect}
                        setSelectedDepartment={setSelectedDepartment}
                        loading={loading}
                        error={error}
                        isReorderMode={isReorderMode}
                        onSectionsOrderChange={setCurrentSectionsOrder}
                      />
                    </div>                  
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      );
};