export interface Doctor {
    id: string;
    name: string;
    specialty: string;
    patients: string[];
    schedule: {
      shifts: string[];
      appointments: {
        patientId: string;
        date: string;
        type: string;
      }[];
    };
}
  
export interface Nurse {
    id: string;
    name: string;
    shift: string;
    assignedBeds: string[];
    tasks: {
      patientId: string;
      type: string;
      time: string;
      status: string;
    }[];
}
  
export interface AssignStaffData {
    patientId: string;
    doctorId: string;
    nurseId: string;
    department: string;
}