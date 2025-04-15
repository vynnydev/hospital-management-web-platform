import React from 'react';
import { 
  Thermometer, 
  Bell, 
} from 'lucide-react';
import { Input } from '@/components/ui/organisms/input';
import { Switch } from '@/components/ui/organisms/switch';
import { Button } from '@/components/ui/organisms/button';
import { Slider } from '@/components/ui/organisms/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/organisms/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/organisms/card';
import {
  Alert,
  AlertDescription,
  AlertTitle
} from '@/components/ui/organisms/alert';
import type { IThermalCameraConfiguration } from '@/types/thermal-cameras-types';

interface IGeneralCameraSettingsTabProps {
  cameraConfig: IThermalCameraConfiguration | null;
  onSave: () => Promise<void>;
}

export const GeneralCameraSettingsTab: React.FC<IGeneralCameraSettingsTabProps> = ({ 
  cameraConfig, 
  onSave 
}) => {
  if (!cameraConfig) {
    return (
      <Alert>
        <AlertTitle>Configuração não encontrada</AlertTitle>
        <AlertDescription>
          Não foi possível carregar as configurações para este hospital.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-blue-400" />
            Configurações de Temperatura
          </CardTitle>
          <CardDescription className="text-gray-400">
            Configure os limites de temperatura e alertas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 block mb-2">Limites de Temperatura (°C)</label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Temperatura Normal</label>
                  <Input 
                    type="number" 
                    value={cameraConfig.defaultSettings.temperatureThresholds.normal} 
                    className="bg-gray-700 border-gray-600"
                    min={35}
                    max={38}
                    step={0.1}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Temperatura Elevada</label>
                  <Input 
                    type="number" 
                    value={cameraConfig.defaultSettings.temperatureThresholds.elevated} 
                    className="bg-gray-700 border-gray-600"
                    min={36}
                    max={39}
                    step={0.1}
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Temperatura Baixa</label>
                <Input 
                  type="number" 
                  value={cameraConfig.defaultSettings.temperatureThresholds.low} 
                  className="bg-gray-700 border-gray-600"
                  min={30}
                  max={36}
                  step={0.1}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Temperatura de Febre</label>
                <Input 
                  type="number" 
                  value={cameraConfig.defaultSettings.temperatureThresholds.fever} 
                  className="bg-gray-700 border-gray-600"
                  min={37}
                  max={43}
                  step={0.1}
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm text-gray-400 block mb-2">
                Intervalo de Captura (segundos)
              </label>
              <div className="flex items-center gap-4">
                <Slider 
                  defaultValue={[cameraConfig.defaultSettings.captureInterval]} 
                  min={10} 
                  max={300}
                  step={10}
                  className="flex-1"
                />
                <Input 
                  type="number" 
                  value={cameraConfig.defaultSettings.captureInterval} 
                  className="w-20 bg-gray-700 border-gray-600"
                  min={10}
                  max={300}
                  step={10}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-400" />
            Configurações de Alertas
          </CardTitle>
          <CardDescription className="text-gray-400">
            Configure como os alertas serão enviados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-400 block mb-2">Canais de Notificação</label>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between bg-gray-700/30 p-3 rounded-lg">
                <span className="text-white">Email</span>
                <Switch 
                  checked={cameraConfig.alertNotifications.enabledChannels.email} 
                />
              </div>
              <div className="flex items-center justify-between bg-gray-700/30 p-3 rounded-lg">
                <span className="text-white">SMS</span>
                <Switch 
                  checked={cameraConfig.alertNotifications.enabledChannels.sms} 
                />
              </div>
              <div className="flex items-center justify-between bg-gray-700/30 p-3 rounded-lg">
                <span className="text-white">Notificação no App</span>
                <Switch 
                  checked={cameraConfig.alertNotifications.enabledChannels.appNotification} 
                />
              </div>
              <div className="flex items-center justify-between bg-gray-700/30 p-3 rounded-lg">
                <span className="text-white">Alerta no Sistema</span>
                <Switch 
                  checked={cameraConfig.alertNotifications.enabledChannels.systemAlert} 
                />
              </div>
            </div>
          </div>
          
          <div>
            <label className="text-sm text-gray-400 block mb-2">
              Tempo para Escalação (minutos)
            </label>
            <div className="flex items-center gap-4">
              <Slider 
                defaultValue={[cameraConfig.alertNotifications.escalationTime]} 
                min={5} 
                max={60}
                step={5}
                className="flex-1"
              />
              <Input 
                type="number" 
                value={cameraConfig.alertNotifications.escalationTime} 
                className="w-20 bg-gray-700 border-gray-600"
                min={5}
                max={60}
                step={5}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Tempo antes que o alerta seja escalado para o próximo nível de urgência
            </p>
          </div>
          
          <div>
            <label className="text-sm text-gray-400 block mb-2">
              Destinatários de Alertas
            </label>
            <Select>
              <SelectTrigger className="bg-gray-700 border-gray-600">
                <SelectValue placeholder="Selecione os destinatários" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all-staff">Toda a equipe</SelectItem>
                <SelectItem value="doctors">Apenas médicos</SelectItem>
                <SelectItem value="nurses">Apenas enfermeiros</SelectItem>
                <SelectItem value="admins">Apenas administradores</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="border-t border-gray-700 pt-4">
          <Button 
            onClick={onSave}
            className="ml-auto bg-gradient-to-r from-blue-600 to-indigo-600"
          >
            Salvar Configurações
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};