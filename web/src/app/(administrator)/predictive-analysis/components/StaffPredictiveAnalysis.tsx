import React, { useMemo } from 'react';
import { 
  Users, AlertTriangle, Activity, Clock, Brain,
  TrendingUp, Calendar, UserPlus, ArrowUpRight
} from 'lucide-react';
import { useStaffPredictiveAnalysis } from '@/services/hooks/useStaffPredictiveAnalysis';

import type { IStaffTeam } from '@/types/staff-types';
import { HospitalNetworkListSlider } from '@/components/ui/templates/HospitalNetworkListSlider';

interface StaffPredictiveAnalysisProps {
    hospitalId: string;
    selectedDepartment: string;
    staffTeams: { [hospitalId: string]: IStaffTeam[] };
}

export const StaffPredictiveAnalysis: React.FC<StaffPredictiveAnalysisProps> = ({ 
  hospitalId, 
  selectedDepartment,
  staffTeams, 
}) => {
    const { predictDepartmentDemand, predictStaffingNeeds } = useStaffPredictiveAnalysis(staffTeams);
  
    const departmentDemand = useMemo(() => 
      predictDepartmentDemand(hospitalId, selectedDepartment), 
      [hospitalId, selectedDepartment, predictDepartmentDemand]
    );
    
    const staffingNeeds = useMemo(() => 
      predictStaffingNeeds(hospitalId), 
      [hospitalId, predictStaffingNeeds]
    );

    return (
        <div className="space-y-8">
            {/* Cards Grid */}
            <div className="grid grid-cols-3 gap-6">
                {/* Card Demanda de Equipes */}
                <div className="bg-slate-200 dark:bg-gray-900
                    backdrop-blur-sm rounded-3xl min-h-[320px] border border-slate-200/10 dark:border-slate-700/30
                    transition-all hover:border-slate-200/20 dark:hover:border-slate-600/40">
                    <div className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Users className="w-5 h-5 text-blue-500" />
                            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                                Demanda de Equipes
                            </h3>
                        </div>

                        {/* Subcard de Valores */}
                        <div className="bg-white/40 dark:bg-slate-800/40 rounded-2xl p-4 mb-4
                            border border-slate-200/20 dark:border-slate-700/20">
                            <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-slate-700 dark:text-slate-100">2</span>
                            <div className="flex items-center text-emerald-600 dark:text-emerald-400 text-sm">
                                <ArrowUpRight className="w-4 h-4" />
                                +15.3%
                            </div>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            Equipes ativas
                            </p>
                        </div>

                        {/* Subcard MediMind Insights */}
                        <div className="bg-blue-50/50 dark:bg-blue-900/20 rounded-2xl p-4
                            border border-blue-200/20 dark:border-blue-700/20 cursor-pointer
                            hover:bg-blue-50/70 dark:hover:bg-blue-900/30 transition-colors">
                            <div className="flex items-center gap-2 mb-3">
                            <Brain className="w-4 h-4 text-blue-500" />
                            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                MediMind Insights
                            </span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                            Clique para gerar recomendações de otimização de equipe
                            </p>
                        </div>
                        </div>
                    </div>

            {/* Card Taxa de Conclusão */}
            <div className="bg-slate-200 dark:bg-gray-900
                backdrop-blur-sm rounded-3xl min-h-[320px] border border-slate-200/10 dark:border-slate-700/30
                transition-all hover:border-slate-200/20 dark:hover:border-slate-600/40">
                <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Activity className="w-5 h-5 text-emerald-500" />
                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                    Taxa de Conclusão
                    </h3>
                </div>

                {/* Subcard de Valores */}
                <div className="bg-white/40 dark:bg-slate-800/40 rounded-2xl p-4 mb-4
                    border border-slate-200/20 dark:border-slate-700/20">
                    <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-slate-700 dark:text-slate-100">90%</span>
                    <div className="flex items-center text-emerald-600 dark:text-emerald-400 text-sm">
                        <ArrowUpRight className="w-4 h-4" />
                        +5.2%
                    </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Média de tarefas concluídas
                    </p>
                </div>

                {/* Subcard MediMind Insights */}
                <div className="bg-emerald-50/50 dark:bg-emerald-900/20 rounded-2xl p-4
                    border border-emerald-200/20 dark:border-emerald-700/20 cursor-pointer
                    hover:bg-emerald-50/70 dark:hover:bg-emerald-900/30 transition-colors">
                    <div className="flex items-center gap-2 mb-3">
                    <Brain className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                        MediMind Insights
                    </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                    Clique para gerar análise de produtividade
                    </p>
                </div>
                </div>
            </div>

            {/* Card Alertas */}
            <div className="bg-slate-200 dark:bg-gray-900
                backdrop-blur-sm rounded-3xl min-h-[320px] border border-slate-200/10 dark:border-slate-700/30
                transition-all hover:border-slate-200/20 dark:hover:border-slate-600/40">
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                            Alertas
                        </h3>
                    </div>

                    {/* Subcard de Valores */}
                    <div className="bg-white/40 dark:bg-slate-800/40 rounded-2xl p-4 mb-4
                        border border-slate-200/20 dark:border-slate-700/20">
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-slate-700 dark:text-slate-100">1</span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            Equipes em alta demanda
                        </p>
                    </div>

                    {/* Subcard MediMind Insights */}
                    <div className="bg-amber-50/50 dark:bg-amber-900/20 rounded-2xl p-4
                        border border-amber-200/20 dark:border-amber-700/20 cursor-pointer
                        hover:bg-amber-50/70 dark:hover:bg-amber-900/30 transition-colors">
                        <div className="flex items-center gap-2 mb-3">
                            <Brain className="w-4 h-4 text-amber-500" />
                            <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
                                MediMind Insights
                            </span>
                            </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                Clique para gerar recomendações de alerta
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );
};