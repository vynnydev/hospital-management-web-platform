/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Thermometer, Settings } from 'lucide-react';
import { Button } from '@/components/ui/organisms/button';
import { Switch } from '@/components/ui/organisms/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/organisms/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/organisms/tooltip';
import { Slider } from '@/components/ui/organisms/slider';
import { useThermalCameraData } from '@/hooks/thermal-cameras/useThermalCameraData';

interface ThermalOverlayToggleProps {
  hospitalId: string;
  departmentName: string;
}

export const ThermalOverlayToggle: React.FC<ThermalOverlayToggleProps> = ({
  hospitalId,
  departmentName
}) => {
  const [isActive, setIsActive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [overlayOpacity, setOverlayOpacity] = useState(50);
  const [colorMode, setColorMode] = useState<'rainbow' | 'heat' | 'cool'>('rainbow');
  
  const { cameras, cameraConfig, loading } = useThermalCameraData(hospitalId);
  
  // Filtrar câmeras do departamento atual que estão ativas
  const departmentCameras = cameras.filter(
    camera => camera.status === 'active' && camera.roomId.startsWith(departmentName.charAt(0))
  );
  
  const handleToggle = () => {
    if (departmentCameras.length === 0) {
      // Não ativar se não houver câmeras
      return;
    }
    setIsActive(!isActive);
  };
  
  const handleOpacityChange = (value: number[]) => {
    setOverlayOpacity(value[0]);
  };
  
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={isActive ? 'default' : 'outline'}
              size="sm"
              onClick={handleToggle}
              disabled={departmentCameras.length === 0}
              className={`relative ${isActive ? 'bg-red-600 hover:bg-red-700' : 'border-gray-600 text-gray-300'}`}
            >
              <Thermometer className="h-4 w-4 mr-2" />
              {isActive ? 'Ocultar Visão Térmico' : 'Mostrar Visão Térmico'}
              
              {isActive && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 ml-1 text-white/80 hover:text-white hover:bg-red-700/50"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSettings(true);
                  }}
                >
                  <Settings className="h-3 w-3" />
                </Button>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {departmentCameras.length === 0 
              ? 'Não há câmeras térmicas ativas neste departamento'
              : `${departmentCameras.length} câmeras térmicas disponíveis`}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {/* Diálogo de configurações */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Thermometer className="h-5 w-5 text-red-500" />
              Configurações de Visualização Térmica
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Personalize como os dados térmicos são exibidos na visualização do corredor
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm text-gray-400 block mb-2">
                Opacidade da Sobreposição Térmica
              </label>
              <div className="flex items-center gap-4">
                <Slider 
                  value={[overlayOpacity]} 
                  onValueChange={handleOpacityChange}
                  min={10} 
                  max={100}
                  step={5}
                  className="flex-1"
                />
                <div className="w-10 text-center">
                  {overlayOpacity}%
                </div>
              </div>
            </div>
            
            <div>
              <label className="text-sm text-gray-400 block mb-2">
                Escala de Cores
              </label>
              <div className="grid grid-cols-3 gap-2">
                <div
                  className={`p-3 rounded-lg border cursor-pointer flex items-center justify-center ${
                    colorMode === 'rainbow' 
                      ? 'border-blue-500 bg-blue-500/20' 
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                  onClick={() => setColorMode('rainbow')}
                >
                  <div className="h-4 w-16 bg-gradient-to-r from-blue-600 via-yellow-500 to-red-600 rounded"></div>
                </div>
                <div
                  className={`p-3 rounded-lg border cursor-pointer flex items-center justify-center ${
                    colorMode === 'heat' 
                      ? 'border-blue-500 bg-blue-500/20' 
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                  onClick={() => setColorMode('heat')}
                >
                  <div className="h-4 w-16 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-600 rounded"></div>
                </div>
                <div
                  className={`p-3 rounded-lg border cursor-pointer flex items-center justify-center ${
                    colorMode === 'cool' 
                      ? 'border-blue-500 bg-blue-500/20' 
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                  onClick={() => setColorMode('cool')}
                >
                  <div className="h-4 w-16 bg-gradient-to-r from-blue-600 via-cyan-500 to-green-500 rounded"></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between bg-gray-700/30 p-3 rounded-lg">
              <div>
                <span className="text-white">Mostrar Alertas de Temperatura</span>
                <p className="text-xs text-gray-500 mt-1">
                  Destaca leitos com temperaturas fora da faixa normal
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between bg-gray-700/30 p-3 rounded-lg">
              <div>
                <span className="text-white">Mostrar Leitos Vagos</span>
                <p className="text-xs text-gray-500 mt-1">
                  Exibe sobreposição térmica também em leitos não ocupados
                </p>
              </div>
              <Switch defaultChecked={false} />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSettings(false)}
              className="border-gray-600"
            >
              Cancelar
            </Button>
            <Button
              onClick={() => setShowSettings(false)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600"
            >
              Aplicar Configurações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Se isActive for true, renderizar a sobreposição térmica 
          Na implementação real, isso integraria com o componente CorridorView */}
    </>
  );
};
