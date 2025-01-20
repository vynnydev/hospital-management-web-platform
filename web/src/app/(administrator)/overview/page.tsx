/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React, { useState } from 'react';
import { Card } from '@/components/ui/organisms/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/organisms/tabs';
import { useNetworkData } from '@/services/hooks/useNetworkData';
import { ManagementNetworkMetrics } from './components/ManagementNetworkMetrics';
import { HospitalNetworkMetrics } from './components/HospitalNetworkMetrics';
import { DepartmentStatus } from './components/DepartmentStatus';
import { NetworkListHospital } from './components/NetworkListHospital';
import { OccupancyRateCharts } from './components/OccupancyRateCharts';
import { MaintenanceHospitalRecommendations } from './components/MaintenanceHospitalRecommendations';
import 'mapbox-gl/dist/mapbox-gl.css';
import { HospitalsLocations } from './components/HospitalsLocations';
import { AIAnaliticsMetrics } from './components/AIAnaliticsMetrics';
import { HospitalFlowDiagram } from './components/HospitalFlowDiagram';

// Add department status interface
interface DepartmentStatus {
  name: string;
  status: 'normal' | 'attention' | 'critical';
  occupancy: number;
  waitingList: number;
  icon: React.ElementType;
}

const Overview: React.FC = () => {
  const { networkData, currentUser, loading, error } = useNetworkData();
  const [selectedHospital, setSelectedHospital] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [displayMode, setDisplayMode] = useState<'dashboard' | 'tv'>('dashboard');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

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

  // Function to check if user has access to specific features
  const hasAccess = (feature: 'performance' | 'comparison' | 'discharge') => {
    if (!currentUser) return false;
    return currentUser.permissions.includes('VIEW_ALL_HOSPITALS');
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

  
  // Update the regions list to only include regions from authorized hospitals
  const regions = getAuthorizedHospitals()
  .reduce<string[]>((acc, hospital) => {
    if (!acc.includes(hospital.unit.state)) {
      acc.push(hospital.unit.state);
    }
    return acc;
  }, []);
  
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
    <div className="space-y-6 p-6 -mt-20">
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
          />

      <HospitalNetworkMetrics 
          networkData={networkData}
          selectedRegion={selectedRegion}
          currentMetrics={currentMetrics}
          />

      <DepartmentStatus 
          networkData={networkData}
          selectedHospital={selectedHospital}
          getStatusColor={getStatusColor}
      />

      {/* Main Content Area */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          {/* <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="comparison">Comparativo</TabsTrigger> */}
          {/* <TabsTrigger value="resources-recommendations">Manutenção dos Hospitais por IA</TabsTrigger> */}
          <TabsTrigger value="hospitals-locations">Localização dos Hospitais</TabsTrigger>
          <TabsTrigger value="analytics">Analise dos Hospitais por IA</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Hospital List */}
            <NetworkListHospital 
                filteredHospitals={filteredHospitals}
                setSelectedHospital={setSelectedHospital}
                currentUser={currentUser}
            />

            {/* Occupancy Chart */}
            {/* Occupancy Chart */}
            <OccupancyRateCharts 
              filteredHospitals={filteredHospitals}
            />
          </div>
        </TabsContent>

        {/*
        <TabsContent value="performance">
        </TabsContent>

        <TabsContent value="comparison">
        </TabsContent>*/}

        {/* Existing TabsContent for overview, performance, and comparison */}
        {/* <TabsContent value="resources-recommendations" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <MaintenanceHospitalRecommendations 
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
            />
          </div>
        </TabsContent>*/}

        <TabsContent value="hospitals-locations" className="space-y-4">
          <HospitalsLocations
            hospitals={networkData?.hospitals}
            currentUser={currentUser} 
            selectedHospital={selectedHospital} 
            setSelectedHospital={setSelectedHospital}          
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <AIAnaliticsMetrics 
              filteredHospitals={getFilteredHospitals() || []}
              currentUser={currentUser}
              onRefresh={() => {
                  // Sua lógica de refresh
              }}
          />
        </TabsContent>
      </Tabs>
      
      <HospitalFlowDiagram 
        networkData={networkData}
      />
    </div>
  );
};

export default Overview