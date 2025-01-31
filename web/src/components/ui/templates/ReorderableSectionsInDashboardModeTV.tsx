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
import { IAppUser } from '@/types/auth-types';
import { FlowEditor } from '@/app/(administrator)/overview/components/workflow/FlowEditor';

interface ReorderableSectionProps {
  children: React.ReactNode;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
  title: string;
}

interface DashboardSection {
  id: string;
  title: string;
  component: React.ReactNode;
}

interface DashboardTVProps {
  networkData: INetworkData;
  filteredHospitals: IHospital[];
  selectedHospital: string | null;
  setSelectedHospital: React.Dispatch<React.SetStateAction<string | null>>;
  currentUser: IAppUser | null;
  selectedRegion: string;
  setSelectedRegion: React.Dispatch<React.SetStateAction<string>>;
  setDisplayMode: React.Dispatch<React.SetStateAction<"dashboard" | "tv">>;
  displayMode: "dashboard" | "tv";
  currentMetrics: {
    totalBeds: number;
    totalPatients: number;
    averageOccupancy: number;
  };
  canChangeRegion?: boolean;
  getStatusColor: (status: "normal" | "attention" | "critical") => string;
  getFilteredHospitals: () => IHospital[];
}

const ReorderableSectionDashboardMode: React.FC<ReorderableSectionProps> = ({ 
  children, 
  onMoveUp, 
  onMoveDown, 
  isFirst, 
  isLast, 
  title 
}) => {
  return (
    <motion.div
      layout
      className="relative bg-gradient-to-r from-blue-700 to-cyan-700 rounded-md shadow-md mb-4"
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
      <div className="p-4 bg-gray-800 rounded-md">
        <div className="flex items-center gap-2 mb-2 text-white">
          <Move className="w-4 h-4" />
          <h3 className="text-sm font-medium">{title}</h3>
        </div>
        {children}
      </div>
    </motion.div>
  );
};

export const ReorderableSectionsInDashboardModeTV: React.FC<DashboardTVProps> = ({
  networkData,
  filteredHospitals,
  selectedHospital,
  setSelectedHospital,
  currentUser,
  selectedRegion,
  setSelectedRegion,
  setDisplayMode,
  displayMode,
  currentMetrics,
  canChangeRegion,
  getStatusColor,
  getFilteredHospitals,
}) => {
  // Estado local para controle de seções
  const [sections, setSections] = useState<DashboardSection[]>([]);
  
  // Efeito para atualizar as seções quando selectedHospital ou outros dados mudarem
  useEffect(() => {
    setSections([
      {
        id: 'metrics',
        title: 'Métricas da Rede',
        component: (
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
        ),
      },
      {
        id: 'department',
        title: 'Status dos Departamentos',
        component: (
          <DepartmentStatus
            networkData={networkData}
            selectedHospital={selectedHospital}
            getStatusColor={getStatusColor}
          />
        ),
      },
      {
        id: 'hospitals',
        title: 'Lista de Hospitais',
        component: (
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
      },
      {
        id: 'network-flow-hospital',
        title: 'Fluxo de Rede Hospital',
        component: (
          <FlowEditor networkData={networkData}/>
        ),
      },
    ]);
  }, [networkData, filteredHospitals, selectedHospital, currentUser, selectedRegion, displayMode, currentMetrics, setSelectedRegion, setDisplayMode, canChangeRegion, getStatusColor, getFilteredHospitals, setSelectedHospital]);

  const moveSection = (currentIndex: number, direction: number): void => {
    const newSections = [...sections];
    const newIndex = currentIndex + direction;
    
    if (newIndex >= 0 && newIndex < sections.length) {
      const [movedSection] = newSections.splice(currentIndex, 1);
      newSections.splice(newIndex, 0, movedSection);
      setSections(newSections);
    }
  };

  return (
    <div className="relative pl-12">
      <AnimatePresence>
        {sections.map((section, index) => (
          <ReorderableSectionDashboardMode
            key={section.id}
            title={section.title}
            onMoveUp={() => moveSection(index, -1)}
            onMoveDown={() => moveSection(index, 1)}
            isFirst={index === 0}
            isLast={index === sections.length - 1}
          >
            {section.component}
          </ReorderableSectionDashboardMode>
        ))}
      </AnimatePresence>
    </div>
  );
};