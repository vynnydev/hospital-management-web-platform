/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/organisms/card';
import { useNetworkData } from '@/hooks/network-hospital/useNetworkData';

import 'mapbox-gl/dist/mapbox-gl.css';
import { CognitivaAIPatientAssistant } from '@/components/ui/templates/cognitiva-ai-assistant/CognitivaAIPatientAssistant';
import { ReorderableSectionsInOverviewPage } from '@/components/ui/templates/ReorderableSectionsInOverviewPage';
import { ManagementNetworkMetrics } from './components/ManagementNetworkMetrics';
import { DepartmentStatus } from './components/DepartmentStatus';
import { ModernTabs } from './components/ModernTabs';
import { NetworkListHospital } from './components/NetworkListHospital';
import { OccupancyRateCharts } from './components/OccupancyRateCharts';
import { HospitalsLocations } from './components/HospitalsLocations';
import { AIAnalyticsGeneralData } from './components/AIAnalyticsGeneralData';
import { RepositionActionsBar } from '@/components/ui/templates/RepositionActionsBar';
import { IAppUser } from '@/types/auth-types';
import { Button } from '@/components/ui/organisms/button';
import { LayoutGrid } from 'lucide-react';
import { DashboardModeModalOptions } from '@/components/ui/templates/modals/DashboardModeModalOptions';
import { FullscreenModeModalForOverviewPage } from '@/components/ui/templates/modals/FullscreenModeModalForOverviewPage';
import { AmbulanceManagement } from '@/components/ui/templates/AmbulanceManagement';
import { useStaffData } from '@/hooks/staffs/useStaffData';
import { useAmbulanceData } from '@/hooks/ambulance/useAmbulanceData';
import { PatientMonitoringDashboard } from '@/components/ui/templates/PatientMonitoringDashboard';
import { AlertCenterHub } from '@/components/ui/templates/AlertCenterHub';

const Overview: React.FC = () => {
  const { networkData, currentUser, setNetworkData, loading, error } = useNetworkData();
  const [selectedHospital, setSelectedHospital] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [displayMode, setDisplayMode] = useState<'dashboard' | 'tv'>('dashboard');
  
  // Props para o AlertCenterHub
  const [message, setMessage] = useState('');
  const [messageUserSearchQuery, setMessageUserSearchQuery] = useState('');
  
  // Para salvar o estado da funcionalidade de reposicionamento dos componentes
  const [initialSectionsOrder, setInitialSectionsOrder] = useState<string[]>(['metrics', 'departments', 'flow']);
  const [currentSectionsOrder, setCurrentSectionsOrder] = useState<string[]>(['metrics', 'departments', 'flow']);
    
  // Estado para controlar o modal de funcionalidade de reorganização de componentes e do modo tv
  const [isDashboardModeModalOpen, setIsDashboardModeModalOpen] = useState(false);
  const [isFullscreenMode, setIsFullscreenMode] = useState(false);
  const [isReorderMode, setIsReorderMode] = useState<boolean>(false);

  const {
    staffData
  } = useStaffData();

  const {
    ambulanceData
  } = useAmbulanceData(selectedHospital);

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

  const handleSaveLayout = () => {
    // Salva a ordem atual como a nova ordem inicial
    setInitialSectionsOrder([...currentSectionsOrder]);
    // Aqui você pode implementar a lógica para salvar no backend
  };

  console.log("Usuário atual logado:", currentUser)

  // Function to filter hospitals based on user permissions
  const getAuthorizedHospitals = () => {
    if (!networkData?.hospitals || !currentUser) return [];
    
    // Check if user has permission to view all hospitals
    const canViewAllHospitals = currentUser.permissions.includes('VIEW_ALL_HOSPITALS');
    
    if (canViewAllHospitals) {
      return networkData.hospitals;
    }
    
    // If user can only view single hospital, filter by their hospitalId
    return networkData.hospitals.filter(hospital => hospital.id === currentUser.hospitalId);
  };

  // Get filtered hospitals based on both permissions and selected region
  const getFilteredHospitals = () => {
    const authorizedHospitals = getAuthorizedHospitals();
    
    if (selectedRegion === 'all') {
      return authorizedHospitals;
    }
    
    return authorizedHospitals.filter(h => h.unit.state === selectedRegion);
  };
  
  // Update getCurrentRegionMetrics to use authorized hospitals
  const getCurrentRegionMetrics = () => {
    const authorizedHospitals = getAuthorizedHospitals();
    
    if (selectedRegion === 'all') {
      const totalBeds = authorizedHospitals.reduce((acc, h) => acc + h.metrics.overall.totalBeds, 0);
      const totalPatients = authorizedHospitals.reduce((acc, h) => acc + h.metrics.overall.totalPatients, 0);
      const averageOccupancy = authorizedHospitals.reduce((acc, h) => acc + h.metrics.overall.occupancyRate, 0) / authorizedHospitals.length;
      
      return { totalBeds, totalPatients, averageOccupancy };
    }

    const regionHospitals = authorizedHospitals.filter(h => h.unit.state === selectedRegion);
    const totalBeds = regionHospitals.reduce((acc, h) => acc + h.metrics.overall.totalBeds, 0);
    const totalPatients = regionHospitals.reduce((acc, h) => acc + h.metrics.overall.totalPatients, 0);
    const averageOccupancy = regionHospitals.reduce((acc, h) => acc + h.metrics.overall.occupancyRate, 0) / regionHospitals.length;

    return { totalBeds, totalPatients, averageOccupancy };
  };
  
  const filteredHospitals = getFilteredHospitals();

  const currentMetrics = getCurrentRegionMetrics();
  
  // Restrict single hospital users from changing regions
  const canChangeRegion = currentUser?.permissions.includes('VIEW_ALL_HOSPITALS');

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

  if (!staffData) return;
  if (!ambulanceData) return;
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error || !networkData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6 bg-gray-200 dark:bg-gray-700">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Erro ao carregar dados</h2>
          <p className="text-muted-foreground">{error || 'Dados não disponíveis'}</p>
        </Card>
      </div>
    );
  }
  
  // Status color mapping
  const getStatusColor = (status: 'normal' | 'attention' | 'critical'): string => {
    const colors = {
      normal: 'bg-gradient-to-r from-blue-700 to-cyan-700 text-white',
      attention: 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white',
      critical: 'bg-gradient-to-r from-red-700 to-pink-700 text-white'
    };
    return colors[status];
  };

  const handleSendMessage = () => {
    // Implementar lógica de envio
    setMessage('');
  };

  return (
    <>
      <RepositionActionsBar
        isReorderMode={isReorderMode}
        setIsReorderMode={setIsReorderMode}
        onSave={handleSaveLayout}
        initialSectionsOrder={initialSectionsOrder}
        currentSectionsOrder={currentSectionsOrder}
      />

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
          loading={loading}
          isReorderMode={isReorderMode}
          onSectionsOrderChange={setCurrentSectionsOrder}
        />
      ) : (
        <>
          {/* Display Mode Toggle Button */}
          <div className='-mt-32 relative flex justify-center justify-self-end px-16 mr-12 p-1 bg-gradient-to-r from-blue-700/90 to-cyan-700/90 rounded-xl w-48 h-12'>
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
          </div>

          <div className="space-y-20 p-6 rounded-md">

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
                  isReorderMode={isReorderMode}
                  setIsReorderMode={setIsReorderMode}
                />
              </div>
            </div>

            <div className='pt-2 bg-gradient-to-r from-blue-700 to-cyan-700 rounded-lg shadow-md'>
              <div className='p-4 bg-gray-800 rounded-lg'>
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
                      <AIAnalyticsGeneralData />
                    ),
                    alertCenterHub: (
                      <AlertCenterHub 
                        hospitalId={selectedHospital || ''}
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

            <div>
              <PatientMonitoringDashboard 
                  selectedHospitalId={selectedHospital || ''}
                  setSelectedHospitalId={setSelectedHospital}
                  networkData={networkData}
                  staffData={staffData}
                  ambulanceData={ambulanceData}
              />
            </div>

            <div>
              <AmbulanceManagement />
            </div>
          </div>
        </>
      )}

      <DashboardModeModalOptions
        isOpen={isDashboardModeModalOpen}
        onClose={() => setIsDashboardModeModalOpen(false)}
        onSelectMode={handleModeSelection}
      />

      <FullscreenModeModalForOverviewPage
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

      <CognitivaAIPatientAssistant />
    </>
  );
};

export default Overview;