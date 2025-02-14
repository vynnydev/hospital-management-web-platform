import { IBed, INetworkData } from "@/types/hospital-network-types";

// Utility function to count beds by status and hospital with the new room structure
export const countBedsByStatus = (
    networkData: INetworkData | null,
    status: IBed['status'],
    selectedHospital: string = 'all'
  ): number => {
    if (!networkData?.hospitals) return 0;
  
    return networkData.hospitals
      .filter(hospital => selectedHospital === 'all' || hospital.id === selectedHospital)
      .reduce((totalBeds, hospital) => {
        const hospitalBeds = hospital.departments?.reduce((deptBeds, dept) => {
          const departmentBeds = dept.rooms?.reduce((roomBeds, room) => {
            const statusBeds = room.beds?.filter(bed => bed.status === status).length || 0;
            return roomBeds + statusBeds;
          }, 0) || 0;
          
          return deptBeds + departmentBeds;
        }, 0) || 0;
  
        return totalBeds + hospitalBeds;
      }, 0);
};