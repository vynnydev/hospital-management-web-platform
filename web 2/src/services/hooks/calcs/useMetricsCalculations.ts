/* eslint-disable @typescript-eslint/no-unused-vars */
import { HospitalMetrics, Capacity } from '@/types/metrics';
import { TrendDirection } from '@/types/trends';

export const useMetricsCalculations = (metrics: HospitalMetrics) => {
  
  // Calcula a taxa de rotatividade dos leitos com limite de capacidade
  const calculateTurnoverRate = () => {
    if (!metrics) return 0;

    const discharges = metrics.overall.totalDischarges || 0;
    const maxBeds = metrics.capacity.total.maxBeds;
    const availableBeds = Math.min(metrics.overall.availableBeds || 1, maxBeds);
    const period = 1;
    
    const turnoverRate = discharges / availableBeds / period;
    
    return isNaN(turnoverRate) || turnoverRate < 0 ? 0 : Number(turnoverRate.toFixed(2));
  };

  // Calcula o percentual de utilização dos leitos considerando capacidade máxima
  const calculateBedUtilization = () => {
    if (!metrics) return 0;
    const maxBeds = metrics.capacity.total.maxBeds;
    const patientDays = metrics.overall.patientDays;
    return Math.min((patientDays / (maxBeds * 365)) * 100, 100);
  };

  // Calcula métricas específicas por departamento com limites
  const calculateDepartmentMetrics = (department: 'uti' | 'enfermaria') => {
    if (!metrics) return {
      occupancy: 0,
      efficiency: 0,
      turnover: 0,
      avgLOS: 0,
      mortalityRate: 0,
      readmissionRate: 0
    };

    const deptData = metrics.departmental[department];
    const deptCapacity = metrics.capacity.departmental[department];
    
    const maxBeds = deptCapacity.maxBeds;
    const turnover = (deptData.discharges * 365) / Math.min(deptData.beds, maxBeds);
    const avgLOS = deptData.patientDays / deptData.discharges;
    const efficiency = Math.min((deptData.patients / maxBeds) * 100, 100);
    const mortalityRate = (deptData.deaths / deptData.discharges) * 100;
    const readmissionRate = (deptData.readmissions / deptData.discharges) * 100;

    return {
      occupancy: Math.min(deptData.occupancy, deptCapacity.maxOccupancy),
      efficiency,
      turnover,
      avgLOS,
      mortalityRate,
      readmissionRate
    };
  };

  // Calcula tendência do tempo de permanência
  const calculateStayDurationTrend = () => {
    if (!metrics) return {
      value: 0,
      direction: 'stable' as TrendDirection
    };
    
    // Compare com valores históricos para determinar a tendência
    const currentDuration = metrics.overall.avgStayDuration;
    const previousDuration = currentDuration * 1.1; // Exemplo - substituir por dados reais históricos
    
    let direction: TrendDirection = 'stable';
    if (currentDuration > previousDuration * 1.05) direction = 'up';
    if (currentDuration < previousDuration * 0.95) direction = 'down';
    
    return {
      value: currentDuration,
      direction
    };
  };

  // Calcula tendência da taxa de rotatividade
  const calculateTurnoverTrend = () => {
    if (!metrics) return {
      value: 0,
      direction: 'stable' as TrendDirection
    };
    
    const currentTurnover = calculateTurnoverRate();
    const previousTurnover = currentTurnover * 1.1;
    
    let direction: TrendDirection = 'stable';
    if (currentTurnover > previousTurnover * 1.05) direction = 'up';
    if (currentTurnover < previousTurnover * 0.95) direction = 'down';
    
    return {
      value: currentTurnover,
      direction
    };
  };

  // Calcula admissões nas últimas 24h
  const calculateAdmissionsLast24h = () => {
    if (!metrics) return {
      admissions: 0,
      discharges: 0
    };
    
    // Exemplo - substituir por cálculos reais baseados em timestamps
    const admissions = metrics.overall.totalPatients * 0.1;
    const discharges = metrics.overall.totalDischarges * 0.1;
    
    return {
      admissions: Math.round(admissions),
      discharges: Math.round(discharges)
    };
  };

  // Funções adicionais mantidas do código original
  const calculateMortalityRate = () => {
    if (!metrics) return 0;
    const deaths = metrics.overall.deaths;
    const discharges = metrics.overall.totalDischarges;
    return (deaths / discharges) * 100;
  };

  const calculateReadmissionRate = () => {
    if (!metrics) return 0;
    const readmissions = metrics.overall.readmissions;
    const totalDischarges = metrics.overall.totalDischarges;
    return (readmissions / totalDischarges) * 100;
  };

  const calculateInfectionRate = () => {
    if (!metrics) return 0;
    const infections = metrics.overall.hospitalInfections;
    const patientDays = metrics.overall.patientDays;
    return (infections / patientDays) * 1000;
  };

  const calculateOverallEfficiency = () => {
    if (!metrics) return 0;
    const totalRevenue = metrics.overall.revenue;
    const totalCosts = metrics.overall.costs;
    return ((totalRevenue - totalCosts) / totalRevenue) * 100;
  };

  const calculateCostPerPatient = () => {
    if (!metrics) return 0;
    const totalCosts = metrics.overall.costs;
    const totalPatients = metrics.overall.totalPatients;
    return totalCosts / totalPatients;
  };

  const calculateAverageWaitTime = () => {
    if (!metrics) return 0;
    const totalWaitTime = metrics.overall.totalWaitTime;
    const totalPatients = metrics.overall.totalPatients;
    return totalWaitTime / totalPatients;
  };

  return {
    calculateTurnoverRate,
    calculateBedUtilization,
    calculateDepartmentMetrics,
    calculateStayDurationTrend,
    calculateTurnoverTrend,
    calculateAdmissionsLast24h,
    calculateMortalityRate,
    calculateReadmissionRate,
    calculateInfectionRate,
    calculateOverallEfficiency,
    calculateCostPerPatient,
    calculateAverageWaitTime
  };
};