import { KnowledgeBaseEntry } from "./types/medimind-ai-assistant";

class MedicalKnowledgeBase {
    private static instance: MedicalKnowledgeBase;
    private entries: Map<string, KnowledgeBaseEntry[]>;
    private lastUpdate: Date;
  
    private constructor() {
      this.entries = new Map();
      this.lastUpdate = new Date();
      this.initializeKnowledgeBase();
    }
  
    static getInstance(): MedicalKnowledgeBase {
      if (!MedicalKnowledgeBase.instance) {
        MedicalKnowledgeBase.instance = new MedicalKnowledgeBase();
      }
      return MedicalKnowledgeBase.instance;
    }
  
    private async initializeKnowledgeBase() {
      // Inicializa com dados baseados em evidências
      this.entries.set('pneumonia', [
        {
          condition: 'pneumonia',
          recommendations: [
            'Iniciar antibioticoterapia empírica conforme protocolo institucional',
            'Monitorar saturação de O2 a cada 4 horas',
            'Realizar fisioterapia respiratória 2x/dia',
            'Manter cabeceira elevada 30-45°',
            'Colher culturas antes do início de antibióticos'
          ],
          evidenceLevel: 'A',
          source: 'Infectious Diseases Society of America',
          lastUpdated: new Date('2024-01-01')
        }
      ]);
  
      // Adicione mais condições conforme necessário
    }
  
    getRecommendations(condition: string): KnowledgeBaseEntry[] {
      return this.entries.get(condition.toLowerCase()) || [];
    }
  
    async update(): Promise<void> {
      // Implementar atualização da base de conhecimento
      this.lastUpdate = new Date();
    }
}

export {
    MedicalKnowledgeBase
}