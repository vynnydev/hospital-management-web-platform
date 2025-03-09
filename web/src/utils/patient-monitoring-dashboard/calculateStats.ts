import { INetworkData } from '@/types/hospital-network-types';
import { IAmbulanceRoute } from '@/types/ambulance-types';

/**
 * Calcula estatísticas baseadas nos dados do hospital selecionado
 * 
 * @param networkData Dados da rede de hospitais
 * @param hospitalId ID do hospital selecionado
 * @param activeRoutes Rotas ativas de ambulâncias
 * @returns Estatísticas calculadas
 */
export const calculateStats = (
  networkData: INetworkData | null,
  hospitalId: string,
  activeRoutes: IAmbulanceRoute[]
) => {
  if (!networkData || !hospitalId) {
    return {
      totalPatients: 0,
      occupiedBeds: 0,
      availableBeds: 0,
      incomingTransfers: 0,
      outgoingTransfers: 0,
      criticalPatients: 0,
      occupancyRate: 0
    };
  }
  
  const hospital = networkData.hospitals.find(h => h.id === hospitalId);
  if (!hospital) {
    return {
      totalPatients: 0,
      occupiedBeds: 0,
      availableBeds: 0,
      incomingTransfers: 0,
      outgoingTransfers: 0,
      criticalPatients: 0,
      occupancyRate: 0
    };
  }
  
  // Contar pacientes, leitos ocupados, disponíveis
  let totalPatients = 0;
  let occupiedBeds = 0;
  let availableBeds = 0;
  let criticalPatients = 0;
  
  hospital.departments.forEach(dept => {
    dept.rooms.forEach(room => {
      room.beds.forEach(bed => {
        if (bed.status === 'occupied') {
          occupiedBeds++;
          totalPatients++;
          
          // Verificar se é um paciente crítico (simplificação)
          if (bed.patient?.careHistory?.statusHistory) {
            const lastStatus = bed.patient.careHistory.statusHistory[
              bed.patient.careHistory.statusHistory.length - 1
            ];
            if (
              lastStatus && 
              (lastStatus.status === 'Em Procedimento' || 
               lastStatus.status === 'Em Recuperação') &&
              lastStatus.department === 'UTI'
            ) {
              criticalPatients++;
            }
          }
        } else if (bed.status === 'available') {
          availableBeds++;
        }
      });
    });
  });
  
  // Calcular taxa de ocupação
  const totalBeds = occupiedBeds + availableBeds;
  const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;
  
  // Contar transferências de/para este hospital
  const incomingTransfers = activeRoutes.filter(
    route => route.destination.hospitalId === hospitalId
  ).length;
  
  const outgoingTransfers = activeRoutes.filter(
    route => route.origin.hospitalId === hospitalId
  ).length;
  
  return {
    totalPatients,
    occupiedBeds,
    availableBeds,
    incomingTransfers,
    outgoingTransfers,
    criticalPatients,
    occupancyRate
  };
};