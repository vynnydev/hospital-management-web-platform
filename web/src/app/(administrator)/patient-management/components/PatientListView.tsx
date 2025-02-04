import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/organisms/table";
import {
  Card,
  CardContent,
} from "@/components/ui/organisms/card";
import { IPatient } from '@/types/hospital-network-types';
import { getLatestStatus } from '@/utils/patientDataUtils';
import { Badge } from '@/components/ui/organisms/badge';

type StatusType = 'Aguardando Atendimento' | 'Em Procedimento' | 'Em Recuperação' | 'Alta' | 'default'

interface PatientListViewProps {
  patients: IPatient[];
  onSelectPatient: (patient: IPatient) => void;
}

const getStatusColor = (status: string) => {
    const statusMap: Record<StatusType, string> = {
      'Aguardando Atendimento': 'bg-yellow-500',
      'Em Procedimento': 'bg-blue-500',
      'Em Recuperação': 'bg-green-500',
      'Alta': 'bg-gray-500',
      'default': 'bg-gray-500'
    };
    
    return statusMap[status as StatusType] || statusMap.default;
};

export const PatientListView: React.FC<PatientListViewProps> = ({ 
  patients,
  onSelectPatient
}) => {
  return (
    <Card className="w-full bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden">
      <CardContent className="p-6">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Paciente</TableHead>
              <TableHead>Data Admissão</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Diagnóstico</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient) => {
              const status = getLatestStatus(patient);
              return (
                <TableRow 
                  key={patient.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => onSelectPatient(patient)}
                >
                  <TableCell className="font-medium">{patient.id}</TableCell>
                  <TableCell>{patient.name}</TableCell>
                  <TableCell>
                    {new Date(patient.admissionDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{status?.department}</TableCell>
                  <TableCell>
                    <Badge 
                      className={`${getStatusColor(status?.status || '')} text-white`}
                    >
                      {status?.status || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {patient.diagnosis}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};