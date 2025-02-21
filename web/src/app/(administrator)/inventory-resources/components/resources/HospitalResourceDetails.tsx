/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { IHospitalResources, TDepartment } from '@/types/resources-types';
import { AlertCircle, ArrowDownRight, ArrowUpRight, ChevronRight, Loader2 } from 'lucide-react';
import { ResourceItem } from './items/ResourceItem';
import { SupplyItem } from './items/SupplyItem';
import { IHospital } from '@/types/hospital-network-types';
import { getCriticality, getEquipmentName, getSupplyName, getTrend } from '@/utils/resourceDetailsFunctions';

interface IHospitalResourceDetailsProps {
  hospital: IHospital;
  resources: IHospitalResources | null;
  loading: boolean;
  error: string | null;
  selectedDepartment: TDepartment;
  onTransferClick: (resourceType: string, category: 'equipment' | 'supplies') => void;
}

const departmentMapping: Record<TDepartment, string> = {
  uti: 'UTI',
  enfermaria: 'Enfermaria',
  centro_cirurgico: 'Centro Cirúrgico',
  pediatria: 'Pediatria',
  all: 'Todos os Departamentos'
} as const;

const getDepartmentLabel = (department: TDepartment): string => {
  return departmentMapping[department] || department;
};

export const HospitalResourceDetails: React.FC<IHospitalResourceDetailsProps> = ({
  hospital,
  resources,
  loading,
  error,
  selectedDepartment,
  onTransferClick
}) => {
  // Estado de carregamento e erro permanecem iguais...

  // Filtra recursos baseado no departamento selecionado
  const filterResourcesByDepartment = (
    resources: IHospitalResources | null, 
    department: TDepartment
  ): IHospitalResources | null => {
    if (!resources || department === 'all') {
      return resources;
    }
  
    const departmentEquipment: Record<Exclude<TDepartment, 'all'>, string[]> = {
      uti: ['respirators', 'monitors'],
      enfermaria: ['monitors', 'defibrillators'],
      centro_cirurgico: ['monitors', 'defibrillators', 'respirators'],
      pediatria: ['monitors', 'defibrillators']
    };
  
    const selectedEquipment = departmentEquipment[department];
  
    return {
      ...resources,
      equipmentStatus: Object.fromEntries(
        Object.entries(resources.equipmentStatus)
          .filter(([key]) => selectedEquipment.includes(key))
      ),
      suppliesStatus: resources.suppliesStatus,
      transferRequests: resources.transferRequests
    } as IHospitalResources;
  };

  const filteredResources = filterResourcesByDepartment(resources, selectedDepartment);

  if (!filteredResources) {
    return (
      <div className="bg-gray-800/70 mt-2 rounded-lg p-4">
        <div className="flex flex-col items-center justify-center space-y-3">
          <AlertCircle className="h-6 w-6 text-yellow-500" />
          <div className="text-center">
            <p className="text-gray-400">
              Não há dados de recursos disponíveis
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 text-sm text-blue-400 hover:text-blue-300"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/70 mt-2 rounded-lg overflow-hidden">
      <div className="p-3 border-b border-gray-700">
        <h3 className="text-white font-medium flex items-center">
          Recursos Disponíveis
          {selectedDepartment !== 'all' && (
            <span className="ml-2 text-sm text-gray-400">
              ({getDepartmentLabel(selectedDepartment)})
            </span>
          )}
        </h3>
      </div>

      <div className="p-2 max-h-[240px] overflow-y-auto">
        {/* Equipamentos */}
        <div className="mb-3">
          <div className="flex items-center mb-2">
            <span className="h-2 w-2 rounded-full bg-blue-500 mr-2" />
            <h4 className="text-blue-300 text-sm font-medium">Equipamentos</h4>
          </div>
          
          <div className="space-y-2 pl-4">
            {Object.entries(filteredResources.equipmentStatus).length > 0 ? (
              Object.entries(filteredResources.equipmentStatus).map(([key, value]) => (
                <ResourceItem 
                  key={key}
                  name={getEquipmentName(key)}
                  available={value.available}
                  total={value.total}
                  criticality={getCriticality(value.available, value.total)}
                  trend={getTrend(value.available, value.total)}
                  onClick={() => onTransferClick(key, 'equipment')}
                />
              ))
            ) : (
              <div className="text-center py-2 text-gray-400 text-sm">
                Nenhum equipamento disponível para este departamento
              </div>
            )}
          </div>
        </div>
        
        {/* Suprimentos */}
        <div className="mb-3">
          <div className="flex items-center mb-2">
            <span className="h-2 w-2 rounded-full bg-green-500 mr-2" />
            <h4 className="text-green-300 text-sm font-medium">Suprimentos</h4>
          </div>
          
          <div className="space-y-2 pl-4">
            {Object.entries(filteredResources.suppliesStatus).map(([key, status]) => (
              <SupplyItem 
                key={key}
                name={getSupplyName(key)}
                status={status}
                onClick={() => onTransferClick(key, 'supplies')}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};