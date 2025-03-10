/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { IPatient, IStatusHistory, IBed } from '@/types/hospital-network-types';
import { Badge } from '@/components/ui/organisms/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/organisms/table';
import { AlertCircle, CalendarClock, Heart, UserCircle2 } from 'lucide-react';

interface PatientListProps {
  patients: {
    patient: IPatient;
    bed: IBed;
    department: string;
    lastStatus: IStatusHistory | null;
  }[];
  selectedPatientId: string | null;
  onSelectPatient: (patientId: string) => void;
}

// Helper function to determine status color
const getStatusClass = (status: string, department: string): string => {
  if (department === 'UTI') {
    if (status === 'Em Procedimento') 
      return 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200 border-rose-200 dark:border-rose-800';
    if (status === 'Em Recuperação') 
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 border-amber-200 dark:border-amber-800';
    return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-800';
  }
  
  if (status === 'Aguardando Atendimento') 
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 border-gray-200 dark:border-gray-800';
  if (status === 'Em Triagem') 
    return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 border-purple-200 dark:border-purple-800';
  if (status === 'Em Atendimento') 
    return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-800';
  if (status === 'Em Observação') 
    return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 border-indigo-200 dark:border-indigo-800';
  if (status === 'Em Recuperação') 
    return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200 border-teal-200 dark:border-teal-800';
  if (status === 'Alta') 
    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800';
  if (status === 'Transferido') 
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800';
  
  return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 border-gray-200 dark:border-gray-800';
};

// Helper function to calculate LOS (Length of Stay) in days
const calculateLOS = (admissionDate: string): number => {
  const admission = new Date(admissionDate);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - admission.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const PatientList: React.FC<PatientListProps> = ({ 
  patients, 
  selectedPatientId, 
  onSelectPatient 
}) => {
  if (patients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <UserCircle2 className="h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
        <p>Nenhum paciente encontrado.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 dark:bg-gray-900">
            <TableHead className="text-gray-700 dark:text-gray-300">Paciente</TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300">Dept.</TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300">Status</TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300">Leito</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map(({ patient, bed, department, lastStatus }) => (
            <TableRow 
              key={patient.id}
              className={`cursor-pointer border-b border-gray-200 dark:border-gray-700 px-2 
                        ${selectedPatientId === patient.id 
                          ? 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30' 
                          : 'hover:bg-gray-50 dark:hover:bg-gray-900/50'}`}
              onClick={() => onSelectPatient(patient.id)}
            >
              <TableCell className="py-3">
                <div className="flex flex-col">
                  <span className="font-medium text-gray-800 dark:text-gray-200">{patient.name}</span>
                  <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>{patient.age} anos</span>
                    <span>•</span>
                    <span>{patient.gender}</span>
                    {patient.bloodType && (
                      <>
                        <span>•</span>
                        <span className="flex items-center">
                          <Heart className="h-3 w-3 mr-1 text-rose-500 dark:text-rose-400" />
                          {patient.bloodType}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 border-indigo-200 dark:border-indigo-800 font-normal">
                  {department}
                </Badge>
              </TableCell>
              <TableCell>
                {lastStatus ? (
                  <div className="space-y-1.5">
                    <Badge className={getStatusClass(lastStatus.status, lastStatus.department)}>
                      {lastStatus.status}
                    </Badge>
                    <div className="text-xs flex items-center text-gray-500 dark:text-gray-400">
                      <CalendarClock className="h-3 w-3 mr-1 text-indigo-500 dark:text-indigo-400" /> 
                      {calculateLOS(patient.admissionDate)} dias
                    </div>
                  </div>
                ) : (
                  <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">Sem status</Badge>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md">
                    {bed.number}
                  </span>
                  {patient.expectedDischarge && new Date(patient.expectedDischarge) < new Date() && (
                    <AlertCircle className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};