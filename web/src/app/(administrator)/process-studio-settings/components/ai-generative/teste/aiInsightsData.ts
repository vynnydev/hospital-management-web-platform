/**
 * Dados de exemplo para insights gerados pela IA
 * Em um ambiente real, estes insights seriam gerados dinamicamente
 * com base na análise dos dados do hospital
 */

export const aiInsightsData = [
    {
      id: 'insight-1',
      title: 'Tendência de Ocupação',
      description: 'A ocupação da UTI tem aumentado 5% por semana nas últimas 3 semanas. Considere revisar os critérios de alta.',
      severity: 'medium',
      metrics: ['Taxa de Ocupação UTI', 'Tempo Médio de Permanência']
    },
    {
      id: 'insight-2',
      title: 'Déficit de Equipe',
      description: 'O setor de Oncologia está com 30% das posições em aberto, podendo impactar a qualidade do atendimento.',
      severity: 'high',
      metrics: ['Déficit de Equipes', 'Risco de Burnout']
    },
    {
      id: 'insight-3',
      title: 'Manutenção Preventiva',
      description: 'Há 5 equipamentos críticos que necessitarão de manutenção nos próximos 7 dias.',
      severity: 'low',
      metrics: ['Higienização de Equipamentos', 'Manutenção']
    },
    {
      id: 'insight-4',
      title: 'Tempo de Espera Elevado',
      description: 'O tempo médio de espera para atendimento na emergência aumentou 15% no último mês.',
      severity: 'medium',
      metrics: ['Tempo de Espera', 'Eficiência Operacional']
    },
    {
      id: 'insight-5',
      title: 'Alta Taxa de Reinternação',
      description: 'Pacientes do departamento de Cardiologia estão apresentando taxa de reinternação 12% acima da média.',
      severity: 'high',
      metrics: ['Taxa de Giro', 'Hospital Crítico']
    }
  ];