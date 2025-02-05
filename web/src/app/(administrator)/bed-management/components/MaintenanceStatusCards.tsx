/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Building2, Calendar } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/organisms/select';
import { useNetworkData } from '@/services/hooks/useNetworkData';
import { IHospital } from '@/types/hospital-network-types';

interface MaintenanceStatusCardsProps {
  className?: string;
  selectedHospitalId?: string;
}

interface MaintenanceCardProps {
  title: string;
  subtitle: string;
  count: number;
  selectedHospital: string;
  onHospitalChange: (hospital: string) => void;
  hasAllHospitalsPermission: boolean | undefined;
  hospitals: IHospital[];
  className?: string;
}

export const MaintenanceStatusCards: React.FC<MaintenanceStatusCardsProps> = ({ 
  className,
  selectedHospitalId 
}) => {
  const { networkData, currentUser } = useNetworkData();
  
  const hasAllHospitalsPermission = currentUser?.permissions?.includes('VIEW_ALL_HOSPITALS');
  const defaultHospital = hasAllHospitalsPermission ? 'all' : currentUser?.hospitalId || '';
  const [selectedHospital, setSelectedHospital] = React.useState(selectedHospitalId || defaultHospital);

  // Estado separado para cada card
  const [maintenanceHospital, setMaintenanceHospital] = React.useState('all');
  const [pendingHospital, setPendingHospital] = React.useState('all');

  const getMaintenanceBedsCount = () => {
    if (!networkData?.hospitals) return 0;
    
    let maintenanceBeds = 0;
    networkData.hospitals.forEach(hospital => {
      if (maintenanceHospital === 'all' || hospital.id === maintenanceHospital) {
        hospital.departments?.forEach(dept => {
          maintenanceBeds += dept.beds?.filter(bed => bed.status === 'maintenance').length || 0;
        });
      }
    });
    return maintenanceBeds;
  };
 
  const getPendingMaintenanceBedsCount = () => {
    if (!networkData?.hospitals) return 0;
    
    let availableBeds = 0;
    networkData.hospitals.forEach(hospital => {
      if (pendingHospital === 'all' || hospital.id === pendingHospital) {
        hospital.departments?.forEach(dept => {
          availableBeds += dept.beds?.filter(bed => bed.status === 'available').length || 0;
        });
      }
    });
    return availableBeds;
  };

  const MaintenanceCard: React.FC<MaintenanceCardProps> = ({
    title,
    subtitle,
    count,
    selectedHospital,
    onHospitalChange,
    hasAllHospitalsPermission,
    hospitals,
    className
   }) => {
    const HospitalSelect = () => (
      <Select 
        value={selectedHospital}
        onValueChange={onHospitalChange}
        disabled={!hasAllHospitalsPermission}
      >
        <SelectTrigger className="w-52 bg-gray-700/40 border-gray-600/50 rounded-2xl">
          <Building2 className="w-4 h-4 mr-2 text-gray-400" />
          <SelectValue placeholder="Selecione" />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-700">
          {hasAllHospitalsPermission && (
            <SelectItem value="all">Todos</SelectItem>
          )}
          {hospitals.map(hospital => (
            <SelectItem key={hospital.id} value={hospital.id}>
              {hospital.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
   
    return (
      <div className={`p-6 rounded-3xl space-y-4 ${className}`}>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-xl font-semibold text-gray-100 mt-4">{title}</h3>
          <HospitalSelect />
        </div>
   
        <div className="flex items-center text-sm text-gray-400 mb-4 pt-2">
          <Calendar className="w-4 h-4 mr-2" />
          {subtitle}
        </div>
   
        <div className="bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/15 dark:hover:bg-white/10 transition-colors">
          <div className="text-sm text-gray-400 mb-2">Quantidade de Leitos</div>
          <div className="text-4xl font-bold text-gray-100">
            {count} <span className="text-gray-400 text-2xl">leitos</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`grid grid-cols-2 gap-6 ${className}`}>
      <MaintenanceCard 
        title="Leitos em Manutenção"
        subtitle="Previsão de conclusão: 7 dias"
        count={getMaintenanceBedsCount()}
        selectedHospital={maintenanceHospital}
        onHospitalChange={setMaintenanceHospital}
        hasAllHospitalsPermission={hasAllHospitalsPermission}
        hospitals={networkData?.hospitals || []}
        className="bg-gradient-to-br from-amber-400/20 to-orange-300/20 hover:from-amber-400/30 hover:to-orange-300/30 dark:from-amber-600/20 dark:to-orange-500/20 border border-amber-200/20 dark:border-amber-400/20"
      />
      
      <MaintenanceCard 
        title="Leitos para Manutenção" 
        subtitle="Previsão para início: 15 dias"
        count={getPendingMaintenanceBedsCount()}
        selectedHospital={pendingHospital}
        onHospitalChange={setPendingHospital}
        hasAllHospitalsPermission={hasAllHospitalsPermission}
        hospitals={networkData?.hospitals || []}
        className="bg-gradient-to-br from-emerald-400/20 to-teal-300/20 hover:from-emerald-400/30 hover:to-teal-300/30 dark:from-emerald-600/20 dark:to-teal-500/20 border border-emerald-200/20 dark:border-emerald-400/20"
      />
    </div>
  );
};