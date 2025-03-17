/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { 
  Users,
  Activity,
  TrendingUp,
  RotateCcw,
  Settings,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  GraduationCap,
  Users2,
  LucideIcon,
  AlertCircle,
  PlusCircle
} from 'lucide-react';
import { IHospital, INetworkData } from '@/types/hospital-network-types';

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
  selectedHospital: string | null;
  selectedRegion: string | null;
  visibleMetrics?: string[]; // Nova propriedade para controlar quais métricas são visíveis
  filteredHospitals?: IHospital[]; // Hospitais filtrados passados como prop
}

interface IMetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  color: string;
  icon: LucideIcon;
  trend?: number;
  target?: number;
  additionalInfo?: {
    label: string;
    value: string;
  };
  selectedHospital?: string | null;
  valueSize?: 'normal' | 'small';
  cardType: TCardType
}

interface ICalculatedMetrics {
  hospitalWithHighestOccupancy: any; // Tipo específico do hospital
  burnoutRiskCalculation: number;
  equipmentMaintenanceRisk: number;
  professionalTrainingRate: number;
  departmentPatientVariation: number;
  bedTurnoverRate: number;
  operationalEfficiency: number;
  averageOccupancy: number;
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

const getHospitalDisplayName = (selectedHospital: string | null, networkData: INetworkData, selectedRegion: string | null) => {
  if (!selectedHospital) {
    return selectedRegion && selectedRegion !== 'all' 
      ? selectedRegion 
      : 'Todos';
  }
  
  const hospital = networkData?.hospitals?.find(h => h.id === selectedHospital);
  if (!hospital) return 'Todos';
  
  return hospital.name;
};

const MetricCard: React.FC<IMetricCardProps> = ({ 
  title, 
  value, 
  subtitle, 
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
  selectedHospital,
  selectedRegion,
  visibleMetrics,
  filteredHospitals
}) => {
  const calculateAdditionalMetrics = (): ICalculatedMetrics => {
    const hospitals = networkData?.hospitals || [];
    const networkEfficiency = networkData?.networkInfo?.networkMetrics?.networkEfficiency;

    // Hospitais filtrados com base na seleção do usuário
    let filteredHospitalsList = hospitals;
    
    if (selectedHospital) {
      // Se um hospital específico foi selecionado, filtrar apenas por ele
      filteredHospitalsList = hospitals.filter(h => h.id === selectedHospital);
    } else if (selectedRegion && selectedRegion !== 'all') {
      // Se uma região específica foi selecionada, filtrar por região
      filteredHospitalsList = hospitals.filter(h => h.unit?.state === selectedRegion);
    }

    const defaultHospital = {
      id: '',
      name: 'Nenhum hospital',
      metrics: { overall: { occupancyRate: 0 } }
    };

    // Obter o hospital selecionado, se existir
    const selectedHospitalData = selectedHospital 
      ? hospitals.find(h => h.id === selectedHospital) 
      : null;

    // 1. hospitalWithHighestOccupancy
    const hospitalWithHighestOccupancy = filteredHospitalsList.length > 0 
      ? filteredHospitalsList.reduce((highest, current) => 
          (current.metrics?.overall?.occupancyRate || 0) > (highest.metrics?.overall?.occupancyRate || 0) 
            ? current 
            : highest, 
          filteredHospitalsList[0] || defaultHospital)
      : defaultHospital;

    // 2. burnoutRiskCalculation
    const burnoutRiskCalculation = selectedHospitalData
      ? selectedHospitalData.metrics?.overall?.totalPatients / (selectedHospitalData.metrics?.overall?.totalBeds || 1)
      : filteredHospitalsList.length > 0
        ? filteredHospitalsList.reduce((total, hospital) => 
            total + (hospital.metrics?.overall?.totalPatients / (hospital.metrics?.overall?.totalBeds || 1)), 
            0) / (filteredHospitalsList.length || 1)
        : 0;

    // 3. equipmentMaintenanceRisk
    const equipmentMaintenanceRisk = selectedHospitalData
      ? selectedHospitalData.metrics?.departmental?.uti?.occupancy > 85 ? 1 : 0
      : filteredHospitalsList.length > 0
        ? filteredHospitalsList.reduce((total, hospital) => 
            total + (hospital.metrics?.departmental?.uti?.occupancy > 85 ? 1 : 0), 
            0)
        : 0;

    // 4. professionalTrainingRate
    const professionalTrainingRate = selectedHospitalData
      ? Math.round((selectedHospitalData.metrics?.networkEfficiency?.resourceUtilization || 0) * 100)
      : Math.round((networkEfficiency?.resourceUtilization || 0) * 100);

    // 5. departmentPatientVariation
    const departmentPatientVariation = selectedHospitalData
      ? (() => {
          const departments = selectedHospitalData.metrics?.departmental;
          if (departments) {
            const occupancies = Object.values(departments).map(dept => dept.occupancy);
            if (occupancies.length > 1) {
              return Math.max(...occupancies) - Math.min(...occupancies);
            }
          }
          return 0;
        })()
      : filteredHospitalsList.length > 0
        ? filteredHospitalsList.reduce((variation, hospital) => {
            const departments = hospital.metrics?.departmental;
            if (departments) {
              const occupancies = Object.values(departments).map(dept => dept.occupancy);
              if (occupancies.length > 1) {
                const maxVariation = Math.max(...occupancies) - Math.min(...occupancies);
                return Math.max(variation, maxVariation);
              }
            }
            return variation;
          }, 0)
        : 0;

    // 6. bedTurnoverRate
    const bedTurnoverRate = selectedHospitalData
      ? selectedHospitalData.metrics?.networkEfficiency?.bedTurnover || 0
      : networkEfficiency?.bedTurnover || 0;

    // 7. operationalEfficiency
    const operationalEfficiency = selectedHospitalData
      ? selectedHospitalData.metrics?.networkEfficiency?.resourceUtilization || 0
      : networkEfficiency?.resourceUtilization || 0;

    // 8. averageOccupancy
    const averageOccupancy = selectedHospitalData
      ? selectedHospitalData.metrics?.overall?.occupancyRate || 0
      : networkData?.networkInfo?.networkMetrics?.averageOccupancy || 0;

    return {
      hospitalWithHighestOccupancy,
      burnoutRiskCalculation,
      equipmentMaintenanceRisk,
      professionalTrainingRate,
      departmentPatientVariation,
      bedTurnoverRate,
      operationalEfficiency,
      averageOccupancy
    };
  };

  const additionalMetrics = calculateAdditionalMetrics();

  // Obter o nome de exibição do hospital selecionado
  const hospitalDisplayName = selectedHospital
    ? networkData?.hospitals?.find(h => h.id === selectedHospital)?.name || 'Hospital Selecionado'
    : selectedRegion && selectedRegion !== 'all'
      ? `Região ${selectedRegion}`
      : 'Todos';

  const metrics = [
    {
      title: "Hospital Crítico",
      value: additionalMetrics.hospitalWithHighestOccupancy?.name || 'N/A',
      subtitle: "Maior Ocupação",
      trend: 2.5,
      color: "red",
      cardType: "hospital-critico" as TCardType,
      icon: AlertTriangle,
      valueSize: 'small' as const,
      additionalInfo: {
        label: "Taxa de Ocupação",
        value: `${additionalMetrics.hospitalWithHighestOccupancy?.metrics?.overall?.occupancyRate?.toFixed(1) || '0'}%`
      }
    },
    {
      title: "Risco de Burnout",
      value: additionalMetrics.burnoutRiskCalculation.toFixed(1),
      subtitle: "Nível de Estresse",
      trend: 1.8,
      target: 5.0,
      color: "orange",
      cardType: "burnout" as TCardType,
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
      cardType: "manutencao" as TCardType,
      icon: Settings,
      additionalInfo: {
        label: "Previsão de Conclusão",
        value: "7 dias"
      }
    },
    {
      title: "Taxa de Giro",
      value: additionalMetrics.bedTurnoverRate.toFixed(1) || "0",
      subtitle: "Rotatividade de Leitos",
      trend: 1.2,
      target: 8.0,
      color: "cyan",
      cardType: "taxa-giro" as TCardType,
      icon: RotateCcw,
      additionalInfo: {
        label: "Média do Setor",
        value: "4.8 pacientes/leito"
      }
    },
    {
      title: "Eficiência Operacional",
      value: `${(additionalMetrics.operationalEfficiency * 100).toFixed(0)}%`,
      subtitle: "Performance Geral",
      trend: 3.2,
      target: 90,
      color: "emerald",
      cardType: "eficiencia" as TCardType,
      icon: TrendingUp,
      additionalInfo: {
        label: "Ranking na Rede",
        value: "#2 de 3 hospitais"
      }
    },
    {
      title: "Ocupação Média",
      value: `${additionalMetrics.averageOccupancy.toFixed(1)}%`,
      subtitle: "Taxa de Ocupação",
      trend: 2.3,
      target: 85,
      color: "violet",
      cardType: "ocupacao" as TCardType,
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
      cardType: "variacao" as TCardType,
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
      cardType: "treinamento" as TCardType,
      icon: GraduationCap,
      additionalInfo: {
        label: "Profissionais Treinados",
        value: "42 este mês"
      }
    }
  ];

  // Filtrar métricas com base na propriedade visibleMetrics
  const filteredMetrics = visibleMetrics && visibleMetrics.length > 0
    ? metrics.filter(metric => visibleMetrics.includes(metric.cardType))
    : metrics;

  // Verificar se há métricas para exibir
  if (filteredMetrics.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-800/30 border border-gray-700/30 rounded-3xl p-8">
        <PlusCircle className="h-16 w-16 text-gray-500 mb-4" />
        <p className="text-gray-400 text-center">
          Nenhuma métrica adicional selecionada.
        </p>
        <p className="text-gray-500 text-center mt-2">
          Adicione métricas adicionais para visualizar mais informações sobre o desempenho do hospital.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {filteredMetrics.map((metric, index) => (
        <MetricCard 
          key={index} 
          {...metric as IMetricCardProps}
          selectedHospital={hospitalDisplayName}
        />
      ))}
    </div>
  );
};