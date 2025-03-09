/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { IHospital, IDepartment } from '@/types/hospital-network-types';
import { Search, Filter, BarChart3, CalendarRange, LayoutDashboard, SendToBack } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/organisms/select';
import { Input } from '@/components/ui/organisms/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/organisms/tooltip';
import { Button } from '@/components/ui/organisms/button';
import { AdvancedFilters } from '../AdvancedFilters';
import { RefreshButton } from '@/components/ui/organisms/RefreshButton';
import { FullscreenToggle } from '../FullscreenToggle';
import { NotificationsPopover } from '@/components/ui/molecules/NotificationsPopover';
import { UpdateIntervalSelector } from '../UpdateIntervalSelector';
import { useDashboardConfig } from '@/components/ui/context/patient-monitoring-dashboard/DashboardConfigContext';
import { StatsModal } from '../StatsModal';

interface DashboardHeaderProps {
  hospitals: IHospital[];
  departments: IDepartment[];
  selectedHospitalId: string;
  setSelectedHospitalId: (id: string) => void;
  selectedHospitalName: string;
  departmentFilter: string;
  setDepartmentFilter: (filter: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setAdvancedFilters: (filters: Record<string, any>) => void;
  stats: any;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  hospitals,
  departments,
  selectedHospitalId,
  setSelectedHospitalId,
  selectedHospitalName,
  departmentFilter,
  setDepartmentFilter,
  searchTerm,
  setSearchTerm,
  setAdvancedFilters,
  stats
}) => {
  const { 
    viewMode, 
    setViewMode,
    lastUpdated
  } = useDashboardConfig();

  // Função para obter a cor do indicador de ocupação
  const getStatusIndicatorColor = (occupancyRate: number) => {
    if (occupancyRate >= 90) return 'bg-red-500';
    if (occupancyRate >= 75) return 'bg-yellow-500';
    if (occupancyRate >= 50) return 'bg-blue-500';
    return 'bg-green-500';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2">
            <Select 
              value={selectedHospitalId} 
              onValueChange={setSelectedHospitalId}
            >
              <SelectTrigger className="w-[240px] bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                <SelectValue placeholder="Selecione um hospital" />
              </SelectTrigger>
              <SelectContent className='bg-gray-100 dark:bg-gray-800'>
                {hospitals.map(hospital => (
                  <SelectItem key={hospital.id} value={hospital.id}>
                    {hospital.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex items-center">
              <div className={`h-2.5 w-2.5 rounded-full mr-2 ${getStatusIndicatorColor(stats.occupancyRate)}`}></div>
              <span className="text-xs text-gray-500 dark:text-gray-400">{stats.occupancyRate}% ocupação</span>
            </div>
          </div>
          
          <Select 
            value={departmentFilter} 
            onValueChange={setDepartmentFilter}
          >
            <SelectTrigger className="w-[180px] bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
              <SelectValue placeholder="Departamento" />
            </SelectTrigger>
            <SelectContent className='bg-gray-100 dark:bg-gray-800'>
              <SelectItem value="all">Todos os departamentos</SelectItem>
              {departments.map(dept => (
                <SelectItem key={dept.name} value={dept.name}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <AdvancedFilters onFilterChange={setAdvancedFilters} />
        </div>
        
        <div className="flex gap-2 items-center">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              type="search"
              placeholder="Buscar paciente..."
              className="pl-8 w-full sm:w-[240px] bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <RefreshButton />
          <FullscreenToggle />
          <NotificationsPopover />
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-3">
          <StatsModal stats={stats} hospitalName={selectedHospitalName} />
          <UpdateIntervalSelector />
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  onClick={() => setViewMode(viewMode === 'full' ? 'compact' : 'full')}
                >
                  {viewMode === 'full' ? (
                    <SendToBack className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <LayoutDashboard className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400" />
                  )}
                  <span>{viewMode === 'full' ? 'Visualização Compacta' : 'Visualização Completa'}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{viewMode === 'full' ? 'Reduzir para visualização compacta' : 'Expandir para visualização completa'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
          <CalendarRange className="h-3 w-3 mr-1" />
          Última atualização: {lastUpdated.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};