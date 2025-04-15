import React from 'react';
import { 
  Camera, 
  Thermometer, 
  Clock, 
  Settings,
  Eye,
  EyeOff,
  RefreshCw,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/organisms/button';
import { Badge } from '@/components/ui/organisms/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/organisms/card';
import {
  Input
} from '@/components/ui/organisms/input';
import type { IThermalCamera } from '@/types/thermal-cameras-types';

interface CamerasListTabProps {
  cameras: IThermalCamera[];
  onSelectCamera: (camera: IThermalCamera) => void;
  onUpdateStatus: (cameraId: string, status: 'active' | 'inactive' | 'maintenance') => Promise<void>;
}

export const CamerasListTab: React.FC<CamerasListTabProps> = ({ 
  cameras, 
  onSelectCamera,
  onUpdateStatus
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredCameras = cameras.filter(camera => 
    camera.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    camera.roomId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    camera.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const CameraCard = ({ 
    camera,
    isSuggestion,
    onSelect 
  }: {
    camera: IThermalCamera;
    isSuggestion: boolean;
    onSelect: (camera: IThermalCamera) => void;
  }) => {
    return (
      <div className={`
        bg-gray-800/50 rounded-xl border p-4 transition-all
        ${isSuggestion ? 'border-blue-700/30' : 'border-gray-700/50 hover:border-blue-700/50'}
        ${camera.status === 'maintenance' ? 'border-amber-700/30' : ''}
      `}>
        {isSuggestion && (
          <div className="bg-blue-900/30 text-blue-400 text-xs px-2 py-1 rounded-full mb-2 inline-block">
            Sugestão
          </div>
        )}
        
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-md font-semibold text-white flex items-center gap-2">
            <Camera className={`h-5 w-5 ${
              camera.status === 'active' ? 'text-green-500' :
              camera.status === 'inactive' ? 'text-gray-500' : 
              'text-amber-500'
            }`} />
            {camera.name}
          </h4>
          <Badge variant={
            camera.status === 'active' ? 'success' :
            camera.status === 'inactive' ? 'secondary' :
            'warning'
          }>
            {camera.status === 'active' ? 'Ativo' :
             camera.status === 'inactive' ? 'Inativo' :
             'Em manutenção'
            }
          </Badge>
        </div>
        
        {/* Resto do conteúdo do card */}
        
        <div className="flex gap-2 mt-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onSelect(camera)}
            disabled={isSuggestion}
            className="border-gray-700 text-gray-300 hover:bg-gray-700/50"
          >
            <Settings className="h-4 w-4 mr-2" />
            Configurar
          </Button>
          
          {/* Outros botões */}
          
          {isSuggestion && (
            <Button
              className="bg-gradient-to-r from-blue-600 to-indigo-600 ml-auto"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Instalar
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          type="text"
          placeholder="Buscar câmeras por nome, quarto ou modelo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-gray-800/80 border-gray-700 pl-10"
        />
        <Camera className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
      </div>

      {cameras.length === 0 ? (
        <div className="empty-state">
          <Camera className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-300 mb-2">
            Nenhuma câmera instalada
          </h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            As câmeras exibidas abaixo são apenas sugestões baseadas na configuração do hospital.
            Adicione uma câmera real para começar a monitorar.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCameras.map(camera => (
            <Card 
              key={camera.id} 
              className="bg-gray-800/50 border-gray-700 hover:border-blue-700/50 transition-all"
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-md font-semibold text-white flex items-center gap-2">
                    <Camera className={`h-5 w-5 ${camera.status === 'active' ? 'text-green-400' : camera.status === 'maintenance' ? 'text-amber-400' : 'text-gray-400'}`} />
                    {camera.name}
                  </CardTitle>
                  <Badge className={`
                    ${camera.status === 'active' ? 'bg-green-500/20 text-green-400' : 
                      camera.status === 'maintenance' ? 'bg-amber-500/20 text-amber-400' : 
                      'bg-gray-500/20 text-gray-400'}
                  `}>
                    {camera.status === 'active' ? 'Ativa' : 
                      camera.status === 'maintenance' ? 'Em Manutenção' : 
                      'Inativa'}
                  </Badge>
                </div>
                <CardDescription className="text-gray-400 flex items-center gap-2">
                  <div>Modelo: {camera.model}</div>
                  <div>•</div>
                  <div>Quarto: {camera.roomId}</div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-700/30 p-3 rounded-lg">
                    <div className="text-xs text-gray-400 mb-1">Temperatura</div>
                    <div className="font-medium text-white flex items-center">
                      <Thermometer className="h-4 w-4 text-red-400 mr-2" />
                      <span>
                        {camera.thermalSettings.temperatureRange.min}°C - {camera.thermalSettings.temperatureRange.max}°C
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Alerta: {camera.thermalSettings.alertThreshold}°C</div>
                  </div>
                  
                  <div className="bg-gray-700/30 p-3 rounded-lg">
                    <div className="text-xs text-gray-400 mb-1">Manutenção</div>
                    <div className="font-medium text-white flex items-center">
                      <Clock className="h-4 w-4 text-blue-400 mr-2" />
                      <span>
                        {new Date(camera.nextMaintenance).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Última: {new Date(camera.lastMaintenance).toLocaleDateString()}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-gray-700 text-white"
                    onClick={() => onSelectCamera(camera)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Configurar
                  </Button>
                  
                  <Button 
                    variant={camera.status === 'active' ? 'destructive' : 'outline'} 
                    size="sm"
                    className={camera.status === 'active' ? '' : 'border-green-700/50 text-green-500'}
                    onClick={() => onUpdateStatus(
                      camera.id, 
                      camera.status === 'active' ? 'inactive' : 'active'
                    )}
                  >
                    {camera.status === 'active' ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-2" />
                        Desativar
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        Ativar
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-amber-700/50 text-amber-500"
                    onClick={() => onUpdateStatus(
                      camera.id, 
                      camera.status === 'maintenance' ? 'active' : 'maintenance'
                    )}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    {camera.status === 'maintenance' ? 'Concluir' : 'Manutenção'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};