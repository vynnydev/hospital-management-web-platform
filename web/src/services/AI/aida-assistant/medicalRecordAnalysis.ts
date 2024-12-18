// services/medicalRecordAnalysis.ts

import { HfInference } from '@huggingface/inference';

export class MedicalRecordAnalysis {
  private summarizer: HfInference = new HfInference;

  constructor() {
    this.initializeSummarizer();
  }

  private async initializeSummarizer() {
    // Certifique-se de que a HUGGING_FACE_API_KEY está definida nas suas variáveis de ambiente
    this.summarizer = new HfInference(process.env.HUGGING_FACE_API_KEY);
  }

  async summarizeMedicalHistory(patient: Patient): Promise<string> {
    const medicalInfo = this.extractMedicalInfo(patient);
    return await this.generateSummary(medicalInfo);
  }

  private extractMedicalInfo(patient: Patient): string {
    const {
      diagnosis,
      vitals,
      medications,
    } = patient.treatment;

    return `
      Diagnósticos: ${diagnosis.join(', ')}
      Medicações: ${medications.map(med => `${med.name} ${med.dosage}`).join(', ')}
      Últimos sinais vitais: Temp: ${vitals[vitals.length - 1].temperature}°C, 
      PA: ${vitals[vitals.length - 1].bloodPressure}
    `;
  }

  private async generateSummary(text: string): Promise<string> {
    try {
      const result = await this.summarizer.summarization({
        model: 'facebook/bart-large-cnn',
        inputs: text,
        parameters: {
          max_length: 130,
          min_length: 30,
        }
      });

      return result.summary_text;
    } catch (error) {
      console.error('Erro na sumarização:', error);
      return 'Não foi possível gerar o sumário.';
    }
  }
}