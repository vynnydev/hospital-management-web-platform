import { HospitalData } from "../types/hospital-network-types";

interface HospitalProps {
    hospital: HospitalData;
    onSelect?: (hospital: HospitalData) => void;
    className?: string;
}

export const HospitalCard: React.FC<HospitalProps> = ({ hospital, onSelect, className }) => {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {hospital.name}
        </h3>
        <div className="mt-2 space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Ocupação Total: {hospital.metrics.occupancyRate.total}%
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Pacientes: {hospital.metrics.patients.total}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Leitos Disponíveis: {hospital.metrics.beds.available}
          </p>
        </div>
        <div className="mt-4">
          <button
            onClick={() => onSelect?.(hospital)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          >
            Ver Detalhes
          </button>
        </div>
      </div>
    );
};