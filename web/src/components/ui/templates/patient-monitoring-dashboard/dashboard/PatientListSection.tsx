import React from 'react';
import { IPatient, IBed, IStatusHistory } from '@/types/hospital-network-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/organisms/card';
import { Badge } from '@/components/ui/organisms/badge';
import { Users } from 'lucide-react';
import { PatientList } from '../PatientList';

interface PatientListSectionProps {
  patientsInDepartment: {
    patient: IPatient;
    bed: IBed;
    department: string;
    lastStatus: IStatusHistory | null;
  }[];
  selectedPatientId: string | null;
  setSelectedPatientId: (id: string | null) => void;
  departmentFilter: string;
}

export const PatientListSection: React.FC<PatientListSectionProps> = ({
  patientsInDepartment,
  selectedPatientId,
  setSelectedPatientId,
  departmentFilter
}) => {
  return (
    <Card className="lg:col-span-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <CardTitle className="flex justify-between items-center text-gray-800 dark:text-gray-100">
          <span className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
            Pacientes em Atendimento
          </span>
          <Badge variant="outline" className="bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700">
            {patientsInDepartment.length} pacientes
          </Badge>
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          {departmentFilter === 'all' 
            ? 'Todos os departamentos' 
            : `Departamento: ${departmentFilter}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="bg-white dark:bg-gray-800 p-0">
        <PatientList 
          patients={patientsInDepartment}
          selectedPatientId={selectedPatientId}
          onSelectPatient={setSelectedPatientId}
        />
      </CardContent>
    </Card>
  );
};