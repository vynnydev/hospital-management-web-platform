import { useState, useEffect } from 'react';
import { useNetworkData } from '@/services/hooks/network-hospital/useNetworkData';
import { IHospital } from '@/types/hospital-network-types';

interface HospitalSelectorProps {
  selectedHospitalId: string;
  onSelect: (hospitalId: string) => void;
  className?: string;
}

export default function HospitalSelector({ 
  selectedHospitalId, 
  onSelect,
  className = '' 
}: HospitalSelectorProps) {
  const { networkData, loading, error } = useNetworkData();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<IHospital | null>(null);

  // Encontrar o hospital selecionado quando os dados estiverem disponíveis
  useEffect(() => {
    if (networkData?.hospitals && selectedHospitalId) {
      const hospital = networkData.hospitals.find(h => h.id === selectedHospitalId);
      setSelectedHospital(hospital || null);
    }
  }, [networkData, selectedHospitalId]);

  // Selecionar o primeiro hospital por padrão se nenhum for selecionado
  useEffect(() => {
    if (!selectedHospitalId && networkData?.hospitals && networkData.hospitals.length > 0) {
      onSelect(networkData.hospitals[0].id);
    }
  }, [networkData, selectedHospitalId, onSelect]);

  const handleSelectHospital = (hospital: IHospital) => {
    onSelect(hospital.id);
    setIsOpen(false);
  };

  if (loading) {
    return (
      <div className={`bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm ${className}`}>
        <div className="animate-pulse h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  if (error || !networkData?.hospitals) {
    return (
      <div className={`bg-red-50 dark:bg-red-900 p-2 rounded-lg ${className}`}>
        <p className="text-red-600 dark:text-red-300 text-sm">Erro ao carregar hospitais</p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm"
      >
        <div className="flex items-center">
          <span className="text-gray-500 dark:text-gray-400 text-sm font-medium mr-2">Hospital:</span>
          {selectedHospital ? (
            <span className="text-gray-900 dark:text-gray-100 font-medium">{selectedHospital.name}</span>
          ) : (
            <span className="text-gray-400 dark:text-gray-500">Selecione um hospital</span>
          )}
        </div>
        <svg 
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto">
          <ul className="py-1">
            {networkData.hospitals.map((hospital) => (
              <li key={hospital.id}>
                <button
                  type="button"
                  onClick={() => handleSelectHospital(hospital)}
                  className={`flex items-center w-full px-4 py-2.5 text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    selectedHospitalId === hospital.id 
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' 
                      : 'text-gray-900 dark:text-gray-100'
                  }`}
                >
                  <div className="flex-1">
                    <p className="font-medium">{hospital.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {hospital.unit.city}, {hospital.unit.state}
                    </p>
                  </div>
                  <div className="text-right text-xs">
                    <p className="text-gray-600 dark:text-gray-300">
                      Ocupação: {hospital.metrics?.overall?.occupancyRate.toFixed(1)}%
                    </p>
                    <p className={`font-medium ${
                      (hospital.metrics?.overall?.occupancyRate || 0) > 90 
                        ? 'text-red-600 dark:text-red-400' 
                        : (hospital.metrics?.overall?.occupancyRate || 0) > 75 
                          ? 'text-yellow-600 dark:text-yellow-400' 
                          : 'text-green-600 dark:text-green-400'
                    }`}>
                      {hospital.metrics?.overall?.availableBeds || 0} leitos disponíveis
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}