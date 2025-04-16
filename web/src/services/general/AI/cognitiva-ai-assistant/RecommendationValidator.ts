import { IPatientContext, IValidationResult } from "../../../../types/cognitiva-ai-assistant";

/* eslint-disable @typescript-eslint/no-unused-vars */
class RecommendationValidator {
  private static contraindications: Map<string, string[]> = new Map([
    ['anticoagulantes', ['procedimentos invasivos', 'sangramento ativo']],
    ['corticosteroides', ['infecção ativa não tratada', 'úlcera péptica ativa']]
  ]);

  static validate(recommendations: string[], context: IPatientContext): IValidationResult {
    const result: IValidationResult = {
      isValid: true,
      conflicts: [],
      warnings: []
    };

    recommendations.forEach(rec => {
      // Verifica contraindicações
      this.checkContraindications(rec, context, result);
      // Verifica interações medicamentosas
      this.checkMedicationInteractions(rec, context, result);
      // Verifica adequação à idade
      this.checkAgeAppropriate(rec, context, result);
    });

    result.isValid = result.conflicts.length === 0;
    return result;
  }

  private static checkContraindications(
    recommendation: string,
    context: IPatientContext,
    result: IValidationResult
  ): void {
    this.contraindications.forEach((contraindicated, treatment) => {
      if (recommendation.toLowerCase().includes(treatment)) {
        contraindicated.forEach(condition => {
          if (context.diagnoses.some(d => d.toLowerCase().includes(condition))) {
            result.conflicts.push(
              `Contraindicação: ${treatment} com ${condition}`
            );
          }
        });
      }
    });
  }

  private static checkMedicationInteractions(
    recommendation: string,
    context: IPatientContext,
    result: IValidationResult
  ): void {
    // Implementar verificação de interações medicamentosas
  }

  private static checkAgeAppropriate(
    recommendation: string,
    context: IPatientContext,
    result: IValidationResult
  ): void {
    // Implementar verificação de adequação à idade
  }
}

export {
    RecommendationValidator
}