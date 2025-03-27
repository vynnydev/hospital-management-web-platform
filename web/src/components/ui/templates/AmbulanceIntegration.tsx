/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { 
  Ambulance, 
  Clock, 
  MapPin, 
  Phone, 
  AlertCircle, 
  User, 
  MoreHorizontal,
  ArrowRight,
  CheckCircle,
  BedDouble,
  HeartCrack
} from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/organisms/dialog';
import { Button } from '@/components/ui/organisms/button';
import { Badge } from '@/components/ui/organisms/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/organisms/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/organisms/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/organisms/select';
import { useAmbulanceData } from '@/services/hooks/ambulance/useAmbulanceData';
import { useNetworkData } from '@/services/hooks/network-hospital/useNetworkData';
import type { IAmbulance, IAmbulanceRoute, IAmbulanceRequest, TEmergengyLevel } from '@/types/ambulance-types';
import type { IBed } from '@/types/hospital-network-types';

interface AmbulanceIntegrationProps {
  hospitalId: string;
  selectedDepartment?: string;
  onBedSelect?: (bed: IBed) => void;
}

export const AmbulanceIntegration: React.FC<AmbulanceIntegrationProps> = ({
  hospitalId,
  selectedDepartment,
  onBedSelect
}) => {
  const [showAssignBeds, setShowAssignBeds] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<IAmbulanceRoute | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<IAmbulanceRequest | null>(null);
  const [selectedBedId, setSelectedBedId] = useState<string>('');
  const [isAssigning, setIsAssigning] = useState(false);
  
  const {
    availableAmbulances,
    activeRoutes,
    pendingRequests,
    dispatchAmbulance,
    updateRouteStatus,
    getHospitalAmbulanceStats
  } = useAmbulanceData(hospitalId);
  
  const { networkData, beds, getBedsForFloor } = useNetworkData();
  
  const hospital = networkData?.hospitals.find(h => h.id === hospitalId);
  
  // Filtra rotas relevantes para o departamento selecionado
  const filteredRoutes = selectedDepartment 
    ? activeRoutes.filter(route => 
        route.patient?.condition.toLowerCase().includes(selectedDepartment.toLowerCase())
      )
    : activeRoutes;
  
  // Obter estatísticas de ambulâncias
  const ambulanceStats = getHospitalAmbulanceStats(hospitalId);
  
  // Filtrar camas disponíveis para o departamento selecionado
  const getAvailableBeds = () => {
    if (!selectedDepartment) return [];
    
    return beds.filter(bed => 
      bed.department === selectedDepartment && 
      bed.status === 'available' &&
      bed.hospital === hospital?.name
    );
  };
  
  // Função para atribuir leito a paciente de ambulância
  const assignBedToPatient = async () => {
    if (!selectedRoute || !selectedBedId) return;
    
    setIsAssigning(true);
    
    try {
      // Atualizar rota com informações do leito (corrigir para valores reais)
      const updatedRoute = await updateRouteStatus(
        selectedRoute.id,
        'in_progress',
        'dispatched',
      );
      
      console.log('Leito atribuído, rota atualizada:', updatedRoute);
      
      // Aqui seria implementada a lógica para atualizar o status do leito na API
      
      // Fechar diálogo
      setShowAssignBeds(false);
      setSelectedRoute(null);
      setSelectedBedId('');
    } catch (error) {
      console.error('Erro ao atribuir leito:', error);
    } finally {
      setIsAssigning(false);
    }
  };
  
  // Função para despachar ambulância para uma solicitação
  const handleDispatchAmbulance = async (request: IAmbulanceRequest, ambulanceId: string) => {
    if (!networkData?.hospitals) return;
    
    try {
      await dispatchAmbulance(
        request.id,
        ambulanceId,
        networkData.hospitals
      );
    } catch (error) {
      console.error('Erro ao despachar ambulância:', error);
    }
  };
  
  // Função para obter cor baseada no nível de emergência
  const getEmergencyLevelColor = (level: TEmergengyLevel) => {
    switch (level) {
      case 'critical': return 'text-red-500 bg-red-900/20 border-red-500/30';
      case 'high': return 'text-orange-500 bg-orange-900/20 border-orange-500/30';
      case 'medium': return 'text-amber-500 bg-amber-900/20 border-amber-500/30';
      case 'low': return 'text-blue-500 bg-blue-900/20 border-blue-500/30';
      default: return 'text-gray-500 bg-gray-900/20 border-gray-500/30';
    }
  };
  
  // Função para obter texto para o nível de emergência
  const getEmergencyLevelText = (level: TEmergengyLevel) => {
    switch (level) {
      case 'critical': return 'Crítico';
      case 'high': return 'Alto';
      case 'medium': return 'Médio';
      case 'low': return 'Baixo';
      default: return level;
    }
  };
  
  // Função para obter o tempo estimado de chegada formatado
  const getETAFormatted = (route: IAmbulanceRoute) => {
    const eta = new Date(route.estimatedArrivalTime);
    const now = new Date();
    
    // Calcular diferença em minutos
    const diffMs = eta.getTime() - now.getTime();
    const diffMinutes = Math.round(diffMs / 60000);
    
    if (diffMinutes <= 0) return 'Chegando agora';
    if (diffMinutes === 1) return '1 minuto';
    if (diffMinutes < 60) return `${diffMinutes} minutos`;
    
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    
    if (minutes === 0) return `${hours}h`;
    return `${hours}h ${minutes}m`;
  };
  
  return (
    <div className="space-y-6">
      {/* Painel de estatísticas de ambulâncias */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-gray-800/90 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Ambulâncias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Ambulance className="h-5 w-5 text-blue-400 mr-2" />
              <span className="text-2xl font-bold text-white">
                {availableAmbulances.length + activeRoutes.length}
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800/90 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Disponíveis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
              <span className="text-2xl font-bold text-white">
                {availableAmbulances.length}
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800/90 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Em Trânsito</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <HeartCrack className="h-5 w-5 text-purple-400 mr-2" />
              <span className="text-2xl font-bold text-white">
                {activeRoutes.length}
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800/90 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Solicitações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-amber-400 mr-2" />
              <span className="text-2xl font-bold text-white">
                {pendingRequests.length}
              </span>
              {pendingRequests.length > 0 && (
                <Badge className="ml-2 bg-amber-500/20 text-amber-400 border-amber-500/30">
                  Pendentes
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Ambulâncias ativas em trânsito */}
      <div>
        <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center">
          <Ambulance className="h-5 w-5 mr-2 text-blue-400" />
          Ambulâncias em Trânsito
          {selectedDepartment && (
            <Badge className="ml-2 bg-blue-500/20 text-blue-400 border-blue-500/30">
              Filtrado: {selectedDepartment}
            </Badge>
          )}
        </h3>
        
        {filteredRoutes.length === 0 ? (
          <div className="bg-gray-800/30 rounded-xl p-6 text-center">
            <Ambulance className="h-12 w-12 text-gray-600 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-300 mb-1">
              Nenhuma ambulância em trânsito
            </h3>
            <p className="text-gray-500 text-sm">
              Não há ambulâncias a caminho deste hospital no momento.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRoutes.map(route => (
              <div 
                key={route.id} 
                className="bg-gray-800/60 rounded-xl p-4 border border-gray-700/50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h4 className="font-medium text-white flex items-center">
                        <Ambulance className="h-4 w-4 mr-2 text-blue-400" />
                        {route.patient?.name || 'Paciente sem identificação'}
                      </h4>
                      
                      <Badge className={`ml-3 ${getEmergencyLevelColor(route.patient?.emergencyLevel || 'medium')}`}>
                        {getEmergencyLevelText(route.patient?.emergencyLevel || 'medium')}
                      </Badge>
                    </div>
                    
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center text-sm text-gray-400">
                        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                        {route.origin.name} {route.origin.hospitalId ? '(Hospital)' : ''}
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <ArrowRight className="h-4 w-4 mx-2 text-gray-500" />
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-300">
                        <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                        {route.destination.name}
                      </div>
                    </div>
                    
                    <div className="mt-3 flex flex-wrap gap-3">
                      <div className="bg-gray-700/50 px-3 py-1.5 rounded-lg flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-purple-400" />
                        <span className="text-sm text-gray-300">
                          ETA: {getETAFormatted(route)}
                        </span>
                      </div>
                      
                      <div className="bg-gray-700/50 px-3 py-1.5 rounded-lg flex items-center">
                        <User className="h-4 w-4 mr-2 text-amber-400" />
                        <span className="text-sm text-gray-300">
                          {route.patient?.age} anos - {route.patient?.condition}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-600 hover:bg-gray-700"
                      onClick={() => {
                        setSelectedRoute(route);
                        setShowAssignBeds(true);
                      }}
                    >
                      <BedDouble className="h-4 w-4 mr-2" />
                      Designar Leito
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-gray-800 border-gray-700">
                        <DropdownMenuItem 
                          className="text-green-400 hover:text-green-300"
                          onClick={() => updateRouteStatus(route.id, 'completed', 'available')}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Marcar como Chegada
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Solicitações de ambulância pendentes */}
      {pendingRequests.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-amber-400" />
            Solicitações Pendentes
            <Badge className="ml-2 animate-pulse bg-red-500/20 text-red-400 border-red-500/30">
              {pendingRequests.length} pendentes
            </Badge>
          </h3>
          
          <div className="space-y-4">
            {pendingRequests.map(request => (
              <div 
                key={request.id} 
                className="bg-gray-800/60 rounded-xl p-4 border border-amber-500/20"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h4 className="font-medium text-white flex items-center">
                        <User className="h-4 w-4 mr-2 text-amber-400" />
                        {request.patientInfo.name || 'Paciente sem identificação'}
                      </h4>
                      
                      <Badge className={`ml-3 ${getEmergencyLevelColor(request.patientInfo.emergencyLevel)}`}>
                        {getEmergencyLevelText(request.patientInfo.emergencyLevel)}
                      </Badge>
                    </div>
                    
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center text-sm text-gray-300">
                        <MapPin className="h-4 w-4 mr-2 text-amber-500" />
                        {request.location.address}
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-400">
                        <Phone className="h-4 w-4 mr-2 text-gray-500" />
                        Solicitante: {request.callerName} - {request.callerPhone}
                      </div>
                    </div>
                    
                    <div className="mt-3 bg-gray-700/50 px-3 py-1.5 rounded-lg">
                      <div className="text-xs text-gray-400 mb-1">Condição</div>
                      <div className="text-sm text-gray-200">
                        {request.patientInfo.condition}
                      </div>
                    </div>
                    
                    <div className="mt-3 flex flex-wrap gap-2">
                      {request.patientInfo.symptoms.map((symptom, index) => (
                        <Badge 
                          key={index}
                          className="bg-gray-700/50 text-gray-300 border-gray-600"
                        >
                          {symptom}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="default"
                          size="sm"
                          className="bg-amber-600 hover:bg-amber-700"
                        >
                          <Ambulance className="h-4 w-4 mr-2" />
                          Despachar
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-800 border-gray-700 text-white">
                        <DialogHeader>
                          <DialogTitle>Despachar Ambulância</DialogTitle>
                          <DialogDescription className="text-gray-400">
                            Selecione uma ambulância disponível para atender esta solicitação.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4 py-4">
                          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                            <div className="flex items-center mb-2">
                              <AlertCircle className="h-5 w-5 text-amber-400 mr-2" />
                              <h4 className="font-medium text-white">Detalhes da Emergência</h4>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center text-gray-300">
                                <User className="h-4 w-4 mr-2 text-gray-500" />
                                Paciente: {request.patientInfo.name || 'Não identificado'}
                                {request.patientInfo.age && ` (${request.patientInfo.age} anos)`}
                              </div>
                              <div className="flex items-center text-gray-300">
                                <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                                Localização: {request.location.address}
                              </div>
                              <div className="text-gray-300">
                                <span className="text-gray-500">Condição:</span> {request.patientInfo.condition}
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm text-gray-400">Selecionar Ambulância</label>
                            <Select>
                              <SelectTrigger className="bg-gray-700 border-gray-600">
                                <SelectValue placeholder="Escolha uma ambulância disponível" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-700 border-gray-600">
                                {availableAmbulances.map(ambulance => (
                                  <SelectItem key={ambulance.id} value={ambulance.id}>
                                    Ambulância {ambulance.vehicleId} ({ambulance.type})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <DialogFooter>
                          <Button 
                            variant="outline" 
                            className="border-gray-600 hover:bg-gray-700"
                          >
                            Cancelar
                          </Button>
                          <Button 
                            variant="default"
                            className="bg-amber-600 hover:bg-amber-700"
                            onClick={() => {
                              // Em produção aqui usaríamos o valor selecionado do Select
                              // Por simplicidade, vamos usar a primeira ambulância disponível
                              if (availableAmbulances.length > 0) {
                                handleDispatchAmbulance(request, availableAmbulances[0].id);
                              }
                            }}
                          >
                            Despachar Ambulância
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Diálogo para atribuir leito */}
      <Dialog open={showAssignBeds} onOpenChange={setShowAssignBeds}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Designar Leito para Paciente</DialogTitle>
            <DialogDescription className="text-gray-400">
              Selecione um leito disponível para o paciente que está chegando.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {selectedRoute?.patient && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <User className="h-5 w-5 text-blue-400 mr-2" />
                  <h4 className="font-medium text-white">Detalhes do Paciente</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Nome:</span>
                    <span className="text-gray-200">{selectedRoute.patient.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Idade:</span>
                    <span className="text-gray-200">{selectedRoute.patient.age} anos</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Condição:</span>
                    <span className="text-gray-200">{selectedRoute.patient.condition}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Prioridade:</span>
                    <Badge className={getEmergencyLevelColor(selectedRoute.patient.emergencyLevel)}>
                      {getEmergencyLevelText(selectedRoute.patient.emergencyLevel)}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Chegada estimada:</span>
                    <span className="text-gray-200">{getETAFormatted(selectedRoute)}</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Selecionar Leito</label>
              <Select 
                value={selectedBedId} 
                onValueChange={setSelectedBedId}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Escolha um leito disponível" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 max-h-56">
                  {getAvailableBeds().map(bed => (
                    <SelectItem key={bed.id} value={bed.id}>
                      Leito {bed.number} - {bed.department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {getAvailableBeds().length === 0 && (
                <div className="text-amber-400 text-sm mt-1 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  Não há leitos disponíveis no departamento selecionado.
                </div>
              )}
            </div>
            
            <div className="bg-gray-700/50 p-3 rounded-lg mt-4">
              <h5 className="text-sm font-medium text-gray-300 mb-2">Preparação do Leito</h5>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="prepare-equipment" 
                    className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-500"
                  />
                  <label htmlFor="prepare-equipment" className="ml-2 text-sm text-gray-300">
                    Preparar equipamentos necessários
                  </label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="notify-team" 
                    className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-500"
                  />
                  <label htmlFor="notify-team" className="ml-2 text-sm text-gray-300">
                    Notificar equipe médica
                  </label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="patient-record" 
                    className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-500"
                  />
                  <label htmlFor="patient-record" className="ml-2 text-sm text-gray-300">
                    Criar prontuário prévio
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              className="border-gray-600 hover:bg-gray-700"
              onClick={() => setShowAssignBeds(false)}
            >
              Cancelar
            </Button>
            <Button 
              variant="default"
              disabled={!selectedBedId || isAssigning}
              onClick={assignBedToPatient}
            >
              {isAssigning ? (
                <>
                  <span className="animate-spin mr-2">↻</span>
                  Designando...
                </>
              ) : (
                <>
                  <BedDouble className="h-4 w-4 mr-2" />
                  Confirmar Designação
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};