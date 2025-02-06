/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Users, Clock, Activity, ChevronRight, Brain, Briefcase } from 'lucide-react';
import { IStaffTeam, IDepartmentalStaffMetrics } from '@/types/staff-types';
import { QRCodeSVG } from 'qrcode.react';
import { AIRecommendationCardPressable } from '../../patient-management/components/AI/AIRecommendationCardPressable';

interface StaffCardProps {
    team: IStaffTeam;
    status: string;
    analyticsData: Record<string, any>;
    departmentMetrics: IDepartmentalStaffMetrics;
    isLoading: boolean;
    loadingMessage?: string;
    loadingProgress?: number;
    onCardClick?: (team: IStaffTeam) => void;
    onGenerateAnalytics?: (team: IStaffTeam) => void;
}

export const StaffCard: React.FC<StaffCardProps> = ({
    team,
    analyticsData,
    departmentMetrics,
    isLoading,
    loadingMessage = "Gerando análise...",
    loadingProgress,
    onCardClick,
    onGenerateAnalytics
}) => {
    const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!(e.target as HTMLElement).closest('.analytics-recommendation-card')) {
            e.stopPropagation();
            onCardClick?.(team);
        }
    };

    const handleGenerateAnalytics = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        onGenerateAnalytics?.(team);
    };

    const generateQRCodeData = () => {
        try {
            const teamData = {
                id: team.id,
                name: team.name,
                department: team.department,
                shift: team.shift,
                members: team.members.length,
                specialties: team.specialties,
                metrics: {
                    completion: team.metrics.taskCompletion,
                    response: team.metrics.avgResponseTime,
                    satisfaction: team.metrics.patientSatisfaction
                }
            };
            return JSON.stringify(teamData);
        } catch (error) {
            console.error('Erro ao gerar dados do QR Code:', error);
            return JSON.stringify({ id: team.id, name: team.name });
        }
    };

    // Calcula indicadores de performance
    const getPerformanceIndicator = () => {
        const completion = team.metrics.taskCompletion;
        if (completion >= 90) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
        if (completion >= 70) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    };

    return (
        <div 
            className="bg-gradient-to-br from-blue-500 to-teal-400 dark:from-blue-700 dark:to-teal-700 rounded-xl p-1 cursor-pointer
                       hover:shadow-lg transition-all duration-300"
            onClick={handleCardClick}
        >
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                
                <div className="flex items-start justify-between gap-4 relative">
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg text-gray-800 dark:text-white">
                                {team.name}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPerformanceIndicator()}`}>
                                {team.metrics.taskCompletion}% eficiência
                            </span>
                        </div>
                        
                        <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <Users className="w-4 h-4" />
                            <span>{team.members.length} membros</span>
                            <span className="mx-2">•</span>
                            <Clock className="w-4 h-4" />
                            <span>Turno: {team.shift}</span>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                            {team.specialties.map((specialty, index) => (
                                <span 
                                    key={index}
                                    className="px-2 py-1 rounded-full bg-blue-100/80 dark:bg-blue-900/80 
                                             text-blue-800 dark:text-blue-100 text-xs font-medium"
                                >
                                    {specialty}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex-shrink-0 group relative">
                        <div className="bg-white p-2 rounded-lg shadow-md transform transition-all duration-300 hover:shadow-lg">
                            <QRCodeSVG
                                value={generateQRCodeData()}
                                size={64}
                                level="L"
                                className="w-16 h-16"
                            />
                            <div className="absolute -bottom-1 right-0 transform translate-y-full opacity-0 
                                          group-hover:opacity-100 transition-opacity duration-200 w-40 p-2 
                                          bg-gray-800 text-xs text-white rounded shadow-lg z-10">
                                Escaneie para ver detalhes da equipe
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-600/30 rounded-lg p-2">
                        <Activity className="w-4 h-4 text-blue-500" />
                        <div className="text-sm">
                            <span className="block text-gray-600 dark:text-gray-300">Taxa de Resposta</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                                {team.metrics.avgResponseTime}min
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-600/30 rounded-lg p-2">
                        <Briefcase className="w-4 h-4 text-green-500" />
                        <div className="text-sm">
                            <span className="block text-gray-600 dark:text-gray-300">Tarefas Ativas</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                                {team.tasks.length}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-600/30 rounded-lg p-2">
                        <Brain className="w-4 h-4 text-purple-500" />
                        <div className="text-sm">
                            <span className="block text-gray-600 dark:text-gray-300">Satisfação</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                                {team.metrics.patientSatisfaction}/5.0
                            </span>
                        </div>
                    </div>
                </div>

                {/* <div className="analytics-recommendation-card mt-4">
                    <AIRecommendationCardPressable
                        onGenerateAnalytics={handleGenerateAnalytics}
                        isLoading={isLoading}
                        loadingMessage={loadingMessage}
                        loadingProgress={loadingProgress}
                        analyticsData={analyticsData}
                    />
                </div> */}

                {/* Indicador de ações pendentes ou alertas */}
                {team.tasks.some(task => task.priority === 'high' && task.status === 'pending') && (
                    <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 
                                  rounded-lg flex items-center justify-between">
                        <span className="text-sm text-red-700 dark:text-red-300">
                            Existem tarefas prioritárias pendentes
                        </span>
                        <ChevronRight className="w-4 h-4 text" />
                        <ChevronRight className="w-4 h-4 text-red-700 dark:text-red-300" />
                    </div>
                )}

                {/* Status de capacidade da equipe */}
                <div className="mt-3 flex justify-between items-center border-t border-gray-200 dark:border-gray-600 pt-3">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                            team.capacityStatus === 'optimal' ? 'bg-green-500' :
                            team.capacityStatus === 'high_demand' ? 'bg-yellow-500' :
                            team.capacityStatus === 'low_demand' ? 'bg-blue-500' :
                            'bg-red-500'
                        }`} />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                            {team.capacityStatus === 'optimal' ? 'Capacidade Ideal' :
                             team.capacityStatus === 'high_demand' ? 'Alta Demanda' :
                             team.capacityStatus === 'low_demand' ? 'Baixa Demanda' :
                             'Situação Crítica'}
                        </span>
                    </div>
                    
                    {/* Líder da equipe */}
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-primary" />
                        </div>
                        <div className="text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Líder:</span>
                            <span className="ml-1 text-gray-700 dark:text-gray-200">
                                {team.leader}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Próxima tarefa agendada, se houver */}
                {team.tasks.find(task => task.status === 'scheduled') && (
                    <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 
                                  rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-700 dark:text-blue-300" />
                            <span className="text-sm text-blue-700 dark:text-blue-300">
                                Próxima tarefa em{' '}
                                {new Date(team.tasks.find(task => task.status === 'scheduled')?.scheduledFor || '')
                                    .toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-blue-700 dark:text-blue-300" />
                    </div>
                )}
            </div>
        </div>
    );
};