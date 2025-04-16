/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// types/hospital.ts

export interface IVitalSignsTrend {
  timestamp: string;
  temperature: number;
  bloodPressure: string;
  heartRate: number;
  oxygenSaturation: number;
}

export interface ICacheResult {
  recommendations: string[];
  context: PatientContext;
  timestamp: Date;
  score: number;
}

export interface IPreparedContext {
  age: number;
  diagnoses: string[];
  riskLevel: 'Baixo' | 'Médio' | 'Alto';
  vitals: {
      temperature: number;
      bloodPressure: string;
      heartRate: number;
      oxygenSaturation: number;
  } | null;
  medications: Array<{
      name: string;
      dosage: string;
  }>;
  procedures: Array<{
      type: string;
      notes: string;
  }>;
}

export interface IAnalysis {
  riskLevel: string;
  trend: string;
  alerts: string[];
  recommendations: string[];
  vitalSignsTrend: {
    timestamp: string;
    temperature: number;
    bloodPressure: string;
    heartRate: number;
    oxygenSaturation: number;
  }[];
}

export interface IReportSection {
  title: string;
  content: string;
}

export interface IReportData {
  title: string;
  sections: IReportSection[];
  downloadable: boolean;
  charts: Array<{
    type: string;
    title: string;
    data: IVitalSignsTrend[];
  }>;
  analysis: IAnalysis;
}

export interface IPatientAnalysisResult {
  sections: Array<{
    title: string;
    content: string;
  }>;
  downloadable: boolean;
  charts: Array<{
    type: string;
    title: string;
    data: any;
  }>;
  analysis: IAnalysis;
  riskAnalysis: {
    currentStatus: any;
    medicationImpact: any;
    vitalTrends: any;
    overallRisk: any;
  };
  predictedOutcomes: any;
}
  
export interface IPatient {
  id: string;
  personalInfo: {
    name: string;
    age: number;
    bloodType: string;
    contactInfo: {
      phone: string;
    };
  };
  admission: {
    date: string;
    status: string;
    predictedDischarge: string;
    reason: string;
    bed: {
      number: string;
      wing: string;
    };
  };
  treatment: {
    diagnosis: string[];
    medications: IMedication[];
    procedures: IProcedure[];
    vitals: IVitalSigns[];
  };
  medicalTeam: {
    doctor: {
      name: string;
      id: string;
    };
  };
  aiAnalysis: {
    riskScore: number;
    predictedLOS: number;
    complications: {
      risk: string;
      factors: string[];
    };
    recommendations: string[];
  };
}

// Cognitiva AI Assistant
export interface IPatientData {
    medicalTeam: any;
    personalInfo: {
        id: string;
        name: string;
        age: number;
        gender: string;
        weight?: number;         // em kg
        height?: number;         // em cm
        birthDate: string;
        bloodType?: string;
        contactInfo: {
          phone: string;
        };
    };
    admission: {
      date: string;
      status: string;
      predictedDischarge: string;
      reason: string;
      bed: {
        number: string;
        wing: string;
      };
    };
    treatment: {
        diagnosis: string[];     // lista de diagnósticos
        vitals: IVitalSigns[];    // histórico de sinais vitais
        medications: IMedication[];
        procedures: IProcedure[];
        allergies?: string[];
        notes?: string[];
    };

    aiAnalysis: {
        riskScore: any;
        predictedLOS: any;
        complications: {
        risk: 'Baixo' | 'Médio' | 'Alto';
        factors: string[];
        };
        predictions?: {
        readmissionRisk: number;
        lengthOfStay?: number;
        };
        alerts?: string[];
    };

    insurance?: {
        provider: string;
        plan: string;
        number: string;
        validUntil: string;
    };

    contacts?: {
        emergency: {
        name: string;
        relationship: string;
        phone: string;
        }[];
        primaryPhysician?: {
        name: string;
        specialty: string;
        phone: string;
        };
    };
}

// Interface para sinais vitais
export interface IVitalSigns {
    temperature: number;        // Temperatura em Celsius
    bloodPressure: string;     // Formato "120/80"
    heartRate: number;         // Batimentos por minuto
    oxygenSaturation: number;  // Porcentagem (0-100)
    timestamp: string;         // Data/hora da medição
    consciousness: 'Consciente e Orientado' | 'Consciente e Confuso' | 'Sonolento' | 'Inconsciente';
    painScale: number; // Escala de 0-10
    respiratoryRate: number;
    mobility: 'Independente' | 'Auxílio Parcial' | 'Dependente' | 'Acamado';
}
  
// Interface para medicações
export interface IMedication {
    name: string;              // Nome do medicamento
    dosage: string;           // Dosagem (ex: "500mg")
    frequency: string;        // Frequência (ex: "8/8h")
    route?: string;           // Via de administração (opcional)
    startDate?: string;       // Data de início (opcional)
    endDate?: string;         // Data de término (opcional)
    status: 'active' | 'discontinued' | 'scheduled';
    duration: string
}

// Interface para procedimentos
export interface IProcedure {
    type: string;             // Tipo de procedimento
    description: string;      // Descrição detalhada
    date: string;            // Data do procedimento
    status: 'scheduled' | 'completed' | 'cancelled';
    notes?: string;          // Observações (opcional)
    complications?: string[]; // Possíveis complicações (opcional)
    performer?: string;      // Profissional responsável (opcional)
}

// Interface completa do contexto do paciente
export interface IPatientContext {
    age: number;                    // Idade do paciente
    diagnoses: string[];           // Lista de diagnósticos
    riskLevel: string;             // Nível de risco
    vitals: IVitalSigns | null;            // Sinais vitais
    medications: IMedication[];      // Lista de medicações
    procedures: IProcedure[];        // Lista de procedimentos
}

// Interfaces
export interface IRecommendationFeedback {
    effective: boolean;
    diagnosis: string[];
    age: number;
    riskLevel: string;
    medications: IMedication[];
    procedures: IProcedure[];
    notes: string;
  }

export interface CachedRecommendation {
  recommendations: string[];
  context: PatientContext;
  timestamp: Date;
  score: number;
}

export interface PatientContext {
  age: number;
  diagnoses: string[];
  riskLevel: string;
  vitals: IVitalSigns | null;
  medications: IMedication[];
  procedures: IProcedure[];
}

export interface IKnowledgeBaseEntry {
  condition: string;
  recommendations: string[];
  evidenceLevel: 'A' | 'B' | 'C';
  source: string;
  lastUpdated: Date;
}

export interface IValidationResult {
  isValid: boolean;
  conflicts: string[];
  warnings: string[];
}

export interface ICachedRecommendation {
    recommendations: string[];
    context: IPatientContext;
    timestamp: Date;
    score: number;
}

export interface IRiskAnalysisResult {
    getRecommendations(): Promise<string[]>;
    riskLevel: string;
    riskFactors: string[];
}

// Interface para o serviço de análise de risco
export interface IPatientRiskAnalysis {
    analyzeRisks(context: IPatientContext): Promise<IRiskAnalysisResult>;
}