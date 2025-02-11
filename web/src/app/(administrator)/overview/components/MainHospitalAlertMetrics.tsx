/* eslint-disable @typescript-eslint/no-unused-vars */
import { Card } from "@/components/ui/organisms/card";
import { INetworkData } from "@/types/hospital-network-types";
import { AlertCircle, AlertTriangle, Clock, LucideIcon, Settings, Users } from "lucide-react";

type TCardType = 'critical-hospital' | 'staff' | 'maintenance' | 'waiting';
type TSituation = 'normal' | 'attention' | 'critical';

// Função para determinar a cor da situação
const getSituationColors = (situation: TSituation) => {
    const colors = {
      normal: {
        bg: "bg-green-500/20 dark:bg-green-500/30",
        text: "text-white",
        icon: "text-green-100"
      },
      attention: {
        bg: "bg-yellow-500/20 dark:bg-yellow-500/30",
        text: "text-white",
        icon: "text-yellow-100"
      },
      critical: {
        bg: "bg-red-500/20 dark:bg-red-500/30",
        text: "text-white",
        icon: "text-red-100"
      }
    };
    return colors[situation];
};

const getStatusMessage = (card: TCardType, value: number): string => {
    switch (card) {
        case 'critical-hospital':
            return value > 85 ? 'Requer Atenção Imediata' : 'Situação Normal';
        case 'staff':
            return value > 1 ? 'Atenção' : 'Situação Normal';
        case 'maintenance':
            return value > 1 ? 'Requer Atenção Imediata' : 'Situação Normal';
        case 'waiting':
            return value > 4 ? 'Atenção' : 'Tempo Dentro do Esperado';
        default:
            return 'Status não disponível';
    }
};
  
// Função para determinar o tipo de situação
const getSituationType = (card: TCardType, value: number): TSituation => {
    const status = getStatusMessage(card, value);
    
    if (status === 'Situação Normal' || status === 'Tempo Dentro do Esperado') {
        return 'normal';
    }
    if (status === 'Requer Atenção Imediata') {
        return 'critical';
    }
    return 'attention';
};

const getShortHospitalName = (fullName: string | null): string => {
    if (!fullName) return 'Todos';
    
    // Pega o texto após o último hífen e remove espaços extras
    const location = fullName.split('-').pop()?.trim();
    return location || 'Todos';
};

const getFormattedHospitalName = (fullName: string | null, region: string |  null): string => {
    if (!fullName) return 'Todos';
    
    // Pega o texto após o último hífen e remove espaços extras
    const location = fullName.split('-').pop()?.trim();
    
    // Se não for "all", adiciona o estado
    if (region && region !== 'all') {
        return `${location} - ${region}`;
    }
    
    return location || 'Todos';
};

// Definição das propriedades do componente
interface MainHospitalAlertMetricsProps {
    networkData: INetworkData;
    currentMetrics: {
      totalBeds: number;
      totalPatients: number;
      averageOccupancy: number;
    };
    selectedRegion: string | null;
    selectedHospital: string | null,
    
    // Propriedades opcionais para personalização
    criticalOccupancyThreshold?: number;
    staffingNormsThreshold?: number;
    emergencyWaitTimeThreshold?: number;
}

interface IAlertCard {
    title: string;
    icon: LucideIcon;
    value: string | number;
    subtitle: string;
    description: string;
    gradient: string;
    iconColor: string;
    cardType: TCardType;
    valueSize?: 'small' | 'normal';
    severity: 'high' | 'medium' | 'low';
}

export const MainHospitalAlertMetrics: React.FC<MainHospitalAlertMetricsProps> = ({
    networkData,
    currentMetrics,
    selectedRegion,
    selectedHospital,
    criticalOccupancyThreshold = 90,
    staffingNormsThreshold = 0.6,
    emergencyWaitTimeThreshold = 4
  }) => {
    const calculateAlertMetrics = () => {
        const filteredHospitals = selectedRegion && selectedRegion !== 'all'
            ? networkData?.hospitals.filter(h => h.unit.state === selectedRegion)
            : networkData?.hospitals || [];

        const hospitalWithHighestOccupancy = filteredHospitals.reduce((highest, current) => 
            (current.metrics?.overall?.occupancyRate || 0) > (highest.metrics?.overall?.occupancyRate || 0) 
                ? current 
                : highest
        );

        return {
            hospitalWithHighestOccupancy,
            hospitalsBelowStaffingNorms: filteredHospitals.filter(hospital => 
                hospital.metrics?.overall?.totalPatients / hospital.metrics?.overall?.totalBeds < 0.6
            ).length,
            equipmentMaintenanceAlerts: filteredHospitals.reduce((total, hospital) => 
                total + (hospital.metrics?.departmental?.uti?.occupancy > 85 ? 1 : 0), 
                0
            ),
            emergencyRoomWaitingTime: filteredHospitals.reduce((avg, hospital) => 
                avg + (hospital.metrics?.networkEfficiency?.avgWaitTime || 0), 
                0
            ) / filteredHospitals.length
        };
    };

    const alertMetrics = calculateAlertMetrics();

    const getAnalysisMessage = (card: TCardType, value: number): string => {
        switch (card) {
            case 'critical-hospital':
                return 'Taxa de ocupação dentro dos parâmetros esperados. Margem segura na gestão de leitos mantida.';
            case 'staff':
                return `Taxa de ocupação ${value}% menor que a média da rede. UTI requer atenção com média acima do esperado.`;
            case 'maintenance':
                return 'Alta eficiência na gestão de leitos. Média de 42 altas/dia indica ótimo fluxo de pacientes.';
            case 'waiting':
                return '2º lugar na rede com 85% de eficiência. Melhor resultado dos últimos 6 meses.';
            default:
                return '';
        }
    };
  
    const alertCards: IAlertCard[] = [
        {
            title: "Hospital Crítico",
            icon: AlertTriangle,
            value: alertMetrics.hospitalWithHighestOccupancy?.name || 'N/A',
            subtitle: "Maior Ocupação",
            description: `Taxa de Ocupação: ${alertMetrics.hospitalWithHighestOccupancy?.metrics?.overall?.occupancyRate?.toFixed(1)}%`,
            gradient: "from-red-400/20 to-rose-500/20 dark:from-red-500/20 dark:to-rose-600/20",
            iconColor: "text-red-600 dark:text-red-400",
            cardType: "critical-hospital",
            valueSize: 'small',
            severity: (alertMetrics.hospitalWithHighestOccupancy?.metrics?.overall?.occupancyRate || 0) > 90 ? "high" : "medium"
        },
        {
            title: "Déficit de Equipes",
            subtitle: "Dificuldade nas Equipes",
            icon: Users,
            value: alertMetrics.hospitalsBelowStaffingNorms,
            description: "Hospitais abaixo da taxa de ocupação esperada",
            gradient: "from-amber-400/20 to-yellow-500/20 dark:from-amber-500/20 dark:to-yellow-600/20",
            iconColor: "text-amber-600 dark:text-amber-400",
            cardType: "staff",
            severity: alertMetrics.hospitalsBelowStaffingNorms > 1 ? "high" : "low",
        },
        {
            title: "Manutenção de Equipamentos",
            subtitle: "Manutenção Geral",
            icon: Settings,
            value: alertMetrics.equipmentMaintenanceAlerts,
            description: "UTIs com alto risco de indisponibilidade",
            gradient: "from-blue-400/20 to-indigo-500/20 dark:from-blue-500/20 dark:to-indigo-600/20",
            iconColor: "text-blue-600 dark:text-blue-400",
            cardType: "maintenance",
            severity: alertMetrics.equipmentMaintenanceAlerts > 1 ? "high" : "medium",
        },
        {
            title: "Tempo de Espera",
            subtitle: "Espera",
            icon: Clock,
            value: alertMetrics.emergencyRoomWaitingTime.toFixed(1),
            description: "Tempo médio de espera (em horas)",
            gradient: "from-violet-400/20 to-purple-500/20 dark:from-violet-500/20 dark:to-purple-600/20",
            iconColor: "text-violet-600 dark:text-violet-400",
            cardType: "waiting",
            severity: alertMetrics.emergencyRoomWaitingTime > 4 ? "high" : "low",
        }
    ];
  
    return (
        <div className="grid grid-cols-4 gap-6">
            {alertCards.map((card, index) => (
                <div key={index} className={`
                    relative overflow-hidden
                    flex flex-col min-h-[280px]
                    bg-gradient-to-br ${card.gradient}
                    rounded-3xl p-6 shadow-lg backdrop-blur-sm
                    ${card.severity === "high" ? "border border-red-100/20 dark:border-red-800/20" : ""}
                    hover:shadow-xl transition-all duration-300
                `}>
                    {/* Header do Card */}
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-xl bg-${card.iconColor.split('-')[1]}-100/30 
                                dark:bg-${card.iconColor.split('-')[1]}-900/30 backdrop-blur-sm`}>
                                <card.icon className={card.iconColor} size={20} />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                {card.title}
                            </h3>
                        </div>
                        <div className="px-2 py-1 rounded-lg bg-white/10 dark:bg-gray-800/40 backdrop-blur-sm">
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                                {getFormattedHospitalName(selectedHospital, selectedRegion)}
                            </span>
                        </div>
                    </div>

                    {/* Conteúdo Principal */}
                    <div className="space-y-2 mb-6 bg-white/60 dark:bg-gray-800/60 rounded-2xl p-4 backdrop-blur-sm">
                        <div className="flex flex-col">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {card.subtitle}
                            </p>
                            <h2 className={`${card.valueSize === 'small' ? 'text-xl' : 'text-3xl'} 
                                font-bold text-gray-900 dark:text-white mt-1`}>
                                {card.value}
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                {card.description}
                            </p>
                        </div>
                    </div>

                    {/* Análise Comparativa */}
                    <div className="mt-auto bg-black/20 dark:bg-gray-800/60 rounded-2xl p-4 my-4 backdrop-blur-sm">
                        <p className="text-sm font-medium text-white mb-2">
                            Análise comparativa
                        </p>
                        <p className="text-sm text-gray-300">
                            {getAnalysisMessage(card.cardType, typeof card.value === 'number' ? card.value : 0)}
                        </p>
                    </div>

                    {/* Status/Situação */}
                    <div className={`
                        ${getSituationColors(getSituationType(card.cardType, typeof card.value === 'number' ? card.value : 0)).bg}
                        rounded-2xl p-4 backdrop-blur-sm
                        transition-colors duration-200
                        `}>
                            <div className="flex items-center">
                                <AlertCircle className={`w-4 h-4 mr-2 ${
                                    getSituationColors(getSituationType(card.cardType, typeof card.value === 'number' ? card.value : 0)).icon
                                }`} />
                                    <span className={`text-sm font-medium ${
                                        getSituationColors(getSituationType(card.cardType, typeof card.value === 'number' ? card.value : 0)).text
                                    }`}>
                                        {getStatusMessage(card.cardType, typeof card.value === 'number' ? card.value : 0)}
                                    </span>
                            </div>
                        </div>
                </div>
            ))}
        </div>
    );
};