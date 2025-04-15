import { useState, useEffect } from 'react';
import { useNetworkData } from '@/hooks/network-hospital/useNetworkData';
import { IBed } from '@/types/hospital-network-types';

interface BedAssignmentProps {
  hospitalId: string;
  departmentId: string;
  selectedBedId: string;
  onChange: (bedId: string) => void;
}

export default function BedAssignment({
  hospitalId,
  departmentId,
  selectedBedId,
  onChange
}: BedAssignmentProps) {
  const { networkData, beds, loading } = useNetworkData();
  const [availableBeds, setAvailableBeds] = useState<IBed[]>([]);
  const [selectedFloor, setSelectedFloor] = useState<string>('');
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  
  // Obter leitos disponíveis com base no departamento selecionado
  useEffect(() => {
    if (!networkData || !departmentId) return;
    
    // Filtrar leitos pelo departamento e status disponível
    const departmentBeds = beds.filter(bed => 
      bed.department === departmentId && bed.status === 'available'
    );
    
    setAvailableBeds(departmentBeds);
    
    // Se houver leitos disponíveis, selecionar o primeiro andar por padrão
    if (departmentBeds.length > 0) {
      const floors = [...new Set(departmentBeds.map(bed => bed.floor))].sort();
      if (floors.length > 0 && !selectedFloor) {
        setSelectedFloor(floors[0]);
      }
    } else {
      setSelectedFloor('');
      setSelectedRoom('');
    }
  }, [networkData, departmentId, beds, selectedFloor]);
  
  // Obter andares disponíveis
  const availableFloors = [...new Set(availableBeds.map(bed => bed.floor))].sort();
  
  // Obter salas do andar selecionado
  const roomsInSelectedFloor = selectedFloor
    ? [...new Set(availableBeds
        .filter(bed => bed.floor === selectedFloor)
        .map(bed => {
          // Extrair número da sala do ID do leito (assumindo um formato como "UTI-101A")
          const roomMatch = bed.id.match(/\d+[A-Za-z]*/);
          return roomMatch ? roomMatch[0] : '';
        })
      )].sort()
    : [];
  
  // Obter leitos da sala selecionada
  const bedsInSelectedRoom = selectedRoom
    ? availableBeds.filter(bed => {
        // Verificar se o ID do leito contém o número da sala
        return bed.floor === selectedFloor && bed.id.includes(selectedRoom);
      })
    : selectedFloor 
      ? availableBeds.filter(bed => bed.floor === selectedFloor)
      : [];
  
  // Quando o andar é alterado, resetar a sala selecionada
  useEffect(() => {
    setSelectedRoom('');
  }, [selectedFloor]);
  
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Atribuição de Leito (Opcional)
      </label>
      
      {loading ? (
        <div className="flex justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-primary-500"></div>
        </div>
      ) : availableBeds.length === 0 ? (
        <div className="p-4 bg-yellow-50 text-yellow-700 rounded-md">
          Não há leitos disponíveis neste departamento
        </div>
      ) : (
        <div className="space-y-4">
          {/* Seleção de Andar */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Andar
            </label>
            <div className="flex flex-wrap gap-2">
              {availableFloors.map((floor) => (
                <button
                  key={floor}
                  type="button"
                  onClick={() => setSelectedFloor(floor)}
                  className={`px-4 py-2 rounded-md ${
                    selectedFloor === floor
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {floor}º Andar
                </button>
              ))}
            </div>
          </div>
          
          {/* Seleção de Sala */}
          {selectedFloor && roomsInSelectedFloor.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Sala
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRoom('')}
                  className={`px-4 py-2 rounded-md ${
                    selectedRoom === ''
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Todas
                </button>
                {roomsInSelectedFloor.map((room) => (
                  <button
                    key={room}
                    type="button"
                    onClick={() => setSelectedRoom(room)}
                    className={`px-4 py-2 rounded-md ${
                      selectedRoom === room
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Sala {room}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Seleção de Leito */}
          {selectedFloor && bedsInSelectedRoom.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Leito
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {bedsInSelectedRoom.map((bed) => (
                  <div
                    key={bed.id}
                    onClick={() => onChange(bed.id)}
                    className={`p-3 border rounded-md cursor-pointer transition-colors ${
                      selectedBedId === bed.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-300 hover:border-primary-300 hover:bg-primary-50/30'
                    }`}
                  >
                    <div className="font-medium">{bed.number}</div>
                    <div className="text-sm text-gray-600">
                      {bed.specialty || 'Geral'} - {bed.department}
                    </div>
                    <div className="mt-1 inline-block px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      Disponível
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}