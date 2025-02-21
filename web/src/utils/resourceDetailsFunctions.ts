// Funções auxiliares para o HospitalResourceDetails
export function getEquipmentName(key: string): string {
    const names: Record<string, string> = {
      respirators: 'Respiradores',
      monitors: 'Monitores',
      defibrillators: 'Desfibriladores',
      imagingDevices: 'Equipamentos de Imagem'
    };
    return names[key] || key;
}
  
export function getSupplyName(key: string): string {
    const names: Record<string, string> = {
      medications: 'Medicamentos',
      bloodBank: 'Banco de Sangue',
      ppe: 'EPIs'
    };
    return names[key] || key;
}
  
export function getCriticality(available: number, total: number): 'critical' | 'warning' | 'normal' {
    const ratio = available / total;
    if (ratio < 0.2) return 'critical';
    if (ratio < 0.5) return 'warning';
    return 'normal';
}
  
export function getTrend(available: number, total: number): 'up' | 'down' | 'stable' {
    const ratio = available / total;
    if (ratio > 0.7) return 'up';
    if (ratio < 0.3) return 'down';
    return 'stable';
}