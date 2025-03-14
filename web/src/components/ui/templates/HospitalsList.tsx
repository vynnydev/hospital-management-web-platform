import React, { useState } from 'react';
import { Building2, Building, CircleDot } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/organisms/card';
import { ScrollArea } from '@/components/ui/organisms/scroll-area';
import type { IHospital } from '@/types/hospital-network-types';

interface HospitalsListProps {
  hospitals: IHospital[];
  selectedHospitals: string[];
  onHospitalSelect: (hospitalId: string) => void;
}

export const HospitalsList = ({ hospitals, selectedHospitals, onHospitalSelect }: HospitalsListProps) => {
  const [hoveredHospital, setHoveredHospital] = useState<string | null>(null);

  return (
    <div className="space-y-4 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-3">
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <Building className="w-5 h-5" />
          <h3 className="font-medium">Hospitais da rede</h3>
        </div>
        <span className="text-sm text-gray-500">
          {hospitals.length} {hospitals.length === 1 ? 'hospital' : 'hospitais'}
        </span>
      </div>

      {/* Hospitals Grid */}
      <ScrollArea className="h-64">
        <div className="grid grid-cols-3 gap-4">
          {hospitals.map(hospital => (
            <Card
              key={hospital.id}
              onClick={() => onHospitalSelect(hospital.id)}
              onMouseEnter={() => setHoveredHospital(hospital.id)}
              onMouseLeave={() => setHoveredHospital(null)}
              className={`group cursor-pointer transition-all relative overflow-hidden 
                ${selectedHospitals.includes(hospital.id)
                  ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white ring-2 ring-blue-500 scale-[1.02]'
                  : hoveredHospital === hospital.id
                  ? 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-900/80 scale-[1.01] shadow-lg'
                  : 'bg-white dark:bg-gray-800 hover:scale-[1.01]'
                } 
                duration-300 ease-in-out transform`}
            >
              {/* Selection Indicator */}
              {selectedHospitals.includes(hospital.id) && (
                <div className="absolute top-2 right-2">
                  <CircleDot className="w-4 h-4 text-white" />
                </div>
              )}

              {/* Critical Occupancy Indicator */}
              {hospital.metrics.overall.occupancyRate >= 85 && (
                <div className="absolute inset-x-0 top-0 h-1 bg-red-500" />
              )}

              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Building2 className="w-5 h-5" />
                  <span>{hospital.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm opacity-80">{hospital.unit.city}, {hospital.unit.state}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Ocupação</span>
                      <span className={`font-medium ${
                        !selectedHospitals.includes(hospital.id) && (
                          hospital.metrics.overall.occupancyRate >= 85
                            ? 'text-red-500'
                            : hospital.metrics.overall.occupancyRate >= 70
                            ? 'text-yellow-500'
                            : 'text-green-500'
                        )
                      }`}>
                        {hospital.metrics.overall.occupancyRate}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all ${
                          hospital.metrics.overall.occupancyRate >= 85
                            ? 'bg-red-500'
                            : hospital.metrics.overall.occupancyRate >= 70
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${hospital.metrics.overall.occupancyRate}%` }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className={`${
                          selectedHospitals.includes(hospital.id)
                            ? 'text-white/80'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          Disponíveis
                        </p>
                        <p className="font-medium">
                          {hospital.metrics.overall.availableBeds}
                        </p>
                      </div>
                      <div>
                        <p className={`${
                          selectedHospitals.includes(hospital.id)
                            ? 'text-white/80'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          Em Uso
                        </p>
                        <p className="font-medium">
                          {hospital.metrics.overall.totalBeds - hospital.metrics.overall.availableBeds}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};