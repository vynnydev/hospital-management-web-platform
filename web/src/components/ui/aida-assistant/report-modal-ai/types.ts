/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ReportModalData {
    success: boolean;
    raw: {
      data: {
        analysis: {
          recommendations: string[];
          vitalsAnalysis: {
            alerts: any[];
            risk: string;
            summary: string;
            trends: {
              status: string;
            };
          };
          medicationImages: {
            [medicationId: string]: MedicationImages;
          };
        };
        lastVitals: Array<{
          timestamp: string;
          temperature: number;
          bloodPressure: string;
          heartRate: number;
          oxygenSaturation: number;
        }>;
        patient: {
          admission: {
            date: string;
            reason: string;
            type: string;
            status: string;
            predictedDischarge: string;
          };
          aiAnalysis: {
            riskScore: number;
            predictedLOS: number;
            complications: any[];
            recommendations: any[];
          };
          id: string;
          medicalTeam: {
            doctor: any[];
            nurses: any[];
          };
          personalInfo: {
            name: string;
            age: number;
            gender: string;
            bloodType: string;
            photo: string;
          };
          qrCode: string;
          treatment: {
            diagnosis: string[];
            medications: Array<{
              name: string;
              dosage: string;
              frequency: string;
              duration: string;
              startDate: string;
              endDate?: string;
              route?: string;
              status?: string;
            }>;
            vitals: any[];
            procedures: any[];
          };
        };
      };
    }
    report: {
      charts: any[];
      downloadable: boolean;
      sections: Array<{
        title: string;
        content: string;
      }>;
    };
}

export interface MedicationImages {
  usage: string;
  application: string;
  precaution: string;
}
  
export interface VitalSignCardProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    normal: string;
    status: 'normal' | 'warning' | 'critical';
}
  
export interface VitalsAnalysis {
    lastReadings?: {
      temperature?: string | null;
      pressure?: string | null;
      heartRate?: string | null;
      saturation?: string | null;
    } | null;
    alerts?: string[] | null;
    risk: 'low' | 'moderate' | 'high';
    summary?: string | null;
}
  
export interface VitalReading {
    label: string;
    value: string | null | undefined;
    reference: string;
}
  
  // Interface para funcionalidade de recomendações de tratamento médico
export interface MedicationInstructions {
    visual?: {
      imageUrl?: string;
      steps?: {
        description: string;
        image?: string;
      }[];
    };
    instructions?: string[];
    warnings?: string[];
    aiRecommendations?: {
      nurseProcedures?: string[];
      technicalProcedures?: string[];
      additionalCare?: string[];
    };
}
  
export interface MedicationCardProps {
    medication: {
      name: string;
      dosage: string;
      frequency: string;
      duration: string;
      startDate: string;
      endDate?: string;
      route?: string;
      status?: string;
      instructions?: string[];
      warnings?: string[];
      aiRecommendations?: {
        nurseProcedures?: string[];
        technicalProcedures?: string[];
        additionalCare?: string[];
      };
    };
    images?: MedicationImages;
}
  
export interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: ReportModalData;
}

export interface ReportModalComponentsProps {
  data: ReportModalData;
}

// Interfaces para a impressão
export interface PrintData {
  data: ReportModalData;
  vitalsData: {
    temperature: string;
    pressure: string;
    heartRate: string;
    saturation: string;
  };
  medications: any[];
  processedImages: {
    usage: string;
    application: string;
    precaution: string;
  };
}

// Botões do ReportModal
export interface ActionButton {
  icon: React.ReactNode;
  tooltip: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
}