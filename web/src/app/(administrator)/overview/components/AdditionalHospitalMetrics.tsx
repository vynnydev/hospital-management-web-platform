/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { 
  Users,
  Activity,
  TrendingUp,
  RotateCcw,
  Settings,
  ArrowUp,
  ArrowDown,
  ChevronUp,
  ChevronDown,
  AlertTriangle,
  GraduationCap,
  Users2,
  LucideIcon
} from 'lucide-react';
import { INetworkData } from '@/types/hospital-network-types';

type TCardType = 'hospital-critico' | 'burnout' | 'manutencao' | 'taxa-giro' | 
                'eficiencia' | 'ocupacao' | 'variacao' | 'treinamento';

interface ICurrentMetrics {
  totalBeds: number;
  totalPatients: number;
  averageOccupancy: number;
}

interface IMetricsProps {
  networkData: INetworkData;
  currentMetrics: ICurrentMetrics;
  selectedHospital?: string;
}

interface IAdditionalInfo {
  label: string;
  value: string;
}

interface IMetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  color: string;
  icon: LucideIcon;
  trend?: number;
  target?: number;
  additionalInfo?: IAdditionalInfo;
  selectedHospital?: string;
  valueSize?: 'normal' | 'small';
  cardType: TCardType
}

interface ICalculatedMetrics {
  hospitalWithHighestOccupancy: any; // Tipo específico do hospital
  burnoutRiskCalculation: number;
  equipmentMaintenanceRisk: number;
  professionalTrainingRate: number;
  departmentPatientVariation: number;
}

const getCardGradient = (cardType: TCardType): string => {
  const gradients: Record<TCardType, string> = {
    'hospital-critico': 'from-red-400/20 to-rose-500/20 dark:from-red-500/20 dark:to-rose-600/20',
    'burnout': 'from-orange-400/20 to-amber-500/20 dark:from-orange-500/20 dark:to-amber-600/20',
    'manutencao': 'from-blue-400/20 to-indigo-500/20 dark:from-blue-500/20 dark:to-indigo-600/20',
    'taxa-giro': 'from-cyan-400/20 to-sky-500/20 dark:from-cyan-500/20 dark:to-sky-600/20',
    'eficiencia': 'from-emerald-400/20 to-green-500/20 dark:from-emerald-500/20 dark:to-green-600/20',
    'ocupacao': 'from-violet-400/20 to-purple-500/20 dark:from-violet-500/20 dark:to-purple-600/20',
    'variacao': 'from-fuchsia-400/20 to-pink-500/20 dark:from-fuchsia-500/20 dark:to-pink-600/20',
    'treinamento': 'from-teal-400/20 to-cyan-500/20 dark:from-teal-500/20 dark:to-cyan-600/20'
  };
  return gradients[cardType] || 'from-gray-400/20 to-gray-500/20';
};

const getProgressWidth = (value: string | number, target: number): number => {
  let numericValue: number;
  
  // Se o valor é uma string com %
  if (typeof value === 'string' && value.includes('%')) {
    numericValue = parseFloat(value.replace('%', ''));
  } 
  // Se é um número
  else if (typeof value === 'number') {
    numericValue = value;
  }
  // Fallback para string sem %
  else {
    numericValue = parseFloat(value as string);
  }

  // Se o valor é inválido, retorna 0
  if (isNaN(numericValue)) return 0;
  
  // Calcula a porcentagem em relação à meta
  const percentage = (numericValue / target) * 100;
  
  // Limita entre 0 e 100
  return Math.min(100, Math.max(0, percentage));
};

const MetricCard: React.FC<IMetricCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  color, 
  icon: Icon,
  trend, 
  target,
  additionalInfo,
  selectedHospital,
  valueSize = 'normal',
  cardType
}) => (
  <div className={`
    relative overflow-hidden
    bg-gradient-to-br ${getCardGradient(cardType)}
    rounded-3xl p-6 shadow-lg backdrop-blur-sm
    dark:border-${color}-800/20
    hover:shadow-xl transition-all duration-300
  `}>
    {/* Efeito de brilho no canto superior */}
    <div className={`absolute -top-10 -right-10 w-20 h-20 bg-${color}-500/10 rounded-full blur-xl`} />
    
    <div className="flex justify-between items-start mb-5">
      <div className="flex items-center space-x-3">
        <div className={`
          p-2 rounded-xl bg-${color}-100/30 dark:bg-${color}-900/30
          backdrop-blur-sm
        `}>
          <Icon className={`text-${color}-600 dark:text-${color}-400`} size={20} />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {title}
        </h3>
      </div>
      <div className="px-2 py-1 rounded-lg bg-white/10 dark:bg-gray-800/40 backdrop-blur-sm">
        <span className="text-xs font-medium text-gray-600 dark:text-gray-300 truncate max-w-[100px] block">
          {selectedHospital || 'Todos'}
        </span>
      </div>
    </div>

    <div className={`
      bg-${color}-100/30 dark:bg-${color}-900/30 
      rounded-2xl p-4 backdrop-blur-sm
    `}>
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              {subtitle}
            </p>
            <div className="flex items-baseline gap-2">
              <h2 className={`
                font-bold text-gray-900 dark:text-white
                ${valueSize === 'small' ? 'text-xl' : 'text-3xl'}
              `}>
                {value}
              </h2>
              {trend && (
                <div className={`
                  flex items-center text-sm font-medium
                  ${trend > 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'}
                `}>
                  {trend > 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                  <span>{Math.abs(trend)}%</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {target && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
              <span>0</span>
              <span>Meta: {target}</span>
              <span>100%</span>
            </div>
            <div className="h-1.5 bg-gray-200/50 dark:bg-gray-700/50 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-${color}-500/70 rounded-full transition-all duration-500`}
                style={{ width: `${getProgressWidth(value, target)}%` }}
              />
            </div>
          </div>
        )}

        {additionalInfo && (
          <div className="mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {additionalInfo.label}
                </p>
                <p className="text-base font-semibold text-gray-800 dark:text-gray-200 mt-1">
                  {additionalInfo.value}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

export const AdditionalHospitalMetrics: React.FC<IMetricsProps> = ({ 
  networkData, 
  currentMetrics,
  selectedHospital 
}) => {
  const [expandedMetrics, setExpandedMetrics] = useState<boolean>(true);
  
  const calculateAdditionalMetrics = (): ICalculatedMetrics => {
    const hospitals = networkData?.hospitals || [];
    const networkEfficiency = networkData?.networkInfo?.networkMetrics?.networkEfficiency;

    const hospitalWithHighestOccupancy = hospitals.reduce((highest, current) => 
      (current.metrics?.overall?.occupancyRate || 0) > (highest.metrics?.overall?.occupancyRate || 0) 
        ? current 
        : highest
    );

    const burnoutRiskCalculation = hospitals.reduce((total, hospital) => 
      total + (hospital.metrics?.overall?.totalPatients / (hospital.metrics?.overall?.totalBeds || 1)), 
      0
    ) / hospitals.length;

    const equipmentMaintenanceRisk = hospitals.reduce((total, hospital) => 
      total + (hospital.metrics?.departmental?.uti?.occupancy > 85 ? 1 : 0), 
      0
    );

    const professionalTrainingRate = Math.round(
      (networkEfficiency?.resourceUtilization || 0) * 100
    );

    const departmentPatientVariation = hospitals.reduce((variation, hospital) => {
      const departments = hospital.metrics?.departmental;
      if (departments) {
        const occupancies = Object.values(departments).map(dept => dept.occupancy);
        const maxVariation = Math.max(...occupancies) - Math.min(...occupancies);
        return Math.max(variation, maxVariation);
      }
      return variation;
    }, 0);

    return {
      hospitalWithHighestOccupancy,
      burnoutRiskCalculation,
      equipmentMaintenanceRisk,
      professionalTrainingRate,
      departmentPatientVariation,
    };
  };

  const additionalMetrics = calculateAdditionalMetrics();

  const metrics = [
    {
      title: "Hospital Crítico",
      value: additionalMetrics.hospitalWithHighestOccupancy?.name || 'N/A',
      subtitle: "Maior Ocupação",
      trend: 2.5,
      color: "red",
      cardType: "hospital-critico",
      icon: AlertTriangle,
      valueSize: 'small' as const,
      additionalInfo: {
        label: "Taxa de Ocupação",
        value: `${additionalMetrics.hospitalWithHighestOccupancy?.metrics?.overall?.occupancyRate?.toFixed(1)}%`
      }
    },
    {
      title: "Risco de Burnout",
      value: additionalMetrics.burnoutRiskCalculation.toFixed(1),
      subtitle: "Nível de Estresse",
      trend: 1.8,
      target: 5.0,
      color: "orange",
      cardType: "burnout",
      icon: Users,
      additionalInfo: {
        label: "Equipes em Alerta",
        value: "3 de 8 equipes"
      }
    },
    {
      title: "Manutenção",
      value: additionalMetrics.equipmentMaintenanceRisk,
      subtitle: "Leitos em Manutenção",
      trend: -0.5,
      color: "blue",
      cardType: "manutencao",
      icon: Settings,
      additionalInfo: {
        label: "Previsão de Conclusão",
        value: "7 dias"
      }
    },
    {
      title: "Taxa de Giro",
      value: networkData?.networkInfo?.networkMetrics?.networkEfficiency?.bedTurnover?.toFixed(1) || "0",
      subtitle: "Rotatividade de Leitos",
      trend: 1.2,
      target: 8.0,
      color: "cyan",
      cardType: "taxa-giro",
      icon: RotateCcw,
      additionalInfo: {
        label: "Média do Setor",
        value: "4.8 pacientes/leito"
      }
    },
    {
      title: "Eficiência Operacional",
      value: `${(networkData?.networkInfo?.networkMetrics?.networkEfficiency?.resourceUtilization * 100).toFixed(0)}%`,
      subtitle: "Performance Geral",
      trend: 3.2,
      target: 90,
      color: "emerald",
      cardType: "eficiencia",
      icon: TrendingUp,
      additionalInfo: {
        label: "Ranking na Rede",
        value: "#2 de 3 hospitais"
      }
    },
    {
      title: "Ocupação Média",
      value: `${networkData?.networkInfo?.networkMetrics?.averageOccupancy?.toFixed(1)}%`,
      subtitle: "Taxa de Ocupação",
      trend: 2.3,
      target: 85,
      color: "violet",
      cardType: "ocupacao",
      icon: Activity,
      additionalInfo: {
        label: "Leitos Ocupados",
        value: `${currentMetrics.totalPatients}/${currentMetrics.totalBeds}`
      }
    },
    {
      title: "Variação de Pacientes",
      value: `${additionalMetrics.departmentPatientVariation.toFixed(1)}%`,
      subtitle: "Entre Departamentos",
      trend: -1.5,
      target: 15,
      color: "fuchsia",
      cardType: "variacao",
      icon: Users2,
      additionalInfo: {
        label: "Maior Diferença",
        value: "UTI vs. Enfermaria"
      }
    },
    {
      title: "Treinamento Profissional",
      value: `${additionalMetrics.professionalTrainingRate}%`,
      subtitle: "Capacitação da Equipe",
      trend: 4.2,
      target: 95,
      color: "teal",
      cardType: "treinamento",
      icon: GraduationCap,
      additionalInfo: {
        label: "Profissionais Treinados",
        value: "42 este mês"
      }
    }
  ];

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          Métricas do Hospital
        </h2>
        <button 
          onClick={() => setExpandedMetrics(!expandedMetrics)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {expandedMetrics ? 'Ocultar' : 'Mostrar'} Métricas
          {expandedMetrics ? <ChevronUp /> : <ChevronDown />}
        </button>
      </div>

      {expandedMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((metric, index) => (
            <MetricCard 
              key={index} 
              {...metric as IMetricCardProps}
              selectedHospital={selectedHospital}
            />
          ))}
        </div>
      )}
    </div>
  );
};