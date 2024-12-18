// services/medicationAnalysis.ts

interface DrugInteraction {
    drug1: string;
    drug2: string;
    severity: 'high' | 'medium' | 'low';
    description: string;
  }
  
  export class MedicationAnalysis {
    private drugInteractions: DrugInteraction[];
  
    constructor() {
      // Base de dados de interações medicamentosas
      this.drugInteractions = [];
    }
  
    analyzeMedications(medications: Patient['treatment']['medications']): {
      interactions: DrugInteraction[];
      recommendations: string[];
    } {
      const interactions: DrugInteraction[] = [];
      const recommendations: string[] = [];
  
      // Análise de interações
      for (let i = 0; i < medications.length; i++) {
        for (let j = i + 1; j < medications.length; j++) {
          const interaction = this.checkInteraction(
            medications[i].name,
            medications[j].name
          );
          
          if (interaction) {
            interactions.push(interaction);
            recommendations.push(
              `Monitorar interação entre ${interaction.drug1} e ${interaction.drug2}`
            );
          }
        }
      }
  
      return { interactions, recommendations };
    }
  
    private checkInteraction(drug1: string, drug2: string): DrugInteraction | null {
      return this.drugInteractions.find(
        interaction =>
          (interaction.drug1 === drug1 && interaction.drug2 === drug2) ||
          (interaction.drug1 === drug2 && interaction.drug2 === drug1)
      ) || null;
    }
  }