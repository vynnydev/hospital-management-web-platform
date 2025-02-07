import { IDepartment } from "@/types/hospital-network-types";

// Função para calcular a ocupação do departamento
export const calculateDepartmentOccupancy = (department: IDepartment): number => {
    const occupiedBeds = department.beds.filter(bed => bed.status === 'occupied').length;
    const totalBeds = department.beds.length;
    return totalBeds > 0 ? (occupiedBeds / totalBeds) * 100 : 0;
};

// Função para contar pacientes no departamento
export const countDepartmentPatients = (department: IDepartment): number => {
    return department.beds.filter(bed => bed.status === 'occupied' && bed.patient).length;
};