/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect } from "react";
import { IDepartmentalStaffMetrics, IStaffTeam } from "@/types/staff-types";
import { TFontSize } from "@/types/utils-types";

// Componentes
import { StaffCardModalHeader } from "./staff-card-modal/StaffCardModalHeader";
import { TeamMetrics } from "./staff-card-modal/TeamMetrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/organisms/card";
import { CapacityStatus } from "./staff-card-modal/CapacityStatus";
import { TeamMembers } from "./staff-card-modal/TeamMembers";
import { TasksList } from "./staff-card-modal/TasksList";

interface StaffCardModalProps {
    selectedTeam: IStaffTeam | null;
    setSelectedTeam: (team: IStaffTeam | null) => void;
    departmentMetrics: IDepartmentalStaffMetrics;
    isHighContrast?: boolean;
    fontSize?: TFontSize;
    // Adicionando as propriedades que faltavam
    analyticsData: Record<string, any>;
    isLoading: boolean;
    onGenerateAnalytics: (team: IStaffTeam) => Promise<void>;
}
  
export const StaffCardModal: React.FC<StaffCardModalProps> = ({
    selectedTeam,
    setSelectedTeam,
    departmentMetrics,
    isHighContrast = false,
    fontSize = 'normal',
    analyticsData,  // Adicionar
    isLoading,      // Adicionar
    onGenerateAnalytics  // Adicionar
}) => {
    useEffect(() => {
        console.log('Modal rendered with team:', selectedTeam?.id);
    }, [selectedTeam]);

    if (!selectedTeam) return null;

    const getContrastClass = (baseClass: string) => {
      if (!isHighContrast) return baseClass;
      return `${baseClass} contrast-high brightness-110`;
    };
  
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className={getContrastClass(
                "bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6"
            )}>
                <StaffCardModalHeader 
                    team={selectedTeam} 
                    onClose={() => setSelectedTeam(null)} 
                />
                <TeamMetrics 
                    team={selectedTeam} 
                    analyticsData={analyticsData}
                    isLoading={isLoading}
                />
                <div className="grid grid-cols-2 gap-6 mb-6 bg-gray-100 dark:bg-gray-700 rounded-xl">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Especialidades</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {selectedTeam.specialties.map((specialty, index) => (
                                    <span 
                                        key={index}
                                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                    >
                                        {specialty}
                                    </span>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                    <CapacityStatus 
                        team={selectedTeam} 
                        analyticsData={analyticsData}
                    />
                </div>
                
                <TeamMembers 
                    members={selectedTeam.members} 
                />
                <TasksList 
                    tasks={selectedTeam.tasks}
                    isLoading={isLoading}
                />
                
                {/* Adicionar botão ou área para gerar análise */}
                <div className="mt-6">
                    <button
                        onClick={() => onGenerateAnalytics(selectedTeam)}
                        disabled={isLoading}
                        className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg 
                                disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? 'Gerando análise...' : 'Gerar Análise da Equipe'}
                    </button>
                </div>
            </div>
        </div>
    );
  };