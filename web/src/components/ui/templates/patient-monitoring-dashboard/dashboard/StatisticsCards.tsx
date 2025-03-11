import React from 'react';
import { IAmbulanceData } from '@/types/ambulance-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/organisms/card';
import { Users, Bed, AlertTriangle, ArrowDownToLine, ArrowUpFromLine, Ambulance } from 'lucide-react';

interface StatisticsCardsProps {
  stats: {
    totalPatients: number;
    occupiedBeds: number;
    availableBeds: number;
    incomingTransfers: number;
    outgoingTransfers: number;
    criticalPatients: number;
    occupancyRate: number;
  };
  ambulanceData: IAmbulanceData | null;
  selectedHospitalId: string;
}

export const StatisticsCards: React.FC<StatisticsCardsProps> = ({
  stats,
  ambulanceData,
  selectedHospitalId
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      {/* Total de Pacientes */}
      <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-indigo-900 dark:to-blue-950 text-gray-800 dark:text-blue-100">
        <CardHeader className="pb-2 bg-indigo-100/50 dark:bg-indigo-900/20">
          <CardTitle className="text-sm font-medium flex items-center">
            <Users className="h-4 w-4 mr-2 text-indigo-600 dark:text-indigo-400" />
            Total de Pacientes
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="text-3xl font-bold text-indigo-700 dark:text-indigo-300">{stats.totalPatients}</div>
          <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">
            Ocupação de {stats.occupancyRate}%
          </p>
        </CardContent>
      </Card>
      
      {/* Leitos Disponíveis */}
      <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-900 dark:to-green-950 text-gray-800 dark:text-green-100">
        <CardHeader className="pb-2 bg-emerald-100/50 dark:bg-emerald-900/20">
          <CardTitle className="text-sm font-medium flex items-center">
            <Bed className="h-4 w-4 mr-2 text-emerald-600 dark:text-emerald-400" />
            Leitos Disponíveis
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">{stats.availableBeds}</div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
            de {stats.availableBeds + stats.occupiedBeds || 0} leitos totais
          </p>
        </CardContent>
      </Card>
      
      {/* Pacientes Críticos */}
      <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900 dark:to-orange-950 text-gray-800 dark:text-orange-100">
        <CardHeader className="pb-2 bg-amber-100/50 dark:bg-amber-900/20">
          <CardTitle className="text-sm font-medium flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2 text-amber-600 dark:text-amber-400" />
            Pacientes Críticos
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="text-3xl font-bold text-amber-700 dark:text-amber-300">{stats.criticalPatients}</div>
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
            {stats.totalPatients ? Math.round((stats.criticalPatients / stats.totalPatients) * 100) : 0}% do total
          </p>
        </CardContent>
      </Card>
      
      {/* Transferências Chegando */}
      <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-900 dark:to-cyan-950 text-gray-800 dark:text-cyan-100">
        <CardHeader className="pb-2 bg-blue-100/50 dark:bg-blue-900/20">
          <CardTitle className="text-sm font-medium flex items-center">
            <ArrowDownToLine className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
            Transferências Chegando
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">{stats.incomingTransfers}</div>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            pacientes em rota para este hospital
          </p>
        </CardContent>
      </Card>
      
      {/* Transferências Saindo */}
      <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-violet-50 to-purple-100 dark:from-violet-900 dark:to-purple-950 text-gray-800 dark:text-purple-100">
        <CardHeader className="pb-2 bg-violet-100/50 dark:bg-violet-900/20">
          <CardTitle className="text-sm font-medium flex items-center">
            <ArrowUpFromLine className="h-4 w-4 mr-2 text-violet-600 dark:text-violet-400" />
            Transferências Saindo
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="text-3xl font-bold text-violet-700 dark:text-violet-300">{stats.outgoingTransfers}</div>
          <p className="text-xs text-violet-600 dark:text-violet-400 mt-1">
            pacientes saindo deste hospital
          </p>
        </CardContent>
      </Card>
      
      {/* Ambulâncias Disponíveis */}
      <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-teal-50 to-green-100 dark:from-teal-900 dark:to-green-950 text-gray-800 dark:text-green-100">
        <CardHeader className="pb-2 bg-teal-100/50 dark:bg-teal-900/20">
          <CardTitle className="text-sm font-medium flex items-center">
            <Ambulance className="h-4 w-4 mr-2 text-teal-600 dark:text-teal-400" />
            Ambulâncias Disponíveis
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="text-3xl font-bold text-teal-700 dark:text-teal-300">
            {ambulanceData?.ambulances[selectedHospitalId]?.filter(a => a.status === 'available').length || 0}
          </div>
          <p className="text-xs text-teal-600 dark:text-teal-400 mt-1">
            de {ambulanceData?.ambulances[selectedHospitalId]?.length || 0} ambulâncias
          </p>
        </CardContent>
      </Card>
    </div>
  );
};