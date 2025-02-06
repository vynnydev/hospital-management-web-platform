/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent } from "@/components/ui/organisms/card";
import { IStaffTeam } from "@/types/staff-types";
import { Activity, Brain, Clock } from "lucide-react";

interface ITeamMetricsProps {
    team: IStaffTeam;
    analyticsData?: Record<string, any>;
    isLoading?: boolean;
}

// Sub-componente: Métricas da Equipe
export const TeamMetrics: React.FC<ITeamMetricsProps> = ({
    team,
    analyticsData,
    isLoading
}) => {
    // Usar dados de análise se disponíveis
    const metrics = analyticsData?.[team.id] || {
        performance: team.metrics.taskCompletion,
        efficiency: team.metrics.avgResponseTime,
        satisfaction: team.metrics.patientSatisfaction
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-3 gap-4 mb-6 ">
                {[1, 2, 3].map((i) => (
                    <Card key={i}>
                        <CardContent className="pt-6">
                            <div className="animate-pulse flex items-center gap-2">
                                <div className="w-5 h-5 bg-gray-200 rounded"></div>
                                <div>
                                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-3 gap-4 mb-6 bg-gray-100 dark:bg-gray-700 rounded-xl">
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-500" />
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Taxa de Conclusão</p>
                            <p className="text-xl font-semibold">{metrics.performance}%</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-green-500" />
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Eficiência</p>
                            <p className="text-xl font-semibold">{metrics.efficiency}%</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center gap-2">
                        <Brain className="w-5 h-5 text-purple-500" />
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Satisfação</p>
                            <p className="text-xl font-semibold">{metrics.satisfaction}/5.0</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};