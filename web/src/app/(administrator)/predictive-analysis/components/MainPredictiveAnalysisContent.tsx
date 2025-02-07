import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Brain } from 'lucide-react';
import { generateAIRecommendations } from '@/services/AI/aiStaffAnalysis';
import { AIGenerationModal } from './AIGenerationModal';
import { StaffPredictiveAnalysis } from './StaffPredictiveAnalysis';

// Tipos
import type { INetworkData } from '@/types/hospital-network-types';
import type { IAppUser } from '@/types/auth-types';
import type { IHospitalStaffMetrics, IStaffTeam } from '@/types/staff-types';
import type { AIGeneratedContent } from '@/types/ai-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/organisms/card';
import { Badge } from '@/components/ui/organisms/badge';
import { Progress } from '@/components/ui/organisms/progress';
import { AnalysisChartStaffPredictive } from './AnalysisChartStaffPredictive';
import { HospitalNetworkComponent } from '@/components/ui/templates/HospitalNetworkComponent';
import { HospitalNetworkComponentWithDifferenteUI } from '@/components/ui/templates/HospitalNetworkComponentWithDifferenteUI';
import { DepartmentAreaCardsWithDifferentUI } from '@/components/ui/templates/DepartmentAreaCardsWithDifferentUI';
import { calculateDepartmentOccupancy, countDepartmentPatients } from '@/utils/calculateDepartment';
import { TeamAnalyticsBoard } from './TeamAnalyticsBoard';
import { transformTeamMemberToExtended } from '@/types/staff-analytics-types';

interface MainPredictiveAnalysisContentProps {
  networkData: INetworkData | null;
  currentUser: IAppUser | null;
  staffData: {
    staffTeams: { [hospitalId: string]: IStaffTeam[] };
    staffMetrics: { [hospitalId: string]: IHospitalStaffMetrics };
  } | null;
  selectedDepartment: string;
  setSelectedDepartment: (dept: string) => void;
  getTeamsByDepartment: (hospitalId: string, department: string) => IStaffTeam[];
  onDepartmentSelect: (department: string) => void;
  loading: boolean;
  error: string | null;
}

interface TeamCardProps {
    team: IStaffTeam;
    onAIGenerate: (team: IStaffTeam) => void;
}

interface IDepartmentMetric {
    area: string;
    count: number;
    capacity: number;
    occupancy: number;
}

const mockStaffMember = {
    id: "STF001",
    name: "Dr. Ana Santos",
    role: "Cardiologista Senior",
    department: "UTI",
    shift: "Manhã",
    skillPoints: 78,
    keyCompetencies: ["Cardiologia", "Gestão de Equipe", "Procedimentos Intensivos"],
    activeGoals: [
      {
        id: "GOAL001",
        type: "KPI",
        title: "Redução do Tempo de Resposta",
        date: "2025-03-01",
        status: "active",
        progress: 75,
        description: "Diminuir tempo médio de atendimento em 15%"
      },
      // ... mais objetivos
    ],
    achievedGoals: [
      {
        id: "GOAL003",
        type: "TRAINING",
        title: "Certificação em ACLS",
        date: "2025-01-15",
        status: "completed",
        description: "Conclusão do curso avançado de suporte à vida"
      },
      // ... mais objetivos alcançados
    ],
    performanceMetrics: {
      taskCompletion: 92,
      patientSatisfaction: 88,
      teamCollaboration: 95,
      burnoutRisk: 15
    }
};

// Segundo componente principal
export const MainPredictiveAnalysisContent: React.FC<MainPredictiveAnalysisContentProps> = ({ 
    networkData, 
    currentUser,
    staffData,
    selectedDepartment,
    setSelectedDepartment,
    getTeamsByDepartment,
    onDepartmentSelect,
    loading,
    error,
  }) => {
    const [selectedTeam, setSelectedTeam] = useState<IStaffTeam | null>(null);
    const [aiModalOpen, setAIModalOpen] = useState(false);
    const [generatedContent, setGeneratedContent] = useState<AIGeneratedContent | null>(null);
    const [departments, setDepartments] = useState<IDepartmentMetric[]>([]);

    const [selectedHospital, setSelectedHospital] = useState<string | null>(() => {
        // First, check if user has VIEW_ALL_HOSPITALS permission
        if (currentUser?.permissions.includes('VIEW_ALL_HOSPITALS')) {
          // Safely get the first hospital's ID
          return networkData?.hospitals?.[0]?.id ?? null;
        }
        
        // If not, return the user's hospital ID
        return currentUser?.hospitalId ?? null;
    });
  
    // Update department when hospital changes
    useEffect(() => {
        if (selectedHospital && networkData) {
          const hospital = networkData.hospitals.find(h => h.id === selectedHospital);
          if (hospital && hospital.departments.length > 0) {
            // Select the first department of the selected hospital
            setSelectedDepartment(hospital.departments[0].name.toLowerCase());
          }
        }
      }, [selectedHospital, networkData, setSelectedDepartment]);
  
      const handleHospitalSelect = (hospitalId: string) => {
        setSelectedHospital(hospitalId);
    };
  
    const currentHospitalId = useMemo(() => {
      if (currentUser?.permissions.includes('VIEW_ALL_HOSPITALS')) {
        return networkData?.hospitals[0]?.id;
      }
      return currentUser?.hospitalId;
    }, [currentUser, networkData]);
  
    const currentHospitalTeams = useMemo(() => {
      if (!currentHospitalId || !staffData?.staffTeams) return [];
      return getTeamsByDepartment(currentHospitalId, selectedDepartment);
    }, [currentHospitalId, selectedDepartment, getTeamsByDepartment, staffData]);
  
    const handleAIGeneration = useCallback(async (team: IStaffTeam) => {
      setSelectedTeam(team);
      setAIModalOpen(true);
      
      try {
        const result = await generateAIRecommendations(team);
        setGeneratedContent({
          recommendation: result.recommendation || undefined,
          image: result.image || undefined
        });
      } catch (error) {
        console.error('Erro na geração de IA:', error);
        setGeneratedContent(null);
      }
    }, []);

    // Efeito para atualizar departamentos quando um hospital é selecionado
    useEffect(() => {
        if (selectedHospital && networkData?.hospitals) {
            const hospital = networkData?.hospitals.find(h => h.id === selectedHospital);
            if (hospital?.departments) {
            const deptMetrics: IDepartmentMetric[] = hospital.departments.map(dept => ({
                area: dept.name,
                count: countDepartmentPatients(dept),
                capacity: dept.beds.length,
                occupancy: calculateDepartmentOccupancy(dept)
            }));
            setDepartments(deptMetrics);
            }
        }
    }, [selectedHospital, networkData?.hospitals]);

    const selectedTeamMember = useMemo(() => {
        if (!currentHospitalTeams.length || !staffData) return null;
        
        const team = currentHospitalTeams[0];
        return transformTeamMemberToExtended(team.leader, team);
    }, [currentHospitalTeams, staffData]);

    // Função para renderizar os cards de departamento
    const renderDepartmentCardsWithDifferentIU = () => {
        return (
            <div className="w-full bg-gray-50/50 dark:bg-gray-900/50 rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                    <DepartmentAreaCardsWithDifferentUI
                        departments={departments}
                        onClick={onDepartmentSelect}
                        selectedArea={selectedDepartment || ''}
                        loading={loading}
                        error={error}
                    />
                </div>
            </div>
        );
    };
  
    return (
      <div className="space-y-6 -mt-28">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Brain className="w-6 h-6 text-blue-400" />
            <h1 className="text-2xl font-bold">Análise Preditiva Detalhada</h1>
            <Badge className="text-base bg-gradient-to-r from-blue-700/70 to-cyan-700/70">
                {networkData?.hospitals?.find(h => h.id === currentHospitalId)?.name || 'Hospital'}
            </Badge>
            <Badge className="text-base bg-gradient-to-r from-blue-700/70 to-cyan-700/70">
                {selectedDepartment.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Área dos Departamentos */}
        <div className="w-full bg-gray-50/50 dark:bg-gray-900/50 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
            {renderDepartmentCardsWithDifferentIU()}
            </div>
        </div>

        {/* Análise Preditiva */}
        {staffData && currentHospitalId && (
          <StaffPredictiveAnalysis 
            hospitalId={currentHospitalId}
            selectedDepartment={selectedDepartment}
            staffTeams={staffData.staffTeams}
          />
        )}

        {/* Hospital Network Slider */}
        {networkData?.hospitals && (
            <HospitalNetworkComponentWithDifferenteUI
                networkInfo={networkData?.networkInfo}
                hospitals={networkData?.hospitals}
                currentUser={currentUser}
                onHospitalSelect={handleHospitalSelect}
                onDepartmentSelect={setSelectedDepartment}
                selectedHospital={selectedHospital}
                selectedDepartment={selectedDepartment}
                loading={loading}
                error={error || null}
            />
        )}

        {currentHospitalTeams && currentHospitalTeams.length > 0 && (
            <div className='pt-8'>
                <TeamAnalyticsBoard 
                    teams={currentHospitalTeams}
                    department={selectedDepartment}
                />
            </div>
        )}
  
        {/* Modal de IA */}
        {selectedTeam && (
          <AIGenerationModal 
            isOpen={aiModalOpen}
            onClose={() => {
              setAIModalOpen(false);
              setSelectedTeam(null);
            }}
            team={selectedTeam}
            content={generatedContent}
          />
        )}

        <div className='pt-8'>
            <AnalysisChartStaffPredictive />
        </div>
      </div>
    );
};