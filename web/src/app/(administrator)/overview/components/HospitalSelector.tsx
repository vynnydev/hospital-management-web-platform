import { useState } from "react";
import { HospitalData } from "../types/hospital-network-types";

interface HospitalListProps {
    hospitals: HospitalData[];
    selectedId?: string;
    onSelect?: (hospital: HospitalData) => void;
    className?: string;
}

export const HospitalSelector: React.FC<HospitalListProps> = ({ 
    hospitals, 
    selectedId,
    onSelect,
    className 
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedHospital = hospitals.find(h => h.id === selectedId) || hospitals[0];
  
    return (
      <div className={className}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded-lg shadow"
        >
          <span>{selectedHospital.name}</span>
          <span>{selectedHospital.metrics.occupancyRate.total}% ocupação</span>
        </button>
        
        {isOpen && (
          <div className="mt-2 bg-white dark:bg-gray-800 rounded-lg shadow">
            {hospitals.map(hospital => (
              <button
                key={hospital.id}
                onClick={() => {
                  onSelect?.(hospital);
                  setIsOpen(false);
                }}
                className="w-full p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span>{hospital.name}</span>
                <span className="float-right">
                  {hospital.metrics.occupancyRate.total}% ocupação
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
};