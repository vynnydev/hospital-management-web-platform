interface MaintenanceRecommendation {
  [key: string]: string[];
}

// Função auxiliar para gerar recomendações baseadas no diagnóstico
export const getMaintenanceRecommendations = (diagnosis: string): string[] => {
    const recommendations: MaintenanceRecommendation = {
      'Post-cardiac surgery': [
        'Verificar regularmente a calibração dos monitores cardíacos',
        'Manter sistema de gases medicinais em condições ideais',
        'Garantir backup de energia para equipamentos vitais',
        'Verificar funcionamento do sistema de chamada de emergência'
      ],
      'Hip replacement recovery': [
        'Verificar integridade das barras de apoio do leito',
        'Garantir funcionamento suave dos controles de elevação',
        'Manter colchão em condições adequadas para prevenção de úlceras',
        'Verificar sistema de trava das rodas do leito'
      ]
    };
  
    return recommendations[diagnosis] || [
      'Realizar checagem padrão dos equipamentos',
      'Verificar condições gerais do leito',
      'Manter higienização conforme protocolo'
    ];
};
  
// Função auxiliar para gerar cronograma de manutenção
export const getMaintenanceSchedule = (diagnosis: string, admissionDate: string): string[] => {
    const baseSchedule: string[] = [
      'Próxima higienização completa: Em 3 dias',
      'Verificação de equipamentos: Diariamente',
      'Manutenção preventiva: Em 7 dias'
    ];
  
    if (diagnosis.toLowerCase().includes('cardiac')) {
      baseSchedule.push('Calibração de monitores cardíacos: Em 48 horas');
    }
  
    return baseSchedule;
};