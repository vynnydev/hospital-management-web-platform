/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Construction, 
  Timer,
  AlertCircle, 
  TrendingUp,
  Activity,
  Users,
  Heart,
  Clock,
  Thermometer,
  LineChart,
  Droplets,
  Lightbulb,
  Pill,
  BarChart,
  ShieldAlert,
  Zap,
  UserCheck,
  PanelLeft
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/organisms/card';
import type { IBed, IPatient, IVitalSign } from '@/types/hospital-network-types';
import { Button } from '@/components/ui/organisms/button';
import { useNetworkData } from '@/services/hooks/network-hospital/useNetworkData';
import { useAmbulanceData } from '@/services/hooks/ambulance/useAmbulanceData';
import { useStaffData } from '@/services/hooks/staffs/useStaffData';
import { IAppUser } from '@/types/auth-types';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/organisms/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/organisms/tabs';
import { Badge } from '@/components/ui/organisms/badge';
import { Progress } from '@/components/ui/organisms/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/organisms/tooltip';

interface AIBedAnalysisProps {
  selectedBed: IBed | null;
  hospitalId: string;
}

// Modelo de previsão para análise de leitos baseado em AI
interface IAIPrediction {
  riskScore: number;
  expectedLOS: number;
  expectedDischargeDate: string;
  similarCasesOutcome: {
    avgLOS: number;
    readmissionRate: number;
    mortalityRate: number;
  };
  careRecommendations: {
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    icon: React.ElementType;
  }[];
  resourcePreparation: {
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'completed';
  }[];
  staffRecommendations: {
    title: string;
    description: string;
    staffType: string;
  }[];
  vitalSignsPrediction: {
    metric: string;
    current: number;
    predictedRange: [number, number]; // Definido como tupla com exatamente 2 elementos
    unit: string;
    trend: 'stable' | 'increasing' | 'decreasing'; // Tipo literal union
    icon: React.ElementType; // Tipo para componentes React
  }[];
  treatmentEffectiveness: {
    medication: string;
    effectiveness: number; // 0-100
    sideEffectRisk: number; // 0-100
  }[];
}

export const AIBedAnalysis: React.FC<AIBedAnalysisProps> = ({ 
  selectedBed,
  hospitalId 
}) => {
  const [aiPrediction, setAiPrediction] = useState<IAIPrediction | null>(null);
  const [lastVitals, setLastVitals] = useState<IVitalSign | null>(null);
  const [loadingPrediction, setLoadingPrediction] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [recommendedStaff, setRecommendedStaff] = useState<IAppUser[]>([]);
  const [showStaffDetails, setShowStaffDetails] = useState(false);
  const [showHistoricalData, setShowHistoricalData] = useState(false);
  const [showResourceDetails, setShowResourceDetails] = useState(false);
  
  const { currentUser, getPatientCareHistory } = useNetworkData();
  const { activeRoutes } = useAmbulanceData(hospitalId);
  const { staffData } = useStaffData(hospitalId);

  // Função para analisar os dados do paciente usando AI
  useEffect(() => {
    if (selectedBed?.patient) {
      setLoadingPrediction(true);
      
      // Simulação de chamada a um modelo de ML
      setTimeout(() => {
        const careHistory = getPatientCareHistory(selectedBed.patient?.id || '');
        
        // Últimos sinais vitais (exemplo)
        if (selectedBed.patient?.treatment?.vitals?.length) {
          const vitals = [...selectedBed.patient.treatment.vitals];
          const latest = vitals.sort((a, b) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          )[0];
          setLastVitals(latest);
        }
        
        // Aqui seria a simulação do resultado da análise
        // Em produção, isso seria uma chamada para um serviço de IA
        const mockPrediction: IAIPrediction = generateAIPrediction(selectedBed.patient);
        
        setAiPrediction(mockPrediction);
        setLoadingPrediction(false);
        
        // Encontrar funcionários recomendados
        if (staffData?.staffTeams[hospitalId]) {
          const allStaff: string[] = [];
          staffData.staffTeams[hospitalId].forEach(team => {
            if (team.department === selectedBed.department) {
              allStaff.push(...team.members);
            }
          });
          
          // Implementação real conectaria com um modelo de recomendação
          // Aqui estamos apenas selecionando alguns membros da equipe
          setRecommendedStaff(allStaff.slice(0, 3).map(staffId => ({
              id: staffId,
              name: `Dr. ${staffId.replace('D', 'Doutor ')}`,
              role: 'Médico Especialista',
              department: selectedBed.department,
              specialty: selectedBed.specialty || 'Clínica Geral',
              experience: Math.floor(Math.random() * 20) + 5,
              availability: 'Disponível em 30min'
          } as unknown as IAppUser)));
        }
      }, 1200);
    } else {
      setAiPrediction(null);
    }
  }, [selectedBed?.patient?.id, hospitalId]);

  // Gera uma previsão baseada nos dados do paciente
  const generateAIPrediction = (patient: IPatient | undefined): IAIPrediction => {
    if (!patient) {
      throw new Error("Paciente não encontrado");
    }
    
    // Calcula idade estimada a partir da data de admissão
    const admissionDate = new Date(patient.admissionDate);
    const today = new Date();
    const daysSinceAdmission = Math.floor((today.getTime() - admissionDate.getTime()) / (1000 * 3600 * 24));
    
    // Gera previsão de risco com base no diagnóstico
    const hasCriticalCondition = patient.diagnosis.toLowerCase().includes('cardio') || 
                                patient.diagnosis.toLowerCase().includes('pulmonar') ||
                                patient.diagnosis.toLowerCase().includes('trauma');
    
    const isElderly = patient.age > 65;
    const riskScore = hasCriticalCondition ? (isElderly ? 85 : 72) : (isElderly ? 65 : 45);
    
    // Estima duração da internação
    let expectedLOS = 0;
    if (patient.diagnosis.toLowerCase().includes('surgery')) {
      expectedLOS = isElderly ? 14 : 8;
    } else if (patient.diagnosis.toLowerCase().includes('pneumon')) {
      expectedLOS = isElderly ? 10 : 6;
    } else if (patient.diagnosis.toLowerCase().includes('cardio')) {
      expectedLOS = isElderly ? 12 : 7;
    } else {
      expectedLOS = isElderly ? 8 : 5;
    }
    
    // Data prevista para alta
    const dischargeDate = new Date(admissionDate);
    dischargeDate.setDate(dischargeDate.getDate() + expectedLOS);
    
    // Recomendações de cuidados
    const careRecommendations = generateCareRecommendations(patient);
    
    // Recursos necessários
    const resourcePreparation = generateResourcePreparation(patient);
    
    // Funcionários recomendados
    const staffRecommendations = generateStaffRecommendations(patient);
    
    // Previsão de sinais vitais
    const vitalSignsPrediction = generateVitalSignsPrediction(patient);
    
    // Efetividade do tratamento
    const treatmentEffectiveness = generateTreatmentEffectiveness(patient);
    
    return {
      riskScore,
      expectedLOS,
      expectedDischargeDate: dischargeDate.toISOString().split('T')[0],
      similarCasesOutcome: {
        avgLOS: expectedLOS * 0.9,
        readmissionRate: hasCriticalCondition ? 18 : 8,
        mortalityRate: hasCriticalCondition ? (isElderly ? 12 : 5) : (isElderly ? 3 : 1)
      },
      careRecommendations,
      resourcePreparation,
      staffRecommendations,
      vitalSignsPrediction,
      treatmentEffectiveness
    };
  };
  
  // Gera recomendações de cuidados com base no diagnóstico e condição do paciente
  const generateCareRecommendations = (patient: IPatient) => {
    const recommendations = [];
    
    // Recomendações baseadas no tipo de diagnóstico
    if (patient.diagnosis.toLowerCase().includes('cardio')) {
      recommendations.push({
        title: 'Monitoramento cardíaco contínuo',
        description: 'Manter monitoramento de ECG 24h com alertas para arritmias',
        priority: 'high' as const,
        icon: Heart
      });
    }
    
    if (patient.diagnosis.toLowerCase().includes('pulmonar') || patient.diagnosis.toLowerCase().includes('pneumon')) {
      recommendations.push({
        title: 'Monitoramento de oxigenação',
        description: 'Verificar saturação a cada 4h e realizar ausculta pulmonar',
        priority: 'high' as const,
        icon: Droplets
      });
    }
    
    // Recomendações gerais baseadas na idade
    if (patient.age > 65) {
      recommendations.push({
        title: 'Avaliação de risco de queda',
        description: 'Realizar protocolo de prevenção de quedas e manter grades elevadas',
        priority: 'medium' as const,
        icon: AlertCircle
      });
      
      recommendations.push({
        title: 'Hidratação e nutrição',
        description: 'Monitorar balanço hídrico e assegurar ingestão adequada',
        priority: 'medium' as const,
        icon: Droplets
      });
    }
    
    // Adiciona algumas recomendações gerais
    recommendations.push({
      title: 'Avaliação de parâmetros vitais',
      description: 'Verificar sinais vitais completos a cada 6h',
      priority: 'medium' as const,
      icon: Activity
    });
    
    // Adicionar mais recomendações específicas
    if (patient.diagnosis.toLowerCase().includes('diabetes')) {
      recommendations.push({
        title: 'Controle glicêmico',
        description: 'Monitorar níveis de glicose a cada 4h e ajustar insulina conforme protocolo',
        priority: 'high' as const,
        icon: Timer
      });
    }
    
    if (patient.diagnosis.toLowerCase().includes('infect')) {
      recommendations.push({
        title: 'Controle de infecção',
        description: 'Manter precauções de contato e monitorar sinais de infecção',
        priority: 'high' as const,
        icon: ShieldAlert
      });
    }
    
    return recommendations;
  };
  
  // Gera recomendações de recursos com base no caso
  const generateResourcePreparation = (patient: IPatient) => {
    const preparations = [];
    
    if (patient.diagnosis.toLowerCase().includes('surgery')) {
      preparations.push({
        title: 'Preparação para centro cirúrgico',
        description: 'Agendar sala cirúrgica para procedimento de revisão',
        status: 'in_progress' as const
      });
      
      preparations.push({
        title: 'Equipamentos de anestesia',
        description: 'Preparar materiais específicos para anestesia',
        status: 'pending' as const
      });
    }
    
    if (patient.diagnosis.toLowerCase().includes('cardio')) {
      preparations.push({
        title: 'Equipamento de monitoramento',
        description: 'Monitor cardíaco e kit de emergência cardíaca',
        status: 'completed' as const
      });
    }
    
    preparations.push({
      title: 'Medicamentos prioritários',
      description: 'Garantir disponibilidade de medicamentos prescritos na farmácia',
      status: 'completed' as const
    });
    
    // Sempre adicionar preparação geral
    preparations.push({
      title: 'Equipamentos do leito',
      description: 'Verificar funcionamento dos equipamentos essenciais',
      status: 'completed' as const
    });
    
    return preparations;
  };
  
  // Gera recomendações de equipe com base no diagnóstico
  const generateStaffRecommendations = (patient: IPatient) => {
    const recommendations = [];
    
    if (patient.diagnosis.toLowerCase().includes('cardio')) {
      recommendations.push({
        title: 'Especialista em Cardiologia',
        description: 'Consulta diária para avaliação do quadro cardíaco',
        staffType: 'doctor'
      });
    }
    
    if (patient.diagnosis.toLowerCase().includes('surgery')) {
      recommendations.push({
        title: 'Cirurgião Especialista',
        description: 'Acompanhamento pós-operatório e avaliação de ferida',
        staffType: 'doctor'
      });
    }
    
    if (patient.age > 65) {
      recommendations.push({
        title: 'Geriatra',
        description: 'Avaliação geriátrica para otimizar tratamento',
        staffType: 'doctor'
      });
      
      recommendations.push({
        title: 'Fisioterapeuta',
        description: 'Mobilização precoce para prevenir complicações',
        staffType: 'physiotherapist'
      });
    }
    
    // Sempre adicionar enfermagem
    recommendations.push({
      title: 'Enfermeiro Especializado',
      description: 'Acompanhamento contínuo e administração de medicamentos',
      staffType: 'nurse'
    });
    
    return recommendations;
  };
  
  // Gera previsões de sinais vitais
  const generateVitalSignsPrediction = (patient: IPatient) => {
    const predictions = [];
    
    // Frequência cardíaca
    let heartRateCurrent = 75;
    let heartRateRange: [number, number] = [70, 80]; // Note a definição específica como tupla
    let heartRateTrend: 'stable' | 'increasing' | 'decreasing' = 'stable';
    
    if (patient.diagnosis.toLowerCase().includes('cardio')) {
      heartRateCurrent = 85;
      heartRateRange = [75, 95]; // Tupla corretamente tipada
      heartRateTrend = 'decreasing';
    }
    
    predictions.push({
      metric: 'Frequência Cardíaca',
      current: heartRateCurrent,
      predictedRange: heartRateRange, // Agora é uma tupla [number, number]
      unit: 'bpm',
      trend: heartRateTrend,
      icon: Heart // Use a referência direta ao componente
    });
    
    // Pressão arterial
    predictions.push({
      metric: 'Pressão Arterial',
      current: 120,
      predictedRange: [115, 125] as [number, number], // Cast explícito para tupla
      unit: 'mmHg',
      trend: 'stable' as const,
      icon: Activity
    });
    
    // Saturação
    let satCurrent = 97;
    let satRange: [number, number] = [96, 98];
    let satTrend: 'stable' | 'increasing' | 'decreasing' = 'stable';
    
    if (patient.diagnosis.toLowerCase().includes('pulmonar')) {
      satCurrent = 94;
      satRange = [92, 96];
      satTrend = 'increasing';
    }
    
    predictions.push({
      metric: 'Saturação O2',
      current: satCurrent,
      predictedRange: satRange,
      unit: '%',
      trend: satTrend,
      icon: Droplets
    });
    
    // Temperatura
    predictions.push({
      metric: 'Temperatura',
      current: 36.8,
      predictedRange: [36.5, 37.1] as [number, number],
      unit: '°C',
      trend: 'stable' as const,
      icon: Thermometer
    });
    
    return predictions;
  };
  
  // Gera análise de efetividade de tratamento
  const generateTreatmentEffectiveness = (patient: IPatient) => {
    const treatments = [];
    
    if (patient.treatment?.medications) {
      // Usa medicamentos existentes ou gera alguns exemplos
      const meds = patient.treatment.medications.map(med => med.name) || 
        ['Paracetamol', 'Dipirona', 'Omeprazol', 'Enalapril'];
      
      meds.forEach(med => {
        treatments.push({
          medication: med,
          effectiveness: Math.floor(70 + Math.random() * 25), // 70-95%
          sideEffectRisk: Math.floor(5 + Math.random() * 20)  // 5-25%
        });
      });
    } else {
      // Adiciona alguns exemplos genéricos
      treatments.push(
        {
          medication: 'Antibiótico padrão',
          effectiveness: 85,
          sideEffectRisk: 15
        },
        {
          medication: 'Analgésico',
          effectiveness: 90,
          sideEffectRisk: 8
        }
      );
    }
    
    return treatments;
  };

  // Função para calcular o score colorido do risco
  const getRiskColor = (score: number) => {
    if (score >= 75) return 'bg-red-500';
    if (score >= 50) return 'bg-orange-500';
    if (score >= 30) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  // Função para obter cor baseada na tendência
  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing': return 'text-red-400';
      case 'decreasing': return 'text-green-400';
      default: return 'text-blue-400';
    }
  };
  
  // Função para obter ícone de tendência
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="h-4 w-4 text-red-400" />;
      case 'decreasing': return <TrendingUp className="h-4 w-4 text-green-400 transform rotate-180" />;
      default: return <Activity className="h-4 w-4 text-blue-400" />;
    }
  };

  if (!selectedBed?.patient) {
    return (
      <div className="h-full flex items-center justify-center text-center text-gray-400">
        <div>
          <Brain className="h-16 w-16 mx-auto mb-4 text-gray-500" />
          <p className="text-lg">Selecione um leito ocupado para ver a análise de IA</p>
        </div>
      </div>
    );
  }

  if (loadingPrediction) {
    return (
      <div className="h-full space-y-6 pr-2 pb-6">
        <Card className="bg-gray-800/90 border-0 relative animate-pulse">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold text-gray-100 flex items-center gap-2">
              <Brain className="h-6 w-6 text-blue-400" />
              Analisando dados do paciente...
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="bg-gray-700/30 h-48 rounded-xl flex items-center justify-center">
              <div className="text-center text-gray-500">
                <LineChart className="h-10 w-10 mx-auto mb-2 animate-pulse" />
                <p>Processando dados do paciente</p>
                <p className="text-sm">Analisando histórico e parâmetros...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto space-y-6 pr-2 pb-6">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl" />
        <Card className="bg-gray-800/90 border-0 relative">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold text-gray-100 flex items-center gap-2">
              <Brain className="h-6 w-6 text-indigo-400" />
              Análise Inteligente do Paciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-5 mb-4">
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="recommendations">Recomendações</TabsTrigger>
                <TabsTrigger value="vitals">Sinais Vitais</TabsTrigger>
                <TabsTrigger value="treatment">Tratamento</TabsTrigger>
                <TabsTrigger value="resources">Recursos</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-2 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-900/30 p-4 rounded-xl border border-gray-700/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Score de Risco</span>
                      <Badge 
                        className={`${getRiskColor(aiPrediction?.riskScore || 0)} text-white`}
                      >
                        {aiPrediction?.riskScore || 0}%
                      </Badge>
                    </div>
                    <Progress 
                      value={aiPrediction?.riskScore || 0} 
                      className="h-2 mb-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Baseado no diagnóstico, idade e histórico
                    </p>
                  </div>
                  
                  <div className="bg-gray-900/30 p-4 rounded-xl border border-gray-700/50">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-400 mb-1">Previsão de Alta</span>
                      <div className="flex items-baseline">
                        <span className="text-xl font-semibold text-white">
                          {aiPrediction?.expectedDischargeDate?.split('-').reverse().join('/')}
                        </span>
                      </div>
                      <div className="flex items-center mt-1">
                        <Clock className="h-3 w-3 text-purple-400 mr-1" />
                        <span className="text-xs text-purple-300">
                          {aiPrediction?.expectedLOS || 0} dias de internação previstos
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {lastVitals && (
                  <div className="bg-gray-900/30 p-4 rounded-xl border border-gray-700/50">
                    <div className="flex items-center gap-2 mb-3">
                      <Activity className="h-4 w-4 text-blue-400" />
                      <span className="text-sm text-gray-400">Últimos Sinais Vitais</span>
                      <span className="text-xs text-gray-500 ml-auto">
                        {new Date(lastVitals.timestamp).toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-3">
                      <div className="bg-gray-800/50 p-2 rounded-lg">
                        <div className="flex items-center text-xs text-gray-400 mb-1">
                          <Heart className="h-3 w-3 mr-1 text-red-400" />
                          Pulso
                        </div>
                        <div className="font-medium text-white">
                          {lastVitals.heartRate} <span className="text-xs text-gray-500">bpm</span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-800/50 p-2 rounded-lg">
                        <div className="flex items-center text-xs text-gray-400 mb-1">
                          <Thermometer className="h-3 w-3 mr-1 text-orange-400" />
                          Temperatura
                        </div>
                        <div className="font-medium text-white">
                          {lastVitals.temperature} <span className="text-xs text-gray-500">°C</span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-800/50 p-2 rounded-lg">
                        <div className="flex items-center text-xs text-gray-400 mb-1">
                          <Droplets className="h-3 w-3 mr-1 text-blue-400" />
                          Saturação
                        </div>
                        <div className="font-medium text-white">
                          {lastVitals.oxygenSaturation} <span className="text-xs text-gray-500">%</span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-800/50 p-2 rounded-lg">
                        <div className="flex items-center text-xs text-gray-400 mb-1">
                          <Activity className="h-3 w-3 mr-1 text-green-400" />
                          P.A.
                        </div>
                        <div className="font-medium text-white">
                          {lastVitals.bloodPressure} <span className="text-xs text-gray-500">mmHg</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="bg-gray-900/30 p-4 rounded-xl border border-gray-700/50">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                    <span className="text-sm text-gray-400">Análise de Casos Similares</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-gray-800/50 p-2 rounded-lg">
                      <div className="text-xs text-gray-400 mb-1">
                        Tempo Médio
                      </div>
                      <div className="font-medium text-white">
                        {aiPrediction?.similarCasesOutcome.avgLOS.toFixed(1)} <span className="text-xs text-gray-500">dias</span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/50 p-2 rounded-lg">
                      <div className="text-xs text-gray-400 mb-1">
                        Readmissão
                      </div>
                      <div className="font-medium text-white">
                        {aiPrediction?.similarCasesOutcome.readmissionRate}% <span className="text-xs text-gray-500">em 30d</span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/50 p-2 rounded-lg">
                      <div className="text-xs text-gray-400 mb-1">
                        Mortalidade
                      </div>
                      <div className="font-medium text-white">
                        {aiPrediction?.similarCasesOutcome.mortalityRate}% <span className="text-xs text-gray-500">taxa</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => setShowHistoricalData(true)}
                    variant="outline" 
                    size="sm"
                    className="mt-4 w-full border-gray-700 hover:bg-gray-700/50"
                  >
                    <BarChart className="h-4 w-4 mr-2" />
                    Ver Análise Estatística Completa
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="recommendations" className="mt-2 space-y-4">
                <div className="space-y-3">
                  {aiPrediction?.careRecommendations.map((rec, index) => {
                    const Icon = rec.icon;
                    return (
                      <div 
                        key={index} 
                        className="bg-gray-900/30 p-3 rounded-xl border border-gray-700/50 flex items-start gap-3"
                      >
                        <div className={`
                          p-2 rounded-full 
                          ${rec.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                            rec.priority === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                            'bg-blue-500/20 text-blue-400'}
                        `}>
                          <Icon className="h-5 w-5" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h4 className="font-medium text-white">{rec.title}</h4>
                            <Badge className={`ml-auto 
                              ${rec.priority === 'high' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                                rec.priority === 'medium' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                                'bg-blue-500/20 text-blue-400 border-blue-500/30'}
                            `}>
                              {rec.priority === 'high' ? 'Alta' : 
                                rec.priority === 'medium' ? 'Média' : 'Baixa'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-400 mt-1">{rec.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 p-4 rounded-xl border border-indigo-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="h-5 w-5 text-indigo-400" />
                    <span className="text-sm font-medium text-white">Staff Recomendado</span>
                  </div>
                  
                  <div className="space-y-3">
                    {aiPrediction?.staffRecommendations.map((staffRec, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <div className="text-white">{staffRec.title}</div>
                          <div className="text-xs text-gray-400">{staffRec.description}</div>
                        </div>
                        
                        <Button
                          variant="outline" 
                          size="sm"
                          onClick={() => setShowStaffDetails(true)}
                          className="border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10"
                        >
                          <Users className="h-4 w-4 mr-2" />
                          Ver Disponíveis
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="vitals" className="mt-2 space-y-4">
                <div className="bg-gray-900/30 p-4 rounded-xl border border-gray-700/50">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="h-4 w-4 text-blue-400" />
                    <span className="text-sm text-gray-400">Previsão de Evolução dos Sinais Vitais</span>
                  </div>
                  
                  <div className="space-y-4">
                    {aiPrediction?.vitalSignsPrediction.map((vital, index) => {
                      const Icon = vital.icon;
                      return (
                        <div key={index} className="bg-gray-800/50 p-3 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4 text-blue-400" />
                              <span className="text-sm font-medium text-white">{vital.metric}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-300">
                                {vital.current} {vital.unit}
                              </span>
                              {getTrendIcon(vital.trend)}
                            </div>
                          </div>
                          
                          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 relative"
                              style={{ 
                                width: `${((vital.current - vital.predictedRange[0]) / 
                                  (vital.predictedRange[1] - vital.predictedRange[0])) * 100}%`
                              }}
                            >
                              <div 
                                className="absolute top-0 h-full w-1 bg-white"
                                style={{ 
                                  left: `${((vital.current - vital.predictedRange[0]) / 
                                    (vital.predictedRange[1] - vital.predictedRange[0])) * 100}%`
                                }}
                              ></div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between mt-1 text-xs text-gray-500">
                            <span>{vital.predictedRange[0]} {vital.unit}</span>
                            <span>Faixa Normal</span>
                            <span>{vital.predictedRange[1]} {vital.unit}</span>
                          </div>
                          
                          <div className="mt-2 flex items-center gap-1 text-xs">
                            <span className={`font-medium ${getTrendColor(vital.trend)}`}>
                              Tendência: 
                            </span>
                            <span className="text-gray-400">
                              {vital.trend === 'increasing' ? 'Aumentando' : 
                                vital.trend === 'decreasing' ? 'Diminuindo' : 'Estável'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full mt-2 border-gray-700 hover:bg-gray-700/50"
                      >
                        <LineChart className="h-4 w-4 mr-2" />
                        Ver Gráficos Históricos
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-sm">Recurso disponível na próxima atualização</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TabsContent>
              
              <TabsContent value="treatment" className="mt-2 space-y-4">
                <div className="bg-gray-900/30 p-4 rounded-xl border border-gray-700/50">
                  <div className="flex items-center gap-2 mb-3">
                    <Pill className="h-4 w-4 text-purple-400" />
                    <span className="text-sm text-gray-400">Efetividade do Tratamento</span>
                  </div>
                  
                  <div className="space-y-4">
                    {aiPrediction?.treatmentEffectiveness.map((treatment, index) => (
                      <div key={index} className="bg-gray-800/50 p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-white">{treatment.medication}</span>
                          <Badge className={
                            treatment.effectiveness > 80 ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                            treatment.effectiveness > 60 ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                            'bg-amber-500/20 text-amber-400 border-amber-500/30'
                          }>
                            {treatment.effectiveness}% efetivo
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mt-3">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-gray-400">Efetividade</span>
                              <span className="text-xs text-green-400">{treatment.effectiveness}%</span>
                            </div>
                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-green-500"
                                style={{ width: `${treatment.effectiveness}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-gray-400">Risco de Efeitos Colaterais</span>
                              <span className="text-xs text-red-400">{treatment.sideEffectRisk}%</span>
                            </div>
                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-red-500"
                                style={{ width: `${treatment.sideEffectRisk}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 p-4 rounded-xl border border-purple-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="h-5 w-5 text-purple-400" />
                    <span className="text-sm font-medium text-white">Ajustes de Tratamento Recomendados</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Zap className="h-4 w-4 text-yellow-400" />
                        <span className="text-sm font-medium text-white">Otimização do tratamento</span>
                      </div>
                      <p className="text-sm text-gray-400">
                        Com base na resposta atual, a IA sugere manter esquema medicamentoso com ajuste de dose para os analgésicos.
                      </p>
                    </div>
                    
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <UserCheck className="h-4 w-4 text-green-400" />
                        <span className="text-sm font-medium text-white">Monitoramento específico</span>
                      </div>
                      <p className="text-sm text-gray-400">
                        Recomenda-se vigilância adicional dos níveis séricos de creatinina nas próximas 24h devido ao perfil de risco do paciente.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="resources" className="mt-2 space-y-4">
                <div className="space-y-3">
                  {aiPrediction?.resourcePreparation.map((resource, index) => (
                    <div 
                      key={index} 
                      className="bg-gray-900/30 p-3 rounded-xl border border-gray-700/50 flex items-start gap-3"
                    >
                      <div className={`
                        p-2 rounded-full 
                        ${resource.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                          resource.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-amber-500/20 text-amber-400'}
                      `}>
                        <Construction className="h-5 w-5" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h4 className="font-medium text-white">{resource.title}</h4>
                          <Badge className={`ml-auto 
                            ${resource.status === 'completed' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                              resource.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                              'bg-amber-500/20 text-amber-400 border-amber-500/30'}
                          `}>
                            {resource.status === 'completed' ? 'Concluído' : 
                              resource.status === 'in_progress' ? 'Em Andamento' : 'Pendente'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">{resource.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-gradient-to-r from-amber-900/20 to-yellow-900/20 p-4 rounded-xl border border-amber-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="h-5 w-5 text-amber-400" />
                    <span className="text-sm font-medium text-white">Sugestões de Manutenção</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <div className="text-sm text-white mb-1">Equipamentos necessários</div>
                      <div className="text-xs text-gray-400">
                        Verificação preventiva de monitores e equipamentos associados ao leito antes da alta prevista para {aiPrediction?.expectedDischargeDate?.split('-').reverse().join('/')}
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <div className="text-sm text-white mb-1">Limpeza especializada</div>
                      <div className="text-xs text-gray-400">
                        Programar limpeza terminal do leito após a alta, com atenção especial ao tipo de precaução requerida pelo diagnóstico atual
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => setShowResourceDetails(true)}
                    variant="outline" 
                    size="sm"
                    className="mt-4 w-full border-amber-700/50 text-amber-400 hover:bg-amber-500/10"
                  >
                    <PanelLeft className="h-4 w-4 mr-2" />
                    Ver Detalhes de Recursos
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      {/* Diálogo para detalhes de staff */}
      <Dialog open={showStaffDetails} onOpenChange={setShowStaffDetails}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Profissionais Recomendados</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {recommendedStaff.map(staff => (
              <div key={staff.id} className="flex items-center p-3 bg-gray-700/50 rounded-lg">
                <div className="w-10 h-10 bg-indigo-600/20 rounded-full flex items-center justify-center mr-3">
                  <span className="text-lg font-bold text-indigo-400">
                    {staff.name.charAt(0)}
                  </span>
                </div>
                {/* Implementar depois */}
                {/* <div className="flex-1">
                  <div className="font-medium">{staff.name}</div>
                  <div className="flex items-center text-xs text-gray-400">
                    <Stethoscope className="h-3 w-3 mr-1" />
                    {staff.specialty} • {staff.experience} anos de experiência
                  </div>
                  <div className="text-xs text-green-400 mt-1">
                    {staff.availability}
                  </div>
                </div> */}
                <Button className="ml-auto" size="sm">Atribuir</Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Diálogo para análise estatística */}
      <Dialog open={showHistoricalData} onOpenChange={setShowHistoricalData}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-blue-400" />
              Análise Estatística de Casos Similares
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Comparação com Pacientes Similares</h3>
              <p className="text-sm text-gray-300 mb-4">
                Baseado em {Math.floor(Math.random() * 500) + 1500} casos com diagnóstico similar nos últimos 2 anos.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800/70 p-3 rounded-lg">
                  <h4 className="text-sm font-medium mb-2">Distribuição de Tempo de Internação</h4>
                  <div className="h-40 flex items-end justify-between gap-1">
                    {[15, 28, 42, 65, 48, 30, 18, 10, 5, 2].map((value, i) => (
                      <div 
                        key={i} 
                        className="bg-blue-500 rounded-t w-full" 
                        style={{ height: `${value}%` }}
                      ></div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-400">
                    <span>1-3d</span>
                    <span>4-6d</span>
                    <span>7-9d</span>
                    <span>10-12d</span>
                    <span>13-15d</span>
                    <span>&gt;15d</span>
                  </div>
                </div>
                
                <div className="bg-gray-800/70 p-3 rounded-lg">
                  <h4 className="text-sm font-medium mb-2">Fatores de Risco Associados</h4>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Idade avançada</span>
                        <span className="text-red-400">78%</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full">
                        <div className="h-2 bg-red-500 rounded-full" style={{ width: '78%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Comorbidades cardíacas</span>
                        <span className="text-red-400">65%</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full">
                        <div className="h-2 bg-red-500 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Diabetes</span>
                        <span className="text-amber-400">42%</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full">
                        <div className="h-2 bg-amber-500 rounded-full" style={{ width: '42%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Histórico de cirurgias</span>
                        <span className="text-blue-400">30%</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full">
                        <div className="h-2 bg-blue-500 rounded-full" style={{ width: '30%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Previsão de Evolução Clínica</h3>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-800/70 p-3 rounded-lg text-center">
                  <h4 className="text-sm font-medium mb-2">Melhora dos Sintomas</h4>
                  <div className="text-3xl font-bold text-green-400">72%</div>
                  <p className="text-xs text-gray-400 mt-1">probabilidade</p>
                </div>
                
                <div className="bg-gray-800/70 p-3 rounded-lg text-center">
                  <h4 className="text-sm font-medium mb-2">Complicações</h4>
                  <div className="text-3xl font-bold text-amber-400">18%</div>
                  <p className="text-xs text-gray-400 mt-1">probabilidade</p>
                </div>
                
                <div className="bg-gray-800/70 p-3 rounded-lg text-center">
                  <h4 className="text-sm font-medium mb-2">Readmissão</h4>
                  <div className="text-3xl font-bold text-blue-400">12%</div>
                  <p className="text-xs text-gray-400 mt-1">em 30 dias</p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Diálogo para recursos */}
      <Dialog open={showResourceDetails} onOpenChange={setShowResourceDetails}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Construction className="h-5 w-5 text-amber-400" />
              Detalhes de Recursos
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Equipamentos Necessários</h3>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-gray-800/70 p-2 rounded-lg">
                  <span className="text-sm">Monitor multiparamétrico</span>
                  <Badge className="bg-green-500/20 text-green-400">Disponível</Badge>
                </div>
                
                <div className="flex items-center justify-between bg-gray-800/70 p-2 rounded-lg">
                  <span className="text-sm">Bomba de infusão</span>
                  <Badge className="bg-green-500/20 text-green-400">Disponível</Badge>
                </div>
                
                <div className="flex items-center justify-between bg-gray-800/70 p-2 rounded-lg">
                  <span className="text-sm">Oxímetro de pulso</span>
                  <Badge className="bg-amber-500/20 text-amber-400">Em manutenção</Badge>
                </div>
                
                <div className="flex items-center justify-between bg-gray-800/70 p-2 rounded-lg">
                  <span className="text-sm">Ventilador mecânico</span>
                  <Badge className="bg-gray-500/20 text-gray-400">Não necessário</Badge>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Medicamentos Críticos</h3>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-gray-800/70 p-2 rounded-lg">
                  <span className="text-sm">Antibióticos especiais</span>
                  <div className="text-xs text-gray-400">Estoque: 12 unidades</div>
                </div>
                
                <div className="flex items-center justify-between bg-gray-800/70 p-2 rounded-lg">
                  <span className="text-sm">Anti-hipertensivos</span>
                  <div className="text-xs text-gray-400">Estoque: 45 unidades</div>
                </div>
                
                <div className="flex items-center justify-between bg-gray-800/70 p-2 rounded-lg">
                  <span className="text-sm">Broncodilatadores</span>
                  <div className="text-xs text-gray-400">Estoque: 28 unidades</div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};