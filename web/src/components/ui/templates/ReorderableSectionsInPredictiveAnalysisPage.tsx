/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, Move, Brain } from 'lucide-react';
import { Badge } from '@/components/ui/organisms/badge';

// Tipos
import type { 
    INetworkData
} from '@/types/hospital-network-types';
import type { IAppUser } from '@/types/auth-types';
import type { IStaffTeam, IHospitalStaffMetrics } from '@/types/staff-types';

// Componentes
import { StaffPredictiveAnalysis } from '@/app/(administrator)/predictive-analysis/components/StaffPredictiveAnalysis';
import { TeamAnalyticsBoard } from '@/app/(administrator)/predictive-analysis/components/TeamAnalyticsBoard';
import { AnalysisChartStaffPredictive } from '@/app/(administrator)/predictive-analysis/components/AnalysisChartStaffPredictive';
import { DepartmentAreaCardsWithDifferentUI } from '@/components/ui/templates/DepartmentAreaCardsWithDifferentUI';
import { HospitalNetworkComponentWithDifferenteUI } from '@/components/ui/templates/HospitalNetworkComponentWithDifferenteUI';

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

interface ReorderablePredictiveAnalysisProps {
  networkData: INetworkData | null;
  currentUser: IAppUser | null;
  staffData: {
    staffTeams: { [hospitalId: string]: IStaffTeam[] };
    staffMetrics: { [hospitalId: string]: IHospitalStaffMetrics };
  } | null;
  selectedDepartment: string;
  selectedHospital: string | null;
  departments: Array<{
    area: string;
    count: number;
    capacity: number;
    occupancy: number;
  }>;
  currentHospitalTeams: IStaffTeam[];
  onDepartmentSelect: (department: string) => void;
  onHospitalSelect: (hospitalId: string) => void;
  setSelectedDepartment: (dept: string) => void;
  loading: boolean;
  error: string | null;
  isReorderMode: boolean;
  onSectionsOrderChange?: (sections: string[]) => void;
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

export const ReorderableSectionsInPredictiveAnalysisPage: React.FC<ReorderablePredictiveAnalysisProps> = ({
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
  isReorderMode,
  onSectionsOrderChange,
}) => {
  const [sections, setSections] = useState<Section[]>([]);

  const initialSections: Section[] = [
    {
      id: 'department-areas',
      title: 'Áreas dos Departamentos',
      component: (
        <div className="w-full bg-gray-50/50 dark:bg-gray-900/50 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <DepartmentAreaCardsWithDifferentUI
              departments={departments}
              onClick={onDepartmentSelect}
              selectedArea={selectedDepartment}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      )
    },
    {
      id: 'predictive-analysis',
      title: 'Análise Preditiva',
      component: (
        <>
          {staffData && selectedHospital && (
            <StaffPredictiveAnalysis 
              hospitalId={selectedHospital}
              selectedDepartment={selectedDepartment}
              staffTeams={staffData.staffTeams}
            />
          )}
        </>
      )
    },
    {
      id: 'hospital-network',
      title: 'Rede Hospitalar',
      component: (
        <>
          {networkData?.hospitals && (
            <HospitalNetworkComponentWithDifferenteUI
              networkInfo={networkData?.networkInfo}
              hospitals={networkData?.hospitals}
              currentUser={currentUser}
              onHospitalSelect={onHospitalSelect}
              onDepartmentSelect={setSelectedDepartment}
              selectedHospital={selectedHospital}
              selectedDepartment={selectedDepartment}
              loading={loading}
              error={error}
            />
          )}
        </>
      )
    },
    {
      id: 'team-analytics',
      title: 'Análise de Equipe',
      component: (
        <>
          {currentHospitalTeams && currentHospitalTeams.length > 0 && (
            <div className="pt-8">
              <TeamAnalyticsBoard 
                teams={currentHospitalTeams}
                department={selectedDepartment}
                onTeamSelect={() => {}}
              />
            </div>
          )}
        </>
      )
    },
    {
      id: 'analysis-chart',
      title: 'Gráficos de Análise',
      component: (
        <div className="pt-8">
          <AnalysisChartStaffPredictive 
            hospitalId={selectedHospital || ''}
            hospitalName={networkData?.hospitals?.find(h => h.id === selectedHospital)?.name || 'Hospital'}
            staffTeams={staffData?.staffTeams || {}}
          />
        </div>
      )
    }
  ];

  const notifyOrderChange = React.useCallback(() => {
    if (onSectionsOrderChange) {
      const sectionIds = sections.map(section => section.id);
      onSectionsOrderChange(sectionIds);
    }
  }, [sections, onSectionsOrderChange]);

  useEffect(() => {
    setSections(initialSections);
  }, [networkData?.networkInfo?.id]);

  const moveSection = (currentIndex: number, direction: number): void => {
    setSections(prevSections => {
      const newSections = [...prevSections];
      const newIndex = currentIndex + direction;
      
      if (newIndex >= 0 && newIndex < newSections.length) {
        const [movedSection] = newSections.splice(currentIndex, 1);
        newSections.splice(newIndex, 0, movedSection);
        
        setTimeout(() => notifyOrderChange(), 0);
        
        return newSections;
      }
      
      return prevSections;
    });
  };

  return (
    <div className="space-y-6">
      {/* Seções reordenáveis */}
      <div className={`relative ${isReorderMode ? 'pl-12' : ''} space-y-6`}>
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
    </div>
  );
};