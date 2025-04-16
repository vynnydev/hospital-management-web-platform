// components/hospital/views/ResourcesView.tsx
import React from 'react';
import { IHospital } from "@/types/hospital-network-types";
import { IHospitalResources } from '@/types/hospital-advanced-data-types';

interface IResourcesViewProps {
  hospital: IHospital;
  resources?: IHospitalResources;
}

export const ResourcesView: React.FC<IResourcesViewProps> = ({ resources }) => {
  if (!resources) {
    return (
      <div className="p-3">
        <p className="text-gray-400">Dados de recursos não disponíveis</p>
      </div>
    );
  }

  return (
    <div className="p-3 space-y-4">
      <div>
        <h4 className="text-blue-300 text-sm font-medium mb-2">Equipamentos</h4>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-700/50 p-2 rounded-md">
            <p className="text-xs text-gray-300">Respiradores</p>
            <p className="text-white">{resources.equipmentStatus.respirators.available}/{resources.equipmentStatus.respirators.total}</p>
          </div>
          <div className="bg-gray-700/50 p-2 rounded-md">
            <p className="text-xs text-gray-300">Monitores</p>
            <p className="text-white">{resources.equipmentStatus.monitors.available}/{resources.equipmentStatus.monitors.total}</p>
          </div>
        </div>
      </div>
      
      <div>
        <h4 className="text-green-300 text-sm font-medium mb-2">Leitos</h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-300">UTI</span>
            <span className={`text-sm font-medium ${
              resources.bedStatus.icu.available < 5 ? 'text-red-400' : 'text-green-400'
            }`}>
              {resources.bedStatus.icu.available}/{resources.bedStatus.icu.total}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Emergência</span>
            <span className={`text-sm font-medium ${
              resources.bedStatus.emergency.available < 5 ? 'text-red-400' : 'text-green-400'
            }`}>
              {resources.bedStatus.emergency.available}/{resources.bedStatus.emergency.total}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Geral</span>
            <span className="text-sm font-medium text-green-400">
              {resources.bedStatus.general.available}/{resources.bedStatus.general.total}
            </span>
          </div>
        </div>
      </div>
      
      <div>
        <h4 className="text-yellow-300 text-sm font-medium mb-2">Suprimentos</h4>
        <div className="space-y-1">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <span className="text-gray-300 text-sm">Críticos: {resources.suppliesStatus.medications.criticalLow + resources.suppliesStatus.bloodBank.criticalLow + resources.suppliesStatus.ppe.criticalLow}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
            <span className="text-gray-300 text-sm">Baixo Estoque: {resources.suppliesStatus.medications.lowStock + resources.suppliesStatus.bloodBank.lowStock + resources.suppliesStatus.ppe.lowStock}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-gray-300 text-sm">Normal: {resources.suppliesStatus.medications.normal + resources.suppliesStatus.bloodBank.normal + resources.suppliesStatus.ppe.normal}</span>
          </div>
        </div>
      </div>
    </div>
  );
};