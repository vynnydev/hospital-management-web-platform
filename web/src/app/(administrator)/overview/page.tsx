/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React, { useState } from 'react';
import { Card } from '@/components/ui/organisms/card';
import { useNetworkData } from '@/services/hooks/useNetworkData';

import 'mapbox-gl/dist/mapbox-gl.css';
import { MediMindAIAssistant } from '@/components/ui/medimind-ai-assistant/MediMindAIAssistant';
import { ReorderableSectionsInOverviewPage } from '@/components/ui/templates/ReorderableSectionsInOverviewPage';
import { ManagementNetworkMetrics } from './components/ManagementNetworkMetrics';
import { DepartmentStatus } from './components/DepartmentStatus';
import { ModernTabs } from './components/ModernTabs';
import { NetworkListHospital } from './components/NetworkListHospital';
import { OccupancyRateCharts } from './components/OccupancyRateCharts';
import { HospitalsLocations } from './components/HospitalsLocations';
import { AIAnalyticsMetrics } from './components/AIAnalyticsMetrics';
import { MessageCenter } from './components/MessageCenter';
import { FlowEditor } from './components/workflow/FlowEditor';
import { RepositionActionsBar } from '@/components/ui/templates/RepositionActionsBar';

const Overview: React.FC = () => {
  const { networkData, currentUser, loading, error } = useNetworkData();
  const [selectedHospital, setSelectedHospital] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [displayMode, setDisplayMode] = useState<'dashboard' | 'tv'>('dashboard');
  const [isReorderMode, setIsReorderMode] = useState<boolean>(false);

  // Para salvar o estado da funcionalidade de reposicionamento dos componentes
  const [initialSectionsOrder, setInitialSectionsOrder] = useState<string[]>(['metrics', 'departments', 'flow']);
  const [currentSectionsOrder, setCurrentSectionsOrder] = useState<string[]>(['metrics', 'departments', 'flow']);

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
        <div className="space-y-20 p-6 -mt-20 rounded-md">
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
                  messageCenter: (
                    <MessageCenter 
                      networkData={networkData}
                      currentUser={currentUser}
                      loading={loading}
                    />
                  )
                }}
              </ModernTabs>
            </div>
          </div>

          <FlowEditor networkData={networkData}/>
        </div>
      )}
      <MediMindAIAssistant />
    </>
  );
};

export default Overview;