/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleGenerativeAI } from '@google/generative-ai';

export class HospitalAnalyticsServiceAI {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
  }

  async analyzeMetrics(metrics: {
    occupancyRate: number;
    totalPatients: number;
    availableBeds: number;
    avgStayDuration: number;
    turnoverRate: number;
    departmentOccupancy: { department: string; rate: number }[];
    trends: { metric: string; value: number; direction: string }[];
  }) {
    const prompt = `
      Como especialista em análise de dados hospitalares, examine detalhadamente os seguintes indicadores:

      MÉTRICAS PRINCIPAIS:
      1. Taxa de Ocupação Geral: ${metrics.occupancyRate}%
      2. Total de Pacientes Internados: ${metrics.totalPatients}
      3. Leitos Disponíveis: ${metrics.availableBeds}
      4. Tempo Médio de Internação: ${metrics.avgStayDuration} dias
      5. Taxa de Rotatividade: ${metrics.turnoverRate} pacientes/dia

      OCUPAÇÃO POR DEPARTAMENTO:
      ${metrics.departmentOccupancy.map(d => `- ${d.department}: ${d.rate}% de ocupação`).join('\n')}

      ANÁLISE DE TENDÊNCIAS (Últimas 24 horas):
      ${metrics.trends.map(t => {
        const direction = t.direction === 'up' ? 'aumento de' : 'redução de';
        const impact = t.value >= 5 ? 'significativo' : 'moderado';
        return `- ${t.metric}: ${direction} ${t.value}% (${impact})`;
      }).join('\n')}

     Por favor, forneça uma análise estruturada incluindo:

      **1. ANÁLISE DA SITUAÇÃO ATUAL**
      - Equilíbrio entre Capacidade e Demanda
      - Comparação com Padrões do Setor
      - Padrões nas Tendências Atuais
      - Impacto das Variações Recentes

      Planos de Ação para Situação Atual:
      - Ações específicas baseadas na análise atual
      - Prioridades de implementação
      - Responsáveis sugeridos

      **2. PONTOS CRÍTICOS QUE REQUEREM ATENÇÃO**
      - Ocupação Crítica
      - Gargalos Operacionais
      - Riscos Potenciais
      - Variações Significativas

      Planos de Ação para Pontos Críticos:
      - Medidas corretivas para cada ponto crítico
      - Timeline de resolução
      - Recursos necessários

      **3. RECOMENDAÇÕES DE AÇÃO**
      Ações Imediatas:
      - Medidas urgentes para áreas críticas
      - Otimizações de fluxo prioritárias
      
      Gestão de Recursos:
      - Ajustes na alocação de leitos
      - Otimização de pessoal
      
      Melhorias de Processo:
      - Aprimoramento do processo de alta
      - Eficiência operacional
      
      Medidas Preventivas:
      - Preparação para cenários críticos
      - Planos de contingência

      Planos de Ação para Recomendações:
      - Detalhamento das ações por prioridade
      - Métricas de acompanhamento
      - Cronograma de implementação

      **4. PREVISÕES 24-48h**
      Projeções de Curto Prazo:
      - Tendências de ocupação esperadas
      - Estimativas de demanda
      
      Necessidades de Recursos:
      - Previsão de pessoal necessário
      - Recursos materiais requeridos
      
      Cenários e Contingências:
      - Possíveis situações críticas
      - Medidas preventivas recomendadas

      Impacto Operacional:
      - Análise do impacto nas operações
      - Ajustes operacionais necessários
      - Medidas de mitigação

      Planos de Ação para Previsões:
      - Ações preventivas baseadas nas projeções
      - Gatilhos para ação
      - Responsabilidades e prazos

      Forneça sua análise de forma clara e objetiva, priorizando informações acionáveis e destacando pontos críticos que requerem atenção imediata.
    `;
    console.log(prompt)

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      console.log(response)
      return response.text();
    } catch (error) {
      console.error('Erro na análise:', error);
      throw error;
    }
  }
}