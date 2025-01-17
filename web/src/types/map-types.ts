export interface Coordinates {
    lat: number;
    lng: number;
}
  
export interface DepartmentMetrics {
    maxBeds: number;
    maxOccupancy: number;
    recommendedMaxOccupancy: number;
}
  
export interface Department {
    occupancy: number;
    beds: number;
    patients: number;
    validStatuses: string[];
}
  
export interface DepartmentStatus {
    name: string;
    status: 'normal' | 'attention' | 'critical';
    occupancy: number;
    waitingList: number;
    icon: React.ElementType;
}