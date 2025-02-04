import React, { useState } from 'react';
import { User, ChevronLeft, ChevronRight } from 'lucide-react';
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
  CardFooter,
} from "@/components/ui/organisms/card";
import { Badge } from '@/components/ui/organisms/badge';
import Image from 'next/image';
import { IPatient, IStatusHistory } from '@/types/hospital-network-types';

interface PatientListViewProps {
  patients: IPatient[];
  onSelectPatient: (patient: IPatient) => void;
}

type StatusType = 'Aguardando Atendimento' | 'Em Procedimento' | 'Em Recuperação' | 'Alta' | 'default';

const getStatusColor = (status: string): string => {
  const statusMap: Record<StatusType, string> = {
    'Aguardando Atendimento': 'bg-amber-500',
    'Em Procedimento': 'bg-blue-500',
    'Em Recuperação': 'bg-emerald-500',
    'Alta': 'bg-gray-500',
    'default': 'bg-gray-500'
  };
  
  return statusMap[status as StatusType] || statusMap.default;
};

const ITEMS_PER_PAGE = 20;

export const PatientListView: React.FC<PatientListViewProps> = ({ 
  patients, 
  onSelectPatient 
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const getLatestStatus = (patient: IPatient): IStatusHistory | undefined => {
    if (!patient.careHistory?.statusHistory?.length) return undefined;
    return patient.careHistory.statusHistory[patient.careHistory.statusHistory.length - 1];
  };

  const totalPages = Math.ceil(patients.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPatients = patients.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  return (
    <div className='bg-gradient-to-r from-blue-700 to-cyan-700 p-1 rounded-xl mt-4'>
      <Card className="w-full bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden">
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow className="border-b-2 border-gray-200 dark:border-gray-600">
                <TableHead className="py-5 text-lg font-semibold text-gray-700 dark:text-gray-200">
                  Paciente
                </TableHead>
                <TableHead className="py-5 text-lg font-semibold text-gray-700 dark:text-gray-200">
                  Data Admissão
                </TableHead>
                <TableHead className="py-5 text-lg font-semibold text-gray-700 dark:text-gray-200">
                  Departamento
                </TableHead>
                <TableHead className="py-5 text-lg font-semibold text-gray-700 dark:text-gray-200">
                  Status
                </TableHead>
                <TableHead className="py-5 text-lg font-semibold text-gray-700 dark:text-gray-200">
                  Diagnóstico
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPatients.map((patient: IPatient) => {
                const latestStatus = getLatestStatus(patient);
                return (
                  <TableRow 
                    key={patient.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700"
                    onClick={() => onSelectPatient(patient)}
                  >
                    <TableCell className="py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          {patient.photo !== 'null' && (patient.photo?.startsWith('http') || patient.photo?.startsWith('/')) ? (
                            <Image
                              src={patient.photo}
                              alt={`Foto de ${patient.name}`}
                              className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                              height={48}
                              width={48}
                              priority
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900 border-2 border-blue-500 flex items-center justify-center">
                              <User className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {patient.name}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            ID: {patient.id}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {new Date(patient.admissionDate).toLocaleDateString()}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(patient.admissionDate).toLocaleTimeString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {latestStatus?.department}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge 
                        className={`${getStatusColor(latestStatus?.status || '')} text-white px-3 py-1`}
                      >
                        {latestStatus?.status || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 max-w-xs">
                      <p className="text-gray-600 dark:text-gray-300 truncate">
                        {patient.diagnosis}
                      </p>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
        {totalPages > 1 && (
          <CardFooter className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Página {currentPage} de {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg transition-colors ${
                  currentPage === 1
                    ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition-colors ${
                  currentPage === totalPages
                    ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};