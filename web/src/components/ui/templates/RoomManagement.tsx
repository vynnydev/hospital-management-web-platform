import React, { useState, useEffect } from 'react';
import { 
  DoorOpen, 
  User, 
  BedDouble, 
  Plus, 
  Edit, 
  Trash, 
  Search,
  Filter,
  X,
  Check,
  Stethoscope,
  Users,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/organisms/button';
import { Input } from '@/components/ui/organisms/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/organisms/select';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/organisms/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/organisms/dropdown-menu';
import { useNetworkData } from '@/services/hooks/network-hospital/useNetworkData';
import { useStaffData } from '@/services/hooks/staffs/useStaffData';
import type { IHospital, IDepartment, IRoom, IBed } from '@/types/hospital-network-types';
import { Badge } from '@/components/ui/organisms/badge';

interface RoomManagementProps {
  hospitalId: string;
  selectedDepartment: string;
  selectedFloor: string;
  selectedRoom?: string;
  onRoomSelect: (roomId: string) => void;
}

export const RoomManagement: React.FC<RoomManagementProps> = ({
  hospitalId,
  selectedDepartment,
  selectedFloor,
  selectedRoom,
  onRoomSelect
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOccupied, setFilterOccupied] = useState<'all' | 'occupied' | 'available'>('all');
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [newRoomData, setNewRoomData] = useState({
    roomNumber: '',
    floor: selectedFloor,
    type: 'single' as 'single' | 'double' | 'ward',
    specialty: '',
    maxBeds: 1
  });
  
  const { networkData, beds } = useNetworkData();
  const { staffData } = useStaffData(hospitalId);
  
  const hospital = networkData?.hospitals.find(h => h.id === hospitalId);
  const department = hospital?.departments.find(d => d.name === selectedDepartment);
  
  // Resetar filtros quando mudar departamento ou andar
  useEffect(() => {
    setSearchTerm('');
    setFilterOccupied('all');
  }, [selectedDepartment, selectedFloor]);
  
  // Resetar dados do novo quarto quando mudar andar
  useEffect(() => {
    setNewRoomData(prev => ({
      ...prev,
      floor: selectedFloor
    }));
  }, [selectedFloor]);
  
  if (!department) {
    return <div className="p-4 text-gray-400">Selecione um departamento para gerenciar quartos</div>;
  }
  
  // Filtrar quartos por andar
  const roomsInFloor = department.rooms.filter(room => room.floor === selectedFloor);
  
  // Aplicar filtros de busca e ocupação
  const filteredRooms = roomsInFloor.filter(room => {
    // Filtro de busca
    const matchesSearch = searchTerm === '' || 
      room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.specialty?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro de ocupação
    if (filterOccupied === 'all') return matchesSearch;
    
    const roomBeds = room.beds || [];
    const occupiedBeds = roomBeds.filter(bed => bed.status === 'occupied');
    
    if (filterOccupied === 'occupied') {
      return matchesSearch && occupiedBeds.length > 0;
    } else {
      return matchesSearch && occupiedBeds.length < roomBeds.length;
    }
  });
  
  // Obter médicos disponíveis para o departamento/andar selecionado
  const getAvailableDoctors = () => {
    if (!staffData?.staffTeams[hospitalId]) return [];
    
    const doctors: {id: string, name: string}[] = [];
    staffData.staffTeams[hospitalId].forEach(team => {
      if (team.department.toLowerCase() === selectedDepartment.toLowerCase()) {
        team.members.forEach(memberId => {
          if (memberId.startsWith('D')) {
            doctors.push({
              id: memberId,
              name: `Dr. ${memberId.replace('D', '')}`
            });
          }
        });
      }
    });
    
    return doctors;
  };
  
  const getRoomTypeLabel = (type: string) => {
    switch (type) {
      case 'single': return 'Individual';
      case 'double': return 'Duplo';
      case 'ward': return 'Enfermaria';
      default: return type;
    }
  };
  
  const getRoomTypeIcon = (type: string) => {
    switch (type) {
      case 'single': return <User className="h-4 w-4" />;
      case 'double': return <Users className="h-4 w-4" />;
      case 'ward': return <BedDouble className="h-4 w-4" />;
      default: return <DoorOpen className="h-4 w-4" />;
    }
  };
  
  // Calcular estatísticas do quarto
  const getRoomStats = (room: IRoom) => {
    const totalBeds = room.beds?.length || 0;
    const occupiedBeds = room.beds?.filter(bed => bed.status === 'occupied').length || 0;
    const maintenanceBeds = room.beds?.filter(bed => bed.status === 'hygienization').length || 0;
    const availableBeds = totalBeds - occupiedBeds - maintenanceBeds;
    
    return {
      totalBeds,
      occupiedBeds,
      maintenanceBeds,
      availableBeds,
      occupancyRate: totalBeds > 0 ? (occupiedBeds / totalBeds) * 100 : 0
    };
  };
  
  // Função para lidar com a adição de um novo quarto
  const handleAddRoom = () => {
    // Aqui seria implementada a lógica para adicionar o quarto à API
    console.log('Adicionando novo quarto:', newRoomData);
    
    // Resetar form e fechar modal
    setNewRoomData({
      roomNumber: '',
      floor: selectedFloor,
      type: 'single',
      specialty: '',
      maxBeds: 1
    });
    setShowAddRoom(false);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-100 flex items-center">
          <DoorOpen className="h-5 w-5 mr-2 text-blue-400" />
          Quartos do {selectedDepartment} - Andar {selectedFloor}
        </h3>
        
        <Dialog open={showAddRoom} onOpenChange={setShowAddRoom}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Adicionar Quarto
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Quarto</DialogTitle>
              <DialogDescription className="text-gray-400">
                Preencha os dados do novo quarto para o departamento {selectedDepartment}.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Número do Quarto</label>
                  <Input 
                    value={newRoomData.roomNumber}
                    onChange={e => setNewRoomData({...newRoomData, roomNumber: e.target.value})}
                    placeholder="Ex: 101"
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Andar</label>
                  <Select 
                    value={newRoomData.floor}
                    onValueChange={value => setNewRoomData({...newRoomData, floor: value})}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600">
                      <SelectValue placeholder="Selecionar andar" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="1">1º Andar</SelectItem>
                      <SelectItem value="2">2º Andar</SelectItem>
                      <SelectItem value="3">3º Andar</SelectItem>
                      <SelectItem value="4">4º Andar</SelectItem>
                      <SelectItem value="5">5º Andar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Tipo de Quarto</label>
                  <Select 
                    value={newRoomData.type}
                    onValueChange={value => setNewRoomData({
                      ...newRoomData, 
                      type: value as 'single' | 'double' | 'ward',
                      maxBeds: value === 'single' ? 1 : value === 'double' ? 2 : 6
                    })}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600">
                      <SelectValue placeholder="Selecionar tipo" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="single">Individual</SelectItem>
                      <SelectItem value="double">Duplo</SelectItem>
                      <SelectItem value="ward">Enfermaria</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Especialidade</label>
                  <Select 
                    value={newRoomData.specialty}
                    onValueChange={value => setNewRoomData({...newRoomData, specialty: value})}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600">
                      <SelectValue placeholder="Selecionar especialidade" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      {hospital?.specialties.map(specialty => (
                        <SelectItem key={specialty} value={specialty}>
                          {specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Capacidade (Leitos)</label>
                <Input 
                  type="number"
                  min={1}
                  max={newRoomData.type === 'single' ? 1 : newRoomData.type === 'double' ? 2 : 6}
                  value={newRoomData.maxBeds}
                  onChange={e => setNewRoomData({...newRoomData, maxBeds: parseInt(e.target.value) || 1})}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowAddRoom(false)}
                className="border-gray-600 hover:bg-gray-700"
              >
                Cancelar
              </Button>
              <Button onClick={handleAddRoom}>Adicionar Quarto</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Buscar quarto..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-9 bg-gray-800/50 border-gray-700/50 text-gray-100"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <Select 
          value={filterOccupied}
          onValueChange={value => setFilterOccupied(value as 'all' | 'occupied' | 'available')}
        >
          <SelectTrigger className="w-40 bg-gray-800/50 border-gray-700/50 text-gray-100">
            <Filter className="h-4 w-4 mr-2 text-gray-500" />
            <SelectValue placeholder="Filtrar por" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700 text-gray-100">
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="occupied">Ocupados</SelectItem>
            <SelectItem value="available">Disponíveis</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {filteredRooms.map(room => {
          const stats = getRoomStats(room);
          const isSelected = selectedRoom === room.roomNumber;
          
          return (
            <div 
              key={room.roomNumber}
              onClick={() => onRoomSelect(room.roomNumber)}
              className={`
                bg-gray-800/50 p-4 rounded-xl border border-gray-700/50 cursor-pointer transition-all
                ${isSelected ? 'ring-2 ring-blue-500 border-blue-500/50' : 'hover:bg-gray-700/50'}
              `}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`
                    p-2 rounded-lg 
                    ${isSelected ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-700/50 text-gray-400'}
                  `}>
                    {getRoomTypeIcon(room.type)}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-100">Quarto {room.roomNumber}</h4>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <span>{getRoomTypeLabel(room.type)}</span>
                      {room.specialty && (
                        <>
                          <span>•</span>
                          <span className="flex items-center">
                            <Stethoscope className="h-3 w-3 mr-1" />
                            {room.specialty}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-100">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-gray-800 border-gray-700 text-gray-100">
                    <DropdownMenuItem className="flex items-center">
                      <Edit className="h-4 w-4 mr-2" />
                      Editar Quarto
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center text-red-400 hover:text-red-300">
                      <Trash className="h-4 w-4 mr-2" />
                      Remover Quarto
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="mt-3 flex items-center gap-3">
                <div className="flex-1 bg-gray-900/50 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${
                      stats.occupancyRate > 80 ? 'bg-red-500' : 
                      stats.occupancyRate > 50 ? 'bg-amber-500' : 
                      'bg-green-500'
                    }`}
                    style={{ width: `${stats.occupancyRate}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-400">
                  {stats.occupiedBeds}/{stats.totalBeds} leitos
                </span>
              </div>
              
              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className="flex items-center justify-center bg-gray-700/30 rounded-lg py-2">
                  <div className="text-center">
                    <div className="text-xs text-gray-400">Ocupados</div>
                    <div className="text-lg font-semibold text-blue-400">{stats.occupiedBeds}</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center bg-gray-700/30 rounded-lg py-2">
                  <div className="text-center">
                    <div className="text-xs text-gray-400">Disponíveis</div>
                    <div className="text-lg font-semibold text-green-400">{stats.availableBeds}</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center bg-gray-700/30 rounded-lg py-2">
                  <div className="text-center">
                    <div className="text-xs text-gray-400">Manutenção</div>
                    <div className="text-lg font-semibold text-amber-400">{stats.maintenanceBeds}</div>
                  </div>
                </div>
              </div>
              
              {/* Visualização dos pacientes no quarto */}
              {stats.occupiedBeds > 0 && (
                <div className="mt-3 space-y-2">
                  <div className="text-xs font-medium text-gray-300 flex items-center">
                    <User className="h-3 w-3 mr-1 text-gray-400" />
                    Pacientes no quarto
                  </div>
                  
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {room.beds
                      .filter(bed => bed.status === 'occupied' && bed.patient)
                      .map(bed => (
                        <div 
                          key={bed.id} 
                          className="flex items-center justify-between bg-gray-700/30 rounded-lg p-2"
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-600/20 rounded-full flex items-center justify-center mr-2">
                              <span className="text-sm font-medium text-blue-400">
                                {bed.patient?.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-white">{bed.patient?.name}</div>
                              <div className="text-xs text-gray-400 flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                <span>
                                  {new Date(bed.patient?.admissionDate || '').toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Badge 
                            className="text-xs bg-gray-600 hover:bg-gray-500 border-none"
                          >
                            Leito {bed.number}
                          </Badge>
                        </div>
                      ))
                    }
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {filteredRooms.length === 0 && (
        <div className="bg-gray-800/30 rounded-xl p-6 text-center">
          <DoorOpen className="h-12 w-12 text-gray-600 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-300 mb-1">
            Nenhum quarto encontrado
          </h3>
          <p className="text-gray-500 text-sm">
            {searchTerm || filterOccupied !== 'all' 
              ? 'Tente ajustar os filtros para ver mais resultados.'
              : 'Adicione quartos a este departamento usando o botão acima.'}
          </p>
        </div>
      )}
    </div>
  );
};