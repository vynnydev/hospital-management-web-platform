/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleGenerativeAI } from '@google/generative-ai';

import { 
  PatientContext, 
  PatientData,
  CachedRecommendation,
  PreparedContext,
  VitalSigns
} from './types/aida-assistant';

class PatientRiskAnalysis {
    private readonly similarityThreshold = 0.85;
    private cache: Map<string, CachedRecommendation>;
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor() {
        if (!process.env.HUGGING_FACE_API_KEY) {
            throw new Error('Token Hugging Face não configurado');
        }
        this.genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
        this.cache = new Map();
    }

    private preparePatientContext(patientData: PatientData): PatientContext {
      // Pega o sinal vital mais recente de forma segura
      const latestVitals = patientData.treatment.vitals.length > 0
          ? patientData.treatment.vitals[patientData.treatment.vitals.length - 1]
          : null;
  
      return {
          age: patientData.personalInfo.age,
          diagnoses: patientData.treatment.diagnosis,
          riskLevel: patientData.aiAnalysis.complications.risk,
          vitals: latestVitals ? {
              temperature: latestVitals.temperature,
              bloodPressure: latestVitals.bloodPressure,
              heartRate: latestVitals.heartRate,
              oxygenSaturation: latestVitals.oxygenSaturation,
              timestamp: latestVitals.timestamp
          } : null,
          medications: patientData.treatment.medications.map(med => ({
              name: med.name,
              dosage: med.dosage,
              frequency: med.frequency,
              route: med.route,
              startDate: med.startDate,
              endDate: med.endDate,
              status: med.status,
              duration: med.duration
          })),
          procedures: patientData.treatment.procedures.map(proc => ({
              type: proc.type,
              description: proc.description,
              date: proc.date,
              status: proc.status,
              notes: proc.notes,
              complications: proc.complications,
              performer: proc.performer
          }))
      };
  }

  async generateRecommendations(patientData: PatientData): Promise<string[]> {
    console.log("INICIO DA FUNÇÃO DE INTELIGENCIA ARTIFICIAL:")
    console.log(patientData)

    const context: PatientContext = this.preparePatientContext(patientData);
    console.log("FORMATANDO O CONTEXTO DOS VALORES RECEBIDOS:")
    console.log(context)
    
    try {
        const cacheKey = this.generateCacheKey(context);
        const cachedResult = this.cache.get(cacheKey);

        if (cachedResult && this.isContextSimilar(context, cachedResult.context)) {
            console.log('Usando recomendações em cache');
            return cachedResult.recommendations;
        }

        try {
            const recommendations = await this.generateAIRecommendations(context);
            console.log("RECOMENDAÇÃO DE INTELIGENCIA ARTIFICIAL:")
            console.log(recommendations)
            
            if (this.validateRecommendations(recommendations)) {
                this.cache.set(cacheKey, {
                    recommendations,
                    context,
                    timestamp: new Date(),
                    score: 1.0
                });
                return recommendations;
            }
            throw new Error('Recomendações inválidas');
        } catch (error) {
            console.error('Erro no modelo Gemini Pro:', error);
            throw new Error('Falha na geração de recomendações');
        }
    } catch (error) {
        console.error('Erro ao gerar recomendações:', error);
        throw new Error('Falha ao gerar recomendações');
    }
  }
  
    private async generateAIRecommendations(context: PatientContext): Promise<string[]> {
      try {
          const prompt = this.createAIPrompt(context);
          console.log("RETORNO DO PROMPT:")
          console.log(prompt)
          
          const result = await this.model.generateContent(prompt);
          const response = await result.response;
          console.log("RETORNO DA REQUISIÇÃO (PROMPT) DE RECOMENDAÇÃO:")
          console.log(response.text())
  
          return this.parseAIResponse(response.text());
      } catch (error) {
          console.error('Erro na geração de recomendações por IA:', error);
          throw error;
      }
    }
  
    private createAIPrompt(context: PatientContext): string {
      return `Você é um médico especialista experiente. Analise cuidadosamente os dados do paciente e forneça exatamente 5 recomendações médicas específicas e relevantes em português.
  
      DADOS DO PACIENTE:
      - Idade: ${context.age} anos
      - Diagnósticos: ${context.diagnoses.join(', ')}
      - Nível de Risco: ${context.riskLevel}
      ${context.vitals ? `- Sinais Vitais:
        * Temperatura: ${context.vitals.temperature}°C
        * Pressão: ${context.vitals.bloodPressure}
        * Pulso: ${context.vitals.heartRate} bpm
        * Saturação: ${context.vitals.oxygenSaturation}%` : '- Sinais Vitais: Não disponíveis'}
      - Medicações: ${context.medications.map(m => `${m.name} ${m.dosage}`).join(', ')}
      
      INSTRUÇÕES IMPORTANTES:
      - Forneça EXATAMENTE 5 recomendações médicas.
      - Cada recomendação deve começar com um número seguido de ponto (1., 2., etc.).
      - Escreva em português claro e profissional.
      - Cada recomendação deve ser específica para o caso.
      - Considere todos os diagnósticos e sinais vitais apresentados.
      - Inclua orientações de monitoramento quando necessário.
      
      Suas 5 recomendações:`;
    }
  
    private validateRecommendations(recommendations: string[]): boolean {
      if (!Array.isArray(recommendations) || recommendations.length !== 5) {
          console.log('Validação falhou: número incorreto de recomendações');
          return false;
      }
  
      return recommendations.every((rec, index) => {
          const expectedPrefix = `${index + 1}.`;
          const hasCorrectPrefix = rec.startsWith(expectedPrefix);
          
          const isValid = 
              hasCorrectPrefix &&
              rec.length >= 15 && // Mínimo de 15 caracteres após o número
              rec.length <= 200 && // Máximo de 200 caracteres
              /^[0-9]\.\s[A-ZÀ-Ú]/.test(rec) && // Começa com número, ponto, espaço e letra maiúscula
              /[.!?]$/.test(rec) && // Termina com pontuação adequada
              /[a-záàâãéèêíïóôõöúçñ]/i.test(rec) && // Contém caracteres em português
              !rec.includes('undefined') &&
              !rec.includes('null') &&
              !rec.includes('error');
  
          if (!isValid) {
              console.log('Recomendação inválida:', rec);
              console.log('Motivo:', this.getValidationFailureReason(rec));
          }
  
          return isValid;
      });
    }
  
    private parseAIResponse(response: string): string[] {
      try {
          // Limpa caracteres especiais mantendo acentuação
          const cleanResponse = response
              .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove caracteres de controle
              .replace(/['"]/g, '') // Remove aspas
              .replace(/\s+/g, ' ') // Normaliza espaços
              .trim();
  
          // Extrai as recomendações
          const recommendations = cleanResponse
              .split(/(?=\d+\.)/) // Divide quando encontrar número seguido de ponto
              .map(rec => rec.trim())
              .filter(rec => /^\d+\./.test(rec)) // Filtra apenas as que começam com número e ponto
              .map(rec => {
                  // Remove caracteres problemáticos mas mantém acentuação
                  return rec
                      .replace(/^\d+\.\s*/, '') // Remove a numeração
                      .replace(/[^\w\s\u00C0-\u00FF,.()-]/g, '') // Mantém letras, números, acentos e alguns símbolos
                      .trim();
              })
              .filter(rec => rec.length > 0); // Remove linhas vazias
  
          if (recommendations.length !== 5) {
              throw new Error(`Encontradas ${recommendations.length} recomendações, esperadas 5`);
          }
  
          // Formata as recomendações com nova numeração
          return recommendations.map((rec, index) => `${index + 1}. ${rec}`);
  
      } catch (error) {
          console.error('Erro ao processar resposta:', error);
          throw error;
      }
    }
      
    private getValidationFailureReason(rec: string): string {
      if (rec.length < 10) return 'Muito curto';
      if (rec.length > 200) return 'Muito longo';
      
      // Versão modificada das regex para compatibilidade
      const invalidCharsRegex = new RegExp('^[a-zA-Z\\s.,():!-]+$');
      if (!invalidCharsRegex.test(rec)) return 'Caracteres inválidos';
      
      if (rec.includes('http')) return 'Contém URL';
      if (rec.includes('Error')) return 'Contém palavra reservada Error';
      if (rec.includes('undefined')) return 'Contém palavra reservada undefined';
      
      const longCodesRegex = new RegExp('(?:0x[\\da-f]+|[\\d]{5,})', 'i');
      if (longCodesRegex.test(rec)) return 'Contém códigos ou números longos';
      
      const acronymsRegex = new RegExp('\\b[A-Z]{2,}\\b');
      if (acronymsRegex.test(rec)) return 'Contém siglas inadequadas';
      
      if (rec.split(' ').length < 3) return 'Menos de 3 palavras';
      
      const capsRegex = new RegExp('^[A-Z]');
      if (!capsRegex.test(rec)) return 'Não começa com maiúscula';
      
      const punctRegex = new RegExp('[.!?]$');
      if (!punctRegex.test(rec)) return 'Não termina com pontuação adequada';
      
      return 'Razão desconhecida';
    }

    private generateCacheKey(context: PatientContext): string {
        return JSON.stringify({
          diagnoses: context.diagnoses.sort(),
          age: context.age,
          riskLevel: context.riskLevel,
          medications: context.medications.map(m => m.name).sort()
        });
      }

    private isContextSimilar(context1: PatientContext, context2: PatientContext): boolean {
          const diagnosisSimilarity = this.calculateSetSimilarity(
              new Set(context1.diagnoses),
              new Set(context2.diagnoses)
          );

          const ageSimilarity = 1 - Math.abs(context1.age - context2.age) / 100;

          const medicationSimilarity = this.calculateSetSimilarity(
              new Set(context1.medications.map(m => m.name)),
              new Set(context2.medications.map(m => m.name))
          );

          const overallSimilarity = (
              diagnosisSimilarity * 0.4 +
              ageSimilarity * 0.3 +
              medicationSimilarity * 0.3
          );

          return overallSimilarity >= this.similarityThreshold;
    }

    private calculateSetSimilarity(set1: Set<string>, set2: Set<string>): number {
          const intersection = new Set(Array.from(set1).filter(x => set2.has(x)));
          const union = new Set([...Array.from(set1), ...Array.from(set2)]);
          return union.size === 0 ? 0 : intersection.size / union.size;
    }
}

export { PatientRiskAnalysis };