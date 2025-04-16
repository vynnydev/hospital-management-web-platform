import { IHospitalMetrics, IPatient } from '@/types/hospital-network-types';

/**
 * Extrai os sinais vitais mais recentes do paciente a partir dos eventos
 */
export const getPatientVitals = (patient: IPatient) => {
    const vitalExams = patient.careHistory?.events.filter(event => 
      event.type === 'exam' && 
      event.details?.examType?.toLowerCase().includes('sinais vitais')
    ) || [];
  
    const latestVitalExam = vitalExams[vitalExams.length - 1];
    
    return {
      heartRate: latestVitalExam?.details?.heartRate || 0,
      temperature: latestVitalExam?.details?.temperature || 0,
      oxygenSaturation: latestVitalExam?.details?.oxygenSaturation || 0
    };
  };
  
  /**
   * Obtém lista de medicações ativas do paciente
   */
  export const getPatientMedications = (patient: IPatient) => {
    return patient.careHistory?.events
      .filter(event => event.type === 'medication')
      .map(event => ({
        name: event.details?.medicationName || '',
        description: event.description,
        timestamp: event.timestamp
      })) || [];
  };
  
  /**
   * Obtém o procedimento mais recente do paciente
   */
  export const getLatestProcedure = (patient: IPatient) => {
    const procedures = patient.careHistory?.events
      .filter(event => event.type === 'procedure')
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
    return procedures?.[0];
  };
  
  /**
   * Obtém o último status do paciente
   */
  export const getLatestStatus = (patient: IPatient) => {
    return patient.careHistory?.statusHistory
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
  };
  
  /**
   * Gera o prompt para o plano de cuidados baseado nos dados do paciente
   */
  export const generateCarePlanPrompt = (patient: IPatient) => {
    const vitals = getPatientVitals(patient);
    const latestProcedure = getLatestProcedure(patient);
    const currentMedications = getPatientMedications(patient);
    const latestStatus = getLatestStatus(patient);
  
    return `Representação visual técnica e detalhada em português brasileiro:
      - TIPO: Diagrama médico técnico hospitalar
      - CONTEÚDO: Fluxograma de monitoramento do paciente
      - DADOS VITAIS: FC ${vitals.heartRate}bpm | Temp ${vitals.temperature}°C | SatO2 ${vitals.oxygenSaturation}%
      - ÚLTIMO PROCEDIMENTO: ${latestProcedure?.description || 'Nenhum'}
      - MEDICAÇÕES ATIVAS: ${currentMedications.map(med => med.name).join(', ') || 'Nenhuma'}
      - STATUS ATUAL: ${latestStatus?.status || 'Não disponível'}
      - ESTILO: Diagrama profissional médico, alto contraste
      - ELEMENTOS: Equipamentos médicos, gráficos de monitoramento, símbolos hospitalares
      - LAYOUT: Organizado em grade com setas de fluxo
      - CORES: Esquema profissional hospitalar
      - TEXTO: Todas as legendas em português do Brasil
      - ATENÇÃO: Sem pessoas, sem rostos, apenas equipamentos e diagramas`;
  };
  
  /**
   * Categoriza pacientes por departamento e status
   */
  export const categorizePatients = (patients: IPatient[], departments: Record<string, string[]>) => {
    const categorized: Record<string, Record<string, IPatient[]>> = {};
  
    // Inicializar a estrutura
    Object.keys(departments).forEach((department) => {
      categorized[department] = {};
      departments[department].forEach((status) => {
        categorized[department][status] = [];
      });
    });
  
    // Categorizar pacientes
    patients.forEach((patient) => {
      const latestStatus = getLatestStatus(patient);
      if (!latestStatus) return;
  
      const department = latestStatus.department.toLowerCase().trim();
      const status = latestStatus.status.toLowerCase().trim();
  
      if (!categorized[department]) {
        categorized[department] = {};
      }
      if (!categorized[department][status]) {
        categorized[department][status] = [];
      }
  
      categorized[department][status].push(patient);
    });
  
    return categorized;
};

// Função helper para normalizar nomes de departamentos
export const normalizeDepartmentName = (name: string): string => {
    return name.toLowerCase().trim();
};
  
// Função helper para verificar departamento
export const hasDepartment = (data: IHospitalMetrics, area: string): boolean => {
    if (!data?.departmental) return false;
  
    const normalizedArea = normalizeDepartmentName(area);
    return normalizedArea === 'uti' || normalizedArea === 'enfermaria';
};
  
// Helper para obter dados do departamento
export const getDepartmentData = (data: IHospitalMetrics, area: string) => {
    const normalizedArea = normalizeDepartmentName(area);
    return data.departmental?.[normalizedArea];
};

export const filterPatientsByDepartment = (
  patients: IPatient[], 
  department: string,
  normalizeDepartmentName: (dept: string) => string
): IPatient[] => {
  return patients.filter(patient => {
    const latestStatus = patient.careHistory?.statusHistory?.[patient.careHistory.statusHistory.length - 1];
    return latestStatus && normalizeDepartmentName(latestStatus.department) === department;
  });
};