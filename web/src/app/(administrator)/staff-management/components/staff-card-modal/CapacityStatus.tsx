/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent } from "@/components/ui/organisms/card";
import { Progress } from '@/components/ui/organisms/progress';

// Tipos
import { IStaffTeam } from "@/types/staff-types";

interface ICapacityStatusProps {
    team: IStaffTeam;
    analyticsData?: Record<string, any>;
}

// Sub-componente: Status da Capacidade
export const CapacityStatus: React.FC<ICapacityStatusProps> = ({
    team,
    analyticsData
}) => {
    const getStatusInfo = () => {
        const statusMap = {
            optimal: { color: 'bg-green-500', text: 'Capacidade Ideal' },
            high_demand: { color: 'bg-yellow-500', text: 'Alta Demanda' },
            low_demand: { color: 'bg-blue-500', text: 'Baixa Demanda' },
            critical: { color: 'bg-red-500', text: 'Situação Crítica' }
        };
        return statusMap[team.capacityStatus];
    };
  
    const status = getStatusInfo();
    // Usar analyticsData se disponível
    const completionRate = analyticsData?.[team.id]?.performance || team.metrics.taskCompletion;
  
    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${status.color}`} />
                        <span className="font-medium">{status.text}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Progress value={completionRate} className="w-32" />
                        <span className="text-sm text-gray-600">{completionRate}%</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};