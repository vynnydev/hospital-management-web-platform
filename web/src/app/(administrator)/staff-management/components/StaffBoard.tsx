/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from 'react';
import { IHospitalMetrics } from '@/types/hospital-network-types';
import { IStaffTeam, IDepartmentalStaffMetrics } from '@/types/staff-types';
import { StaffCard } from './StaffCard';

interface StaffBoardProps {
  data: IHospitalMetrics | undefined;
  departmentMetrics: IDepartmentalStaffMetrics;
  selectedArea: string;
  teams: IStaffTeam[];
  searchQuery?: string;
  setSelectedTeam: (team: IStaffTeam | null) => void;
  generateAnalytics: (team: IStaffTeam) => Promise<void>;
  analyticsData: Record<string, any>;
  isLoading: boolean;
  loadingMessage?: string;
  loadingProgress?: number;
}

export const StaffBoard: React.FC<StaffBoardProps> = ({
  data,
  departmentMetrics,
  selectedArea,
  teams,
  searchQuery = '',
  setSelectedTeam,
  generateAnalytics,
  analyticsData,
  isLoading,
  loadingMessage,
  loadingProgress,
}) => {
  // Estados
  const [selectedDepartment, setSelectedDepartment] = useState<string>(selectedArea || '');

  // Filtra equipes baseado no termo de busca
  const filteredTeams = useMemo(() => {
    if (!searchQuery) return teams;

    const query = searchQuery.toLowerCase();
    return teams.filter(team => 
      team.name.toLowerCase().includes(query) ||
      team.id.toLowerCase().includes(query) ||
      team.specialties.some(spec => spec.toLowerCase().includes(query)) ||
      team.members.some(member => member.toLowerCase().includes(query))
    );
  }, [teams, searchQuery]);

  // Obtém equipes por status
  const getTeamsByStatus = (status: 'active' | 'high_demand' | 'low_demand' | 'critical') => {
    return filteredTeams.filter(team => team.capacityStatus === status);
  };

  const handleCardClick = (team: IStaffTeam) => {
    setSelectedTeam(team);
  };

  const handleGenerateAnalytics = async (team: IStaffTeam) => {
    await generateAnalytics(team);
  };

  // Renderiza colunas do quadro
  const renderTeamColumns = () => {
    const statusColumns = [
      { 
        id: 'active', 
        label: 'Equipes Disponíveis',
        description: 'Capacidade operacional normal'
      },
      { 
        id: 'high_demand', 
        label: 'Alta Demanda',
        description: 'Operando acima da capacidade ideal'
      },
      { 
        id: 'low_demand', 
        label: 'Baixa Demanda',
        description: 'Capacidade ociosa'
      },
      { 
        id: 'critical', 
        label: 'Atenção Necessária',
        description: 'Situações críticas que requerem ação'
      }
    ];

   
    return (
      <div className="grid grid-cols-4 gap-4 w-full h-full">
        {statusColumns.map(({ id, label, description }) => {
          const statusTeams = getTeamsByStatus(id as any);
          console.log("Status dos times:", statusTeams.length)
          return (
            <div key={id} className="flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full h-full">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-teal-500 dark:from-blue-700 dark:to-teal-700 rounded-t-xl">
                <h4 className="text-xl font-semibold text-white">{label}</h4>
                <p className="text-sm text-white/90">
                  {statusTeams.length} equipes
                  {searchQuery && statusTeams.length === 0 && (
                    <span className="text-xs text-white/70"> (nenhum resultado)</span>
                  )}
                </p>
                <p className="text-xs text-white/80 mt-1">{description}</p>
              </div>

              <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {statusTeams.length > 0 ? (
                  statusTeams.map((team) => (
                    <div key={team.id}>
                      <StaffCard
                        team={team}
                        status={id}
                        analyticsData={analyticsData}
                        isLoading={isLoading}
                        loadingMessage={loadingMessage}
                        loadingProgress={loadingProgress}
                        onCardClick={handleCardClick}
                        onGenerateAnalytics={handleGenerateAnalytics}
                        departmentMetrics={departmentMetrics}
                      />
                    </div>
                  ))
                ) : searchQuery ? (
                  <div className="flex items-center justify-center h-32 text-gray-500 dark:text-gray-400">
                    Nenhuma equipe encontrada
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32 text-gray-500 dark:text-gray-400">
                    Nenhuma equipe nesta categoria
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full max-w-full h-screen bg-gray-100 dark:bg-gray-800 flex flex-col px-2 py-2 box-border overflow-hidden">
      {selectedArea && renderTeamColumns()}
    </div>
  );
};