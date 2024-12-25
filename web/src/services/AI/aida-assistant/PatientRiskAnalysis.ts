/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { load } from '@tensorflow-models/universal-sentence-encoder';
import * as tf from '@tensorflow/tfjs';

import { RecommendationCache } from './RecommendationCache';
import { MedicalKnowledgeBase } from './MedicalKnowledgeBase';
import { RecommendationValidator } from './RecommendationValidator';

class PatientRiskAnalysis {
    private model: any;
    private cache: RecommendationCache;
    private knowledgeBase: MedicalKnowledgeBase;
    private feedbackHistory: RecommendationFeedback[];
    private readonly similarityThreshold = 0.85;
  
    constructor() {
      this.cache = new RecommendationCache();
      this.knowledgeBase = MedicalKnowledgeBase.getInstance();
      this.feedbackHistory = [];
      this.initializeModel();
    }
  
    private async initializeModel() {
      try {
        this.model = await load();
        console.log('Modelo USE carregado com sucesso');
      } catch (error) {
        console.error('Erro ao carregar modelo USE:', error);
        throw new Error('Falha ao inicializar modelo de IA');
      }
    }
  
    async generateRecommendations(patientData: PatientData): Promise<string[]> {
        // Inicializar context com um valor padrão
        let context: PatientContext = {
          age: patientData.personalInfo.age,
          diagnoses: [],
          riskLevel: 'baixo',
          vitals: {
            temperature: 0,
            bloodPressure: '',
            heartRate: 0,
            oxygenSaturation: 0,
            timestamp: new Date().toISOString()
          },
          medications: [],
          procedures: []
        };
      
        try {
          // 1. Preparar contexto do paciente
          context = this.preparePatientContext(patientData);
          
          // 2. Verificar cache
          const cacheKey = this.cache.generateKey(context);
          const cachedRecommendations = this.cache.get(cacheKey);
          
          if (cachedRecommendations && this.isContextSimilar(context, cachedRecommendations.context)) {
            console.log('Usando recomendações em cache');
            return cachedRecommendations.recommendations;
          }
      
          // 3. Gerar novas recomendações
          const recommendations = await this.generateNewRecommendations(context);
      
          // 4. Validar recomendações
          const validationResult = RecommendationValidator.validate(recommendations, context);
          
          if (!validationResult.isValid) {
            console.warn('Conflitos encontrados:', validationResult.conflicts);
            return this.getFallbackRecommendations(context);
          }
      
          // 5. Armazenar em cache
          this.cache.set(cacheKey, {
            recommendations,
            context,
            timestamp: new Date(),
            score: 1.0
          });
      
          return recommendations;
        } catch (error) {
          console.error('Erro ao gerar recomendações:', error);
          return this.getFallbackRecommendations(context);
        }
    }
  
    private preparePatientContext(patientData: PatientData): PatientContext {
      return {
        age: patientData.personalInfo.age,
        diagnoses: patientData.treatment.diagnosis,
        riskLevel: patientData.aiAnalysis.complications.risk,
        vitals: patientData.treatment.vitals[patientData.treatment.vitals.length - 1],
        medications: patientData.treatment.medications,
        procedures: patientData.treatment.procedures
      };
    }
  
    public async generateNewRecommendations(context: PatientContext): Promise<string[]> {
        const recommendations = new Set<string>();
      
        // 1. Recomendações baseadas em evidências da base de conhecimento
        for (const diagnosis of context.diagnoses) {
          const knowledgeBaseRecs = this.knowledgeBase
            .getRecommendations(diagnosis)
            .filter(entry => entry.evidenceLevel === 'A')
            .flatMap(entry => entry.recommendations);
      
          knowledgeBaseRecs.forEach(rec => recommendations.add(rec));
        }
      
        // 2. Recomendações baseadas em IA
        const aiRecs = await this.generateAIRecommendations(context);
        aiRecs.forEach(rec => recommendations.add(rec));
      
        // 3. Recomendações baseadas em feedback do histórico
        const feedbackRecs = await this.getFeedbackRecommendations(context);
        feedbackRecs.forEach(rec => recommendations.add(rec));
      
        // 4. Priorização e filtragem
        return this.prioritizeRecommendations(Array.from(recommendations), context);
      }
    
      private async getFeedbackRecommendations(context: PatientContext): Promise<string[]> {
        try {
          // Buscar recomendações do histórico de feedback
          const relevantFeedback = this.feedbackHistory.filter(feedback => 
            feedback.effective && 
            this.isContextSimilar(context, {
              age: feedback.age,
              diagnoses: feedback.diagnosis,
              riskLevel: feedback.riskLevel,
              vitals: context.vitals, // usando vitais atuais como fallback
              medications: feedback.medications || [],
              procedures: feedback.procedures || []
            })
          );
    
          // Extrair recomendações dos feedbacks relevantes
          const recommendations = new Set<string>();
          relevantFeedback.forEach(feedback => {
            if (feedback.notes) {
              recommendations.add(feedback.notes);
            }
          });
    
          return Array.from(recommendations);
        } catch (error) {
          console.error('Erro ao obter recomendações do histórico:', error);
          return [];
        }
    }

    private async generateAIRecommendations(context: PatientContext): Promise<string[]> {
        try {
          // Criar embedding do contexto do paciente
          const contextText = this.createContextText(context);
          const embedding = await this.model.embed(contextText);
    
          // Buscar recomendações similares do histórico
          const similarRecommendations = await this.findSimilarRecommendations(embedding, context);
    
          // Gerar novas recomendações baseadas no contexto
          const newRecommendations = await this.generateContextSpecificRecommendations(context);
    
          return [...similarRecommendations, ...newRecommendations];
        } catch (error) {
          console.error('Erro na geração de recomendações por IA:', error);
          return [];
        }
    }
  
    private createContextText(context: PatientContext): string {
      return `
        Paciente:
        Idade: ${context.age}
        Diagnósticos: ${context.diagnoses.join(', ')}
        Nível de Risco: ${context.riskLevel}
        
        Sinais Vitais:
        Temperatura: ${context.vitals.temperature}°C
        Pressão Arterial: ${context.vitals.bloodPressure}
        Frequência Cardíaca: ${context.vitals.heartRate}
        Saturação O2: ${context.vitals.oxygenSaturation}%
        
        Medicações:
        ${context.medications.map(m => `${m.name} ${m.dosage} ${m.frequency}`).join('\n')}
      `.trim();
    }
  
    private async findSimilarRecommendations(
      embedding: tf.Tensor,
      context: PatientContext
    ): Promise<string[]> {
      const similarRecommendations = new Set<string>();
      
      // Buscar casos similares no histórico de feedback
      const similarCases = this.feedbackHistory.filter(feedback => 
        feedback.effective && 
        this.isContextSimilar(context, {
          age: context.age,
          diagnoses: feedback.diagnosis,
          riskLevel: context.riskLevel,
          vitals: context.vitals,
          medications: context.medications,
          procedures: context.procedures
        })
      );
  
      // Adicionar recomendações de casos similares
      similarCases.forEach(case_ => {
        const recommendations = this.knowledgeBase
          .getRecommendations(case_.diagnosis[0])
          .flatMap(entry => entry.recommendations);
        
        recommendations.forEach(rec => similarRecommendations.add(rec));
      });
  
      return Array.from(similarRecommendations);
    }
  
    private async generateContextSpecificRecommendations(
      context: PatientContext
    ): Promise<string[]> {
      const recommendations: string[] = [];
  
      // Recomendações baseadas em idade
      if (context.age >= 65) {
        recommendations.push(
          'Avaliar risco de queda',
          'Considerar ajuste de doses para função renal',
          'Monitorar estado cognitivo'
        );
      }
  
      // Recomendações baseadas em sinais vitais
      if (context.vitals.temperature > 37.8) {
        recommendations.push(
          'Investigar foco infeccioso',
          'Considerar coleta de culturas',
          'Monitorar temperatura a cada 4 horas'
        );
      }
  
      // Recomendações baseadas em nível de risco
      if (context.riskLevel === 'Alto') {
        recommendations.push(
          'Monitoramento contínuo de sinais vitais',
          'Avaliação diária por equipe multidisciplinar',
          'Considerar suporte em unidade de maior complexidade'
        );
      }
  
      return recommendations;
    }
  
    private prioritizeRecommendations(
      recommendations: string[],
      context: PatientContext
    ): string[] {
      // Pontuação para cada recomendação
      const scores = new Map<string, number>();
  
      recommendations.forEach(rec => {
        let score = 1;
  
        // Aumenta score baseado em evidências
        const evidenceBase = this.knowledgeBase
          .getRecommendations(context.diagnoses[0])
          .find(entry => entry.recommendations.includes(rec));
        
        if (evidenceBase) {
          score += evidenceBase.evidenceLevel === 'A' ? 3 :
                   evidenceBase.evidenceLevel === 'B' ? 2 : 1;
        }
  
        // Aumenta score baseado em feedback positivo
        const positiveFeedback = this.feedbackHistory.filter(f => 
          f.effective && f.notes.includes(rec)
        ).length;
        
        score += positiveFeedback * 0.5;
  
        // Ajusta score baseado no nível de risco
        if (context.riskLevel === 'Alto' && rec.includes('monitoramento')) {
          score += 2;
        }
  
        scores.set(rec, score);
      });
  
      // Ordena recomendações por score
      return recommendations.sort((a, b) => 
        (scores.get(b) || 0) - (scores.get(a) || 0)
      );
    }
  
    private isContextSimilar(context1: PatientContext, context2: PatientContext): boolean {
      // Verifica similaridade de diagnósticos
      const diagnosisSimilarity = this.calculateSetSimilarity(
        new Set(context1.diagnoses),
        new Set(context2.diagnoses)
      );
  
      // Verifica similaridade de idade
      const ageSimilarity = 1 - Math.abs(context1.age - context2.age) / 100;
  
      // Verifica similaridade de medicações
      const medicationSimilarity = this.calculateSetSimilarity(
        new Set(context1.medications.map(m => m.name)),
        new Set(context2.medications.map(m => m.name))
      );
  
      // Calcula similaridade geral
      const overallSimilarity = (
        diagnosisSimilarity * 0.4 +
        ageSimilarity * 0.3 +
        medicationSimilarity * 0.3
      );
  
      return overallSimilarity >= this.similarityThreshold;
    }
  
    private calculateSetSimilarity(set1: Set<string>, set2: Set<string>): number {
        // Criar array de interseção usando Array.from
        const intersection = new Set(
          Array.from(set1).filter(x => set2.has(x))
        );
      
        // Criar união usando Array.from
        const union = new Set(
          Array.from(set1).concat(Array.from(set2))
        );
      
        return intersection.size / union.size;
    }
  
    private getFallbackRecommendations(context: PatientContext): string[] {
      // Recomendações seguras e genéricas para casos de falha
      const baseRecommendations = [
        'Monitorar sinais vitais conforme protocolo institucional',
        'Manter medicações prescritas sob supervisão médica',
        'Observar e registrar evolução clínica',
        'Seguir precauções padrão'
      ];
  
      if (context.riskLevel === 'Alto') {
        baseRecommendations.push(
          'Intensificar monitoramento',
          'Considerar avaliação especializada',
          'Manter equipe em alerta'
        );
      }
  
      return baseRecommendations;
    }
  
    // Método para registrar feedback
    async addFeedback(feedback: RecommendationFeedback): Promise<void> {
      this.feedbackHistory.push(feedback);
      await this.updateModelWithFeedback(feedback);
    }
  
    private async updateModelWithFeedback(feedback: RecommendationFeedback): Promise<void> {
      // Implementar lógica de atualização do modelo com novo feedback
      // Este é um placeholder para futura implementação de aprendizado contínuo
    }
}

export {
    PatientRiskAnalysis
};