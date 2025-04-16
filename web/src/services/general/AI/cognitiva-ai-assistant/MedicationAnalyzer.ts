import { IMedication, IPatientContext } from "@/types/cognitiva-ai-assistant";

interface MedicationInteraction {
    medications: string[];
    severity: 'low' | 'medium' | 'high';
    recommendation: string;
  }
  
  interface MedicationAnalysisResult {
    interactions: MedicationInteraction[];
    adjustments: string[];
    summary: string;
    riskScore: number;
  }
  
  class MedicationAnalyzer {
    private static readonly KNOWN_INTERACTIONS: {
      [key: string]: { medications: string[]; severity: 'low' | 'medium' | 'high'; recommendation: string }[]
    } = {
      'Dipirona': [
        {
          medications: ['Warfarina'],
          severity: 'high',
          recommendation: 'Evitar combinação. Aumenta risco de sangramento.'
        }
      ],
      'Omeprazol': [
        {
          medications: ['Clopidogrel'],
          severity: 'medium',
          recommendation: 'Monitorar eficácia do Clopidogrel.'
        }
      ]
      // Adicione mais interações conhecidas conforme necessário
    };
  
    public static analyzeMedications(
      medications: IMedication[],
      context?: IPatientContext
    ): MedicationAnalysisResult {
      const interactions: MedicationInteraction[] = [];
      const adjustments: string[] = [];
      let riskScore = 0;
  
      // Análise de interações
      medications.forEach((med1, index) => {
        medications.slice(index + 1).forEach(med2 => {
          const interaction = this.checkInteraction(med1.name, med2.name);
          if (interaction) {
            interactions.push(interaction);
            riskScore += this.getSeverityScore(interaction.severity);
          }
        });
      });
  
      // Análise de ajustes necessários
      medications.forEach(med => {
        const adjustment = this.checkDosageAdjustment(med, context);
        if (adjustment) {
          adjustments.push(adjustment);
        }
      });
  
      // Gerar resumo
      const summary = this.generateSummary(medications, interactions, adjustments);
  
      return {
        interactions,
        adjustments,
        summary,
        riskScore
      };
    }
  
    private static checkInteraction(med1: string, med2: string): MedicationInteraction | null {
      const interaction1 = this.KNOWN_INTERACTIONS[med1]?.find(
        i => i.medications.includes(med2)
      );
      const interaction2 = this.KNOWN_INTERACTIONS[med2]?.find(
        i => i.medications.includes(med1)
      );
  
      if (interaction1 || interaction2) {
        const interaction = interaction1 || interaction2;
        return {
          medications: [med1, med2],
          severity: interaction!.severity,
          recommendation: interaction!.recommendation
        };
      }
  
      return null;
    }
  
    private static checkDosageAdjustment(
      medication: IMedication,
      context?: IPatientContext
    ): string | null {
      if (!context) return null;
  
      // Ajustes baseados em idade
      if (context.age > 65) {
        return `Considerar redução de dose de ${medication.name} devido à idade`;
      }
  
      // Ajustes baseados em sinais vitais
      if (context.vitals) {
        if (
          medication.name.toLowerCase().includes('anti-hipertensivo') &&
          context.vitals.bloodPressure.split('/')[0] < '100'
        ) {
          return `Reavaliar dose de ${medication.name} devido à pressão baixa`;
        }
      }
  
      return null;
    }
  
    private static getSeverityScore(severity: 'low' | 'medium' | 'high'): number {
      switch (severity) {
        case 'low':
          return 1;
        case 'medium':
          return 2;
        case 'high':
          return 3;
        default:
          return 0;
      }
    }
  
    private static generateSummary(
      medications: IMedication[],
      interactions: MedicationInteraction[],
      adjustments: string[]
    ): string {
      return `
        Total de medicações: ${medications.length}
        Interações identificadas: ${interactions.length}
        Ajustes sugeridos: ${adjustments.length}
        
        ${interactions.length > 0 ? '\nInterações críticas:\n' + 
          interactions
            .filter(i => i.severity === 'high')
            .map(i => `- ${i.medications.join(' + ')}: ${i.recommendation}`)
            .join('\n') : 'Sem interações críticas'}
        
        ${adjustments.length > 0 ? '\nAjustes necessários:\n' + 
          adjustments.map(a => `- ${a}`).join('\n') : 'Sem ajustes necessários'}
      `.trim();
    }
  }
  
  export {
    MedicationAnalyzer,
    type MedicationAnalysisResult,
    type MedicationInteraction
  };