/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { useNetworkData } from '@/services/hooks/network-hospital/useNetworkData';
import { useAmbulanceData } from '@/services/hooks/ambulance/useAmbulanceData';
import { useStaffData } from '@/services/hooks/staffs/useStaffData';
import { 
  Users, 
  Bed, 
  Ambulance, 
  Activity, 
  ChevronDown, 
  ChevronUp, 
  UserCheck,
  Clock,
  Scale,
  Briefcase,
  BookOpen
} from 'lucide-react';

interface ResourceInsightsProps {
  hospitalId: string;
}

interface ResourceCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  indicators: ResourceIndicator[];
}

interface ResourceIndicator {
  id: string;
  title: string;
  value: string | number;
  status: 'optimal' | 'warning' | 'critical' | 'neutral';
  timeframe?: string;
  trend?: 'up' | 'down' | 'stable';
  change?: number;
  details?: string;
}

export const ResourceInsights: React.FC<ResourceInsightsProps> = ({ hospitalId }) => {
  const { networkData } = useNetworkData();
  const { staffData } = useStaffData(hospitalId);
  const { ambulanceData } = useAmbulanceData(hospitalId);
  const [expandedCategory, setExpandedCategory] = useState<string | null>('staff');
  
  const hospital = networkData?.hospitals.find(h => h.id === hospitalId);
  
  if (!hospital) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">Dados do hospital não disponíveis</p>
      </div>
    );
  }
  
  // Calcular indicadores de recursos com base nos dados do hospital
  const calculateResourceCategories = (): ResourceCategory[] => {
    const utiOccupancy = hospital.metrics.departmental.uti?.occupancy || 0;
    const enfermariaOccupancy = hospital.metrics.departmental.enfermaria?.occupancy || 0;
    
    // Métricas de equipe
    const staffMetrics = staffData?.staffMetrics[hospitalId];
    const utiStaffDistribution = staffMetrics?.departmental['uti']?.staffDistribution;
    const utiShiftCoverage = staffMetrics?.departmental['uti']?.shiftCoverage;
    
    // Dados de ambulâncias
    const ambulances = ambulanceData?.ambulances[hospitalId] || [];
    const availableAmbulances = ambulances.filter(a => a.status === 'available');
    const dispatchedAmbulances = ambulances.filter(a => a.status === 'dispatched');
    const maintenanceAmbulances = ambulances.filter(a => a.status === 'maintenance');
    
    return [
      {
        id: 'staff',
        title: 'Recursos Humanos',
        description: 'Análise da distribuição e disponibilidade de equipes',
        icon: <Users className="h-5 w-5" />,
        color: 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30',
        indicators: [
          {
            id: 'staff-uti-ratio',
            title: 'Proporção Enfermeiros/Pacientes UTI',
            value: utiStaffDistribution 
              ? (utiStaffDistribution.nurses / hospital.metrics.departmental.uti.patients).toFixed(2) 
              : '0.8',
            status: parseFloat((utiStaffDistribution 
              ? (utiStaffDistribution.nurses / hospital.metrics.departmental.uti.patients).toFixed(2) 
              : '0.8')) >= 0.5 ? 'optimal' : 'warning',
            details: 'A proporção ideal é de pelo menos 0.5 enfermeiros por paciente em UTI'
          },
          {
            id: 'staff-shift-coverage',
            title: 'Cobertura de Turno Noturno',
            value: `${utiShiftCoverage?.night || 85}%`,
            status: (utiShiftCoverage?.night || 85) >= 90 ? 'optimal' : 'warning',
            details: 'A cobertura ideal em todos os turnos é de pelo menos 90%'
          },
          {
            id: 'staff-task-completion',
            title: 'Taxa de Conclusão de Tarefas',
            value: `${staffMetrics?.departmental['uti']?.taskCompletion || 90}%`,
            status: (staffMetrics?.departmental['uti']?.taskCompletion || 90) >= 85 ? 'optimal' : 'warning',
            trend: 'up',
            change: 2.5
          },
          {
            id: 'staff-avg-task-time',
            title: 'Tempo Médio por Tarefa',
            value: `${staffMetrics?.departmental['uti']?.averageTaskTime || 25} min`,
            status: (staffMetrics?.departmental['uti']?.averageTaskTime || 25) <= 30 ? 'optimal' : 'warning'
          }
        ]
      },
      {
        id: 'beds',
        title: 'Leitos e Capacidade',
        description: 'Análise da ocupação e eficiência no uso de leitos',
        icon: <Bed className="h-5 w-5" />,
        color: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30',
        indicators: [
          {
            id: 'beds-uti-occupancy',
            title: 'Taxa de Ocupação UTI',
            value: `${utiOccupancy}%`,
            status: utiOccupancy <= 85 ? 'optimal' : utiOccupancy <= 90 ? 'warning' : 'critical',
            trend: hospital.metrics.overall.periodComparison.occupancy.trend,
            change: hospital.metrics.overall.periodComparison.occupancy.value
          },
          {
            id: 'beds-enfermaria-occupancy',
            title: 'Taxa de Ocupação Enfermaria',
            value: `${enfermariaOccupancy}%`,
            status: enfermariaOccupancy <= 80 ? 'optimal' : enfermariaOccupancy <= 90 ? 'warning' : 'critical',
            trend: 'stable'
          },
          {
            id: 'beds-turnover',
            title: 'Taxa de Rotatividade',
            value: hospital.metrics.overall.turnoverRate.toFixed(1),
            status: hospital.metrics.overall.turnoverRate >= 10 ? 'optimal' : 'warning',
            details: 'A taxa ideal de rotatividade é de pelo menos 10 pacientes por leito/mês'
          },
          {
            id: 'beds-avg-stay',
            title: 'Permanência Média',
            value: `${hospital.metrics.overall.avgStayDuration.toFixed(1)} dias`,
            status: hospital.metrics.overall.avgStayDuration <= 5 ? 'optimal' : 'warning',
            details: 'O tempo médio ideal de permanência é de até 5 dias'
          }
        ]
      },
      {
        id: 'ambulances',
        title: 'Ambulâncias e Transporte',
        description: 'Status e disponibilidade de ambulâncias',
        icon: <Ambulance className="h-5 w-5" />,
        color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30',
        indicators: [
          {
            id: 'ambulances-availability',
            title: 'Disponibilidade de Ambulâncias',
            value: `${(availableAmbulances.length / ambulances.length * 100).toFixed(0)}%`,
            status: (availableAmbulances.length / ambulances.length * 100) >= 50 ? 'optimal' : 'warning',
            details: `${availableAmbulances.length} de ${ambulances.length} ambulâncias disponíveis`
          },
          {
            id: 'ambulances-response-time',
            title: 'Tempo Médio de Resposta',
            value: ambulanceData?.stats[hospitalId]?.averageResponseTime 
              ? `${ambulanceData.stats[hospitalId].averageResponseTime} min` 
              : '18 min',
            status: (ambulanceData?.stats[hospitalId]?.averageResponseTime || 18) <= 20 ? 'optimal' : 'warning'
          },
          {
            id: 'ambulances-maintenance',
            title: 'Ambulâncias em Manutenção',
            value: maintenanceAmbulances.length,
            status: (maintenanceAmbulances.length / ambulances.length * 100) <= 20 ? 'optimal' : 'warning',
            details: `${maintenanceAmbulances.length} de ${ambulances.length} ambulâncias em manutenção`
          }
        ]
      },
      {
        id: 'efficiency',
        title: 'Indicadores de Eficiência',
        description: 'Métricas de eficiência operacional e financeira',
        icon: <Activity className="h-5 w-5" />,
        color: 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30',
        indicators: [
          {
            id: 'efficiency-bed-turnover',
            title: 'Taxa de Rotatividade/Leito',
            value: hospital.metrics.overall.turnoverRate.toFixed(1),
            status: hospital.metrics.overall.turnoverRate >= 10 ? 'optimal' : 'warning'
          },
          {
            id: 'efficiency-resource-utilization',
            title: 'Utilização de Recursos',
            value: `${(hospital.metrics?.networkEfficiency?.resourceUtilization || 85).toFixed(1)}%`,
            status: (hospital.metrics?.networkEfficiency?.resourceUtilization || 85) <= 90 ? 'optimal' : 'warning'
          },
          {
            id: 'efficiency-wait-time',
            title: 'Tempo Médio de Espera',
            value: `${(hospital.metrics?.networkEfficiency?.avgWaitTime || 2.8).toFixed(1)} h`,
            status: (hospital.metrics?.networkEfficiency?.avgWaitTime || 2.8) <= 3 ? 'optimal' : 'warning',
            trend: 'down',
            change: 5.2
          },
          {
            id: 'efficiency-nurse-productivity',
            title: 'Produtividade da Enfermagem',
            value: staffMetrics?.departmental['enfermaria']?.taskCompletion 
              ? `${staffMetrics.departmental['enfermaria'].taskCompletion}%` 
              : '85%',
            status: (staffMetrics?.departmental['enfermaria']?.taskCompletion || 85) >= 80 ? 'optimal' : 'warning'
          }
        ]
      }
    ];
  };
  
  const resourceCategories = calculateResourceCategories();
  
  // Obter cor baseada no status
  const getStatusColor = (status: 'optimal' | 'warning' | 'critical' | 'neutral') => {
    switch (status) {
      case 'optimal':
        return 'text-green-600 dark:text-green-400';
      case 'warning':
        return 'text-amber-600 dark:text-amber-400';
      case 'critical':
        return 'text-red-600 dark:text-red-400';
      case 'neutral':
        return 'text-gray-600 dark:text-gray-400';
    }
  };
  
  // Obter ícone baseado no status
  const getStatusIcon = (status: 'optimal' | 'warning' | 'critical' | 'neutral') => {
    switch (status) {
      case 'optimal':
        return <div className="h-2 w-2 rounded-full bg-green-500 dark:bg-green-400"></div>;
      case 'warning':
        return <div className="h-2 w-2 rounded-full bg-amber-500 dark:bg-amber-400"></div>;
      case 'critical':
        return <div className="h-2 w-2 rounded-full bg-red-500 dark:bg-red-400"></div>;
      case 'neutral':
        return <div className="h-2 w-2 rounded-full bg-gray-500 dark:bg-gray-400"></div>;
    }
  };
  
  // Obter ícone de tendência
  const getTrendIcon = (trend?: 'up' | 'down' | 'stable', change?: number) => {
    if (!trend || !change) return null;
    
    return (
      <span className={`text-xs ${
        trend === 'up' 
          ? 'text-green-600 dark:text-green-400' 
          : trend === 'down'
            ? 'text-red-600 dark:text-red-400'
            : 'text-gray-600 dark:text-gray-400'
      }`}>
        {trend === 'up' 
          ? '↑' 
          : trend === 'down' 
            ? '↓' 
            : '−'
        } 
        {Math.abs(change).toFixed(1)}%
      </span>
    );
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
          <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mr-2" />
          Insights de Recursos
        </h3>
      </div>
      
      <div className="space-y-6">
        {resourceCategories.map((category) => (
          <div 
            key={category.id}
            className="bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 overflow-hidden"
          >
            <div 
              className="p-4 cursor-pointer"
              onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${category.color}`}>
                    {category.icon}
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {category.title}
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                      {category.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <button 
                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400"
                    aria-label="Expandir"
                  >
                    {expandedCategory === category.id ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              
              {/* Preview dos indicadores (sempre visível) */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {category.indicators.slice(0, 4).map((indicator) => (
                  <div 
                    key={indicator.id} 
                    className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3"
                  >
                    <div className="flex items-center mb-1">
                      {getStatusIcon(indicator.status)}
                      <span className="text-xs text-gray-600 dark:text-gray-300 ml-1">
                        {indicator.title}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className={`text-lg font-bold ${getStatusColor(indicator.status)}`}>
                        {indicator.value}
                      </span>
                      {getTrendIcon(indicator.trend, indicator.change)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Conteúdo expandido */}
            {expandedCategory === category.id && (
              <div className="px-4 pb-4 pt-2 border-t border-gray-200 dark:border-gray-600">
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Análise Detalhada
                </h5>
                
                {/* Análise específica por categoria */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
                  {category.id === 'staff' && (
                    <div>
                      <h6 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                        Distribuição de equipe por departamento
                      </h6>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600 dark:text-gray-300">UTI</span>
                            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                              {staffData?.staffMetrics[hospitalId]?.departmental['uti']?.totalStaff || 18} profissionais
                            </span>
                          </div>
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-3">
                            <span className="flex items-center">
                              <Briefcase className="h-3 w-3 mr-1 text-indigo-500 dark:text-indigo-400" />
                              {staffData?.staffMetrics[hospitalId]?.departmental['uti']?.staffDistribution.doctors || 6} médicos
                            </span>
                            <span className="flex items-center">
                              <UserCheck className="h-3 w-3 mr-1 text-emerald-500 dark:text-emerald-400" />
                              {staffData?.staffMetrics[hospitalId]?.departmental['uti']?.staffDistribution.nurses || 8} enfermeiros
                            </span>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600 dark:text-gray-300">Enfermaria</span>
                            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                              {staffData?.staffMetrics[hospitalId]?.departmental['enfermaria']?.totalStaff || 25} profissionais
                            </span>
                          </div>
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-3">
                            <span className="flex items-center">
                              <Briefcase className="h-3 w-3 mr-1 text-indigo-500 dark:text-indigo-400" />
                              {staffData?.staffMetrics[hospitalId]?.departmental['enfermaria']?.staffDistribution.doctors || 8} médicos
                            </span>
                            <span className="flex items-center">
                              <UserCheck className="h-3 w-3 mr-1 text-emerald-500 dark:text-emerald-400" />
                              {staffData?.staffMetrics[hospitalId]?.departmental['enfermaria']?.staffDistribution.nurses || 12} enfermeiros
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {category.id === 'beds' && (
                    <div>
                      <h6 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                        Capacidade e ocupação por departamento
                      </h6>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600 dark:text-gray-300">UTI</span>
                            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                              Ocupação: {hospital.metrics.departmental.uti?.occupancy || 0}%
                            </span>
                          </div>
                          <div className="relative h-2 bg-gray-200 dark:bg-gray-600 rounded overflow-hidden">
                            <div 
                              className={`absolute h-full left-0 top-0 ${
                                (hospital.metrics.departmental.uti?.occupancy || 0) > 90 
                                  ? 'bg-red-500 dark:bg-red-600' 
                                  : (hospital.metrics.departmental.uti?.occupancy || 0) > 80
                                    ? 'bg-amber-500 dark:bg-amber-600'
                                    : 'bg-green-500 dark:bg-green-600'
                              }`}
                              style={{ width: `${hospital.metrics.departmental.uti?.occupancy || 0}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                            <span>Leitos: {hospital.metrics.departmental.uti?.beds || 0}</span>
                            <span>Pacientes: {hospital.metrics.departmental.uti?.patients || 0}</span>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600 dark:text-gray-300">Enfermaria</span>
                            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                              Ocupação: {hospital.metrics.departmental.enfermaria?.occupancy || 0}%
                            </span>
                          </div>
                          <div className="relative h-2 bg-gray-200 dark:bg-gray-600 rounded overflow-hidden">
                            <div 
                              className={`absolute h-full left-0 top-0 ${
                                (hospital.metrics.departmental.enfermaria?.occupancy || 0) > 90 
                                  ? 'bg-red-500 dark:bg-red-600' 
                                  : (hospital.metrics.departmental.enfermaria?.occupancy || 0) > 80
                                    ? 'bg-amber-500 dark:bg-amber-600'
                                    : 'bg-green-500 dark:bg-green-600'
                              }`}
                              style={{ width: `${hospital.metrics.departmental.enfermaria?.occupancy || 0}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                            <span>Leitos: {hospital.metrics.departmental.enfermaria?.beds || 0}</span>
                            <span>Pacientes: {hospital.metrics.departmental.enfermaria?.patients || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {category.id === 'ambulances' && (
                    <div>
                      <h6 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                        Status atual da frota
                      </h6>
                      <div className="grid grid-cols-4 gap-3">
                        <div className="bg-white dark:bg-gray-700 p-3 rounded-lg text-center">
                          <div className="text-lg font-bold text-gray-900 dark:text-white">
                            {ambulanceData?.ambulances[hospitalId]?.length || 0}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Total de ambulâncias
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-700 p-3 rounded-lg text-center">
                          <div className="text-lg font-bold text-green-600 dark:text-green-400">
                            {ambulanceData?.ambulances[hospitalId]?.filter(a => a.status === 'available').length || 0}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Disponíveis
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-700 p-3 rounded-lg text-center">
                          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            {ambulanceData?.ambulances[hospitalId]?.filter(a => a.status === 'dispatched').length || 0}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Em atendimento
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-700 p-3 rounded-lg text-center">
                          <div className="text-lg font-bold text-amber-600 dark:text-amber-400">
                            {ambulanceData?.ambulances[hospitalId]?.filter(a => a.status === 'maintenance').length || 0}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Em manutenção
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {category.id === 'efficiency' && (
                    <div>
                      <h6 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                        Indicadores de eficiência
                      </h6>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                          <div className="flex items-center mb-2">
                            <Clock className="h-4 w-4 text-purple-500 dark:text-purple-400 mr-2" />
                            <span className="text-sm text-gray-600 dark:text-gray-300">Tempo médio de permanência</span>
                          </div>
                          <div className="text-lg font-bold text-gray-900 dark:text-white">
                            {hospital.metrics.overall.avgStayDuration.toFixed(1)} dias
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Recomendado: ≤ 5 dias
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                          <div className="flex items-center mb-2">
                            <Scale className="h-4 w-4 text-blue-500 dark:text-blue-400 mr-2" />
                            <span className="text-sm text-gray-600 dark:text-gray-300">Taxa de rotatividade</span>
                          </div>
                          <div className="text-lg font-bold text-gray-900 dark:text-white">
                            {hospital.metrics.overall.turnoverRate.toFixed(1)}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Recomendado: ≥ 10
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Lista de todos os indicadores dessa categoria */}
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Todos os indicadores
                </h5>
                
                <div className="space-y-2">
                  {category.indicators.map(indicator => (
                    <div 
                      key={indicator.id} 
                      className="flex items-center justify-between bg-white dark:bg-gray-700 p-3 rounded-lg"
                    >
                      <div className="flex items-center">
                        {getStatusIcon(indicator.status)}
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          {indicator.title}
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        <span className={`font-medium ${getStatusColor(indicator.status)}`}>
                          {indicator.value}
                        </span>
                        {indicator.trend && indicator.change && (
                          <div className="ml-2">
                            {getTrendIcon(indicator.trend, indicator.change)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Recomendações relacionadas */}
                {category.id === 'staff' && (
                  <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                    <h6 className="font-medium text-blue-800 dark:text-blue-300 flex items-center text-sm mb-1">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Recomendação da IA
                    </h6>
                    <p className="text-blue-700 dark:text-blue-400 text-sm">
                      A análise indica uma oportunidade de balanceamento da equipe de enfermagem entre turnos.
                      Considere realocar 2 enfermeiros do turno da manhã para o turno da noite para melhorar a cobertura.
                    </p>
                  </div>
                )}
                
                {category.id === 'beds' && (
                  <div className="mt-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                    <h6 className="font-medium text-amber-800 dark:text-amber-300 flex items-center text-sm mb-1">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Recomendação da IA
                    </h6>
                    <p className="text-amber-700 dark:text-amber-400 text-sm">
                      A taxa de ocupação da UTI está próxima do limite crítico. Recomendamos revisar os critérios de alta da UTI
                      e considerar a transferência de pacientes estáveis para unidades de cuidados intermediários.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};