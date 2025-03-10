import React from 'react';
import { IAmbulanceRoute } from '@/types/ambulance-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/organisms/card';
import { Badge } from '@/components/ui/organisms/badge';
import { Button } from '@/components/ui/organisms/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/organisms/dropdown-menu';
import { Ambulance, ArrowRight, Clock } from 'lucide-react';

interface TransferSectionProps {
  activeRoutes: IAmbulanceRoute[];
  setSelectedPatientId: (id: string | null) => void;
}

export const TransferSection: React.FC<TransferSectionProps> = ({
  activeRoutes,
  setSelectedPatientId
}) => {
  // Obter cor baseada no nível de emergência
  const getEmergencyBadgeClass = (level: string | undefined): string => {
    switch (level) {
      case 'critical': 
        return 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200';
      case 'high': 
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      case 'medium': 
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: 
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // Formatar nível de emergência para exibição
  const formatEmergencyLevel = (level: string | undefined): string => {
    switch (level) {
      case 'critical': return 'Crítico';
      case 'high': return 'Alto Risco';
      case 'medium': return 'Médio Risco';
      case 'low': return 'Baixo Risco';
      default: return 'Desconhecido';
    }
  };

  return (
    <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30">
        <CardTitle className="flex items-center text-gray-800 dark:text-gray-100">
          <Ambulance className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
          Transferências em Tempo Real
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Acompanhe ambulâncias e transferências de pacientes em andamento
        </CardDescription>
      </CardHeader>
      <CardContent className="bg-white dark:bg-gray-800 py-4">
        {activeRoutes.length > 0 ? (
          <div className="space-y-4">
            {activeRoutes.map(route => (
              <div 
                key={route.id} 
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900 
                           hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors
                           flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-200 flex items-center">
                    <Ambulance className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                    {route.patient?.name || 'Paciente sem nome'}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 ml-6">{route.patient?.condition}</p>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Badge className={getEmergencyBadgeClass(route.patient?.emergencyLevel)}>
                    {formatEmergencyLevel(route.patient?.emergencyLevel)}
                  </Badge>
                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-xs">
                    {route.origin.name}
                  </span>
                  <ArrowRight className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-xs">
                    {route.destination.name}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Chegada estimada: {new Date(route.estimatedArrivalTime).toLocaleTimeString()}
                  </span>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                        Opções
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      <DropdownMenuLabel className="text-gray-700 dark:text-gray-300">Ações</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                      <DropdownMenuItem 
                        onClick={() => setSelectedPatientId(route.patient?.id || null)}
                        className="text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer"
                      >
                        Ver paciente
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer">
                        Notificar equipe
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer">
                        Preparar leito
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <Ambulance className="h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
            <p className="text-center">
              Nenhuma transferência em andamento no momento.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};