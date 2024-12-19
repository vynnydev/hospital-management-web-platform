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

// Então, defina o objeto usando Record
export const cardInitialMessages: Record<CardTitle, string> = {
  'Gestão de Pacientes': 
    "🏥 Iniciando módulo de Gestão de Pacientes\n\n" +
    "Funcionalidades disponíveis:\n" +
    "• Monitoramento em tempo real de sinais vitais\n" +
    "• Análise de histórico médico e evolução\n" +
    "• Avaliação de riscos e complicações\n" +
    "• Alertas automáticos para alterações críticas\n\n" +
    "Por favor, informe o ID do paciente para iniciar a análise.",

  'Prontuário Digital':
    "📋 Acessando Prontuário Digital\n\n" +
    "Funcionalidades disponíveis:\n" +
    "• Visualização completa do histórico médico\n" +
    "• Acesso a exames e resultados\n" +
    "• Histórico de prescrições médicas\n" +
    "• Evolução detalhada do tratamento\n\n" +
    "Por favor, informe o ID do prontuário para consulta.",

  'Agenda Médica':
    "🗓️ Sistema de Agenda Médica\n\n" +
    "Funcionalidades disponíveis:\n" +
    "• Gerenciamento de consultas e retornos\n" +
    "• Agendamento de procedimentos e cirurgias\n" +
    "• Sistema inteligente de priorização\n" +
    "• Organização de escalas médicas\n\n" +
    "Como posso ajudar com sua agenda hoje?",

  'Gestão de Medicamentos':
    "💊 Sistema de Gestão de Medicamentos\n\n" +
    "Funcionalidades disponíveis:\n" +
    "• Controle de estoque e validade\n" +
    "• Análise de interações medicamentosas\n" +
    "• Monitoramento de dispensação\n" +
    "• Alertas de necessidade de reposição\n\n" +
    "Qual aspecto da gestão de medicamentos você precisa consultar?",

  'Resultados de Exames':
    "🔬 Central de Resultados de Exames\n\n" +
    "Funcionalidades disponíveis:\n" +
    "• Visualização de exames laboratoriais\n" +
    "• Acesso a exames de imagem\n" +
    "• Análise comparativa de resultados\n" +
    "• Histórico completo de exames\n\n" +
    "Por favor, informe o ID do exame ou paciente para consulta.",

  'Suporte à Decisão Clínica':
    "⚕️ Suporte à Decisão Clínica\n\n" +
    "Funcionalidades disponíveis:\n" +
    "• Análise baseada em evidências\n" +
    "• Sugestões de diagnóstico diferencial\n" +
    "• Recomendações de tratamento\n" +
    "• Análise de casos similares\n\n" +
    "Por favor, descreva o caso clínico para análise."
};

export const initialMessage = 'Olá! Sou AIDA, sua assistente virtual especializada em saúde. ' +
'Posso ajudar com gestão de pacientes, análise de prontuários, agendamentos e muito mais. ' +
'Como posso auxiliar você hoje?';

export interface TrendEmojis {
  melhorando: string;
  estável: string;
  deteriorando: string;
  variável: string;
}

export interface RiskEmojis {
  Baixo: string;
  Médio: string;
  Alto: string;
}

export function formatAIResponse(result: any): string {
  const {
    analysis,
    riskAnalysis,
    predictedOutcomes
  } = result;

  // Definir os emojis com tipos corretos
  const riskEmoji: RiskEmojis = {
    'Baixo': '🟢',
    'Médio': '🟡',
    'Alto': '🔴'
  };

  const trendEmoji: TrendEmojis = {
    'melhorando': '📈',
    'estável': '➡️',
    'deteriorando': '📉',
    'variável': '↕️'
  };

  // Usar as interfaces para acessar os emojis de forma segura
  const selectedRiskEmoji = riskEmoji[analysis.riskLevel as keyof RiskEmojis] || '⚪';
  const selectedTrendEmoji = trendEmoji[analysis.trend as keyof TrendEmojis] || '➡️';

  const message = `
    🏥 *Análise do Paciente*

    *Status Atual:*
    ${selectedRiskEmoji} Nível de Risco: ${analysis.riskLevel}
    ${selectedTrendEmoji} Tendência: ${analysis.trend}

    *Alertas Importantes:*
    ${analysis.alerts.length > 0 
    ? analysis.alerts.map((alert: any) => `⚠️ ${alert}`).join('\n')
    : '✅ Nenhum alerta crítico'}

    *Recomendações Principais:*
    ${analysis.recommendations.map((rec: any) => `• ${rec}`).join('\n')}

    *Previsões:*
    📊 Tempo estimado de internação: ${predictedOutcomes.estimatedLOS} dias
    🎯 Probabilidade de complicações: ${predictedOutcomes.complicationRisk.probability.toFixed(2)}%
    📋 Trajetória prevista: ${predictedOutcomes.recoveryTrajectory}

    *Análise de Medicamentos:*
    ${riskAnalysis.medicationImpact.interactions.length > 0
    ? riskAnalysis.medicationImpact.interactions.map((interaction: any) => `⚕️ ${interaction}`).join('\n')
    : '✅ Sem interações medicamentosas identificadas'}

    *Observações dos Sinais Vitais:*
    ${riskAnalysis.currentStatus.abnormalities.length > 0
    ? riskAnalysis.currentStatus.abnormalities.map((abnormality: any) => `📊 ${abnormality}`).join('\n')
    : '✅ Sinais vitais dentro dos parâmetros normais'}

    ${riskAnalysis.overallRisk.mitigationStrategies.length > 0
    ? `\n*Estratégias de Mitigação de Risco:*\n${riskAnalysis.overallRisk.mitigationStrategies.map((strategy: any) => `💡 ${strategy}`).join('\n')}`
    : ''}
    `;

  return message.trim();
}