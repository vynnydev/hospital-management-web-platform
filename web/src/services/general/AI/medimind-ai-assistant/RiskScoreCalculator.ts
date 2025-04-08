import { Medication, PatientData, VitalSigns } from "./types/medimind-ai-assistant";

class RiskScoreCalculator {
    private static readonly RISK_FACTORS = {
        age: {
        weight: 0.2,
        thresholds: [
            { value: 65, score: 0.5 },
            { value: 75, score: 0.7 },
            { value: 85, score: 1.0 }
        ]
        },
        vitals: {
        weight: 0.3,
        parameters: {
            temperature: { normal: [36.0, 37.5], weight: 0.3 },
            heartRate: { normal: [60, 100], weight: 0.3 },
            oxygenSaturation: { normal: [95, 100], weight: 0.4 }
        }
        },
        diagnosis: {
        weight: 0.3,
        highRiskConditions: new Set([
            'sepsis', 'pneumonia', 'myocardial infarction', 'stroke'
        ])
        },
        medications: {
        weight: 0.2,
        highRiskMeds: new Set([
            'warfarin', 'heparin', 'insulin', 'digoxin'
        ])
        }
    };

    static calculateRiskScore(patientData: PatientData): {
        score: number;
        factors: string[];
        level: string;
    } {
        let totalScore = 0;
        const riskFactors: string[] = [];

        // Avaliação de idade
        const ageScore = this.calculateAgeScore(patientData.personalInfo.age);
        totalScore += ageScore * this.RISK_FACTORS.age.weight;
        if (ageScore > 0.5) {
        riskFactors.push(`Idade ${patientData.personalInfo.age} anos`);
        }

        // Avaliação de sinais vitais
        const vitalsScore = this.calculateVitalsScore(patientData.treatment.vitals);
        totalScore += vitalsScore.score * this.RISK_FACTORS.vitals.weight;
        riskFactors.push(...vitalsScore.factors);

        // Avaliação de diagnósticos
        const diagnosisScore = this.calculateDiagnosisScore(patientData.treatment.diagnosis);
        totalScore += diagnosisScore.score * this.RISK_FACTORS.diagnosis.weight;
        riskFactors.push(...diagnosisScore.factors);

        // Avaliação de medicações
        const medicationScore = this.calculateMedicationScore(patientData.treatment.medications);
        totalScore += medicationScore.score * this.RISK_FACTORS.medications.weight;
        riskFactors.push(...medicationScore.factors);

        return {
        score: totalScore,
        factors: riskFactors,
        level: this.getRiskLevel(totalScore)
        };
    }

    private static calculateAgeScore(age: number): number {
        for (const threshold of this.RISK_FACTORS.age.thresholds) {
        if (age >= threshold.value) {
            return threshold.score;
        }
        }
        return 0;
    }

    private static calculateVitalsScore(vitals: VitalSigns[]): {
        score: number;
        factors: string[];
    } {
        const latest = vitals[vitals.length - 1];
        let score = 0;
        const factors: string[] = [];

        Object.entries(this.RISK_FACTORS.vitals.parameters).forEach(([param, config]) => {
        const value = latest[param as keyof VitalSigns] as number;
        const [min, max] = config.normal;
        
        if (value < min || value > max) {
            score += config.weight;
            factors.push(`${param} anormal: ${value}`);
        }
        });

        return { score, factors };
    }

    private static calculateDiagnosisScore(diagnoses: string[]): {
        score: number;
        factors: string[];
    } {
        let score = 0;
        const factors: string[] = [];

        diagnoses.forEach(diagnosis => {
        if (this.RISK_FACTORS.diagnosis.highRiskConditions.has(diagnosis.toLowerCase())) {
            score += 0.5;
            factors.push(`Diagnóstico de alto risco: ${diagnosis}`);
        }
        });

        return { 
        score: Math.min(score, 1),
        factors 
        };
    }

    private static calculateMedicationScore(medications: Medication[]): {
        score: number;
        factors: string[];
    } {
        let score = 0;
        const factors: string[] = [];

        medications.forEach(med => {
        if (this.RISK_FACTORS.medications.highRiskMeds.has(med.name.toLowerCase())) {
            score += 0.25;
            factors.push(`Medicação de alto risco: ${med.name}`);
        }
        });

        return { 
        score: Math.min(score, 1),
        factors 
        };
    }

    private static getRiskLevel(score: number): string {
        if (score >= 0.7) return 'Alto';
        if (score >= 0.4) return 'Médio';
        return 'Baixo';
    }
}

export {
    RiskScoreCalculator
}