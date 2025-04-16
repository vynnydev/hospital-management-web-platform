/* eslint-disable @typescript-eslint/no-explicit-any */
// Tipos para os status
type VitalStatus = 'NORMAL' | 'WARNING' | 'CRITICAL';

// Interface para os valores de referência
interface VitalReferences {
  temperature: {
    min: number;
    max: number;
    warningThreshold: number;
  };
  bloodPressure: {
    systolicMin: number;
    systolicMax: number;
    diastolicMin: number;
    diastolicMax: number;
  };
  heartRate: {
    min: number;
    max: number;
    warningThreshold: number;
  };
  saturation: {
    min: number;
    warningThreshold: number;
  };
}

// Valores de referência
const vitalReferences: VitalReferences = {
  temperature: {
    min: 36.5,
    max: 37.5,
    warningThreshold: 0.5, // Margem para warning
  },
  bloodPressure: {
    systolicMin: 90,
    systolicMax: 140,
    diastolicMin: 60,
    diastolicMax: 90,
  },
  heartRate: {
    min: 60,
    max: 100,
    warningThreshold: 10, // Margem para warning
  },
  saturation: {
    min: 95,
    warningThreshold: 3, // Margem para warning
  },
};

type StatusType = 'NORMAL' | 'WARNING' | 'CRITICAL';

const statusClasses: Record<StatusType, string> = {
  'NORMAL': 'status-label status-normal',
  'WARNING': 'status-label status-warning',
  'CRITICAL': 'status-label status-critical'
};

export const getStatusClass = (status: string): string => {
  return statusClasses[status.toUpperCase() as StatusType] || statusClasses['NORMAL'];
};

// Função para calcular o status da temperatura
export const calculateTemperatureStatus = (temperature: number): VitalStatus => {
  if (!temperature) return 'NORMAL';
  
  const { min, max, warningThreshold } = vitalReferences.temperature;
  
  if (temperature >= min && temperature <= max) {
    return 'NORMAL';
  } else if (
    temperature >= (min - warningThreshold) && temperature < min ||
    temperature > max && temperature <= (max + warningThreshold)
  ) {
    return 'WARNING';
  }
  return 'CRITICAL';
};

// Função para calcular o status da pressão arterial
export const calculateBloodPressureStatus = (pressure: string): VitalStatus => {
  if (!pressure) return 'NORMAL';
  
  const [systolic, diastolic] = pressure.split('/').map(Number);
  const { systolicMin, systolicMax, diastolicMin, diastolicMax } = vitalReferences.bloodPressure;
  
  if (
    systolic >= systolicMin && systolic <= systolicMax &&
    diastolic >= diastolicMin && diastolic <= diastolicMax
  ) {
    return 'NORMAL';
  } else if (
    (systolic >= systolicMin * 0.9 && systolic < systolicMin) ||
    (systolic > systolicMax && systolic <= systolicMax * 1.1) ||
    (diastolic >= diastolicMin * 0.9 && diastolic < diastolicMin) ||
    (diastolic > diastolicMax && diastolic <= diastolicMax * 1.1)
  ) {
    return 'WARNING';
  }
  return 'CRITICAL';
};

// Função para calcular o status da frequência cardíaca
export const calculateHeartRateStatus = (heartRate: number): VitalStatus => {
  if (!heartRate) return 'NORMAL';
  
  const { min, max, warningThreshold } = vitalReferences.heartRate;
  
  if (heartRate >= min && heartRate <= max) {
    return 'NORMAL';
  } else if (
    heartRate >= (min - warningThreshold) && heartRate < min ||
    heartRate > max && heartRate <= (max + warningThreshold)
  ) {
    return 'WARNING';
  }
  return 'CRITICAL';
};

// Função para calcular o status da saturação
export const calculateSaturationStatus = (saturation: number): VitalStatus => {
  if (!saturation) return 'NORMAL';
  
  const { min, warningThreshold } = vitalReferences.saturation;
  
  if (saturation >= min) {
    return 'NORMAL';
  } else if (saturation >= (min - warningThreshold)) {
    return 'WARNING';
  }
  return 'CRITICAL';
};

// Função principal para calcular todos os status
export const calculateVitalSigns = (vitalsData: any) => {
  return {
    temperature: {
      value: vitalsData.temperature,
      status: calculateTemperatureStatus(Number(vitalsData.temperature))
    },
    bloodPressure: {
      value: vitalsData.pressure,
      status: calculateBloodPressureStatus(vitalsData.pressure)
    },
    heartRate: {
      value: vitalsData.heartRate,
      status: calculateHeartRateStatus(Number(vitalsData.heartRate))
    },
    saturation: {
      value: vitalsData.saturation,
      status: calculateSaturationStatus(Number(vitalsData.saturation))
    }
  };
};