import React from 'react';
import { 
  Camera, 
  Thermometer, 
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
  cameras
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  // Separar câmeras reais das sugeridas
  const realCameras = cameras.filter(camera => camera.status === 'active' || camera.status === 'inactive' || camera.status === 'maintenance');
  const suggestedCameras: IThermalCamera[] = []; // Não há câmeras sugeridas no tipo

  // Filtrar conforme a busca
  const filteredRealCameras = realCameras.filter(camera =>
    camera.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    camera.roomId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    camera.model.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredSuggestedCameras = suggestedCameras.filter(camera => 
    camera.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    camera.roomId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    camera.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Campo de busca */}
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
  
      {/* Mensagem quando não há câmeras reais */}
      {realCameras.length === 0 && (
        <div className="bg-gray-800/30 p-8 text-center rounded-lg mt-6 mb-8">
          <Camera className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-300 mb-2">
            Nenhuma câmera instalada
          </h3>
          <p className="text-gray-500 max-w-md mx-auto mb-2">
            As câmeras exibidas abaixo são apenas sugestões baseadas na configuração do hospital.
          </p>
          <p className="text-gray-500 max-w-md mx-auto">
            Adicione uma câmera real para começar a monitorar.
          </p>
        </div>
      )}
  
      {/* Lista de câmeras reais */}
      {filteredRealCameras.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRealCameras.map(camera => (
            <Card 
              key={camera.id} 
              className="bg-gray-800/50 border-gray-700 hover:border-blue-700/50 transition-all"
            >
              {/* O conteúdo existente do seu card de câmera real */}
            </Card>
          ))}
        </div>
      )}
  
      {/* Seção de câmeras sugeridas */}
      {filteredSuggestedCameras.length > 0 && (
        <>
          <h4 className="text-lg font-medium text-gray-300 mt-8 mb-4 flex items-center">
            <Plus className="h-5 w-5 text-blue-400 mr-2" />
            Sugestões de câmeras para instalação
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSuggestedCameras.map(camera => (
              <Card 
                key={camera.id} 
                className="bg-gray-800/50 border-blue-700/30 hover:border-blue-600/50 transition-all"
              >
                {/* Conteúdo semelhante ao card normal, mas com algumas diferenças */}
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-md font-semibold text-white flex items-center gap-2">
                      <Camera className="h-5 w-5 text-blue-400" />
                      {camera.name}
                    </CardTitle>
                    <Badge className="bg-blue-500/20 text-blue-400">
                      Sugestão
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
                    
                    {/* Informações de manutenção omitidas para sugestões ou mostradas de forma diferente */}
                  </div>
                  
                  {/* Botão especial para instalar a câmera sugerida */}
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Instalar Câmera
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};