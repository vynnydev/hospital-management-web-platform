/* eslint-disable @typescript-eslint/no-unused-vars */

import { VitalSigns } from "./types/aida-assistant";

// Classes de análise específica
class VitalSignsAnalyzer {
    private static readonly CRITICAL_THRESHOLDS = {
      temperature: { min: 35, max: 38.5 },
      systolicBP: { min: 90, max: 180 },
      diastolicBP: { min: 60, max: 110 },
      heartRate: { min: 50, max: 120 },
      oxygenSaturation: { min: 92, max: 100 }
    };
  
    public static analyzeVitals(vitals: VitalSigns[]): {
      summary: string;
      trends: { [key: string]: string };
      alerts: string[];
      risk: 'low' | 'medium' | 'high';
    } {
      const latest = vitals[vitals.length - 1];
      const alerts: string[] = [];
      let riskScore = 0;
  
      // Análise de temperatura
      if (latest.temperature > this.CRITICAL_THRESHOLDS.temperature.max) {
        alerts.push(`Febre alta: ${latest.temperature}°C`);
        riskScore += 2;
      } else if (latest.temperature < this.CRITICAL_THRESHOLDS.temperature.min) {
        alerts.push(`Hipotermia: ${latest.temperature}°C`);
        riskScore += 2;
      }
  
      // Análise de pressão arterial
      const [systolic, diastolic] = latest.bloodPressure.split('/').map(Number);
      if (systolic > this.CRITICAL_THRESHOLDS.systolicBP.max) {
        alerts.push(`Hipertensão sistólica: ${systolic}mmHg`);
        riskScore += 2;
      } else if (systolic < this.CRITICAL_THRESHOLDS.systolicBP.min) {
        alerts.push(`Hipotensão sistólica: ${systolic}mmHg`);
        riskScore += 3;
      }
  
      // Análise de saturação
      if (latest.oxygenSaturation < this.CRITICAL_THRESHOLDS.oxygenSaturation.min) {
        alerts.push(`Dessaturação: ${latest.oxygenSaturation}%`);
        riskScore += 3;
      }
  
      // Análise de tendências
      const trends = this.calculateTrends(vitals);

      const summary = `
        Último registro:
        Temperatura: ${latest.temperature}°C
        Pressão Arterial: ${latest.bloodPressure}
        Frequência Cardíaca: ${latest.heartRate} bpm
        Saturação: ${latest.oxygenSaturation}%
        ${alerts.length > 0 ? '\nAlertas:\n' + alerts.join('\n') : '\nSem alertas críticos'}
        \nNível de Risco: ${riskScore > 5 ? 'Alto' : riskScore > 2 ? 'Médio' : 'Baixo'}
    `.trim();
  
      return {
        summary,
        trends,
        alerts,
        risk: riskScore > 5 ? 'high' : riskScore > 2 ? 'medium' : 'low'
      };
    }
  
    private static calculateTrends(vitals: VitalSigns[]): { [key: string]: string } {
      if (vitals.length < 3) return { status: 'insufficient-data' };
  
      const last3 = vitals.slice(-3);
      const trends: { [key: string]: string } = {};
  
      ['temperature', 'heartRate', 'oxygenSaturation'].forEach(parameter => {
        const values = last3.map(v => v[parameter as keyof VitalSigns] as number);
        trends[parameter] = this.getTrendDirection(values);
      });
  
      return trends;
    }
  
    private static getTrendDirection(values: number[]): string {
      const differences = values.slice(1).map((v, i) => v - values[i]);
      const averageDifference = differences.reduce((a, b) => a + b, 0) / differences.length;
  
      if (Math.abs(averageDifference) < 0.1) return 'stable';
      return averageDifference > 0 ? 'increasing' : 'decreasing';
    }
}

export {
    VitalSignsAnalyzer
}