/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardReport } from "./mediMindAIPatientAssistantFunctions";

import { PatientRiskAnalysis } from "@/services/AI/medimind-ai-assistant/PatientRiskAnalysis";
import { VitalSignsAnalyzer } from "@/services/AI/medimind-ai-assistant/VitalSignsAnalyzer";
import { MedicationAnalyzer } from "@/services/AI/medimind-ai-assistant/MedicationAnalyzer";
import { RecommendationCache } from "@/services/AI/medimind-ai-assistant/RecommendationCache";
import { RecommendationValidator } from "@/services/AI/medimind-ai-assistant/RecommendationValidator";
import { Patient, PatientContext, PatientData, Procedure } from "@/services/AI/medimind-ai-assistant/types/medimind-ai-assistant";
import { ImageGenerationService } from "@/services/AI/medimind-ai-assistant/ImageGenerationService";

class AssistantFuncionalities {
  private static instance: AssistantFuncionalities;
  private baseUrl: string = 'http://localhost:3001';
  private constructor() {}

  public static getInstance(): AssistantFuncionalities {
    if (!AssistantFuncionalities.instance) {
      AssistantFuncionalities.instance = new AssistantFuncionalities();
    }
    return AssistantFuncionalities.instance;
  }

  async getPatientById(patientId: string): Promise<PatientData | null> {
    try {
      const response = await fetch(`${this.baseUrl}/patients/${patientId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();

      return data || null;

    } catch (error) {
      console.error('Erro ao buscar paciente:', error);
      throw error;
    }
  }

  async getAllPatients(): Promise<Patient[]> {
    try {
      const response = await fetch(`${this.baseUrl}/patients`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.patients || [];

      } catch (error) {
        console.error('Erro ao buscar pacientes:', error);
        throw error;
      }
    }
  }

  function preparePatientContext(patientData: PatientData): PatientContext {
    return {
        age: patientData.personalInfo.age,
        diagnoses: patientData.treatment.diagnosis,
        riskLevel: patientData.aiAnalysis.complications.risk,
        vitals: patientData.treatment.vitals.length > 0 
            ? patientData.treatment.vitals[patientData.treatment.vitals.length - 1]
            : null,
        medications: patientData.treatment.medications,
        procedures: patientData.treatment.procedures
    };
  }

  export const funcionalitiesCards: Card[] = [
    {
      icon: '🏥',
      title: 'Gestão de Pacientes',
      description: 'Monitore em tempo real sinais vitais, histórico médico e evolução dos pacientes com IA. Alertas automáticos para alterações críticas.',
      aiHandler: async (patientId: string) => {
        try {
          const response = await fetch(`http://localhost:3001/patients/${patientId}`);
      
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const patient = await response.json();
          const riskAnalyzer = new PatientRiskAnalysis();
          const imageService = new ImageGenerationService();
    
          // Gerar recomendações
          const recommendations = await riskAnalyzer.generateRecommendations(patient);
          
          // Gerar imagens para cada medicamento
          const medicationImages = await Promise.all(
            patient.treatment.medications.map(async (medication: any) => {
              const images = await imageService.generateMedicationImages(medication);
              return {
                medicationId: medication.id,
                ...images
              };
            })
          );
    
          const vitalsAnalysis = VitalSignsAnalyzer.analyzeVitals(patient.treatment.vitals);
          const lastVitals = patient.treatment.vitals[patient.treatment.vitals.length - 1];    
  
          const reportData: CardReport = {
            title: 'Relatório de Análise do Paciente',
            sections: [
              {
                title: 'Informações do Paciente',
                content: `
                  Nome: ${patient.personalInfo.name}
                  ID: ${patient.personalInfo.id}
                  Idade: ${patient.personalInfo.age}
                  Status: ${patient.admission.status}
                  Previsão de Alta: ${patient.admission.predictedDischarge}
                `
              },
              {
                title: 'Sinais Vitais Atuais',
                content:`
                  Temperatura: ${lastVitals.temperature}°C
                  Pressão Arterial: ${lastVitals.bloodPressure}
                  Frequência Cardíaca: ${lastVitals.heartRate} bpm
                  Saturação O2: ${lastVitals.oxygenSaturation}%
                `
              },
              {
                title: 'Análise de Risco',
                content: `
                  Score de Risco: ${patient.aiAnalysis.riskScore}
                  Previsão de Permanência: ${patient.aiAnalysis.predictedLOS} dias
                  Fatores de Risco: ${patient.aiAnalysis.complications.factors.join(', ')}
                `
              },
              {
                title: 'Análise de Sinais Vitais',
                content: vitalsAnalysis.summary
              },
              {
                title: 'Recomendações',
                content: recommendations.join('\n')
              },
              {
                title: 'Medicamentos e Instruções Visuais',
                content: patient.treatment.medications.map((med: any) => {
                  const medImages = medicationImages.find(img => img.medicationId === med.id);
                  return `
                    Medicamento: ${med.name} ${med.dosage}
                    Instruções de Uso: ${medImages}
                    Técnica de Aplicação: ${medImages}
                    Precauções: ${medImages}
                  `;
                }).join('\n\n')
              }
            ],
            downloadable: true,
            charts: [
              {
                type: 'line',
                title: 'Evolução dos Sinais Vitais',
                data: patient.treatment.vitals
              }
            ]
          };
          
          return {
            success: true,
            data: {
              patient,
              analysis: {
                recommendations,
                vitalsAnalysis,
                medicationImages
              },
              lastVitals: patient.treatment.vitals
            },
            report: reportData
          };

  
        } catch (error: any) {
          return {
            success: false,
            error: error.message
          };
        }
      }
    },
    {
      icon: '📋',
      title: 'Prontuário Digital',
      description: 'Acesse e atualize prontuários eletrônicos com histórico completo, exames, prescrições e evolução do tratamento de forma integrada.',
      aiHandler: async (patientId: string) => {
        try {
          const patientService = AssistantFuncionalities.getInstance();
          const patient = await patientService.getPatientById(patientId);
          
          if (!patient) {
            throw new Error('Prontuário não encontrado');
          }
  
          const riskAnalyzer = new PatientRiskAnalysis();
          const context: PatientData = {
            personalInfo: {
              id: patient.personalInfo.id,
              name: patient.personalInfo.name,
              age: patient.personalInfo.age,
              gender: patient.personalInfo.gender,
              weight: patient.personalInfo.weight,
              height: patient.personalInfo.height,
              birthDate: patient.personalInfo.birthDate,
              bloodType: patient.personalInfo.bloodType,
              contactInfo: {
                phone: patient.personalInfo.contactInfo.phone
              }
            },
            treatment: {
              diagnosis: patient.treatment.diagnosis,
              vitals: patient.treatment.vitals,
              medications: patient.treatment.medications,
              procedures: patient.treatment.procedures,
              allergies: patient.treatment.allergies,
              notes: patient.treatment.notes,
            },
            aiAnalysis: {
              complications: {
                risk: patient.aiAnalysis.complications.risk,
                factors: patient.aiAnalysis.complications.factors,
              },
              predictions: patient.aiAnalysis.predictions,
              alerts: patient.aiAnalysis.alerts,
              riskScore: patient.aiAnalysis.riskScore,
              predictedLOS: patient.aiAnalysis.predictedLOS,
            },
            admission: {
              date: patient.admission.date,
              status: patient.admission.status,
              predictedDischarge: patient.admission.predictedDischarge,
              reason: patient.admission.reason,
              bed: {
                number: patient.admission.bed.number,
                wing: patient.admission.bed.wing,
              }
            },
            medicalTeam: patient.medicalTeam,
          };
  
          const recommendations = await riskAnalyzer.generateRecommendations(context);
  
          const reportData: CardReport = {
            title: 'Prontuário Digital Completo',
            sections: [
              {
                title: 'Dados do Paciente',
                content: `
                  Nome: ${patient.personalInfo.name}
                  ID: ${patient.personalInfo.id}
                  Tipo Sanguíneo: ${patient.personalInfo.bloodType}
                  Contato: ${patient.personalInfo.contactInfo.phone}
                `
              },
              {
                title: 'Internação Atual',
                content: `
                  Data: ${patient.admission.date}
                  Motivo: ${patient.admission.reason}
                  Leito: ${patient.admission.bed.number} (${patient.admission.bed.wing})
                  Médico: ${patient.medicalTeam.doctor.name}
                `
              },
              {
                title: 'Diagnósticos e Tratamentos',
                content: `
                  Diagnósticos: ${patient.treatment.diagnosis.join(', ')}
                  Medicações: ${patient.treatment.medications.map(m => 
                    `${m.name} ${m.dosage} ${m.frequency}`
                  ).join('\n')}
                `
              },
              {
                title: 'Procedimentos Realizados',
                content: patient.treatment.procedures.map(p =>
                  `${p.date}: ${p.type} - ${p.notes}`
                ).join('\n')
              },
              {
                title: 'Recomendações da IA',
                content: recommendations.join('\n')
              }
            ],
            downloadable: true
          };
  
          return {
            success: true,
            data: patient,
            report: reportData
          };
        } catch (error: any) {
          return {
            success: false,
            error: error.message
          };
        }
      }
    },
  
    {
      icon: '💊',
      title: 'Gestão de Medicamentos',
      description: 'Controle estoque, validade e dispensação de medicamentos. Alertas de interações medicamentosas e necessidade de reposição.',
      aiHandler: async (patientId: string) => {
        try {
          const patientService = AssistantFuncionalities.getInstance();
          const patient = await patientService.getPatientById(patientId);
          
          if (!patient) {
            throw new Error('Paciente não encontrado');
          }
  
          const riskAnalyzer = new PatientRiskAnalysis();
  
          const context: PatientData = {
            personalInfo: {
              id: patient.personalInfo.id,
              name: patient.personalInfo.name,
              age: patient.personalInfo.age,
              gender: patient.personalInfo.gender,
              weight: patient.personalInfo.weight,
              height: patient.personalInfo.height,
              birthDate: patient.personalInfo.birthDate,
              bloodType: patient.personalInfo.bloodType,
              contactInfo: {
                phone: patient.personalInfo.contactInfo.phone
              }
            },
            treatment: {
              diagnosis: patient.treatment.diagnosis,
              vitals: patient.treatment.vitals,
              medications: patient.treatment.medications,
              procedures: patient.treatment.procedures,
              allergies: patient.treatment.allergies,
              notes: patient.treatment.notes,
            },
            aiAnalysis: {
              complications: {
                risk: patient.aiAnalysis.complications.risk,
                factors: patient.aiAnalysis.complications.factors,
              },
              predictions: patient.aiAnalysis.predictions,
              alerts: patient.aiAnalysis.alerts,
              riskScore: patient.aiAnalysis.riskScore,
              predictedLOS: patient.aiAnalysis.predictedLOS,
            },
            admission: {
              date: patient.admission.date,
              status: patient.admission.status,
              predictedDischarge: patient.admission.predictedDischarge,
              reason: patient.admission.reason,
              bed: {
                number: patient.admission.bed.number,
                wing: patient.admission.bed.wing,
              }
            },
            medicalTeam: patient.medicalTeam,
          };
  
          const medicationAnalysis = MedicationAnalyzer.analyzeMedications(
            patient.treatment.medications
          );
  
          const recommendations = await riskAnalyzer.generateRecommendations(context)
  
          const reportData: CardReport = {
            title: 'Gestão de Medicamentos',
            sections: [
              {
                title: 'Medicações Atuais',
                content: patient.treatment.medications.map(m => `
                  Medicamento: ${m.name}
                  Dosagem: ${m.dosage}
                  Frequência: ${m.frequency}
                  Início: ${m.startDate}
                  Duração: ${m.duration}
                `).join('\n')
              },
              {
                title: 'Análise de Interações',
                content: medicationAnalysis.interactions.map(i => 
                  `${i.medications.join(' + ')}: ${i.severity} - ${i.recommendation}`
                ).join('\n')
              },
              {
                title: 'Ajustes Sugeridos',
                content: medicationAnalysis.adjustments.join('\n')
              },
              {
                title: 'Recomendações',
                content: recommendations.join('\n')
              }
            ],
            downloadable: true,
            charts: [
              {
                type: 'timeline',
                title: 'Cronograma de Medicações',
                data: patient.treatment.medications
              }
            ]
          };
  
          return {
            success: true,
            data: {
              medications: patient.treatment.medications,
              analysis: medicationAnalysis
            },
            report: reportData
          };
        } catch (error: any) {
          return {
            success: false,
            error: error.message
          };
        }
      }
    },
    {
      icon: '🔬',
      title: 'Resultados de Exames',
      description: 'Acesse resultados de exames laboratoriais e de imagem, com análise comparativa e histórico completo do paciente.',
      aiHandler: async (patientId: string) => {
        try {
          const patientService = AssistantFuncionalities.getInstance();
          const patient = await patientService.getPatientById(patientId);
          
          if (!patient) {
            throw new Error('Paciente não encontrado');
          }
  
          const riskAnalyzer = new PatientRiskAnalysis();
  
          const context: PatientData = {
            personalInfo: {
              id: patient.personalInfo.id,
              name: patient.personalInfo.name,
              age: patient.personalInfo.age,
              gender: patient.personalInfo.gender,
              weight: patient.personalInfo.weight,
              height: patient.personalInfo.height,
              birthDate: patient.personalInfo.birthDate,
              bloodType: patient.personalInfo.bloodType,
              contactInfo: {
                phone: patient.personalInfo.contactInfo.phone
              }
            },
            treatment: {
              diagnosis: patient.treatment.diagnosis,
              vitals: patient.treatment.vitals,
              medications: patient.treatment.medications,
              procedures: patient.treatment.procedures,
              allergies: patient.treatment.allergies,
              notes: patient.treatment.notes,
            },
            aiAnalysis: {
              complications: {
                risk: patient.aiAnalysis.complications.risk,
                factors: patient.aiAnalysis.complications.factors,
              },
              predictions: patient.aiAnalysis.predictions,
              alerts: patient.aiAnalysis.alerts,
              riskScore: patient.aiAnalysis.riskScore,
              predictedLOS: patient.aiAnalysis.predictedLOS,
            },
            admission: {
              date: patient.admission.date,
              status: patient.admission.status,
              predictedDischarge: patient.admission.predictedDischarge,
              reason: patient.admission.reason,
              bed: {
                number: patient.admission.bed.number,
                wing: patient.admission.bed.wing,
              }
            },
            medicalTeam: patient.medicalTeam,
          };
  
          const vitalsAnalysis = VitalSignsAnalyzer.analyzeVitals(patient.treatment.vitals);
          const recommendations = await riskAnalyzer.generateRecommendations(context);

          const medicationAnalysis = MedicationAnalyzer.analyzeMedications(
            patient.treatment.medications
          );
  
          // Organizar exames por tipo
          const examsByType = patient.treatment.procedures.reduce((acc: any, proc: Procedure) => {
            if (!acc[proc.type]) acc[proc.type] = [];
            acc[proc.type].push(proc);
            return acc;
          }, {});
  
          const reportData: CardReport = {
            title: 'Gestão de Medicamentos',
            sections: [
              {
                title: 'Medicações Atuais',
                content: patient.treatment.medications.map(m => {
                  return [
                    `Medicamento: ${m.name}`,
                    `Dosagem: ${m.dosage}`,
                    `Frequência: ${m.frequency}`,
                    `Início: ${m.startDate}`,
                    `Duração: ${m.duration}`
                  ].join('\n');
                }).join('\n\n')
              },
              {
                title: 'Análise de Interações',
                content: medicationAnalysis.interactions.map(i => {
                  return `${i.medications.join(' + ')}: ${i.severity} - ${i.recommendation}`;
                }).join('\n')
              },
              {
                title: 'Análise de Sinais Vitais',
                content: vitalsAnalysis.summary
              },
              {
                title: 'Tendências e Alertas',
                content: Object.entries(vitalsAnalysis.trends)
                  .map(([key, value]) => `${key}: ${value}`)
                  .join('\n')
              },
              {
                title: 'Recomendações',
                content: recommendations.join('\n')
              }
            ],
            downloadable: true,
            charts: [
              {
                type: 'line',
                title: 'Evolução dos Sinais Vitais',
                data: patient.treatment.vitals
              },
              {
                type: 'timeline',
                title: 'Histórico de Exames',
                data: patient.treatment.procedures
              }
            ]
          };
  
          return {
            success: true,
            data: {
              examsByType,
              vitalsAnalysis,
              recommendations
            },
            report: reportData
          };
        } catch (error: any) {
          return {
            success: false,
            error: error.message
          };
        }
      }
    },
    {
      icon: '⚕️',
      title: 'Suporte à Decisão Clínica',
      description: 'Recomendações baseadas em evidências para diagnósticos e tratamentos, utilizando IA para análise de casos similares.',
      aiHandler: async (patientId: string) => {
        try {
          const patientService = AssistantFuncionalities.getInstance();
          const patient = await patientService.getPatientById(patientId);

          console.log(`Chamou o paciente: ${patientId} - ${patient}`)
          
          if (!patient) {
            throw new Error('Paciente não encontrado');
          }
  
          const riskAnalyzer = new PatientRiskAnalysis();
  
          const context: PatientData = {
            personalInfo: {
              id: patient.personalInfo.id,
              name: patient.personalInfo.name,
              age: patient.personalInfo.age,
              gender: patient.personalInfo.gender,
              weight: patient.personalInfo.weight,
              height: patient.personalInfo.height,
              birthDate: patient.personalInfo.birthDate,
              bloodType: patient.personalInfo.bloodType,
              contactInfo: {
                phone: patient.personalInfo.contactInfo.phone
              }
            },
            treatment: {
              diagnosis: patient.treatment.diagnosis,
              vitals: patient.treatment.vitals,
              medications: patient.treatment.medications,
              procedures: patient.treatment.procedures,
              allergies: patient.treatment.allergies,
              notes: patient.treatment.notes,
            },
            aiAnalysis: {
              complications: {
                risk: patient.aiAnalysis.complications.risk,
                factors: patient.aiAnalysis.complications.factors,
              },
              predictions: patient.aiAnalysis.predictions,
              alerts: patient.aiAnalysis.alerts,
              riskScore: patient.aiAnalysis.riskScore,
              predictedLOS: patient.aiAnalysis.predictedLOS,
            },
            admission: {
              date: patient.admission.date,
              status: patient.admission.status,
              predictedDischarge: patient.admission.predictedDischarge,
              reason: patient.admission.reason,
              bed: {
                number: patient.admission.bed.number,
                wing: patient.admission.bed.wing,
              }
            },
            medicalTeam: patient.medicalTeam,
          };
  
          // Análises paralelas
          const [recommendations, medicationAnalysis, vitalsAnalysis] = await Promise.all([
            riskAnalyzer.generateRecommendations(context),
            MedicationAnalyzer.analyzeMedications(patient.treatment.medications),
            VitalSignsAnalyzer.analyzeVitals(patient.treatment.vitals)
          ]);
  
          // Validação das recomendações
          const validationResult = RecommendationValidator.validate(recommendations, context as any);
  
          // Cache de recomendações
          if (validationResult.isValid) {
            const patientContext = preparePatientContext(context);
            const cache = new RecommendationCache();
            cache.set(cache.generateKey(patientContext), {
                recommendations,
                context: patientContext,
                timestamp: new Date(),
                score: 1.0
            });
          }
  
          const reportData: CardReport = {
            title: 'Suporte à Decisão Clínica',
            sections: [
              {
                title: 'Análise do Caso',
                content: `
                  Diagnósticos: ${patient.treatment.diagnosis.join(', ')}
                  Score de Risco: ${patient.aiAnalysis.riskScore}
                  Tempo Previsto: ${patient.aiAnalysis.predictedLOS} dias
                  ${'-'.repeat(40)}
                  Fatores de Risco:
                  ${patient.aiAnalysis.complications.factors.map(f => `- ${f}`).join('\n')}
                `
              },
              {
                title: 'Recomendações Validadas',
                content: `
                  ${recommendations.join('\n')}
                  ${'-'.repeat(40)}
                  Confiança: ${validationResult.isValid ? 'Alta' : 'Requer Revisão'}
                  ${validationResult.conflicts.length > 0 ? 
                    `Conflitos:\n${validationResult.conflicts.join('\n')}` : 
                    'Sem conflitos identificados'}
                `
              },
              {
                title: 'Análise de Medicações',
                content: medicationAnalysis.summary
              },
              {
                title: 'Análise de Sinais Vitais',
                content: vitalsAnalysis.summary
              }
            ],
            downloadable: true,
            charts: [
              {
                type: 'radar',
                title: 'Indicadores de Risco',
                data: {
                  clinical: patient.aiAnalysis.riskScore * 100,
                  medication: medicationAnalysis.riskScore,
                  vitals: vitalsAnalysis.risk
                }
              }
            ]
          };

          console.log(reportData)
  
          return {
            success: true,
            data: {
              analysis: {
                recommendations,
                medicationAnalysis,
                vitalsAnalysis,
                validation: validationResult
              },
              context
            },
            report: reportData
          };
        } catch (error: any) {
          return {
            success: false,
            error: error.message
          };
        }
      }
    },
    {
      icon: '⚕️',
      title: 'Suporte à Decisão Clínica',
      description: 'Recomendações baseadas em evidências para diagnósticos e tratamentos, utilizando IA para análise de casos similares.',
      aiHandler: async (patientId: string) => {
        try {
          const patientService = AssistantFuncionalities.getInstance();
          const patient = await patientService.getPatientById(patientId);

          console.log(`Chamou o paciente: ${patientId} - ${patient}`)
          
          if (!patient) {
            throw new Error('Paciente não encontrado');
          }
    
          // Análise de sinais vitais
          const vitalsAnalysis = VitalSignsAnalyzer.analyzeVitals(patient.treatment.vitals);
    
          // Análise de medicações
          const medicationAnalysis = MedicationAnalyzer.analyzeMedications(
            patient.treatment.medications,
            {
              age: patient.personalInfo.age,
              vitals: patient.treatment.vitals[patient.treatment.vitals.length - 1],
              diagnoses: patient.treatment.diagnosis,
              riskLevel: patient.aiAnalysis.complications.risk,
              medications: patient.treatment.medications,
              procedures: patient.treatment.procedures
            }
          );

          // Criar contexto para recomendações
          const context: PatientData = {
            personalInfo: {
              id: patient.personalInfo.id,
              name: patient.personalInfo.name,
              age: patient.personalInfo.age,
              gender: patient.personalInfo.gender,
              weight: patient.personalInfo.weight,
              height: patient.personalInfo.height,
              birthDate: patient.personalInfo.birthDate,
              bloodType: patient.personalInfo.bloodType,
              contactInfo: {
                phone: patient.personalInfo.contactInfo.phone
              }
            },
            treatment: {
              diagnosis: patient.treatment.diagnosis,
              vitals: patient.treatment.vitals,
              medications: patient.treatment.medications,
              procedures: patient.treatment.procedures,
              allergies: patient.treatment.allergies,
              notes: patient.treatment.notes,
            },
            aiAnalysis: {
              complications: {
                risk: patient.aiAnalysis.complications.risk,
                factors: patient.aiAnalysis.complications.factors,
              },
              predictions: patient.aiAnalysis.predictions,
              alerts: patient.aiAnalysis.alerts,
              riskScore: patient.aiAnalysis.riskScore,
              predictedLOS: patient.aiAnalysis.predictedLOS,
            },
            admission: {
              date: patient.admission.date,
              status: patient.admission.status,
              predictedDischarge: patient.admission.predictedDischarge,
              reason: patient.admission.reason,
              bed: {
                number: patient.admission.bed.number,
                wing: patient.admission.bed.wing,
              }
            },
            medicalTeam: patient.medicalTeam,
          };
    
          // Gerar recomendações
          const riskAnalyzer = new PatientRiskAnalysis();
          const recommendations = await riskAnalyzer.generateRecommendations(context);
    
          // Calcular scores de risco
          const riskScores = {
            clinical: vitalsAnalysis.risk === 'high' ? 75 : vitalsAnalysis.risk === 'medium' ? 50 : 25,
            medication: medicationAnalysis.riskScore * 25, // Normalizar para escala de 0-100
            readmission: recommendations.some(r => r.includes('readmissão')) ? 75 : 25
          };
    
          const reportData: CardReport = {
            title: 'Suporte à Decisão Clínica',
            sections: [
              {
                title: 'Análise do Caso',
                content: `
                  Diagnósticos Atuais: ${patient.treatment.diagnosis.join(', ')}
                  ${'-'.repeat(40)}
                  Análise de Sinais Vitais:
                  ${vitalsAnalysis.summary}
                  ${'-'.repeat(40)}
                  Análise de Medicações:
                  ${medicationAnalysis.summary}
                `
              },
              {
                title: 'Recomendações Clínicas',
                content: `
                  Prioridades:
                  ${recommendations.map(r => `- ${r}`).join('\n')}
                  ${'-'.repeat(40)}
                  Monitoramento Sugerido:
                  - Frequência de verificação de sinais vitais: ${
                    vitalsAnalysis.risk === 'high' ? '2h' : 
                    vitalsAnalysis.risk === 'medium' ? '4h' : '6h'
                  }
                  - Exames laboratoriais de controle: ${
                    vitalsAnalysis.risk === 'high' ? 'Diário' : 
                    vitalsAnalysis.risk === 'medium' ? 'A cada 48h' : 'A cada 72h'
                  }
                `
              },
              {
                title: 'Alertas e Considerações',
                content: `
                  Alertas de Sinais Vitais:
                  ${vitalsAnalysis.alerts.map(a => `- ${a}`).join('\n')}
                  ${'-'.repeat(40)}
                  Interações Medicamentosas:
                  ${medicationAnalysis.interactions.map(i => 
                    `- ${i.medications.join(' + ')}: ${i.severity} - ${i.recommendation}`
                  ).join('\n')}
                  ${'-'.repeat(40)}
                  Ajustes Sugeridos:
                  ${medicationAnalysis.adjustments.map(a => `- ${a}`).join('\n')}
                `
              }
            ],
            downloadable: true,
            charts: [
              {
                type: 'radar',
                title: 'Scores de Risco',
                data: riskScores
              },
              {
                type: 'timeline',
                title: 'Evolução do Tratamento',
                data: patient.treatment.procedures
              }
            ]
          };

          console.log(reportData)
    
          return {
            success: true,
            data: {
              patient,
              vitalsAnalysis,
              medicationAnalysis,
              recommendations,
              riskScores
            },
            report: reportData
          };
        } catch (error: any) {
          return {
            success: false,
            error: error.message
          };
        }
      }
    }
];