import { IDepartment } from "@/types/hospital-network-types";

// Funções auxiliares atualizadas para trabalhar diretamente com IDepartment
export const countDepartmentPatients = (dept: IDepartment): number => {
    return dept.rooms.reduce((total, room) => 
      total + room.beds.filter(bed => bed.status === 'occupied').length, 0
    );
};
  
export const calculateDepartmentOccupancy = (dept: IDepartment): number => {
    const totalBeds = dept.rooms.reduce((total, room) => 
      total + room.beds.length, 0
    );
    const occupiedBeds = countDepartmentPatients(dept);
    return totalBeds > 0 ? (occupiedBeds / totalBeds) * 100 : 0;
};

// Calcula leitos disponíveis
export const getAvailableBeds = (department: IDepartment): number => {
    return department.rooms.reduce((total, room) => 
        total + room.beds.filter(bed => bed.status === 'available').length, 0
    );
};

// Calcula leitos em manutenção
export const getMaintenanceBeds = (department: IDepartment): number => {
    return department.rooms.reduce((total, room) => 
        total + room.beds.filter(bed => bed.status === 'maintenance').length, 0
    );
};

export const calculateDepartmentCapacity = (dept: IDepartment): number => {
    return dept.rooms.reduce((total, room) => total + room.beds.length, 0);
};