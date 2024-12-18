/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// types/hospital.ts

interface VitalSignsTrend {
  timestamp: string;
  temperature: number;
  bloodPressure: string;
  heartRate: number;
  oxygenSaturation: number;
}

interface Analysis {
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

interface ReportSection {
  title: string;
  content: string;
}

interface ReportData {
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

interface PatientAnalysisResult {
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
  
interface Patient {
  id: string;
  personalInfo: {
    name: string;
    age: number;
    gender: string;
    bloodType: string;
  };
  treatment: {
    diagnosis: string[];
    vitals: {
      timestamp: string;
      temperature: number;
      bloodPressure: string;
      heartRate: number;
      oxygenSaturation: number;
    }[];
    medications: {
      name: string;
      dosage: string;
      frequency: string;
      duration: string;
      startDate: string;
    }[];
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