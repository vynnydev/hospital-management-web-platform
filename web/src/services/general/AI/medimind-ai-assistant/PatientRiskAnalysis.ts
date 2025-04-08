/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleGenerativeAI } from '@google/generative-ai';

import { 
  PatientContext, 
  PatientData,
  CachedRecommendation,
} from './types/medimind-ai-assistant';
import { ImageGenerationService } from './ImageGenerationService';
import { MedicationImageRequest } from './types/image-types';

class PatientRiskAnalysis {
    private readonly similarityThreshold = 0.85;
    private cache: Map<string, CachedRecommendation>;
    private genAI: GoogleGenerativeAI;
    private model: any;
    private imageService: ImageGenerationService;

    constructor() {
        if (!process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY) {
            throw new Error('Token Hugging Face não configurado');
        }
        this.genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
        this.cache = new Map();
        this.imageService = new ImageGenerationService();
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
              timestamp: latestVitals.timestamp,
              consciousness: latestVitals.consciousness,
              painScale: latestVitals.painScale, // Escala de 0-10
              respiratoryRate: latestVitals.respiratoryRate,
              mobility: latestVitals.mobility,
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

    async generateMedicationInstructions(medication: any, patientData: PatientData) {
        const request: MedicationImageRequest = {
            name: medication.name,
            dosage: medication.dosage,
            instructions: medication.instructions || '',
            patientContext: {
                age: patientData.personalInfo.age,
                weight: patientData.personalInfo.weight,
                allergies: patientData.treatment.allergies,
                mobility: this.assessMobilityStatus(patientData),
                consciousness: this.assessConsciousnessLevel(patientData),
                specialNeeds: this.identifySpecialNeeds(patientData)
            },
            palliativeCare: {
                patientCondition: patientData.treatment.diagnosis.join(', '),
                mobilityStatus: this.assessMobilityStatus(patientData),
                painLevel: this.assessPainLevel(patientData),
                nutritionalStatus: this.assessNutritionalStatus(patientData),
                respiratoryStatus: this.assessRespiratoryStatus(patientData),
                consciousnessLevel: this.assessConsciousnessLevel(patientData),
                specialNeeds: this.identifySpecialNeeds(patientData)
            }
        };
    
        return await this.imageService.generateMedicationImages(request);
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
        return `Você é um médico especialista. Analise os dados do paciente e forneça recomendações médicas em português, obrigatoriamente limitadas a 500 caracteres cada.
    
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
        1. FORMATO OBRIGATÓRIO:
           - Forneça EXATAMENTE 5 recomendações principais
           - LIMITE MÁXIMO: 500 caracteres por recomendação
           - Comece cada recomendação com número e ponto (1., 2., etc.)
           - Use português claro e profissional
           - Termine cada recomendação com ponto final
    
        2. CONTEÚDO DAS RECOMENDAÇÕES:
           Recomendação 1: MEDICAMENTOS
           - Instruções detalhadas de uso
           - Técnicas de aplicação
           - Precauções principais
           - Efeitos colaterais importantes
    
           Recomendação 2: MONITORAMENTO
           - Sinais vitais a observar
           - Frequência de verificação
           - Valores de referência
           - Quando buscar ajuda
    
           Recomendação 3: CUIDADOS PALIATIVOS
           - Técnicas não medicamentosas
           - Medidas de conforto
           - Adaptações necessárias
           - Suporte emocional
    
           Recomendação 4: ORIENTAÇÕES PARA CUIDADORES
           - Instruções práticas
           - Precauções específicas
           - Rotinas recomendadas
           - Sinais de alerta
    
           Recomendação 5: ACOMPANHAMENTO
           - Retornos necessários
           - Exames de controle
           - Ajustes de tratamento
           - Critérios de melhora/piora
    
        3. ESTRUTURA DE CADA RECOMENDAÇÃO:
           - Comece com a ação principal
           - Inclua o motivo brevemente
           - Adicione instruções práticas
           - Termine com alertas importantes
    
        EXEMPLO DE FORMATO (respeitando 500 caracteres):
        1. [Medicamento/Dose] Instruções de uso: [como tomar]. Técnica: [aplicação]. Precauções: [principais cuidados]. Monitorar: [efeitos].
        2. [Próxima recomendação seguindo mesmo formato...]
    
        IMPORTANTE:
        - Mantenha CADA recomendação dentro do limite de 500 caracteres
        - Inclua APENAS informações essenciais
        - Priorize a segurança do paciente
        - Use linguagem direta e clara
        - Evite repetições
    
        Forneça APENAS as 5 recomendações numeradas, seguindo a estrutura e limitações definidas.`;
    }
  
    private validateRecommendations(recommendations: string[]): boolean {
        if (!Array.isArray(recommendations) || recommendations.length !== 5) {
            console.log('Validação falhou: número incorreto de recomendações');
            return false;
        }
    
        return recommendations.every((rec, index) => {
            const expectedPrefix = `${index + 1}.`;
            const hasCorrectPrefix = rec.startsWith(expectedPrefix);
            
            // Logs individuais para cada validação
            console.log('Validações para recomendação', index + 1);
            console.log('Tem prefixo correto:', hasCorrectPrefix);
            console.log('Tamanho:', rec.length);
            console.log('Formato início:', /^[0-9]\.\s[A-ZÀ-Ú]/.test(rec));
            console.log('Formato fim:', /[.!?]$/.test(rec));
            console.log('Contém português:', /[a-záàâãéèêíïóôõöúçñ]/i.test(rec));
            
            const isValid = 
                hasCorrectPrefix &&
                rec.length >= 15 && // Mínimo de 15 caracteres
                rec.length <= 500 && // Máximo de 500 caracteres
                /^[0-9]\.\s[A-ZÀ-Ú\w]/.test(rec) && // Formato início mais flexível
                /[.!?]$/.test(rec.trim()) && // Termina com pontuação, removendo espaços
                /[a-záàâãéèêíïóôõöúçñ]/i.test(rec) && // Contém caracteres em português
                !rec.includes('undefined') &&
                !rec.includes('null') &&
                !rec.includes('error');
    
            if (!isValid) {
                console.log('Recomendação inválida:', rec);
                this.logValidationDetails(rec);
            }
    
            return isValid;
        });
    }
    
    private logValidationDetails(rec: string) {
        console.log('Detalhes da validação:');
        console.log('- Comprimento:', rec.length);
        console.log('- Primeiro caractere:', rec.charAt(0));
        console.log('- Último caractere:', rec.charAt(rec.length - 1));
        console.log('- Tem número inicial:', /^[0-9]/.test(rec));
        console.log('- Tem ponto após número:', /^[0-9]\./.test(rec));
        console.log('- Tem espaço após ponto:', /^[0-9]\.\s/.test(rec));
        console.log('- Tem letra maiúscula após espaço:', /^[0-9]\.\s[A-ZÀ-Ú]/.test(rec));
        console.log('- Termina com pontuação:', /[.!?]$/.test(rec.trim()));
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

    private assessMobilityStatus(patientData: PatientData): string {
        const lastVitals = patientData.treatment.vitals[patientData.treatment.vitals.length - 1];
        
        if (!lastVitals) return 'Não Avaliado';
        return lastVitals.mobility || 'Não Avaliado';
    }
    
    private assessConsciousnessLevel(patientData: PatientData): string {
        const lastVitals = patientData.treatment.vitals[patientData.treatment.vitals.length - 1];
        
        if (!lastVitals) return 'Não Avaliado';
        return lastVitals.consciousness || 'Não Avaliado';
    }
    
    private assessPainLevel(patientData: PatientData): number {
        const lastVitals = patientData.treatment.vitals[patientData.treatment.vitals.length - 1];
        
        if (!lastVitals) return 0;
        return lastVitals.painScale || 0;
    }
    
    private assessNutritionalStatus(patientData: PatientData): string {
        const { weight, height } = patientData.personalInfo;
        
        if (weight && height) {
            // Cálculo do IMC
            const heightInMeters = height / 100;
            const bmi = weight / (heightInMeters * heightInMeters);
    
            if (bmi < 18.5) return 'Desnutrição';
            if (bmi >= 18.5 && bmi < 25) return 'Eutrófico';
            if (bmi >= 25 && bmi < 30) return 'Sobrepeso';
            return 'Obesidade';
        }
    
        // Verifica diagnósticos relacionados à nutrição
        const nutritionalIssues = patientData.treatment.diagnosis.some(d =>
            d.toLowerCase().includes('desnutri') ||
            d.toLowerCase().includes('anorexia') ||
            d.toLowerCase().includes('obesidade')
        );
    
        return nutritionalIssues ? 'Comprometido' : 'Não Avaliado';
    }
    
    private assessRespiratoryStatus(patientData: PatientData): string {
        const lastVitals = patientData.treatment.vitals[patientData.treatment.vitals.length - 1];
        
        if (!lastVitals) return 'Não Avaliado';
    
        // Avalia baseado na frequência respiratória e saturação
        if (lastVitals.respiratoryRate > 24 || lastVitals.oxygenSaturation < 90) {
            return 'Insuficiência Respiratória Grave';
        } else if (lastVitals.respiratoryRate > 20 || lastVitals.oxygenSaturation < 95) {
            return 'Insuficiência Respiratória Moderada';
        }
        return 'Normal';
    }
    
    private identifySpecialNeeds(patientData: PatientData): string[] {
        const specialNeeds: string[] = [];
    
        // Verifica condições que requerem cuidados especiais
        if (this.assessMobilityStatus(patientData) === 'Mobilidade Reduzida') {
            specialNeeds.push('Necessita Auxílio para Locomoção');
        }
    
        if (this.assessConsciousnessLevel(patientData) !== 'Consciente e Orientado') {
            specialNeeds.push('Necessita Supervisão Constante');
        }
    
        // Verifica necessidades baseadas em diagnósticos
        if (patientData.treatment.diagnosis.some(d => d.toLowerCase().includes('diabetes'))) {
            specialNeeds.push('Controle Glicêmico');
        }
    
        if (patientData.treatment.diagnosis.some(d => d.toLowerCase().includes('pressão'))) {
            specialNeeds.push('Monitoramento Pressórico');
        }
    
        // Verifica alergias
        if (patientData.treatment.allergies && patientData.treatment.allergies.length > 0) {
            specialNeeds.push('Alergias Medicamentosas');
        }
    
        // Verifica necessidades nutricionais
        if (this.assessNutritionalStatus(patientData) === 'Desnutrição') {
            specialNeeds.push('Suporte Nutricional');
        }
    
        // Verifica necessidades respiratórias
        if (this.assessRespiratoryStatus(patientData) !== 'Normal') {
            specialNeeds.push('Suporte Respiratório');
        }
    
        return specialNeeds;
    }
}

export { PatientRiskAnalysis };