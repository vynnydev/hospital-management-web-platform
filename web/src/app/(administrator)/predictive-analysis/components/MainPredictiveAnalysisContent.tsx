/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Brain, LayoutGrid } from 'lucide-react';
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
import { RepositionActionsBar } from '@/components/ui/templates/RepositionActionsBar';
import { ReorderableSectionsInPredictiveAnalysisPage } from '@/components/ui/templates/ReorderableSectionsInPredictiveAnalysisPage';
import { Button } from '@/components/ui/organisms/button';
import { DashboardModeModalOptions } from '@/components/ui/templates/modals/DashboardModeModalOptions';
import { FullscreenModeModalInPredictiveAnalysisPage } from '@/components/ui/templates/modals/FullscreenModeModalForPredictiveAnalysisPage';

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

interface IDepartmentMetric {
    area: string;
    count: number;
    capacity: number;
    occupancy: number;
}

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

    // Estados de reorganização dos componentes e modo TV 
    const [isDashboardModeModalOpen, setIsDashboardModeModalOpen] = useState(false);
    const [isReorderMode, setIsReorderMode] = useState<boolean>(false);

    const [isFullscreenMode, setIsFullscreenMode] = useState(false);
    const [displayMode, setDisplayMode] = useState<'dashboard' | 'tv'>('dashboard');
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

    const handleSaveLayout = useCallback(() => {
      setInitialSectionsOrder([...currentSectionsOrder]);
      // Aqui você pode adicionar a lógica para salvar no backend
      console.log('Salvando nova ordem:', currentSectionsOrder);
    }, [currentSectionsOrder]);

        const [selectedHospital, setSelectedHospital] = useState<string | null>(() => {
          // Primeiro, verifica se o usuário tem permissão para ver todos os hospitais
          if (currentUser?.permissions.includes('VIEW_ALL_HOSPITALS')) {
            // Se houver hospitais, seleciona o primeiro
            return networkData?.hospitals?.[0]?.id ?? null;
          }
          
          // Se não, retorna o hospital do usuário
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
                capacity: dept.rooms.reduce((total, room) => total + room.beds.length, 0),
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

        // Efeito para atualizar a seleção do hospital quando os dados da rede mudam
        useEffect(() => {
          if (!selectedHospital && networkData?.hospitals?.length) {
            // Se não há hospital selecionado, seleciona o primeiro
            setSelectedHospital(networkData.hospitals[0].id);
          }
        }, [networkData, selectedHospital]);

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
          <>        
            <div className="space-y-6 -mt-28">
              {/* Header sempre visível */}
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

                {/* Display Mode Toggle Button */}
                <div className='p-1 bg-gradient-to-r from-blue-700/90 to-cyan-700/90 rounded-xl'>
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
              </div>
        
              {/* Conteúdo reordenável ou normal */}
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
                  onHospitalSelect={handleHospitalSelect}
                  setSelectedDepartment={setSelectedDepartment}
                  loading={loading}
                  error={error}
                  isReorderMode={isReorderMode}
                  onSectionsOrderChange={setCurrentSectionsOrder}
                />
              ) : (
                <>
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
                                onTeamSelect={(selectedTeam) => {
                                    setSelectedTeam(selectedTeam);
                                }}
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
                      <AnalysisChartStaffPredictive 
                        hospitalId={selectedHospital || ''}
                        hospitalName={networkData?.hospitals?.find(h => h.id === selectedHospital)?.name || 'Hospital'}
                        staffTeams={staffData?.staffTeams || {}}
                      />
                    </div>
                </>
              )}
            </div>

            <RepositionActionsBar
              isReorderMode={isReorderMode}
              setIsReorderMode={setIsReorderMode}
              onSave={handleSaveLayout}
              initialSectionsOrder={initialSectionsOrder}
              currentSectionsOrder={currentSectionsOrder}
            />

            <DashboardModeModalOptions
              isOpen={isDashboardModeModalOpen}
              onClose={() => setIsDashboardModeModalOpen(false)}
              onSelectMode={handleModeSelection}
            />

            <FullscreenModeModalInPredictiveAnalysisPage
              isOpen={isFullscreenMode}
              onClose={() => {
                setIsFullscreenMode(false);
                setDisplayMode('dashboard');
              }}
              networkData={networkData}
              currentUser={currentUser}
              staffData={staffData}
              selectedDepartment={selectedDepartment}
              selectedHospital={selectedHospital}
              departments={departments}
              currentHospitalTeams={currentHospitalTeams}
              onDepartmentSelect={onDepartmentSelect}
              onHospitalSelect={handleHospitalSelect}
              setSelectedDepartment={setSelectedDepartment}
              loading={loading}
              error={error}
            />
          </>
        );
};