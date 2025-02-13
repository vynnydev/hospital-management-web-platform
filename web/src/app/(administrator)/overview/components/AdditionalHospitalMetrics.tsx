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
  LucideIcon,
  AlertCircle
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

const pulseAnimation = {
  normal: "animate-pulse-green",
  attention: "animate-pulse-yellow",
  critical: "animate-pulse-red"
};

type TSituation = 'normal' | 'attention' | 'critical';

// Ajustar as cores para serem mais precisas com a imagem
const getSituationColors = (situation: TSituation) => {
  const colors = {
    normal: {
      bg: "bg-emerald-500", // Verde mais claro e vibrante
      text: "text-white",
      icon: "text-white",
      border: "border-green-500/30",
      gradient: "from-green-950/50 to-emerald-900/50"
    },
    attention: {
      bg: "bg-yellow-500", // Amarelo vibrante
      text: "text-white",
      icon: "text-white",
      border: "border-yellow-500/30",
      gradient: "from-yellow-950/50 to-amber-900/50"
    },
    critical: {
      bg: "bg-red-500", // Vermelho vibrante
      text: "text-white",
      icon: "text-white",
      border: "border-red-500/30",
      gradient: "from-red-950/50 to-rose-900/50"
    }
  };
  return colors[situation];
};

// Funções auxiliares para status e cores
const getStatusColor = (cardType: TCardType) => {
  const colors = {
    'hospital-critico': 'bg-[#4A5043]',  // Verde oliva escuro para normal
    'burnout': 'bg-[#4A5043]',
    'manutencao': 'bg-[#564343]',        // Marrom avermelhado para atenção
    'taxa-giro': 'bg-[#4A5043]',
    'eficiencia': 'bg-[#4A5043]',
    'ocupacao': 'bg-[#4A5043]',
    'variacao': 'bg-[#4A5043]',
    'treinamento': 'bg-[#4A5043]'
  };
  return colors[cardType] || 'bg-[#4A5043]';
};

const getStatusMessage = (cardType: TCardType) => {
  switch(cardType) {
      case 'hospital-critico':
          return 'Requer Atenção Imediata';
      case 'burnout':
      case 'variacao':
          return 'Atenção';
      default:
          return 'Situação Normal';
  }
};

const getSituationType = (cardType: TCardType): TSituation => {
  const status = getStatusMessage(cardType);
  if (status === 'Situação Normal') return 'normal';
  if (status === 'Requer Atenção Imediata') return 'critical';
  return 'attention';
};

const getAnalysisMessage = (cardType: TCardType) => {
  const messages = {
    'hospital-critico': 'Taxa de ocupação dentro dos parâmetros esperados. Margem segura na gestão de leitos mantida.',
    'burnout': 'Taxa de ocupação 1% menor que a média da rede. UTI requer atenção com média acima do esperado.',
    'manutencao': 'Alta eficiência na gestão de leitos. Média de 42 altas/dia indica ótimo fluxo de pacientes.',
    'taxa-giro': '2º lugar na rede com 85% de eficiência. Melhor resultado dos últimos 6 meses.',
    'eficiencia': 'Performance acima da média da rede. Crescimento constante nos últimos 3 meses.',
    'ocupacao': 'Ocupação dentro da meta estabelecida. Distribuição equilibrada entre departamentos.',
    'variacao': 'Variação aceitável entre departamentos. UTI e Enfermaria com fluxos equilibrados.',
    'treinamento': 'Meta de capacitação superada. Equipes com alto índice de participação nos treinamentos.'
  };
  return messages[cardType];
};

const getCardGradient = (cardType: TCardType): string => {
  const gradients: Record<TCardType, string> = {
    'hospital-critico': 'from-[#3D2A2A] to-[#2D1F1F]', // Tons de vermelho escuro
    'burnout': 'from-[#3D3426] to-[#2D271F]',          // Tons de marrom
    'manutencao': 'from-[#2A2F3D] to-[#1F222D]',      // Tons de azul escuro
    'taxa-giro': 'from-[#2A323D] to-[#1F242D]',       // Tons de azul petróleo
    'eficiencia': 'from-[#2A3D2E] to-[#1F2D22]',      // Tons de verde escuro
    'ocupacao': 'from-[#2E2A3D] to-[#221F2D]',        // Tons de roxo escuro
    'variacao': 'from-[#3D2A3A] to-[#2D1F2A]',        // Tons de rosa escuro
    'treinamento': 'from-[#2A3D3D] to-[#1F2D2D]'      // Tons de teal escuro
  };
  return gradients[cardType] || 'from-gray-800 to-gray-900'; // Fallback
};

const MetricCard: React.FC<IMetricCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  color, 
  icon: Icon,
  trend, 
  additionalInfo,
  selectedHospital,
  valueSize = 'normal',
  cardType
}) => {
  const situation = getSituationType(cardType);
  const colors = getSituationColors(situation);

  return (
    <div className={`
      relative overflow-hidden
      bg-gradient-to-br ${getCardGradient(cardType)}
      rounded-3xl p-6
      flex flex-col min-h-[280px]
      border-2 ${colors.border}
      ${pulseAnimation[situation]}
    `}>
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-black/10">
            <Icon className="text-white" size={20} />
          </div>
          <h3 className="text-lg font-semibold text-white">
            {title}
          </h3>
        </div>
        <div className="px-2 py-1 rounded-lg bg-black/10">
          <span className="text-xs font-medium text-white/80">
            {selectedHospital || 'Todos'}
          </span>
        </div>
      </div>
  
      {/* Conteúdo Principal */}
      <div className="space-y-2 mb-6 bg-white/60 dark:bg-gray-800/40 rounded-2xl p-4 backdrop-blur-md">
        <p className="text-sm text-gray-300">
          {subtitle}
        </p>
        <div className="flex items-baseline gap-2">
          <h2 className={`
            font-bold text-white
            ${valueSize === 'small' ? 'text-xl' : 'text-3xl'}
          `}>
            {value}
          </h2>
          {trend && (
            <div className={`
              flex items-center text-sm font-medium
              ${trend > 0 ? 'text-green-400' : 'text-red-400'}
            `}>
              {trend > 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        {additionalInfo && (
          <p className="text-sm text-gray-300">
            {additionalInfo.label}: {additionalInfo.value}
          </p>
        )}
      </div>
  
      {/* Análise Comparativa */}
      <div className="mt-auto mb-6 bg-white/60 dark:bg-gray-800/40 rounded-2xl p-4 backdrop-blur-md">
        <p className="text-sm font-medium text-white mb-2">
          Análise comparativa
        </p>
        <p className="text-sm text-gray-300">
          {getAnalysisMessage(cardType)}
        </p>
      </div>
  
      {/* Status */}
      <div className={`
          ${colors.bg}
          rounded-2xl p-4 backdrop-blur-sm
          transition-colors duration-200 z-10
          py-2 px-4 flex items-center
      `}>
        <AlertCircle className="w-4 h-4 mr-2 text-white" />
        <span className="text-sm font-medium text-white">
          {getStatusMessage(cardType)}
        </span>
      </div>
    </div>
  )
}


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
      <div className="flex justify-between items-center mt-8 mb-8 bg-gray-900/40 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/30 hover:bg-gray-800/40 transition-all duration-200">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 dark:bg-blue-900/30">
              <Activity className="w-5 h-5 text-blue-500 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold bg-gradient-to-r from-gray-100 to-gray-300 dark:from-gray-100 dark:to-blue-200 bg-clip-text text-transparent">
              Métricas do Hospital
            </h2>
          </div>
          {/* Mensagem sempre visível e maior */}
          <p className="text-base text-gray-400 ml-10">
            Clique para {expandedMetrics ? 'ocultar' : 'visualizar'} todas as métricas
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className={`
            w-2 h-2 rounded-full
            ${expandedMetrics ? 'bg-green-500' : 'bg-blue-500'}
            animate-pulse
          `} />
          
          <button 
            onClick={() => setExpandedMetrics(!expandedMetrics)}
            className="
              flex items-center gap-2 px-4 py-2
              bg-gray-800/40 hover:bg-gray-700/40
              dark:bg-gray-800/40 dark:hover:bg-gray-700/40
              rounded-xl transition-all duration-200
              border border-gray-700/30
            "
          >
            <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
              {expandedMetrics ? 'Ocultar' : 'Mostrar'} Métricas
            </span>
            <div className="w-5 h-5 rounded-full bg-gray-700/50 flex items-center justify-center">
              {expandedMetrics ? (
                <ChevronUp className="w-4 h-4 text-gray-300 group-hover:text-white transition-colors" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-300 group-hover:text-white transition-colors" />
              )}
            </div>
          </button>
        </div>
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