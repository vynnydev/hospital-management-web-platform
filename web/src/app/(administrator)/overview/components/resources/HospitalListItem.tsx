// components/hospital/HospitalListItem.tsx
import React from 'react';
import { MapPin } from 'lucide-react';
import { IHospital } from "@/types/hospital-network-types";

interface IHospitalListItemProps {
  hospital: IHospital;
}

export const HospitalListItem: React.FC<IHospitalListItemProps> = ({ hospital }) => (
  <div className="p-3">
    <div className="flex items-center justify-between">
      <h3 className="font-medium text-white truncate mr-2">
        {hospital.name}
      </h3>
      <span className={`text-sm font-medium ${
        hospital.metrics.overall.occupancyRate > 80 
          ? 'text-red-400' 
          : hospital.metrics.overall.occupancyRate > 60 
            ? 'text-yellow-400' 
            : 'text-green-400'
      }`}>
        {hospital.metrics.overall.occupancyRate}%
      </span>
    </div>
    <div className="flex items-center text-xs text-gray-400 mt-1">
      <MapPin className="h-3 w-3 mr-1" />
      <span className="truncate">{hospital.unit.city}, {hospital.unit.state}</span>
    </div>
  </div>
);