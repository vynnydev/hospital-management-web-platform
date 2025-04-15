// components/hospital/HospitalDetails.tsx
import React from 'react';
import { IHospital } from "@/types/hospital-network-types";
import { TViewMode } from '../HospitalsLocations';
import { Building2, MapPin, TrendingUp } from 'lucide-react';
import { OverviewView } from './OverviewView';
import { ResourcesView } from './ResourcesView';
import { TransfersView } from './TransfersView';
import { PredictionsView } from './PredictionsView';
import { EmergencyView } from './EmergencyView';
import { StaffingView } from './StaffingView';
import { useHospitalAdvancedData } from '@/hooks/network-hospital/useHospitalAdvancedData';

interface IHospitalDetailsProps {
  hospital: IHospital;
  viewMode: TViewMode;
  advancedData: ReturnType<typeof useHospitalAdvancedData>;
}

export const HospitalDetails: React.FC<IHospitalDetailsProps> = ({
  hospital,
  viewMode,
  advancedData
}) => {
  const { resourcesData, predictiveData, emergencyData, loading: advancedDataLoading } = advancedData;

  if (advancedDataLoading) {
    return (
      <div className="animate-pulse flex flex-col space-y-3 p-3">
        <div className="h-4 bg-gray-700/50 rounded w-3/4"></div>
        <div className="h-4 bg-gray-700/50 rounded w-1/2"></div>
        <div className="h-4 bg-gray-700/50 rounded w-5/6"></div>
      </div>
    );
  }

  switch (viewMode) {
    case 'resources':
      return <ResourcesView 
        hospital={hospital} 
        resources={resourcesData?.resources[hospital.id]} 
      />;
    case 'transfers':
      return <TransfersView 
        hospital={hospital}
        resources={resourcesData?.resources[hospital.id]}
      />;
    case 'predictions':
      return <PredictionsView
        hospital={hospital}
        predictions={predictiveData?.predictions[hospital.id]}
      />;
    case 'emergency':
      return <EmergencyView
        hospital={hospital}
        emergencyData={emergencyData}
      />;
    case 'staffing':
      return <StaffingView
        hospital={hospital}
        predictiveData={predictiveData}
        resourcesData={resourcesData}
      />;
    default: // overview
      return <OverviewView
        hospital={hospital}
        resourcesData={resourcesData}
        predictiveData={predictiveData}
        emergencyData={emergencyData}
      />;
  }
};