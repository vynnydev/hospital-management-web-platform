import React, { useState } from 'react';
import { Users, ChevronLeft, ChevronRight, Clock, Activity } from 'lucide-react';
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
import { IStaffTeam } from '@/types/staff-types';

interface StaffListViewProps {
  teams: IStaffTeam[];
  onSelectTeam: (team: IStaffTeam) => void;
}

type TTeamStatusType = 'optimal' | 'active' | 'high_demand' | 'low_demand' | 'critical';

const getStatusColor = (status: TTeamStatusType): string => {
    const statusMap: Record<TTeamStatusType, string> = {
      'optimal': 'bg-green-500',
      'active': 'bg-green-500',
      'high_demand': 'bg-amber-500',
      'low_demand': 'bg-blue-500',
      'critical': 'bg-red-500'
    };
    
    return statusMap[status] || statusMap.active;
  };
  
  const getStatusLabel = (status: TTeamStatusType): string => {
    const statusMap: Record<TTeamStatusType, string> = {
      'optimal': 'Capacidade Ideal',
      'active': 'Disponível',
      'high_demand': 'Alta Demanda',
      'low_demand': 'Baixa Demanda',
      'critical': 'Atenção Necessária'
    };
    
    return statusMap[status] || statusMap.active;
  };

const ITEMS_PER_PAGE = 20;

export const StaffListView: React.FC<StaffListViewProps> = ({ 
  teams, 
  onSelectTeam 
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(teams.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTeams = teams.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
                  Equipe
                </TableHead>
                <TableHead className="py-5 text-lg font-semibold text-gray-700 dark:text-gray-200">
                  Turno
                </TableHead>
                <TableHead className="py-5 text-lg font-semibold text-gray-700 dark:text-gray-200">
                  Departamento
                </TableHead>
                <TableHead className="py-5 text-lg font-semibold text-gray-700 dark:text-gray-200">
                  Status
                </TableHead>
                <TableHead className="py-5 text-lg font-semibold text-gray-700 dark:text-gray-200">
                  Métricas
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTeams.map((team) => (
                <TableRow 
                  key={team.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700"
                  onClick={() => onSelectTeam(team)}
                >
                  <TableCell className="py-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900 border-2 border-blue-500 flex items-center justify-center">
                          <Users className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {team.name}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {team.members.length} membros
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {team.shift}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-wrap gap-2">
                      {team.specialties.map((specialty, index) => (
                        <Badge 
                          key={index}
                          className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                        >
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge 
                      className={`${getStatusColor(team.capacityStatus)} text-white px-3 py-1`}
                    >
                      {getStatusLabel(team.capacityStatus)}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Activity className="w-4 h-4 text-green-500" />
                        <span className="text-gray-600 dark:text-gray-300">
                          {team.metrics.taskCompletion}% eficiência
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Resp. média: {team.metrics.avgResponseTime}min
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
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