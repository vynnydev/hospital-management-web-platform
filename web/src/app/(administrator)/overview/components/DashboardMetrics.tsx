/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React, { useEffect, useState } from 'react';
import MetricCard from './MetricCard';
import { metricsCalcService } from '@/services/calcs/metricsCalcService';
import { HospitalMetrics } from '@/types/metrics';
import { useMetricsCalculations } from '@/services/hooks/calcs/useMetricsCalculations';

import {
  HomeModernIcon,
  UserGroupIcon,
  ClockIcon,
  BuildingOffice2Icon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

import { useTheme } from 'next-themes'
import { formatDate } from '@/utils/dateFormatter';

interface DashboardMetricsProps {
  onRefresh?: () => void;
}

const getDefaultMetricValues = (): HospitalMetrics => ({
    capacity: {
        total: {
            maxBeds: 0,
            maxOccupancy: 0
        },
        departmental: {
            uti: {
                maxBeds: 0,
                maxOccupancy: 0,
                recommendedMaxOccupancy: 0
            },
            enfermaria: {
                maxBeds: 0,
                maxOccupancy: 0,
                recommendedMaxOccupancy: 0
            }
        }
    },
    overall: {
        occupancyRate: 0,
        totalPatients: 0,
        availableBeds: 0,
        avgStayDuration: 0,
        lastUpdate: new Date().toISOString(),
        periodComparison: {
            occupancy: { value: 0, trend: 'stable' },
            patients: { value: 0, trend: 'stable' },
            beds: { value: 0, trend: 'stable' },
            turnover: { value: 0, trend: 'stable' },
            mortality: { value: 0, trend: 'stable' },
            readmission: { value: 0, trend: 'stable' },
            infection: { value: 0, trend: 'stable' },
            revenue: { value: 0, trend: 'stable' },
            costs: { value: 0, trend: 'stable' },
        },
        patientDays: 0,
        turnoverRate: 0,
        totalDischarges: 0,
        deaths: 0,
        readmissions: 0,
        hospitalInfections: 0,
        revenue: 0,
        costs: 0,
        totalWaitTime: 0,
        avgWaitTime: 0,
        trends: 'stable'
    },
    departmental: {
      uti: {
        occupancy: 0,
        patients: 0,
        beds: 0,
        discharges: 0,
        deaths: 0,
        readmissions: 0,
        patientDays: 0,
        hospitalInfections: 0,
        avgStayDuration: 0,
        waitTime: 0,
        revenue: 0,
        costs: 0
      },
      enfermaria: {
        occupancy: 0,
        patients: 0,
        beds: 0,
        discharges: 0,
        deaths: 0,
        readmissions: 0,
        patientDays: 0,
        hospitalInfections: 0,
        avgStayDuration: 0,
        waitTime: 0,
        revenue: 0,
        costs: 0
      }
    },
    quality: {
      readmissionRate: 0,
      patientSatisfaction: 0,
      infectionRate: 0,
      incidentReports: 0,
      medicationErrors: 0,
      bedSoresCases: 0,
      fallsCases: 0
    },
    efficiency: {
      avgWaitTime: 0,
      bedTurnoverTime: 0,
      resourceUtilization: 0,
      bedTurnoverInterval: 0,
      operatingRoomUtilization: 0,
      emergencyWaitTimes: 0,
      scheduledSurgeryWaitTimes: 0,
      diagnosticTestWaitTimes: 0
    }
  });

const DashboardMetrics: React.FC<DashboardMetricsProps> = ({ onRefresh }) => {
  const { theme } = useTheme();
  const [metrics, setMetrics] = useState<HospitalMetrics>(getDefaultMetricValues());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  // Novo estado para controlar se os dados foram carregados inicialmente
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const {
    calculateTurnoverRate,
    calculateBedUtilization,
    calculateDepartmentMetrics,
    calculateStayDurationTrend,
    calculateTurnoverTrend,
    calculateAdmissionsLast24h
  } = useMetricsCalculations(metrics);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const data = await metricsCalcService.getMetrics();
      if (data) {
        setMetrics(data);
        setLastUpdate(new Date());
        setError(null);
      } else {
        setMetrics(getDefaultMetricValues());
      }
    } catch (err) {
      console.error(err);
      setMetrics(getDefaultMetricValues());
    } finally {
      setLoading(false);
      setInitialLoadDone(true);
    }
  };

  // Carrega os dados apenas uma vez quando o componente é montado
  useEffect(() => {
    if (!initialLoadDone) {
      fetchMetrics();
    }
  }, [initialLoadDone]);

  const handleRefresh = () => {
    fetchMetrics();
    onRefresh?.();
  };

  const stayDurationTrend = calculateStayDurationTrend();
  const turnoverTrend = calculateTurnoverTrend();
  const admissionsLast24h = calculateAdmissionsLast24h();

  if (loading && !initialLoadDone) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="space-y-6 -mt-16">
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-100 px-4 mt-4">
          Última atualização: {formatDate(lastUpdate)}
        </div>
        <button
          onClick={handleRefresh}
          className={`w-48 items-center border-2 shadow-md rounded-md p-2 border-cyan-600 text-white
            transition-all duration-300 ease-in-out
            ${theme === 'dark'
              ? 'bg-[linear-gradient(90deg,#0F172A,#155E75)] hover:bg-[linear-gradient(90deg,#1e3a8a,#1e4976)] shadow-[0_0_20px_rgba(15,23,42,0.5)]'
              : 'bg-[linear-gradient(90deg,#aecddc,#459bc6)] hover:bg-[linear-gradient(90deg,#1e3a8a,#1e4976)] shadow-lg'
            }
            hover:transform hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(30,58,138,0.3)]
          `}
        >
          <div className='flex flex-row items-center justify-center space-x-2'>
            <ArrowPathIcon className="h-5 w-5 mr-2" />
            Atualizar Análise
          </div>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Taxa de Ocupação Total"
          value={metrics.overall.occupancyRate}
          unit="%"
          trend={{
            value: metrics.overall.periodComparison.occupancy.value,
            direction: metrics.overall.periodComparison.occupancy.trend
          }}
          status={metrics.overall.occupancyRate === 0 ? 'empty' : metricsCalcService.calculateOccupancyStatus(metrics.overall.occupancyRate)}
          timestamp={new Date(metrics.overall.lastUpdate)}
          details={{
            subtitle: "Ocupação por setor",
            breakdown: [
              { label: "UTI", value: `${metrics.departmental.uti.occupancy}%` },
              { label: "Enfermaria", value: `${metrics.departmental.enfermaria.occupancy}%` }
            ]
          }}
          icon={<HomeModernIcon className="w-5 h-5 text-gray-500" />}
        />

        <MetricCard
          title="Total de Pacientes"
          value={metrics.overall.totalPatients}
          unit="pacientes"
          trend={{
            value: metrics.overall.periodComparison.patients.value,
            direction: metrics.overall.periodComparison.patients.trend
          }}
          status={metrics.overall.totalPatients === 0 ? 'empty' : 'normal'}
          timestamp={new Date(metrics.overall.lastUpdate)}
          details={{
            subtitle: "Por tipo de internação",
            breakdown: [
              { label: "UTI", value: String(metrics.departmental.uti.patients) },
              { label: "Enfermaria", value: String(metrics.departmental.enfermaria.patients) }
            ]
          }}
          icon={<UserGroupIcon className="w-5 h-5 text-gray-500" />}
        />

        <MetricCard
          title="Leitos Disponíveis"
          value={metrics.overall.availableBeds}
          unit="leitos"
          trend={{
            value: metrics.overall.periodComparison.beds.value,
            direction: metrics.overall.periodComparison.beds.trend
          }}
          status={metrics.overall.availableBeds === 0 ? 'empty' : 
                 metrics.overall.availableBeds < 10 ? 'critical' : 'normal'}
          timestamp={new Date(metrics.overall.lastUpdate)}
          details={{
            subtitle: "Por categoria",
            breakdown: [
              { 
                label: "UTI", 
                value: String(metrics.departmental.uti.beds - metrics.departmental.uti.patients) 
              },
              { 
                label: "Enfermaria", 
                value: String(metrics.departmental.enfermaria.beds - metrics.departmental.enfermaria.patients) 
              }
            ]
          }}
          icon={<BuildingOffice2Icon className="w-5 h-5 text-gray-500" />}
        />

        <MetricCard
          title="Tempo Médio Internação"
          value={metrics.overall.avgStayDuration}
          unit="dias"
          trend={stayDurationTrend}
          status={metrics.overall.avgStayDuration === 0 ? 'empty' :
                 metrics.overall.avgStayDuration > 7 ? 'warning' : 'normal'}
          timestamp={new Date(metrics.overall.lastUpdate)}
          details={{
            subtitle: "Por especialidade",
            breakdown: [
              { 
                label: "UTI", 
                value: metrics.overall.avgStayDuration === 0 ? '0d' : 
                       `${(metrics.overall.avgStayDuration * 1.2).toFixed(1)}d` 
              },
              { 
                label: "Enfermaria", 
                value: metrics.overall.avgStayDuration === 0 ? '0d' : 
                       `${(metrics.overall.avgStayDuration * 0.9).toFixed(1)}d` 
              }
            ]
          }}
          icon={<ClockIcon className="w-5 h-5 text-gray-500" />}
        />

        <MetricCard
          title="Taxa de Rotatividade"
          value={calculateTurnoverRate()}
          unit="pacientes/dia"
          trend={turnoverTrend}
          status={calculateTurnoverRate() === 0 ? 'empty' : 'normal'}
          timestamp={new Date(metrics.overall.lastUpdate)}
          details={{
            subtitle: "Últimas 24h",
            breakdown: [
              { label: "Admissões", value: String(admissionsLast24h.admissions) },
              { label: "Altas", value: String(admissionsLast24h.discharges) }
            ]
          }}
          icon={<ArrowPathIcon className="w-5 h-5 text-gray-500" />}
        />
      </div>
    </div>
  );
};

export default DashboardMetrics;
