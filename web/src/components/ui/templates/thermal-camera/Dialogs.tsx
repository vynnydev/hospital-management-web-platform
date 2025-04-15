import React, { useState } from 'react';
import { 
  Plus,
  Server
} from 'lucide-react';
import { Input } from '@/components/ui/organisms/input';
import { Button } from '@/components/ui/organisms/button';
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
  DialogTitle
} from '@/components/ui/organisms/dialog';
import type { IHospital } from '@/types/hospital-network-types';

interface AddCameraDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
  hospitalId: string;
  hospital: IHospital | undefined;
}

export const AddCameraDialog: React.FC<AddCameraDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  hospital
}) => {
  const [newCamera, setNewCamera] = useState({
    name: '',
    model: 'ESP32-CAM-MLX90640',
    roomId: '',
    bedId: '',
    ipAddress: ''
  });

  const handleSubmit = () => {
    onSave();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-blue-400" />
            Adicionar Nova Câmera Térmica
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Configure os detalhes da nova câmera térmica para monitoramento de leitos
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Nome da Câmera</label>
              <Input
                value={newCamera.name}
                onChange={(e) => setNewCamera({...newCamera, name: e.target.value})}
                placeholder="Ex: Câmera Térmica 101A"
                className="bg-gray-700 border-gray-600"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Modelo</label>
              <Select 
                value={newCamera.model}
                onValueChange={(value) => setNewCamera({...newCamera, model: value})}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Selecione o modelo" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="ESP32-CAM-MLX90640">ESP32-CAM-MLX90640 (32x24)</SelectItem>
                  <SelectItem value="ESP32-CAM-MLX90641">ESP32-CAM-MLX90641 (16x12)</SelectItem>
                  <SelectItem value="RaspberryPi-AMG8833">RaspberryPi-AMG8833 (8x8)</SelectItem>
                  <SelectItem value="FLIR-Lepton3">FLIR Lepton 3 (160x120)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Quarto</label>
              <Select
                value={newCamera.roomId}
                onValueChange={(value) => setNewCamera({...newCamera, roomId: value})}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Selecione o quarto" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 max-h-60">
                  {hospital?.departments.flatMap(dept => 
                    dept.rooms.map(room => (
                      <SelectItem key={room.roomNumber} value={room.roomNumber}>
                        Quarto {room.roomNumber} ({dept.name})
                      </SelectItem>
                    ))
                  ) || (
                    <SelectItem value="no-rooms">Nenhum quarto encontrado</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Leito (opcional)</label>
              <Select
                value={newCamera.bedId}
                onValueChange={(value) => setNewCamera({...newCamera, bedId: value})}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Selecione o leito (opcional)" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="">Monitorar todo o quarto</SelectItem>
                  {hospital?.departments
                    .flatMap(dept => dept.rooms)
                    .find(room => room.roomNumber === newCamera.roomId)
                    ?.beds.map(bed => (
                      <SelectItem key={bed.id} value={bed.id}>
                        Leito {bed.number}
                      </SelectItem>
                    )) || (
                      <SelectItem value="no-beds">Selecione um quarto primeiro</SelectItem>
                    )}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Endereço IP</label>
            <Input
              value={newCamera.ipAddress}
              onChange={(e) => setNewCamera({...newCamera, ipAddress: e.target.value})}
              placeholder="Ex: 192.168.1.10"
              className="bg-gray-700 border-gray-600"
            />
            <p className="text-xs text-gray-500">
              Digite o endereço IP da câmera na rede local do hospital
            </p>
          </div>
          
          <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-700/30">
            <div className="flex items-center gap-2 mb-2">
              <Server className="h-4 w-4 text-blue-400" />
              <h4 className="text-white font-medium">Configuração automática</h4>
            </div>
            <p className="text-sm text-gray-400">
              As configurações de temperatura, intervalos de captura e privacidade serão aplicadas automaticamente com base nas configurações padrão do hospital.
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="border-gray-600 hover:bg-gray-700"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-blue-600 to-indigo-600"
            disabled={!newCamera.name || !newCamera.roomId || !newCamera.ipAddress}
          >
            Adicionar Câmera
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};