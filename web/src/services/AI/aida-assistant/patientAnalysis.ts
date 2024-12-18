/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { load } from '@tensorflow-models/universal-sentence-encoder';
import * as tf from '@tensorflow/tfjs';

interface VitalSigns {
  temperature: number;
  bloodPressure: string;
  heartRate: number;
  oxygenSaturation: number;
  timestamp: string;
}

interface PatientData {
  id: string;
  personalInfo: {
    age: number;
    gender: string;
    bloodType: string;
  };
  admission: {
    reason: string;
    type: string;
    predictedDischarge: string;
  };
  treatment: {
    diagnosis: string[];
    medications: {
      name: string;
      dosage: string;
      frequency: string;
    }[];
    vitals: VitalSigns[];
    procedures: {
      type: string;
      notes: string;
    }[];
  };
  aiAnalysis: {
    riskScore: number;
    complications: {
      risk: string;
      factors: string[];
    };
  };
}

interface TrendAnalysis {
    trend: string;
    trends: {
      temperature: string;
      oxygenSaturation: string;
      heartRate: string;
    };
    analysis: string;
}

interface Medication {
    name: string;
    dosage: string;
    frequency: string;
  }
  
const knownInteractions = {
    warfarin: ['omeprazole', 'simvastatin', 'erythromycin'],
    omeprazole: ['warfarin', 'clopidogrel'],
    simvastatin: ['warfarin', 'erythromycin']
} as { [key: string]: string[] };

function checkMedicationInteractions(medications: Medication[]): string[] {
    const interactions: string[] = [];
  
    for (let i = 0; i < medications.length; i++) {
      const med1 = medications[i];
      
      for (let j = i + 1; j < medications.length; j++) {
        const med2 = medications[j];
        
        if (knownInteractions[med1.name]?.includes(med2.name) || 
            knownInteractions[med2.name]?.includes(med1.name)) {
          interactions.push(`Possível interação entre ${med1.name} e ${med2.name}`);
        }
      }
    }
  
    return interactions;
}

export class PatientRiskAnalysis {
  private model: any;
  private readonly VITAL_THRESHOLDS = {
    temperature: { min: 36, max: 37.5 },
    systolicBP: { min: 90, max: 140 },
    diastolicBP: { min: 60, max: 90 },
    heartRate: { min: 60, max: 100 },
    oxygenSaturation: { min: 95, max: 100 }
  };

  constructor() {
    this.initializeModel();
  }

  private async initializeModel() {
    this.model = await load();
  }
  
  private analyzeDosages(medications: PatientData['treatment']['medications']): string[] {
    const dosageIssues: string[] = [];
    const standardDosages: { [key: string]: { min: number; max: number; unit: string } } = {
      'paracetamol': { min: 500, max: 1000, unit: 'mg' },
      'ibuprofeno': { min: 200, max: 800, unit: 'mg' },
      'omeprazol': { min: 20, max: 40, unit: 'mg' },
    };
  
    medications.forEach(med => {
      const medName = med.name.toLowerCase();
      if (standardDosages[medName]) {
        const dosageNum = parseFloat(med.dosage);
        const standard = standardDosages[medName];
        
        if (dosageNum < standard.min) {
          dosageIssues.push(`${med.name}: dosagem abaixo do recomendado`);
        } else if (dosageNum > standard.max) {
          dosageIssues.push(`${med.name}: dosagem acima do recomendado`);
        }
      }
    });
  
    return dosageIssues;
  }
  
  private getMedicationAdjustments(medications: PatientData['treatment']['medications']): string[] {
    const adjustments: string[] = [];
    const dosageIssues = this.analyzeDosages(medications);
    
    dosageIssues.forEach(issue => {
      if (issue.includes('abaixo')) {
        adjustments.push(`Considerar aumento de dosagem: ${issue}`);
      } else if (issue.includes('acima')) {
        adjustments.push(`Considerar redução de dosagem: ${issue}`);
      }
    });
  
    return adjustments;
  }
  
  private calculateVitalTrend(vitals: VitalSigns[]): string {
    if (vitals.length < 2) return 'dados insuficientes';
  
    const trends = {
      temperature: this.calculateTrendLine(vitals.map(v => v.temperature)),
      heartRate: this.calculateTrendLine(vitals.map(v => v.heartRate)),
      oxygenSaturation: this.calculateTrendLine(vitals.map(v => v.oxygenSaturation))
    };
  
    // Análise combinada das tendências
    const trendValues = Object.values(trends);
    if (trendValues.every(t => t === 'stable')) return 'estável';
    if (trendValues.some(t => t === 'increasing')) return 'deteriorando';
    if (trendValues.some(t => t === 'decreasing')) return 'melhorando';
    
    return 'variável';
  }
  
  private interpretTrends(trends: { [key: string]: string }): string {
    const interpretations: string[] = [];
  
    if (trends.temperature === 'increasing') {
      interpretations.push('Tendência de aumento da temperatura - monitorar febre');
    }
    if (trends.oxygenSaturation === 'decreasing') {
      interpretations.push('Tendência de queda na saturação - avaliar suporte de O2');
    }
    if (trends.heartRate === 'increasing') {
      interpretations.push('Tendência de taquicardia - avaliar causa');
    }
  
    return interpretations.join('; ') || 'Sinais vitais estáveis';
  }
  
  private analyzeAgeRisk(age: number): string[] {
    const risks: string[] = [];
    
    if (age >= 65) {
      risks.push('Idade avançada - risco aumentado de complicações');
    }
    if (age >= 80) {
      risks.push('Idade muito avançada - risco alto de fragilidade');
    }
    if (age < 12) {
      risks.push('Paciente pediátrico - necessita atenção especial');
    }
  
    return risks;
  }
  
  private analyzeDiagnosisRisk(diagnoses: string[]): string[] {
    const highRiskConditions = [
      'pneumonia',
      'sepse',
      'infarto',
      'avc',
      'insuficiência cardíaca',
      'covid-19'
    ];
  
    return diagnoses
      .filter(diagnosis => 
        highRiskConditions.some(condition => 
          diagnosis.toLowerCase().includes(condition)
        )
      )
      .map(diagnosis => `Condição de alto risco: ${diagnosis}`);
  }
  
  private analyzeProcedureRisk(procedures: PatientData['treatment']['procedures']): string[] {
    const highRiskProcedures = [
      'cirurgia',
      'intubação',
      'biópsia',
      'cateterismo'
    ];
  
    return procedures
      .filter(procedure => 
        highRiskProcedures.some(risk => 
          procedure.type.toLowerCase().includes(risk)
        )
      )
      .map(procedure => `Procedimento de alto risco: ${procedure.type}`);
  }
  
  private async calculateOverallRiskScore(riskFactors: string[]): Promise<number> {
    // Pesos para diferentes tipos de riscos
    const weights = {
      age: 0.3,
      diagnosis: 0.4,
      procedure: 0.3
    };
  
    const ageRisks = riskFactors.filter(risk => risk.includes('Idade')).length;
    const diagnosisRisks = riskFactors.filter(risk => risk.includes('Condição')).length;
    const procedureRisks = riskFactors.filter(risk => risk.includes('Procedimento')).length;
  
    const score = 
      (ageRisks * weights.age) +
      (diagnosisRisks * weights.diagnosis) +
      (procedureRisks * weights.procedure);
  
    return Math.min(score, 1); // Normaliza para máximo de 1
  }
  
  private generateRiskMitigationStrategies(riskFactors: string[]): string[] {
    const strategies: string[] = [];
  
    riskFactors.forEach(risk => {
      if (risk.includes('Idade')) {
        strategies.push('Implementar protocolos geriátricos de prevenção de quedas');
        strategies.push('Avaliar fragilidade e reserva funcional');
      }
      if (risk.includes('Condição')) {
        strategies.push('Intensificar monitoramento de sinais vitais');
        strategies.push('Considerar avaliação por especialista');
      }
      if (risk.includes('Procedimento')) {
        strategies.push('Realizar avaliação pré-procedimento detalhada');
        strategies.push('Preparar recursos para possíveis complicações');
      }
    });
  
    return Array.from(new Set(strategies)); // Remove duplicatas usando Array.from
  }
  
  private extractPredictionFeatures(patientData: PatientData): number[] {
    const age = patientData.personalInfo.age;
    const diagnosisCount = patientData.treatment.diagnosis.length;
    const procedureCount = patientData.treatment.procedures.length;
    const medicationCount = patientData.treatment.medications.length;
    
    const latestVitals = patientData.treatment.vitals[patientData.treatment.vitals.length - 1];
    const systolicBP = parseInt(latestVitals.bloodPressure.split('/')[0]);
  
    return [
      age,
      diagnosisCount,
      procedureCount,
      medicationCount,
      latestVitals.temperature,
      systolicBP,
      latestVitals.heartRate,
      latestVitals.oxygenSaturation
    ];
  }
  
  private async predictLengthOfStay(features: tf.Tensor2D): Promise<number> {
    const prediction = await this.model.predict(features);
    const days = Math.round(prediction.dataSync()[0]);
    return Math.max(1, days); // Mínimo de 1 dia
  }
  
  private async predictComplications(features: tf.Tensor2D): Promise<{
    risk: string;
    probability: number;
  }> {
    const prediction = await this.model.predict(features);
    const probability = prediction.dataSync()[0];
    
    return {
      risk: this.getRiskLevel(probability),
      probability
    };
  }
  
  private calculateRecoveryTrajectory(patientData: PatientData): string {
    const vitals = patientData.treatment.vitals;
    const vitalTrends = this.analyzeTrends(vitals);
    
    if (vitalTrends.trend === 'insufficient-data') {
      return 'Dados insuficientes para previsão';
    }
  
    // Agora podemos acessar trends de forma segura
    const trendValues = Object.values(vitalTrends.trends);
    const hasImprovement = trendValues.some(trend => trend === 'decreasing');
    const hasDeterioration = trendValues.some(trend => trend === 'increasing');
  
    if (hasImprovement && !hasDeterioration) {
      return 'Recuperação favorável';
    } else if (hasDeterioration && !hasImprovement) {
      return 'Recuperação desfavorável';
    }
    
    return 'Recuperação estável';
  }

  async analyzePatient(patientData: PatientData) {
    const vitalSignsAnalysis = await this.analyzeVitalSigns(patientData.treatment.vitals);
    const medicationAnalysis = this.analyzeMedications(patientData.treatment.medications);
    const trendAnalysis = this.analyzeTrends(patientData.treatment.vitals);
    const riskAssessment = await this.assessOverallRisk(patientData);
  
    // Criando o objeto analysis que será usado no template
    const analysis = {
      // Nível de risco baseado na avaliação geral
      riskLevel: riskAssessment.level,
      
      // Tendência geral do paciente
      trend: trendAnalysis.trend,
      
      // Alertas combinados de várias fontes
      alerts: [
        ...vitalSignsAnalysis.abnormalities,
        ...medicationAnalysis.interactions,
        ...riskAssessment.factors
      ],
      
      // Recomendações baseadas em todas as análises
      recommendations: this.generateComprehensiveRecommendations(
        vitalSignsAnalysis,
        medicationAnalysis,
        riskAssessment,
        patientData
      ),
      
      // Tendência dos sinais vitais ao longo do tempo
      vitalSignsTrend: patientData.treatment.vitals.map(vital => ({
        timestamp: vital.timestamp,
        temperature: vital.temperature,
        bloodPressure: vital.bloodPressure,
        heartRate: vital.heartRate,
        oxygenSaturation: vital.oxygenSaturation
      }))
    };
  
    return {
      patientId: patientData.id,
      riskAnalysis: {
        currentStatus: vitalSignsAnalysis,
        medicationImpact: medicationAnalysis,
        vitalTrends: trendAnalysis,
        overallRisk: riskAssessment
      },
      // Incluindo o objeto analysis no retorno
      analysis: analysis,
      predictedOutcomes: await this.predictOutcomes(patientData)
    };
  }

  async analyzeVitalSigns(vitals: VitalSigns[]): Promise<{
    riskLevel: string;
    abnormalities: string[];
    trend: string;
  }> {
    const latestVitals = vitals[vitals.length - 1];
    const abnormalities: string[] = [];

    // Análise de temperatura
    if (latestVitals.temperature > this.VITAL_THRESHOLDS.temperature.max) {
      abnormalities.push(`Temperatura elevada: ${latestVitals.temperature}°C`);
    }

    // Análise de pressão arterial
    const [systolic, diastolic] = latestVitals.bloodPressure.split('/').map(Number);
    if (systolic > this.VITAL_THRESHOLDS.systolicBP.max) {
      abnormalities.push(`Pressão sistólica elevada: ${systolic}mmHg`);
    }

    // Análise de saturação
    if (latestVitals.oxygenSaturation < this.VITAL_THRESHOLDS.oxygenSaturation.min) {
      abnormalities.push(`Saturação baixa: ${latestVitals.oxygenSaturation}%`);
    }

    const riskScore = await this.calculateVitalRiskScore(latestVitals);

    return {
      riskLevel: this.getRiskLevel(riskScore),
      abnormalities,
      trend: this.calculateVitalTrend(vitals)
    };
  }

  private analyzeMedications(medications: PatientData['treatment']['medications']) {
    const medicationInteractions = checkMedicationInteractions(medications)
    const dosageAnalysis = this.analyzeDosages(medications);

    return {
      interactions: medicationInteractions,
      dosageIssues: dosageAnalysis,
      recommendedAdjustments: this.getMedicationAdjustments(medications)
    };
  }

  private determineTrendDirection(trends: { [key: string]: string }): string {
    const trendValues = Object.values(trends);
    if (trendValues.every(t => t === 'stable')) return 'stable';
    if (trendValues.some(t => t === 'increasing')) return 'deteriorating';
    if (trendValues.some(t => t === 'decreasing')) return 'improving';
    return 'variable';
  }

  private analyzeTrends(vitals: VitalSigns[]): TrendAnalysis {
    if (vitals.length < 2) return { 
      trend: 'insufficient-data',
      trends: {
        temperature: 'insufficient-data',
        oxygenSaturation: 'insufficient-data',
        heartRate: 'insufficient-data'
      },
      analysis: 'Dados insuficientes para análise'
    };
  
    const trends = {
      temperature: this.calculateTrendLine(vitals.map(v => v.temperature)),
      oxygenSaturation: this.calculateTrendLine(vitals.map(v => v.oxygenSaturation)),
      heartRate: this.calculateTrendLine(vitals.map(v => v.heartRate))
    };
  
    return {
      trend: this.determineTrendDirection(trends),
      trends: trends,
      analysis: this.interpretTrends(trends)
    };
  }

  private async assessOverallRisk(patientData: PatientData) {
    const riskFactors = [
      ...this.analyzeAgeRisk(patientData.personalInfo.age),
      ...this.analyzeDiagnosisRisk(patientData.treatment.diagnosis),
      ...this.analyzeProcedureRisk(patientData.treatment.procedures)
    ];

    const riskScore = await this.calculateOverallRiskScore(riskFactors);

    return {
      score: riskScore,
      level: this.getRiskLevel(riskScore),
      factors: riskFactors,
      mitigationStrategies: this.generateRiskMitigationStrategies(riskFactors)
    };
  }

  private async predictOutcomes(patientData: PatientData) {
    const features = this.extractPredictionFeatures(patientData);
    const tensor = tf.tensor2d([features]);
    
    return {
      estimatedLOS: await this.predictLengthOfStay(tensor),
      complicationRisk: await this.predictComplications(tensor),
      recoveryTrajectory: this.calculateRecoveryTrajectory(patientData)
    };
  }

  private calculateTrendLine(values: number[]): string {
    if (values.length < 2) return 'stable';
    
    const lastThree = values.slice(-3);
    const average = lastThree.reduce((a, b) => a + b) / lastThree.length;
    const firstAverage = values.slice(0, 3).reduce((a, b) => a + b) / 3;

    if (average > firstAverage * 1.1) return 'increasing';
    if (average < firstAverage * 0.9) return 'decreasing';
    return 'stable';
  }

  private generateComprehensiveRecommendations(
    vitalAnalysis: any,
    medicationAnalysis: any,
    riskAssessment: any,
    patientData: PatientData
  ): string[] {
    const recommendations: string[] = [];

    // Recomendações baseadas em sinais vitais
    if (vitalAnalysis.abnormalities.length > 0) {
      recommendations.push(
        ...vitalAnalysis.abnormalities.map((abnormality: any) => 
          `Monitorar ${abnormality} com maior frequência`)
      );
    }

    // Recomendações baseadas em medicações
    if (medicationAnalysis.dosageIssues.length > 0) {
      recommendations.push(
        ...medicationAnalysis.recommendedAdjustments
      );
    }

    // Recomendações baseadas no risco geral
    if (riskAssessment.level === 'Alto') {
      recommendations.push(
        'Considerar avaliação da equipe multidisciplinar',
        'Aumentar frequência de monitoramento'
      );
    }

    return recommendations;
  }

  private getRiskLevel(score: number): string {
    if (score > 0.7) return 'Alto';
    if (score > 0.4) return 'Médio';
    return 'Baixo';
  }

  private async calculateVitalRiskScore(vitals: VitalSigns): Promise<number> {
    const vitalArray = [
      vitals.temperature,
      parseInt(vitals.bloodPressure.split('/')[0]),
      vitals.heartRate,
      vitals.oxygenSaturation
    ];

    const normalizedVitals = tf.tensor2d([vitalArray]);
    const prediction = await this.model.predict(normalizedVitals);
    return prediction.dataSync()[0];
  }

  async checkMedicationInteractions(medications: Medication[]): Promise<string[]> {
    const interactions: string[] = [];
    
    // Verifica interações diretas
    for (let i = 0; i < medications.length; i++) {
      const med1 = medications[i];
      
      for (let j = i + 1; j < medications.length; j++) {
        const med2 = medications[j];
        
        // Verifica no banco de dados de interações conhecidas
        if (knownInteractions[med1.name.toLowerCase()]?.includes(med2.name.toLowerCase()) || 
            knownInteractions[med2.name.toLowerCase()]?.includes(med1.name.toLowerCase())) {
          interactions.push(`Interação medicamentosa detectada: ${med1.name} + ${med2.name}`);
        }
      }
    }
  
    // Análise de risco combinado
    const riskGroups = {
      anticoagulantes: ['warfarin', 'heparin', 'clopidogrel'],
      antibioticos: ['amoxicillin', 'azithromycin', 'ciprofloxacin'],
      antiInflamatorios: ['ibuprofen', 'naproxen', 'aspirin']
    };
  
    const patientMedGroups = medications.reduce((groups: any, med) => {
      Object.entries(riskGroups).forEach(([group, meds]) => {
        if (meds.includes(med.name.toLowerCase())) {
          groups[group] = [...(groups[group] || []), med.name];
        }
      });
      return groups;
    }, {});
  
    // Adiciona alertas para combinações de grupos de risco
    if (patientMedGroups.anticoagulantes && patientMedGroups.antiInflamatorios) {
      interactions.push('Alerta: Combinação de anticoagulantes e anti-inflamatórios - risco aumentado de sangramento');
    }
  
    return interactions;
  }

  async compareExamHistory(examHistory: any[]): Promise<any[]> {
    const comparisons = [];
    
    // Agrupa exames por tipo
    const examsByType = examHistory.reduce((groups: any, exam) => {
      const type = exam.test;
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push({
        value: parseFloat(exam.value),
        date: new Date(exam.date),
        reference: exam.reference
      });
      return groups;
    }, {});
  
    // Analisa tendências para cada tipo de exame
    for (const [type, exams] of Object.entries(examsByType)) {
      const sortedExams = (exams as any[]).sort((a, b) => a.date.getTime() - b.date.getTime());
      const latestExam = sortedExams[sortedExams.length - 1];
      const previousExam = sortedExams[sortedExams.length - 2];
  
      if (previousExam) {
        const change = ((latestExam.value - previousExam.value) / previousExam.value) * 100;
        const trend = this.determineTrend(change);
        
        comparisons.push({
          test: type,
          currentValue: latestExam.value,
          previousValue: previousExam.value,
          changePercentage: change.toFixed(2),
          trend,
          reference: latestExam.reference,
          analysis: this.analyzeExamChange(type, change, latestExam.value, latestExam.reference)
        });
      }
    }
  
    return comparisons;
  }
  
  private determineTrend(change: number): string {
    if (change > 5) return 'increasing';
    if (change < -5) return 'decreasing';
    return 'stable';
  }
  
  private analyzeExamChange(type: string, change: number, value: number, reference: any): string {
    let analysis = '';
    
    if (Math.abs(change) > 20) {
      analysis += `Variação significativa de ${change.toFixed(1)}%. `;
    }
  
    if (reference) {
      const [min, max] = reference.split('-').map(parseFloat);
      if (value < min) {
        analysis += 'Valor abaixo da referência. ';
      } else if (value > max) {
        analysis += 'Valor acima da referência. ';
      }
    }
  
    return analysis || 'Dentro dos parâmetros esperados';
  }

  async analyzeSimilarCases(cases: any[]): Promise<any[]> {
    const analyzedCases = [];
    
    for (const case_ of cases) {
      // Calcula score de similaridade
      const similarityScore = await this.calculateSimilarityScore(case_);
      
      // Analisa resultados e desfechos
      const outcomeAnalysis = this.analyzeOutcome(case_);
      
      // Extrai lições aprendidas e recomendações
      const learnings = this.extractLearnings(case_);
      
      analyzedCases.push({
        caseId: case_.id,
        similarity: similarityScore,
        outcome: outcomeAnalysis,
        keyLearnings: learnings,
        relevance: this.calculateRelevance(similarityScore, case_.date)
      });
    }
  
    // Ordena por relevância e retorna os mais relevantes
    return analyzedCases
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 5);
  }
  
  private async calculateSimilarityScore(case_: any): Promise<number> {
    // Implementa lógica de similaridade usando TensorFlow.js
    const features = [
      case_.patientAge,
      case_.diagnosis.length,
      case_.complications.length,
      case_.treatments.length
    ];
    
    const tensor = tf.tensor2d([features]);
    const prediction = await this.model.predict(tensor);
    return prediction.dataSync()[0];
  }
  
  private analyzeOutcome(case_: any): any {
    return {
      result: case_.outcome,
      duration: case_.duration,
      complications: case_.complications,
      successFactors: this.identifySuccessFactors(case_)
    };
  }
  
  private extractLearnings(case_: any): string[] {
    const learnings = [];
    
    if (case_.complications.length > 0) {
      learnings.push(`Atenção aos fatores de risco: ${case_.complications.join(', ')}`);
    }
    
    if (case_.successFactors.length > 0) {
      learnings.push(`Práticas bem-sucedidas: ${case_.successFactors.join(', ')}`);
    }
    
    return learnings;
  }
  
  private calculateRelevance(similarity: number, caseDate: string): number {
    const timeWeight = 0.3;
    const similarityWeight = 0.7;
    
    const daysSince = (new Date().getTime() - new Date(caseDate).getTime()) / (1000 * 60 * 60 * 24);
    const timeScore = Math.exp(-daysSince / 365); // Decai exponencialmente com o tempo
    
    return (similarity * similarityWeight) + (timeScore * timeWeight);
  }
  
  private identifySuccessFactors(case_: any): string[] {
    const factors = [];
    
    if (case_.outcome === 'success') {
      if (case_.earlyIntervention) factors.push('Intervenção precoce');
      if (case_.followedProtocol) factors.push('Aderência ao protocolo');
      if (case_.multidisciplinaryApproach) factors.push('Abordagem multidisciplinar');
    }
    
    return factors;
  }
}