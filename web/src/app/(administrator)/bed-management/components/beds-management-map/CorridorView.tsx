/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { IBed, IRoom } from "@/types/hospital-network-types";
import { 
  ChevronRight, 
  ChevronLeft, 
  Users, 
  DoorOpen, 
  AlertTriangle, 
  Flag, 
  Activity, 
  Clock, 
  HeartPulse, 
  Stethoscope, 
  BedDouble, 
  Ambulance,
  Droplets
} from "lucide-react";
import { BedSpace, EmptyBedSpace, CorridorIndicator } from "./BedModelCanva";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/organisms/tooltip";
import { useAmbulanceData } from "@/services/hooks/ambulance/useAmbulanceData";
import { Badge } from "@/components/ui/organisms/badge";
import { IAmbulanceRoute } from "@/types/ambulance-types";
import { Button } from "@/components/ui/organisms/button";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/organisms/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/organisms/tabs";

interface ICorridorViewProps {
  beds: IBed[];
  onBedSelect: (bed: IBed) => void;
  selectedBed: IBed | null;
  departmentName: string;
  hospitalId: string;
  rooms?: IRoom[];
  selectedRoom?: string;
  selectedFloor?: string;
}

export const CorridorView: React.FC<ICorridorViewProps> = ({
  beds,
  onBedSelect,
  selectedBed,
  departmentName,
  hospitalId,
  rooms = [],
  selectedRoom = '',
  selectedFloor = '1'
}) => {
  const [activeQuarterView, setActiveQuarterView] = useState<boolean>(true);
  const [incomingAmbulances, setIncomingAmbulances] = useState<IAmbulanceRoute[]>([]);
  const [showBedDetails, setShowBedDetails] = useState<string | null>(null);
  const { activeRoutes = [] } = useAmbulanceData(hospitalId);

  // Filtra ambulâncias que estão a caminho deste hospital/departamento
  useEffect(() => {
    if (hospitalId) {
      const incoming = activeRoutes.filter(route => 
        route.status === 'in_progress' && 
        route.destination.hospitalId === hospitalId &&
        route.patient?.condition.toLowerCase().includes(departmentName.toLowerCase())
      );
      setIncomingAmbulances(incoming);
    }
  }, [activeRoutes, hospitalId, departmentName]);

    // Filtra ambulâncias que estão a caminho deste hospital/departamento
    useEffect(() => {
      if (hospitalId) {
        const incoming = activeRoutes.filter(route => 
          route.status === 'in_progress' && 
          route.destination.hospitalId === hospitalId &&
          route.patient?.condition.toLowerCase().includes(departmentName.toLowerCase())
        );
        setIncomingAmbulances(incoming);
      }
    }, [activeRoutes, hospitalId, departmentName]);
  
    // Função para ver se um leito tem paciente de ambulância chegando
    const hasIncomingPatientForBed = (bedId: string): IAmbulanceRoute | undefined => {
      return incomingAmbulances.find(route => 
        route.destination.hospitalId === hospitalId &&
        route.status === 'in_progress' &&
        route.notes?.includes(bedId)
      );
    };
  
    // Filtra as camas com base no quarto selecionado
    const filteredBeds = selectedRoom && selectedRoom !== 'all'
    ? beds.filter(bed => 
        bed.number.startsWith(selectedRoom) || 
        bed.number.includes(selectedRoom)
      )
    : beds;
  
    // Agrupar leitos por quartos quando a visualização de quartos estiver ativa
    const groupedBeds = activeQuarterView
      ? rooms
          .filter(room => room.floor === selectedFloor)
          .map(room => ({
            room,
            beds: filteredBeds.filter(bed => 
              bed.number.startsWith(room.roomNumber) || 
              bed.number.includes(room.roomNumber)
            )
          }))
      : [{ 
          room: { 
            roomNumber: 'all', 
            floor: selectedFloor,
            type: 'ward',
            specialty: '',
            beds: [] 
          },
          beds: filteredBeds 
        }];
        
    // Dados para o gráfico de sinais vitais
    const getVitalSignsData = (bed: IBed) => {
      // Em um sistema real, esses dados viriam de um API/banco de dados
      // Aqui estamos gerando alguns valores simulados
      if (!bed.patient) return null;
      
      // Simulando dados de sinais vitais das últimas 12 horas
      const hours = Array.from({ length: 12 }, (_, i) => i);
      const heartRate = hours.map(h => ({
        time: `${h}h`,
        value: bed.patient ? Math.floor(65 + Math.sin(h/2) * 15 + Math.random() * 5) : 0
      }));
      
      const bloodPressure = hours.map(h => ({
        time: `${h}h`,
        systolic: bed.patient ? Math.floor(115 + Math.sin(h/3) * 10 + Math.random() * 5) : 0,
        diastolic: bed.patient ? Math.floor(75 + Math.sin(h/3) * 5 + Math.random() * 3) : 0
      }));
      
      const oxygen = hours.map(h => ({
        time: `${h}h`,
        value: bed.patient ? Math.floor(96 + Math.sin(h/4) * 2 + Math.random()) : 0
      }));
      
      const temperature = hours.map(h => ({
        time: `${h}h`,
        value: bed.patient ? (36.5 + Math.sin(h/6) * 0.5 + Math.random() * 0.3).toFixed(1) : 0
      }));
      
      return {
        heartRate,
        bloodPressure,
        oxygen,
        temperature
      };
    };
  
    const renderBedGroup = (groupBeds: IBed[], roomInfo?: IRoom) => {
      const roomType = roomInfo?.type || 'ward';
      
      // Para diferentes tipos de quarto, renderize diferentes layouts
      switch (roomType) {
        case 'single':
          // Render single patient room layout
          return (
            <div className="grid grid-cols-1 gap-4">
              {groupBeds.map((bed) => (
                <div key={bed.id} className="relative">
                  {hasIncomingPatientForBed(bed.id) && (
                    <div className="absolute -top-1 -right-1 z-10">
                      <Badge variant="destructive" className="animate-pulse flex items-center gap-1">
                        <Ambulance className="h-3 w-3" />
                        Ambulância a caminho
                      </Badge>
                    </div>
                  )}
                  <div className="group">
                    <BedSpace
                      bed={bed}
                      isSelected={selectedBed?.id === bed.id}
                      onClick={() => onBedSelect(bed)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowBedDetails(bed.id === showBedDetails ? null : bed.id);
                      }}
                    >
                      <Activity className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {showBedDetails === bed.id && (
                    <Popover open={showBedDetails === bed.id} onOpenChange={() => setShowBedDetails(null)}>
                      <PopoverContent className="w-80 bg-gray-800 border-gray-700 p-0 overflow-hidden">
                        <Tabs defaultValue="info">
                          <TabsList className="grid grid-cols-3 bg-gray-700">
                            <TabsTrigger value="info">Informações</TabsTrigger>
                            <TabsTrigger value="vitals">Sinais Vitais</TabsTrigger>
                            <TabsTrigger value="staff">Equipe</TabsTrigger>
                          </TabsList>
                          
                          <div className="p-4">
                            <TabsContent value="info" className="m-0">
                              <h4 className="font-medium text-white mb-2 flex items-center">
                                <BedDouble className="h-4 w-4 mr-2" />
                                Leito {bed.number}
                              </h4>
                              
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Status:</span>
                                  <Badge className={
                                    bed.status === 'occupied' ? 'bg-blue-500/20 text-blue-400' : 
                                    bed.status === 'available' ? 'bg-green-500/20 text-green-400' : 
                                    'bg-amber-500/20 text-amber-400'
                                  }>
                                    {bed.status === 'occupied' ? 'Ocupado' : 
                                     bed.status === 'available' ? 'Disponível' : 
                                     'Manutenção'}
                                  </Badge>
                                </div>
                                
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Departamento:</span>
                                  <span className="text-white">{bed.department}</span>
                                </div>
                                
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Especialidade:</span>
                                  <span className="text-white">{bed.specialty || '-'}</span>
                                </div>
                                
                                {bed.patient && (
                                  <>
                                    <div className="pt-2 border-t border-gray-700 mt-2">
                                      <h5 className="font-medium text-white mb-2">Dados do Paciente</h5>
                                      
                                      <div className="space-y-2">
                                        <div className="flex justify-between">
                                          <span className="text-gray-400">Nome:</span>
                                          <span className="text-white">{bed.patient.name}</span>
                                        </div>
                                        
                                        <div className="flex justify-between">
                                          <span className="text-gray-400">Idade:</span>
                                          <span className="text-white">{bed.patient.age} anos</span>
                                        </div>
                                        
                                        <div className="flex justify-between">
                                          <span className="text-gray-400">Diagnóstico:</span>
                                          <span className="text-white">{bed.patient.diagnosis}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>
                            </TabsContent>
                            
                            <TabsContent value="vitals" className="m-0">
                              {bed.patient ? (
                                <div className="space-y-4">
                                  <h4 className="font-medium text-white mb-2 flex items-center">
                                    <Activity className="h-4 w-4 mr-2" />
                                    Sinais Vitais
                                  </h4>
                                  
                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-gray-700/30 p-2 rounded-lg">
                                      <div className="flex items-center text-xs text-gray-400 mb-1">
                                        <HeartPulse className="h-3 w-3 mr-1 text-red-400" />
                                        FC
                                      </div>
                                      <div className="font-medium text-white">
                                        {70 + Math.floor(Math.random() * 20)} <span className="text-xs text-gray-500">bpm</span>
                                      </div>
                                    </div>
                                    
                                    <div className="bg-gray-700/30 p-2 rounded-lg">
                                      <div className="flex items-center text-xs text-gray-400 mb-1">
                                        <Activity className="h-3 w-3 mr-1 text-blue-400" />
                                        PA
                                      </div>
                                      <div className="font-medium text-white">
                                        {110 + Math.floor(Math.random() * 30)}/{70 + Math.floor(Math.random() * 10)} <span className="text-xs text-gray-500">mmHg</span>
                                      </div>
                                    </div>
                                    
                                    <div className="bg-gray-700/30 p-2 rounded-lg">
                                      <div className="flex items-center text-xs text-gray-400 mb-1">
                                        <Activity className="h-3 w-3 mr-1 text-green-400" />
                                        SpO2
                                      </div>
                                      <div className="font-medium text-white">
                                        {95 + Math.floor(Math.random() * 5)} <span className="text-xs text-gray-500">%</span>
                                      </div>
                                    </div>
                                    
                                    <div className="bg-gray-700/30 p-2 rounded-lg">
                                      <div className="flex items-center text-xs text-gray-400 mb-1">
                                        <Activity className="h-3 w-3 mr-1 text-amber-400" />
                                        Temp
                                      </div>
                                      <div className="font-medium text-white">
                                        {(36 + Math.random()).toFixed(1)} <span className="text-xs text-gray-500">°C</span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="mt-2 text-center">
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      className="w-full text-xs border-gray-600"
                                    >
                                      <Clock className="h-3 w-3 mr-1" />
                                      Ver Histórico Completo
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-center py-4 text-gray-400">
                                  <Activity className="h-8 w-8 mx-auto mb-2 text-gray-500" />
                                  <p>Sem paciente para mostrar sinais vitais</p>
                                </div>
                              )}
                            </TabsContent>
                            
                            <TabsContent value="staff" className="m-0">
                              {bed.patient ? (
                                <div className="space-y-4">
                                  <h4 className="font-medium text-white mb-2 flex items-center">
                                    <Users className="h-4 w-4 mr-2" />
                                    Equipe Responsável
                                  </h4>
                                  
                                  <div className="space-y-2">
                                    <div className="flex items-center bg-gray-700/30 p-2 rounded-lg">
                                      <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mr-2">
                                        <Stethoscope className="h-4 w-4 text-blue-400" />
                                      </div>
                                      <div>
                                        <div className="text-sm font-medium text-white">Dr. Carlos Silva</div>
                                        <div className="text-xs text-gray-400">Médico Responsável</div>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center bg-gray-700/30 p-2 rounded-lg">
                                      <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mr-2">
                                        <Users className="h-4 w-4 text-green-400" />
                                      </div>
                                      <div>
                                        <div className="text-sm font-medium text-white">Enf. Ana Martins</div>
                                        <div className="text-xs text-gray-400">Enfermeira</div>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center bg-gray-700/30 p-2 rounded-lg">
                                      <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center mr-2">
                                        <Activity className="h-4 w-4 text-purple-400" />
                                      </div>
                                      <div>
                                        <div className="text-sm font-medium text-white">Beatriz Santos</div>
                                        <div className="text-xs text-gray-400">Técnica de Enfermagem</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-center py-4 text-gray-400">
                                  <Users className="h-8 w-8 mx-auto mb-2 text-gray-500" />
                                  <p>Sem paciente para mostrar equipe</p>
                                </div>
                              )}
                            </TabsContent>
                          </div>
                        </Tabs>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              ))}
            </div>
          );
          
        case 'double':
          // Render double patient room layout
          return (
            <div className="grid grid-cols-2 gap-4">
              {groupBeds.map((bed) => (
                <div key={bed.id} className="relative">
                  {hasIncomingPatientForBed(bed.id) && (
                    <div className="absolute -top-1 -right-1 z-10">
                      <Badge variant="destructive" className="animate-pulse flex items-center gap-1">
                        <Ambulance className="h-3 w-3" />
                        Ambulância a caminho
                      </Badge>
                    </div>
                  )}
                  <div className="group">
                    <BedSpace
                      bed={bed}
                      isSelected={selectedBed?.id === bed.id}
                      onClick={() => onBedSelect(bed)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowBedDetails(bed.id === showBedDetails ? null : bed.id);
                      }}
                    >
                      <Activity className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {showBedDetails === bed.id && (
                    <Popover open={showBedDetails === bed.id} onOpenChange={() => setShowBedDetails(null)}>
                      <PopoverContent className="w-80 bg-gray-800 border-gray-700 p-0 overflow-hidden">
                        {/* Mesmo conteúdo das abas que no caso single */}
                        <div className="p-3 text-center text-gray-400">
                          <p>Detalhes do leito {bed.number}</p>
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              ))}
            </div>
          );
          
        case 'ward':
        default:
          // Render ward layout (original corridor layout)
          // Criar array de 12 posições (6 por fileira) com numeração sequencial
          const allPositions = Array(groupBeds.length || 12).fill(null).map((_, index) => {
            const row = Math.floor(index / 6);
            const position = (index % 6) + 1;
            const bedNumber = getEmptyBedNumber(row, position);
            const existingBed = groupBeds.find(bed => bed.number === bedNumber);
            
            return existingBed || {
              id: `empty-${departmentName}-${bedNumber}`,
              number: bedNumber,
              department: departmentName,
              floor: selectedFloor,
              specialty: '',
              hospital: '',
              status: 'available' as const
            };
          });
  
          // Dividir em duas fileiras
          const row1 = allPositions.slice(0, 6);
          const row2 = allPositions.slice(6, 12);
  
          return (
            <div className="space-y-4">
              {/* Primeira fileira */}
              <div className="grid grid-cols-6 gap-4">
                {row1.map((bed) => (
                  <div key={bed.id} className="relative group">
                    {hasIncomingPatientForBed(bed.id) && (
                      <div className="absolute -top-1 -right-1 z-10">
                        <Badge variant="destructive" className="animate-pulse flex items-center gap-1">
                          <Ambulance className="h-3 w-3" />
                          Ambulância a caminho
                        </Badge>
                      </div>
                    )}
                    
                    {bed.status === 'hygienization' && (
                      <div className="absolute -top-1 -right-1 z-10">
                        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 flex items-center gap-1">
                          <Droplets className="h-3 w-3" />
                          Manutenção
                        </Badge>
                      </div>
                    )}
                    
                    <BedSpace
                      key={bed.id}
                      bed={bed}
                      isSelected={selectedBed?.id === bed.id}
                      onClick={() => onBedSelect(bed)}
                    />
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowBedDetails(bed.id === showBedDetails ? null : bed.id);
                      }}
                    >
                      <Activity className="h-4 w-4" />
                    </Button>
                    
                    {showBedDetails === bed.id && (
                      <Popover open={showBedDetails === bed.id} onOpenChange={() => setShowBedDetails(null)}>
                        <PopoverContent className="w-80 bg-gray-800 border-gray-700 p-0 overflow-hidden">
                          {/* Mesmo conteúdo das abas que no caso single */}
                          <div className="p-3 text-center text-gray-400">
                            <p>Detalhes do leito {bed.number}</p>
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                ))}
              </div>
  
              {/* Corredor central */}
              <CorridorIndicator />
  
              {/* Segunda fileira */}
              <div className="grid grid-cols-6 gap-4">
                {row2.map((bed) => (
                  <div key={bed.id} className="relative group">
                    {hasIncomingPatientForBed(bed.id) && (
                      <div className="absolute -top-1 -right-1 z-10">
                        <Badge variant="destructive" className="animate-pulse flex items-center gap-1">
                          <Ambulance className="h-3 w-3" />
                          Ambulância a caminho
                        </Badge>
                      </div>
                    )}
                    
                    {bed.status === 'hygienization' && (
                      <div className="absolute -top-1 -right-1 z-10">
                        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 flex items-center gap-1">
                          <Droplets className="h-3 w-3" />
                          Manutenção
                        </Badge>
                      </div>
                    )}
                    
                    <BedSpace
                      key={bed.id}
                      bed={bed}
                      isSelected={selectedBed?.id === bed.id}
                      onClick={() => onBedSelect(bed)}
                    />
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowBedDetails(bed.id === showBedDetails ? null : bed.id);
                      }}
                    >
                      <Activity className="h-4 w-4" />
                    </Button>
                    
                    {showBedDetails === bed.id && (
                      <Popover open={showBedDetails === bed.id} onOpenChange={() => setShowBedDetails(null)}>
                        <PopoverContent className="w-80 bg-gray-800 border-gray-700 p-0 overflow-hidden">
                          {/* Mesmo conteúdo das abas que no caso single */}
                          <div className="p-3 text-center text-gray-400">
                            <p>Detalhes do leito {bed.number}</p>
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
      }
    };
  
    // Função para gerar número do leito baseado na posição
    const getEmptyBedNumber = (row: number, position: number): string => {
      const rowPrefix = row === 0 ? '1' : '2';
      return `${rowPrefix}${position.toString().padStart(2, '0')}`;
    };
  
    return (
      <div className="bg-gray-800/30 p-6 rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="text-gray-400 text-sm">
            Leitos {activeQuarterView ? 'por Quartos' : 'por Corredor'}
          </div>
  
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveQuarterView(!activeQuarterView)}
              className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors
                ${activeQuarterView 
                  ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30' 
                  : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700/70'
                }`}
            >
              <DoorOpen className="h-3.5 w-3.5 mr-1" />
              {activeQuarterView ? 'Visualização por quartos' : 'Visualização por corredor'}
            </button>
            
            {incomingAmbulances.length > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="px-3 py-1 bg-red-600/20 text-red-400 rounded-lg text-xs font-medium flex items-center gap-1 animate-pulse">
                      <Ambulance className="h-3.5 w-3.5 mr-1" />
                      {incomingAmbulances.length} ambulância(s) a caminho
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-800 border-gray-700">
                    <div className="space-y-2">
                      {incomingAmbulances.map(route => (
                        <div key={route.id} className="text-xs">
                          <div className="font-medium text-white">{route.patient?.name || 'Paciente'}</div>
                          <div className="text-gray-400">ETA: {new Date(route.estimatedArrivalTime).toLocaleTimeString()}</div>
                          <div className="text-gray-400">Cond.: {route.patient?.condition}</div>
                        </div>
                      ))}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
  
        <div className="space-y-8">
          {groupedBeds.map(({ room, beds: groupBeds }) => (
            <div key={room.roomNumber} className="space-y-4">
              {activeQuarterView && room.roomNumber !== 'all' && (
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <DoorOpen className="h-4 w-4 text-gray-500" />
                    Quarto {room.roomNumber}
                    <span className="text-xs bg-gray-700 px-2 py-0.5 rounded-full text-gray-400">
                      {room.type === 'single' ? 'Individual' : 
                       room.type === 'double' ? 'Duplo' : 'Enfermaria'}
                    </span>
                    {room.specialty && (
                      <span className="text-xs bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded-full">
                        {room.specialty}
                      </span>
                    )}
                  </h4>
                  
                  <div className="flex items-center text-xs text-gray-400">
                    <span className="mr-2">
                      {groupBeds.filter(bed => bed.status === 'occupied').length}/{groupBeds.length} ocupados
                    </span>
                    {groupBeds.some(bed => bed.status === 'hygienization') && (
                      <span className="bg-yellow-600/20 text-yellow-500 px-2 py-0.5 rounded-full flex items-center">
                        <Droplets className="h-3 w-3 mr-1" />
                        Em manutenção
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              {renderBedGroup(groupBeds, {
                ...room,
                type: room.type as 'single' | 'double' | 'ward'
              })}
            </div>
          ))}
        </div>
      </div>
    );
};