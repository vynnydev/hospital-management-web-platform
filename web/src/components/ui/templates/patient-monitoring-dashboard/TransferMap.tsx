/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { IPatient, IHospital } from '@/types/hospital-network-types';
import { IAmbulanceRoute } from '@/types/ambulance-types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/organisms/alert';
import { Badge } from '@/components/ui/organisms/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';
import { 
  AlertCircle, 
  Ambulance, 
  ArrowDownFromLine, 
  ArrowRightCircle, 
  ArrowUpFromLine, 
  Clock, 
  Map as MapIcon, 
  UserCircle2,
  Navigation, 
  Building2, 
  Home, 
  MapPin,
  Hospital
} from 'lucide-react';

interface TransferMapProps {
  patient: IPatient;
  incomingTransfer: IAmbulanceRoute | undefined;
  outgoingTransfer: IAmbulanceRoute | undefined;
  hospital: IHospital | undefined;
}

export const TransferMap: React.FC<TransferMapProps> = ({ 
  patient, 
  incomingTransfer, 
  outgoingTransfer,
  hospital
}) => {
  // Formatar data e hora
  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };
  
  // Calcular tempo restante em minutos
  const calculateTimeRemaining = (arrivalTime: string): number => {
    const arrival = new Date(arrivalTime).getTime();
    const now = new Date().getTime();
    const diff = arrival - now;
    return Math.max(0, Math.floor(diff / (1000 * 60)));
  };
  
  // Obter cor baseada no nível de emergência
  const getEmergencyLevelClass = (level: string): string => {
    switch (level) {
      case 'critical': 
        return 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200 border-rose-200 dark:border-rose-800';
      case 'high': 
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 border-amber-200 dark:border-amber-800';
      case 'medium': 
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-800';
      case 'low': 
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800';
      default: 
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 border-gray-200 dark:border-gray-800';
    }
  };

  return (
    <div className="space-y-6 text-gray-800 dark:text-gray-200">
      {/* Se não houver transferências */}
      {!incomingTransfer && !outgoingTransfer && (
        <div className="p-8 text-center bg-gray-50 dark:bg-gray-900 rounded-lg">
          <MapIcon className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-medium mb-2 text-gray-700 dark:text-gray-300">Nenhuma transferência em andamento</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Este paciente não possui transferências ativas no momento.
          </p>
        </div>
      )}

      {/* Transferência de entrada */}
      {incomingTransfer && (
        <Card className="border-0 shadow-lg overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-100 dark:border-blue-900">
          <CardHeader className="pb-3 border-b border-blue-200 dark:border-blue-800 bg-blue-100/50 dark:bg-blue-900/20">
            <CardTitle className="flex items-center text-lg font-medium text-blue-800 dark:text-blue-300">
              <ArrowDownFromLine className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
              Transferência de Entrada
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-white/80 dark:bg-gray-800/50 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Origem</p>
                  <h3 className="font-medium flex items-center">
                    <Building2 className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                    {incomingTransfer.origin.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 ml-6">{incomingTransfer.origin.address}</p>
                </div>
                
                <div className="bg-white/80 dark:bg-gray-800/50 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Destino</p>
                  <h3 className="font-medium flex items-center">
                    <Hospital className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                    {incomingTransfer.destination.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 ml-6">{incomingTransfer.destination.address}</p>
                </div>
                
                <div className="flex justify-between items-center bg-white/80 dark:bg-gray-800/50 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div>
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Distância</p>
                    <p className="font-medium">{incomingTransfer.distance.toFixed(1)} km</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Duração Est.</p>
                    <p className="font-medium">{incomingTransfer.duration} min</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Emergência</p>
                    <Badge className={getEmergencyLevelClass(incomingTransfer.patient?.emergencyLevel || 'medium')}>
                      {incomingTransfer.patient?.emergencyLevel === 'critical' ? 'Crítico' : 
                       incomingTransfer.patient?.emergencyLevel === 'high' ? 'Alto' : 
                       incomingTransfer.patient?.emergencyLevel === 'medium' ? 'Médio' : 'Baixo'}
                    </Badge>
                  </div>
                </div>
                
                <Alert className="bg-blue-100 border-blue-300 dark:bg-blue-900/40 dark:border-blue-700 text-blue-800 dark:text-blue-200">
                  <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <AlertTitle className="font-medium">Chegada Prevista</AlertTitle>
                  <AlertDescription>
                    <span className="font-medium">{formatDateTime(incomingTransfer.estimatedArrivalTime)}</span>
                    <span className="block text-sm mt-1">
                      {calculateTimeRemaining(incomingTransfer.estimatedArrivalTime)} minutos restantes
                    </span>
                  </AlertDescription>
                </Alert>
              </div>
              
              <div className="flex flex-col gap-4">
                <div className="bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg p-4 flex-1 flex flex-col justify-center items-center border border-blue-200 dark:border-blue-800">
                  <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 shadow-md">
                    <Ambulance className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex flex-col text-center">
                    <span className="text-sm text-blue-600 dark:text-blue-400">Ambulância</span>
                    <span className="font-mono font-medium">{incomingTransfer.ambulanceId}</span>
                    <div className="text-xs mt-3 flex items-center justify-center text-gray-600 dark:text-gray-400">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>Despachada: {formatDateTime(incomingTransfer.dispatchTime)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/80 dark:bg-gray-800/50 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center shadow">
                      <UserCircle2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium">{patient.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {patient.age} anos • {patient.gender}
                      </p>
                      
                      <div className="text-sm">
                        <p className="text-blue-600 dark:text-blue-400">Condição:</p>
                        <p className="text-gray-700 dark:text-gray-300">{incomingTransfer.patient?.condition || patient.diagnosis}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-between">
              <Button 
                variant="outline" 
                size="sm"
                className="bg-white hover:bg-gray-50 text-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700"
              >
                <MapIcon className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                Ver Rota Completa
              </Button>
              
              <Button 
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-600"
              >
                <ArrowRightCircle className="h-4 w-4 mr-2" />
                Preparar Recepção
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transferência de saída */}
      {outgoingTransfer && (
        <Card className="border-0 shadow-lg overflow-hidden bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950 border-purple-100 dark:border-purple-900">
          <CardHeader className="pb-3 border-b border-purple-200 dark:border-purple-800 bg-purple-100/50 dark:bg-purple-900/20">
            <CardTitle className="flex items-center text-lg font-medium text-purple-800 dark:text-purple-300">
              <ArrowUpFromLine className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
              Transferência de Saída
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-white/80 dark:bg-gray-800/50 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                  <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Origem</p>
                  <h3 className="font-medium flex items-center">
                    <Hospital className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400" />
                    {outgoingTransfer.origin.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 ml-6">{outgoingTransfer.origin.address}</p>
                </div>
                
                <div className="bg-white/80 dark:bg-gray-800/50 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                  <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Destino</p>
                  <h3 className="font-medium flex items-center">
                    <Building2 className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400" />
                    {outgoingTransfer.destination.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 ml-6">{outgoingTransfer.destination.address}</p>
                </div>
                
                <div className="flex justify-between items-center bg-white/80 dark:bg-gray-800/50 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div>
                    <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Distância</p>
                    <p className="font-medium">{outgoingTransfer.distance.toFixed(1)} km</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Duração Est.</p>
                    <p className="font-medium">{outgoingTransfer.duration} min</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Emergência</p>
                    <Badge className={getEmergencyLevelClass(outgoingTransfer.patient?.emergencyLevel || 'medium')}>
                      {outgoingTransfer.patient?.emergencyLevel === 'critical' ? 'Crítico' : 
                       outgoingTransfer.patient?.emergencyLevel === 'high' ? 'Alto' : 
                       outgoingTransfer.patient?.emergencyLevel === 'medium' ? 'Médio' : 'Baixo'}
                    </Badge>
                  </div>
                </div>
                
                <Alert className="bg-purple-100 border-purple-300 dark:bg-purple-900/40 dark:border-purple-700 text-purple-800 dark:text-purple-200">
                  <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <AlertTitle className="font-medium">Chegada Prevista</AlertTitle>
                  <AlertDescription>
                    <span className="font-medium">{formatDateTime(outgoingTransfer.estimatedArrivalTime)}</span>
                    <span className="block text-sm mt-1">
                      {calculateTimeRemaining(outgoingTransfer.estimatedArrivalTime)} minutos restantes
                    </span>
                  </AlertDescription>
                </Alert>
              </div>
              
              <div className="flex flex-col gap-4">
                <div className="bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-lg p-4 flex-1 flex flex-col justify-center items-center border border-purple-200 dark:border-purple-800">
                  <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 shadow-md">
                    <Ambulance className="h-10 w-10 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex flex-col text-center">
                    <span className="text-sm text-purple-600 dark:text-purple-400">Ambulância</span>
                    <span className="font-mono font-medium">{outgoingTransfer.ambulanceId}</span>
                    <div className="text-xs mt-3 flex items-center justify-center text-gray-600 dark:text-gray-400">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>Despachada: {formatDateTime(outgoingTransfer.dispatchTime)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/80 dark:bg-gray-800/50 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center shadow">
                      <UserCircle2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="font-medium">{patient.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {patient.age} anos • {patient.gender}
                      </p>
                      
                      <div className="text-sm">
                        <p className="text-purple-600 dark:text-purple-400">Motivo da transferência:</p>
                        <p className="text-gray-700 dark:text-gray-300">{outgoingTransfer.patient?.condition || "Não especificado"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-between">
              <Button 
                variant="outline" 
                size="sm"
                className="bg-white hover:bg-gray-50 text-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700"
              >
                <MapIcon className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400" />
                Ver Rota Completa
              </Button>
              
              <Button 
                size="sm" 
                variant="secondary"
                className="bg-purple-100 hover:bg-purple-200 text-purple-800 dark:bg-purple-900/60 dark:hover:bg-purple-900 dark:text-purple-200 border border-purple-200 dark:border-purple-800"
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                Verificar Status
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};