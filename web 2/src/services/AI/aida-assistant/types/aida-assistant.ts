/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// types/hospital.ts

export interface VitalSignsTrend {
  timestamp: string;
  temperature: number;
  bloodPressure: string;
  heartRate: number;
  oxygenSaturation: number;
}

export interface CacheResult {
  recommendations: string[];
  context: PatientContext;
  timestamp: Date;
  score: number;
}

export interface PreparedContext {
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

export interface Analysis {
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

export interface ReportSection {
  title: string;
  content: string;
}

export interface ReportData {
  title: string;
  sections: ReportSection[];
  downloadable: boolean;
  charts: Array<{
    type: string;
    title: string;
    data: VitalSignsTrend[];
  }>;
  analysis: Analysis;
}

export interface PatientAnalysisResult {
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
  analysis: Analysis;
  riskAnalysis: {
    currentStatus: any;
    medicationImpact: any;
    vitalTrends: any;
    overallRisk: any;
  };
  predictedOutcomes: any;
}
  
export interface Patient {
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
    medications: Medication[];
    procedures: Procedure[];
    vitals: VitalSigns[];
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

// AIDA Assistant
export interface PatientData {
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
        vitals: VitalSigns[];    // histórico de sinais vitais
        medications: Medication[];
        procedures: Procedure[];
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
export interface VitalSigns {
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
export interface Medication {
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
export interface Procedure {
    type: string;             // Tipo de procedimento
    description: string;      // Descrição detalhada
    date: string;            // Data do procedimento
    status: 'scheduled' | 'completed' | 'cancelled';
    notes?: string;          // Observações (opcional)
    complications?: string[]; // Possíveis complicações (opcional)
    performer?: string;      // Profissional responsável (opcional)
}

// Interface completa do contexto do paciente
export interface PatientContext {
    age: number;                    // Idade do paciente
    diagnoses: string[];           // Lista de diagnósticos
    riskLevel: string;             // Nível de risco
    vitals: VitalSigns | null;            // Sinais vitais
    medications: Medication[];      // Lista de medicações
    procedures: Procedure[];        // Lista de procedimentos
}

// Interfaces
export interface RecommendationFeedback {
    effective: boolean;
    diagnosis: string[];
    age: number;
    riskLevel: string;
    medications: Medication[];
    procedures: Procedure[];
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
  vitals: VitalSigns | null;
  medications: Medication[];
  procedures: Procedure[];
}

export interface KnowledgeBaseEntry {
  condition: string;
  recommendations: string[];
  evidenceLevel: 'A' | 'B' | 'C';
  source: string;
  lastUpdated: Date;
}

export interface ValidationResult {
  isValid: boolean;
  conflicts: string[];
  warnings: string[];
}

export interface CachedRecommendation {
    recommendations: string[];
    context: PatientContext;
    timestamp: Date;
    score: number;
}

export interface RiskAnalysisResult {
    getRecommendations(): Promise<string[]>;
    riskLevel: string;
    riskFactors: string[];
}

// Interface para o serviço de análise de risco
export interface PatientRiskAnalysis {
    analyzeRisks(context: PatientContext): Promise<RiskAnalysisResult>;
}