/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, Move } from 'lucide-react';
import { 
  INetworkData, 
  IHospital,
} from '@/types/hospital-network-types';
import { ManagementNetworkMetrics } from '@/app/(administrator)/overview/components/ManagementNetworkMetrics';
import { DepartmentStatus } from '@/app/(administrator)/overview/components/DepartmentStatus';
import { NetworkListHospital } from '@/app/(administrator)/overview/components/NetworkListHospital';
import { OccupancyRateCharts } from '@/app/(administrator)/overview/components/OccupancyRateCharts';
import { HospitalsLocations } from '@/app/(administrator)/overview/components/HospitalsLocations';
import { AIAnalyticsMetrics } from '@/app/(administrator)/overview/components/AIAnalyticsMetrics';
import { ModernTabs } from '@/app/(administrator)/overview/components/ModernTabs';
import { IAppUser } from '@/types/auth-types';
import { AmbulanceManagement } from './AmbulanceManagement';
import { PatientMonitoringDashboard } from './PatientMonitoringDashboard';
import { useStaffData } from '@/services/hooks/staffs/useStaffData';
import { useAmbulanceData } from '@/services/hooks/ambulance/useAmbulanceData';
import { LoadingSpinner } from './LoadingSpinner';
import { AlertCenterHub } from './AlertCenterHub';

interface ReorderableSectionProps {
  children: React.ReactNode;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
  title: string;
  isReorderMode: boolean;
}

interface Section {
  id: string;
  title: string;
  component: React.ReactNode;
}

interface CurrentMetrics {
  totalBeds: number;
  totalPatients: number;
  averageOccupancy: number;
}

interface ReorderableOverviewProps {
  networkData: INetworkData;
  filteredHospitals: IHospital[];
  selectedHospital: string | null;
  setSelectedHospital: React.Dispatch<React.SetStateAction<string | null>>;
  currentUser: IAppUser | null;
  selectedRegion: string;
  setSelectedRegion: React.Dispatch<React.SetStateAction<string>>;
  displayMode: 'dashboard' | 'tv';
  setDisplayMode: React.Dispatch<React.SetStateAction<'dashboard' | 'tv'>>;
  currentMetrics: CurrentMetrics;
  canChangeRegion: boolean | undefined;
  getStatusColor: (status: 'normal' | 'attention' | 'critical') => string;
  getFilteredHospitals: () => IHospital[];
  loading: boolean;
  isReorderMode: boolean;
  onSectionsOrderChange?: (sections: string[]) => void;
  setMessage: React.Dispatch<React.SetStateAction<string>>
}

const ReorderableSection: React.FC<ReorderableSectionProps> = ({
  children,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  title,
  isReorderMode
}) => {
  if (!isReorderMode) {
    return <>{children}</>;
  }

  return (
    <motion.div
      layout
      className="relative mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="absolute -left-12 top-1/2 transform -translate-y-1/2 flex flex-col gap-1">
        <button
          onClick={onMoveUp}
          disabled={isFirst}
          className={`p-1 rounded-full ${
            isFirst ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
          } text-white transition-colors`}
        >
          <ChevronUp className="w-4 h-4" />
        </button>
        <button
          onClick={onMoveDown}
          disabled={isLast}
          className={`p-1 rounded-full ${
            isLast ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
          } text-white transition-colors`}
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
      
      <div className="bg-gradient-to-r from-blue-700 to-cyan-700 rounded-md shadow-md">
        <div className="p-4 bg-gray-800 rounded-md">
          {isReorderMode && (
            <div className="flex items-center gap-2 mb-2 text-white">
              <Move className="w-4 h-4" />
              <h3 className="text-sm font-medium">{title}</h3>
            </div>
          )}
          {children}
        </div>
      </div>
    </motion.div>
  );
};

export const ReorderableSectionsInOverviewPage: React.FC<ReorderableOverviewProps> = ({
  networkData,
  filteredHospitals,
  selectedHospital,
  setSelectedHospital,
  currentUser,
  selectedRegion,
  setSelectedRegion,
  displayMode,
  setDisplayMode,
  currentMetrics,
  canChangeRegion,
  getStatusColor,
  getFilteredHospitals,
  loading,
  isReorderMode,
  onSectionsOrderChange,
  setMessage
}) => {
    const [sections, setSections] = useState<Section[]>([]);
    const [selectedMessageUsers, setSelectedMessageUsers] = useState<IAppUser[]>([]);

    const {
      staffData
    } = useStaffData();
  
    
    const {
      ambulanceData
    } = useAmbulanceData(selectedHospital);

    // Função para selecionar um hospital no Message Center
    const onHospitalSelect = (hospitalId: string | null) => {
      // Se o usuário tiver permissão para ver todos os hospitais, permite a seleção
      if (canChangeRegion) {
        // Se o hospitalId for null, limpa a seleção
        if (hospitalId === null) {
          setSelectedHospital(null);
          return;
        }

        // Verifica se o hospital existe nos dados da rede
        const selectedHospital = networkData?.hospitals?.find(h => h.id === hospitalId);
        
        if (selectedHospital) {
          // Define o hospital selecionado
          setSelectedHospital(hospitalId);
          
          // Atualiza a região para o estado do hospital selecionado
          setSelectedRegion(selectedHospital.unit.state);
        }
      } else {
        // Se o usuário não tem permissão para ver todos os hospitais, 
        // só permite selecionar o hospital associado ao seu usuário
        if (hospitalId === currentUser?.hospitalId) {
          setSelectedHospital(hospitalId);
        }
      }
    };

    const handleSendMessage = () => {
      // Implementar lógica de envio
      setMessage('');
    };

    const initialSections: Section[] = [
      {
          id: 'metrics',
          title: 'Métricas da Rede',
          component: (
          <div className='pt-2 bg-gradient-to-r from-blue-700 to-cyan-700 rounded-md shadow-md'>
              <div className='p-4 bg-gray-800 rounded-md'>
              <ManagementNetworkMetrics 
                  networkData={networkData}
                  filteredHospitals={filteredHospitals}
                  selectedRegion={selectedRegion}
                  setSelectedRegion={setSelectedRegion}
                  setDisplayMode={setDisplayMode}
                  displayMode={displayMode}
                  currentMetrics={currentMetrics}
                  canChangeRegion={canChangeRegion}
                  selectedHospital={selectedHospital}
                  getStatusColor={getStatusColor}
                  getFilteredHospitals={getFilteredHospitals}
                  setSelectedHospital={setSelectedHospital}
              />
              </div>
          </div>
          )
      },
      {
          id: 'departments-and-tabs',
          title: 'Departamentos e Visão Geral',
          component: (
          <div className='pt-2 bg-gradient-to-r from-blue-700 to-cyan-700 rounded-md shadow-md'>
              <div className='p-4 bg-gray-800'>
                <DepartmentStatus 
                    networkData={networkData}
                    selectedHospital={selectedHospital}
                    getStatusColor={getStatusColor}
                />

                <ModernTabs>
                    {{
                    overview: (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                        <HospitalsLocations
                        hospitals={networkData?.hospitals}
                        currentUser={currentUser} 
                        selectedHospital={selectedHospital} 
                        setSelectedHospital={setSelectedHospital}          
                        />
                    ),
                    analytics: (
                        <AIAnalyticsMetrics
                        filteredHospitals={getFilteredHospitals() || []}
                        currentUser={currentUser}
                        />
                    ),
                    alertCenterHub: (
                      <AlertCenterHub 
                        hospitalId="RD4H-SP-ITAIM"
                        initialView="chat"
                        onSendMessage={handleSendMessage}
                        floatingButton={true}
                        position="bottom-right"
                      />
                    )
                    }}
                </ModernTabs>

              </div>
          </div>
        )
      },
      {
        id: 'patient-monitoring-dashboard',
        title: 'Dashboard de Monitoramento do Paciente',
        component: (
            <div>
              <PatientMonitoringDashboard 
                  selectedHospitalId={selectedHospital || ''}
                  setSelectedHospitalId={setSelectedHospital}
                  networkData={networkData}
                  staffData={staffData}
                  ambulanceData={ambulanceData}
              />
            </div>
        )
      },
      {
        id: 'ambulance-management',
        title: 'Sistema de Gerenciamento de Ambulâncias',
        component: (
          <div>
            <AmbulanceManagement />
          </div>
        )
      }
    ];

    // Notificar mudanças na ordem apenas quando necessário
    const notifyOrderChange = React.useCallback(() => {
      if (onSectionsOrderChange) {
        const sectionIds = sections.map(section => section.id);
        onSectionsOrderChange(sectionIds);
      }
    }, [sections, onSectionsOrderChange]);
  
    // Atualizar seções apenas quando as props mudarem
    useEffect(() => {
      setSections(initialSections);
    }, [networkData?.networkInfo?.id]); // Dependência mais estável
  
    const moveSection = (currentIndex: number, direction: number): void => {
      setSections(prevSections => {
        const newSections = [...prevSections];
        const newIndex = currentIndex + direction;
        
        if (newIndex >= 0 && newIndex < newSections.length) {
          const [movedSection] = newSections.splice(currentIndex, 1);
          newSections.splice(newIndex, 0, movedSection);
          
          // Notificar mudança após a reordenação
          setTimeout(() => notifyOrderChange(), 0);
          
          return newSections;
        }
        
        return prevSections;
      });
    };

    return (
        <div className={`relative ${isReorderMode ? 'pl-12' : ''} space-y-20 p-6 -mt-20 rounded-md`}>
          <AnimatePresence>
            {sections.map((section, index) => (
              <ReorderableSection
                key={section.id}
                title={section.title}
                onMoveUp={() => moveSection(index, -1)}
                onMoveDown={() => moveSection(index, 1)}
                isFirst={index === 0}
                isLast={index === sections.length - 1}
                isReorderMode={isReorderMode}
              >
                {section.component}
              </ReorderableSection>
            ))}
          </AnimatePresence>
        </div>
      );
};