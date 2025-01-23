/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
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
  Puzzle
} from 'lucide-react';
import { HospitalNetworkMetrics } from './HospitalNetworkMetrics';
import { NetworkData } from '@/types/hospital-network-types';
import { IntegrationsPreviewPressable } from '@/components/ui/organisms/IntegrationsPreviewPressable';

interface HospitalMetrics {
  unit: {
    state: string;
    name?: string;
  };
}

interface NetworkInfo {
  name: string;
  logo?: string;
}

interface CurrentMetrics {
  totalBeds: number;
  totalPatients: number;
  averageOccupancy: number;
}

interface ManagementNetworkMetricsProps {
  networkData: NetworkData;
  filteredHospitals: HospitalMetrics[];
  selectedRegion: string;
  setSelectedRegion: React.Dispatch<React.SetStateAction<string>>;
  setDisplayMode: React.Dispatch<React.SetStateAction<"dashboard" | "tv">>;
  displayMode: "dashboard" | "tv";
  currentMetrics: CurrentMetrics;
  canChangeRegion: boolean | undefined;
}

export const ManagementNetworkMetrics: React.FC<ManagementNetworkMetricsProps> = ({
  networkData,
  selectedRegion,
  setSelectedRegion,
  setDisplayMode,
  displayMode,
  currentMetrics,
  filteredHospitals,
  canChangeRegion
}) => {
  const [isIntegrationsOpen, setIsIntegrationsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

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
            <div className='mr-[790px]'>
              <IntegrationsPreviewPressable 
                onSelectIntegration={() => {
                  setIsIntegrationsOpen(true);
                  setActiveSection('integrations');
                }} 
              />
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

              {/* Botão de Integrações */}
              {/* <div className="fixed bottom-8 right-8 flex items-center gap-2">
                <button
                  onClick={() => setIsIntegrationsOpen(true)}
                  className="rounded-full p-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2"
                  aria-label="Abrir integrações"
                >
                  <div className="p-2 bg-white/10 rounded-full">
                    <Puzzle className="w-5 h-5" />
                  </div>
                  <span className="pr-2 font-medium">Integrações</span>
                </button>
              </div>

              <IntegrationsNetworkMetricsModal
                  isOpen={isIntegrationsOpen}
                  onClose={() => setIsIntegrationsOpen(false)}
                /> */}
            </div>
          </div>

          {/* Metrics Cards */}
          <HospitalNetworkMetrics 
              networkData={networkData}
              currentMetrics={currentMetrics}
          />

          {/* Action Buttons */}
          {/* <div className="flex space-x-4">
            <Button className="flex-1 bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-800 border border-blue-200 dark:border-blue-700">
              <Map className="mr-2 h-4 w-4" />
              Ver Mapa de Leitos
            </Button>
            <Button className="flex-1 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600">
              <Settings className="mr-2 h-4 w-4" />
              Configurações da Rede
            </Button>
          </div> */}
        </div>
      </CardContent>
    </Card>
  );
};