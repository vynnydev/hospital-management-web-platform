'use client'

import { useState, useEffect } from 'react'
import { Check, ChevronDown, Building } from 'lucide-react'
import { useNetworkData } from '@/services/hooks/network-hospital/useNetworkData'
import { useAuth } from '@/services/hooks/auth/useAuth'

import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/organisms/select'

interface HospitalSelectorProps {
  onHospitalChange: (hospitalId: string) => void;
  selectedHospitalId?: string;
  className?: string;
}

export const HospitalSelector = ({ 
  onHospitalChange, 
  selectedHospitalId,
  className = "" 
}: HospitalSelectorProps) => {
  const { networkData, loading: networkLoading } = useNetworkData();
  const { user, hasPermission } = useAuth();
  const [hospitals, setHospitals] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedId, setSelectedId] = useState<string | undefined>(selectedHospitalId);

  // Carregar lista de hospitais disponíveis para o usuário
  useEffect(() => {
    if (!networkData?.hospitals) return;

    const availableHospitals = hasPermission('VIEW_ALL_HOSPITALS')
      ? networkData.hospitals
      : networkData.hospitals.filter(h => h.id === user?.hospitalId);
    
    setHospitals(availableHospitals);
    
    // Se não houver hospital selecionado, selecione o primeiro
    if (!selectedId && availableHospitals.length > 0) {
      setSelectedId(availableHospitals[0].id);
      onHospitalChange(availableHospitals[0].id);
    }
  }, [networkData, user, hasPermission, selectedId, onHospitalChange]);

  // Quando mudar o hospital selecionado
  const handleHospitalChange = (value: string) => {
    setSelectedId(value);
    onHospitalChange(value);
  };

  if (networkLoading) {
    return (
      <div className={`flex items-center ${className}`}>
        <div className="w-6 h-6 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin mr-2"></div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Carregando hospitais...</span>
      </div>
    );
  }

  // Se só tiver um hospital, mostre apenas o nome
  if (hospitals.length === 1) {
    return (
      <div className={`flex items-center ${className}`}>
        <Building className="h-5 w-5 mr-2 text-indigo-500 dark:text-indigo-400" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {hospitals[0].name}
        </span>
      </div>
    );
  }

  return (
    <div className={className}>
      <Select
        value={selectedId}
        onValueChange={handleHospitalChange}
      >
        <SelectTrigger className="w-full md:w-[300px] bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
          <div className="flex items-center">
            <Building className="h-4 w-4 mr-2 text-indigo-500 dark:text-indigo-400" />
            <SelectValue placeholder="Selecione um hospital" />
          </div>
        </SelectTrigger>
        <SelectContent>
          {hospitals.map((hospital) => (
            <SelectItem key={hospital.id} value={hospital.id}>
              <div className="flex items-center">
                <Building className="h-4 w-4 mr-2 text-indigo-500 dark:text-indigo-400" />
                <span>{hospital.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};