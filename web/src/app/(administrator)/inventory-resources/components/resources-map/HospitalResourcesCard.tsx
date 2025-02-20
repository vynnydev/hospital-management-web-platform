import React from 'react';
import { IHospital } from '@/types/hospital-network-types';
import { IHospitalStaffMetrics } from '@/types/staff-types';
import { TResourceCategory } from '../ResourceManagementMap';
import { Building2, AlertCircle, TrendingUp, MapPin } from 'lucide-react';
import { IHospitalResources } from '@/types/resources-types';

interface IHospitalResourcesCardProps {
  hospital: IHospital;
  staffData?: IHospitalStaffMetrics;
  resources?: IHospitalResources;
  category: TResourceCategory;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const HospitalResourcesCard: React.FC<IHospitalResourcesCardProps> = ({
  hospital,
  staffData,
  resources,
  category,
  isSelected,
  onSelect
}) => {
  // Calcular métricas gerais
  const occupancyRate = hospital.metrics.overall.occupancyRate;
  const availableBeds = hospital.metrics.overall.availableBeds;
  
  // Calcular disponibilidade de equipamentos
  const equipmentAvailability = resources ? 
    Math.round(((resources.equipmentStatus.respirators.available + 
                 resources.equipmentStatus.monitors.available + 
                 resources.equipmentStatus.defibrillators.available) /
                (resources.equipmentStatus.respirators.total + 
                 resources.equipmentStatus.monitors.total + 
                 resources.equipmentStatus.defibrillators.total)) * 100) : 0;
  
  // Calcular criticidade de suprimentos
  const criticalSupplies = resources ?
    resources.suppliesStatus.medications.criticalLow +
    resources.suppliesStatus.bloodBank.criticalLow +
    resources.suppliesStatus.ppe.criticalLow : 0;
  
  // Calcular métricas específicas baseadas na categoria selecionada
  const getCategoryMetrics = () => {
    switch(category) {
      case 'equipment':
        if (!resources) return null;
        return (
          <div className="mt-2 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Respiradores</span>
              <span className={`text-sm ${
                resources.equipmentStatus.respirators.available < 5 ? 'text-red-400' : 'text-green-400'
              }`}>
                {resources.equipmentStatus.respirators.available}/{resources.equipmentStatus.respirators.total}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Monitores</span>
              <span className={`text-sm ${
                resources.equipmentStatus.monitors.available < 10 ? 'text-red-400' : 'text-green-400'
              }`}>
                {resources.equipmentStatus.monitors.available}/{resources.equipmentStatus.monitors.total}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Desfibriladores</span>
              <span className={`text-sm ${
                resources.equipmentStatus.defibrillators.available < 3 ? 'text-red-400' : 'text-green-400'
              }`}>
                {resources.equipmentStatus.defibrillators.available}/{resources.equipmentStatus.defibrillators.total}
              </span>
            </div>
          </div>
        );
        
      case 'supplies':
        if (!resources) return null;
        return (
          <div className="mt-2 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Medicamentos</span>
              <div className="flex items-center">
                <span className={`text-sm ${
                  resources.suppliesStatus.medications.criticalLow > 0 ? 'text-red-400' : 'text-green-400'
                }`}>
                  {resources.suppliesStatus.medications.criticalLow > 0 ? 
                    `${resources.suppliesStatus.medications.criticalLow} críticos` : 'OK'}
                </span>
                {resources.suppliesStatus.medications.criticalLow > 0 && 
                  <AlertCircle className="h-4 w-4 text-red-400 ml-1" />}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Banco de Sangue</span>
              <div className="flex items-center">
                <span className={`text-sm ${
                  resources.suppliesStatus.bloodBank.criticalLow > 0 ? 'text-red-400' : 'text-green-400'
                }`}>
                  {resources.suppliesStatus.bloodBank.criticalLow > 0 ? 
                    `${resources.suppliesStatus.bloodBank.criticalLow} críticos` : 'OK'}
                </span>
                {resources.suppliesStatus.bloodBank.criticalLow > 0 && 
                  <AlertCircle className="h-4 w-4 text-red-400 ml-1" />}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">EPIs</span>
              <div className="flex items-center">
                <span className={`text-sm ${
                  resources.suppliesStatus.ppe.criticalLow > 0 ? 'text-red-400' : 'text-green-400'
                }`}>
                  {resources.suppliesStatus.ppe.criticalLow > 0 ? 
                    `${resources.suppliesStatus.ppe.criticalLow} críticos` : 'OK'}
                </span>
                {resources.suppliesStatus.ppe.criticalLow > 0 && 
                  <AlertCircle className="h-4 w-4 text-red-400 ml-1" />}
              </div>
            </div>
          </div>
        );
        
      case 'staff':
        if (!staffData) return null;
        return (
          <div className="mt-2 space-y-2">
            {Object.entries(staffData.departmental).map(([deptName, metrics]) => (
              <div key={deptName} className="flex justify-between items-center">
                <span className="text-gray-300 text-sm capitalize">{deptName.replace('_', ' ')}</span>
                <div className="flex items-center">
                  <span className={`text-sm ${
                    metrics.onDuty < metrics.totalStaff * 0.7 ? 'text-red-400' : 'text-green-400'
                  }`}>
                    {metrics.onDuty}/{metrics.totalStaff}
                  </span>
                  {metrics.onDuty < metrics.totalStaff * 0.7 && 
                    <AlertCircle className="h-4 w-4 text-red-400 ml-1" />}
                </div>
              </div>
            ))}
          </div>
        );
        
      default: // 'all' or other
        return (
          <div className="mt-2 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Ocupação</span>
              <div className="flex items-center">
                <span className={`text-sm ${
                  occupancyRate > 80 ? 'text-red-400' : 
                  occupancyRate > 60 ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {occupancyRate}%
                </span>
                {occupancyRate > 80 && <TrendingUp className="h-4 w-4 text-red-400 ml-1" />}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Leitos</span>
              <span className="text-sm text-blue-400">{availableBeds}</span>
            </div>
            {resources && (
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Equipamentos</span>
                <span className={`text-sm ${
                  equipmentAvailability < 30 ? 'text-red-400' : 
                  equipmentAvailability < 50 ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {equipmentAvailability}% disp.
                </span>
              </div>
            )}
            {criticalSupplies > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Suprimentos</span>
                <div className="flex items-center">
                  <span className="text-sm text-red-400">{criticalSupplies} críticos</span>
                  <AlertCircle className="h-4 w-4 text-red-400 ml-1" />
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div 
      className={`p-3 rounded-lg transition-all duration-200 cursor-pointer ${
        isSelected 
          ? 'bg-blue-500/20 border border-blue-500/50'
          : 'bg-gray-700/50 hover:bg-gray-700'
      }`}
      onClick={() => onSelect(hospital.id)}
    >
      <div className="flex items-center space-x-2">
        <div className="h-10 w-10 bg-gray-600/50 rounded-full flex items-center justify-center">
          <Building2 className="h-5 w-5 text-blue-400" />
        </div>
        <div>
          <h3 className="font-medium text-white">{hospital.name}</h3>
          <div className="flex items-center text-xs text-gray-400">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            <span>{hospital.unit.city}, {hospital.unit.state}</span>
          </div>
        </div>
      </div>
      
      {getCategoryMetrics()}
    </div>
  );
};