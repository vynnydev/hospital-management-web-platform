/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
export type ReportType = 'evolucao' | 'medicacao' | 'exames' | 'cirurgia' | 'completo';

// Tipos para os prompts de gestão de pacientes
export type CardTitle = 
| 'Gestão de Pacientes'
| 'Prontuário Digital'
| 'Agenda Médica'
| 'Gestão de Medicamentos'
| 'Resultados de Exames'
| 'Suporte à Decisão Clínica';

export interface Card {
  icon: string;
  title: CardTitle;
  description: string;
  aiHandler?: (data: any) => Promise<any>;
}

export interface CardReport {
  title: string;
  sections: {
    title: string;
    content: string;
  }[];
  downloadable: boolean;
  charts?: {
    type: string;
    title: string;
    data: any;
  }[];
}

// Então, defina o objeto usando Record
export const cardInitialMessages: Record<CardTitle, string> = {
  'Gestão de Pacientes': 
    "🏥 Iniciando módulo de Gestão de Pacientes\n\n" +
    " - Funcionalidades disponíveis:\n" +
    "• Monitoramento em tempo real de sinais vitais\n" +
    "• Análise de histórico médico e evolução\n" +
    "• Avaliação de riscos e complicações\n" +
    "• Alertas automáticos para alterações críticas\n\n" +
    " - Por favor, informe o ID do paciente para iniciar a análise.",

  'Prontuário Digital':
    "📋 Acessando Prontuário Digital\n\n" +
    " - Funcionalidades disponíveis:\n" +
    "• Visualização completa do histórico médico\n" +
    "• Acesso a exames e resultados\n" +
    "• Histórico de prescrições médicas\n" +
    "• Evolução detalhada do tratamento\n\n" +
    "Por favor, informe o ID do prontuário para consulta.",

  'Agenda Médica':
    "🗓️ Sistema de Agenda Médica\n\n" +
    " - Funcionalidades disponíveis:\n" +
    "• Gerenciamento de consultas e retornos\n" +
    "• Agendamento de procedimentos e cirurgias\n" +
    "• Sistema inteligente de priorização\n" +
    "• Organização de escalas médicas\n\n" +
    " - Como posso ajudar com sua agenda hoje?",

  'Gestão de Medicamentos':
    "💊 Sistema de Gestão de Medicamentos\n\n" +
    " - Funcionalidades disponíveis:\n" +
    "• Controle de estoque e validade\n" +
    "• Análise de interações medicamentosas\n" +
    "• Monitoramento de dispensação\n" +
    "• Alertas de necessidade de reposição\n\n" +
    " - Qual aspecto da gestão de medicamentos você precisa consultar?",

  'Resultados de Exames':
    "🔬 Central de Resultados de Exames\n\n" +
    " - Funcionalidades disponíveis:\n" +
    "• Visualização de exames laboratoriais\n" +
    "• Acesso a exames de imagem\n" +
    "• Análise comparativa de resultados\n" +
    "• Histórico completo de exames\n\n" +
    " - Por favor, informe o ID do exame ou paciente para consulta.",

  'Suporte à Decisão Clínica':
    "⚕️ Suporte à Decisão Clínica\n\n" +
    " - Funcionalidades disponíveis:\n" +
    "• Análise baseada em evidências\n" +
    "• Sugestões de diagnóstico diferencial\n" +
    "• Recomendações de tratamento\n" +
    "• Análise de casos similares\n\n" +
    " - Por favor, descreva o caso clínico para análise."
};

export const initialMessage = 'Olá! Sou Cognitiva AI, sua assistente virtual especializada em saúde. ' +
'Posso ajudar com gestão de pacientes, análise de prontuários, agendamentos e muito mais. ' +
'Como posso auxiliar você hoje?';

export interface TrendEmojis {
  increasing: string;
  stable: string;
  decreasing: string;
  variable: string;
}

export interface RiskEmojis {
  low: string;
  medium: string;
  high: string;
}

export function formatAIResponse(result: any): string {
  // Verificar se result e result.data existem
  if (!result || !result.data) {
    return '❌ Não foi possível processar os dados do paciente.';
  }

  // Extrair dados com valores padrão caso não existam
  const {
    vitalsAnalysis = {
      alerts: [],
      risk: 'low',
      summary: ''
    },
    medicationAnalysis = {
      interactions: [],
      adjustments: [],
      summary: ''
    },
    recommendations = [],
    riskScores = {
      clinical: 0,
      medication: 0,
      readmission: 0
    }
  } = result.data;

  // Definir os emojis
  const riskEmoji: Record<string, string> = {
    'low': '🟢',
    'medium': '🟡',
    'high': '🔴'
  };

  // Converter score numérico para nível de risco
  const getRiskLevel = (score: number) => {
    if (score >= 75) return 'high';
    if (score >= 50) return 'medium';
    return 'low';
  };

  const overallRiskLevel = getRiskLevel(riskScores.clinical);
  const selectedRiskEmoji = riskEmoji[overallRiskLevel] || '⚪';

  const message = `
    🏥 *Análise do Paciente*

    *Status Atual:*
    ${selectedRiskEmoji} Nível de Risco: ${overallRiskLevel.toUpperCase()}
    
    *Análise de Sinais Vitais:*
    ${vitalsAnalysis.alerts && vitalsAnalysis.alerts.length > 0
      ? vitalsAnalysis.alerts.map((alert: string) => `⚠️ ${alert}`).join('\n')
      : '✅ Sinais vitais estáveis'}

    *Análise de Medicamentos:*
    ${medicationAnalysis.interactions && medicationAnalysis.interactions.length > 0
      ? medicationAnalysis.interactions.map((interaction: any) => 
          `⚕️ ${interaction.medications?.join(' + ') || 'Medicamentos'}: ${interaction.severity || 'N/A'} - ${interaction.recommendation || 'N/A'}`
        ).join('\n')
      : '✅ Sem interações medicamentosas identificadas'}

    *Ajustes Sugeridos:*
    ${medicationAnalysis.adjustments && medicationAnalysis.adjustments.length > 0
      ? medicationAnalysis.adjustments.map((adjustment: string) => `💊 ${adjustment}`).join('\n')
      : '✅ Sem ajustes necessários'}

    *Recomendações:*
    ${recommendations && recommendations.length > 0
      ? recommendations.map((rec: string) => `• ${rec}`).join('\n')
      : '✅ Sem recomendações específicas'}

    *Scores de Risco:*
    📊 Risco Clínico: ${riskScores.clinical || 0}%
    💊 Risco Medicamentoso: ${riskScores.medication || 0}%
    🔄 Risco de Readmissão: ${riskScores.readmission || 0}%

    *Monitoramento Sugerido:*
    🕐 Verificação de sinais vitais: ${
      overallRiskLevel === 'high' ? 'a cada 2h' :
      overallRiskLevel === 'medium' ? 'a cada 4h' : 'a cada 6h'
    }
    🔬 Exames laboratoriais: ${
      overallRiskLevel === 'high' ? 'Diário' :
      overallRiskLevel === 'medium' ? 'A cada 48h' : 'A cada 72h'
    }
  `;

  return message.trim();
}