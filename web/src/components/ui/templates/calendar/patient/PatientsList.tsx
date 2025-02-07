import React from 'react';
import { ScrollArea } from '@/components/ui/organisms/scroll-area';
import { Badge } from '@/components/ui/organisms/badge';
import { format, parseISO } from 'date-fns';
import { IPatient } from '@/types/hospital-network-types';

interface PatientsListProps {
  patients: IPatient[];
  selectedPatient: IPatient | null;
  onSelectPatient: (patient: IPatient) => void;
}

export const PatientsList: React.FC<PatientsListProps> = ({
  patients,
  selectedPatient,
  onSelectPatient,
}) => {
  return (
    <div className="h-36">
      <ScrollArea className="h-full">
        <div className="p-2 space-y-2">
          {patients.map((patient) => (
            <button
              key={patient.id}
              className={`w-full p-4 rounded-lg text-left transition-all duration-200 ${
                selectedPatient?.id === patient.id
                  ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-l-4 border-blue-500'
                  : 'hover:bg-blue-800/30'
              }`}
              onClick={() => onSelectPatient(patient)}
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center 
                                bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-medium">
                    {patient.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-white">
                    {patient.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-blue-300/80">Alta prevista:</span>
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-300 border-blue-500/20">
                      {format(parseISO(patient.expectedDischarge), 'dd/MM/yyyy')}
                    </Badge>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};