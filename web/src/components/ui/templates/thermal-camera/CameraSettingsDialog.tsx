'use client';

import React, { useState } from 'react';
import { 
  Clock, 
  Settings,
  ShieldAlert
} from 'lucide-react';
import { Input } from '@/components/ui/organisms/input';
import { Switch } from '@/components/ui/organisms/switch';
import { Button } from '@/components/ui/organisms/button';
import { Slider } from '@/components/ui/organisms/slider';
import { IThermalCamera } from '@/types/thermal-cameras-types';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../organisms/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../organisms/tabs';


interface ICameraSettingsDialogProps {
    camera: IThermalCamera | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (settings: Partial<IThermalCamera>) => Promise<void>;
  }
  
export const CameraSettingsDialog: React.FC<ICameraSettingsDialogProps> = ({
    camera,
    open,
    onOpenChange,
    onSave
}) => {
    const [activeTab, setActiveTab] = useState('thermal');
    const [settings, setSettings] = useState<Partial<IThermalCamera>>({});
    const [isSaving, setIsSaving] = useState(false);
  
    React.useEffect(() => {
      if (camera) {
        setSettings({});
      }
    }, [camera]);
  
    const handleSubmit = async () => {
      if (!camera) return;
      
      setIsSaving(true);
      try {
        await onSave(settings);
        onOpenChange(false);
      } catch (error) {
        console.error('Erro ao salvar configurações:', error);
      } finally {
        setIsSaving(false);
      }
    };
  
    if (!camera) return null;
  
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-blue-400" />
              Configurar {camera.name}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Ajuste as configurações específicas desta câmera térmica
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="thermal">Configurações Térmicas</TabsTrigger>
              <TabsTrigger value="privacy">Privacidade</TabsTrigger>
              <TabsTrigger value="maintenance">Manutenção</TabsTrigger>
            </TabsList>
            
            <TabsContent value="thermal" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 block mb-2">Faixa de Temperatura (°C)</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Mínima</label>
                      <Input 
                        type="number" 
                        defaultValue={camera.thermalSettings.temperatureRange.min} 
                        className="bg-gray-700 border-gray-600"
                        min={30}
                        max={40}
                        step={0.1}
                        onChange={(e) => setSettings({
                          ...settings,
                          thermalSettings: {
                            ...camera.thermalSettings,
                            temperatureRange: {
                              ...camera.thermalSettings.temperatureRange,
                              min: parseFloat(e.target.value)
                            }
                          }
                        })}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Máxima</label>
                      <Input 
                        type="number" 
                        defaultValue={camera.thermalSettings.temperatureRange.max} 
                        className="bg-gray-700 border-gray-600"
                        min={35}
                        max={45}
                        step={0.1}
                        onChange={(e) => setSettings({
                          ...settings,
                          thermalSettings: {
                            ...camera.thermalSettings,
                            temperatureRange: {
                              ...camera.thermalSettings.temperatureRange,
                              max: parseFloat(e.target.value)
                            }
                          }
                        })}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-gray-400 block mb-2">
                    Limiar de Alerta (°C)
                  </label>
                  <div className="flex items-center gap-4">
                    <Slider 
                      defaultValue={[camera.thermalSettings.alertThreshold]} 
                      min={35} 
                      max={42}
                      step={0.1}
                      className="flex-1"
                      onValueChange={(value) => setSettings({
                        ...settings,
                        thermalSettings: {
                          ...camera.thermalSettings,
                          alertThreshold: value[0]
                        }
                      })}
                    />
                    <Input 
                      type="number" 
                      defaultValue={camera.thermalSettings.alertThreshold} 
                      className="w-20 bg-gray-700 border-gray-600"
                      min={35}
                      max={42}
                      step={0.1}
                      onChange={(e) => setSettings({
                        ...settings,
                        thermalSettings: {
                          ...camera.thermalSettings,
                          alertThreshold: parseFloat(e.target.value)
                        }
                      })}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-gray-400 block mb-2">
                    Intervalo de Captura (segundos)
                  </label>
                  <div className="flex items-center gap-4">
                    <Slider 
                      defaultValue={[camera.thermalSettings.captureInterval]} 
                      min={10} 
                      max={300}
                      step={10}
                      className="flex-1"
                      onValueChange={(value) => setSettings({
                        ...settings,
                        thermalSettings: {
                          ...camera.thermalSettings,
                          captureInterval: value[0]
                        }
                      })}
                    />
                    <Input 
                      type="number" 
                      defaultValue={camera.thermalSettings.captureInterval} 
                      className="w-20 bg-gray-700 border-gray-600"
                      min={10}
                      max={300}
                      step={10}
                      onChange={(e) => setSettings({
                        ...settings,
                        thermalSettings: {
                          ...camera.thermalSettings,
                          captureInterval: parseInt(e.target.value)
                        }
                      })}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-gray-400 block mb-2">
                    Sensibilidade (1-10)
                  </label>
                  <div className="flex items-center gap-4">
                    <Slider 
                      defaultValue={[camera.thermalSettings.sensitivity]} 
                      min={1} 
                      max={10}
                      step={1}
                      className="flex-1"
                      onValueChange={(value) => setSettings({
                        ...settings,
                        thermalSettings: {
                          ...camera.thermalSettings,
                          sensitivity: value[0]
                        }
                      })}
                    />
                    <Input 
                      type="number" 
                      defaultValue={camera.thermalSettings.sensitivity} 
                      className="w-20 bg-gray-700 border-gray-600"
                      min={1}
                      max={10}
                      step={1}
                      onChange={(e) => setSettings({
                        ...settings,
                        thermalSettings: {
                          ...camera.thermalSettings,
                          sensitivity: parseInt(e.target.value)
                        }
                      })}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Sensibilidade mais alta detecta menores variações de temperatura, mas pode gerar mais falsos positivos
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="privacy" className="space-y-4">
              <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-700/30 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldAlert className="h-4 w-4 text-purple-400" />
                  <h4 className="text-white font-medium">Conformidade com LGPD</h4>
                </div>
                <p className="text-sm text-gray-400">
                  Estas configurações afetam diretamente a conformidade do sistema com a Lei Geral de Proteção de Dados.
                </p>
              </div>
              
              <div>
                <label className="text-sm text-gray-400 block mb-2">
                  Retenção de Dados (dias)
                </label>
                <div className="flex items-center gap-4">
                  <Slider 
                    defaultValue={[camera.privacySettings.dataRetentionDays]} 
                    min={1} 
                    max={90}
                    step={1}
                    className="flex-1"
                    onValueChange={(value) => setSettings({
                      ...settings,
                      privacySettings: {
                        ...camera.privacySettings,
                        dataRetentionDays: value[0]
                      }
                    })}
                  />
                  <Input 
                    type="number" 
                    defaultValue={camera.privacySettings.dataRetentionDays} 
                    className="w-20 bg-gray-700 border-gray-600"
                    min={1}
                    max={90}
                    onChange={(e) => setSettings({
                      ...settings,
                      privacySettings: {
                        ...camera.privacySettings,
                        dataRetentionDays: parseInt(e.target.value)
                      }
                    })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between bg-gray-700/30 p-3 rounded-lg">
                  <div>
                    <span className="text-white">Mascaramento de Imagem</span>
                    <p className="text-xs text-gray-500 mt-1">
                      Detecta apenas dados térmicos, sem identificação visual
                    </p>
                  </div>
                  <Switch 
                    checked={
                      settings.privacySettings?.maskingEnabled !== undefined 
                        ? settings.privacySettings.maskingEnabled 
                        : camera.privacySettings.maskingEnabled
                    } 
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      privacySettings: {
                        ...camera.privacySettings,
                        maskingEnabled: checked
                      }
                    })}
                  />
                </div>
                <div className="flex items-center justify-between bg-gray-700/30 p-3 rounded-lg">
                  <div>
                    <span className="text-white">Gravação Habilitada</span>
                    <p className="text-xs text-gray-500 mt-1">
                      Armazena dados para revisão posterior
                    </p>
                  </div>
                  <Switch 
                    checked={
                      settings.privacySettings?.recordingEnabled !== undefined 
                        ? settings.privacySettings.recordingEnabled 
                        : camera.privacySettings.recordingEnabled
                    } 
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      privacySettings: {
                        ...camera.privacySettings,
                        recordingEnabled: checked
                      }
                    })}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="maintenance" className="space-y-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Última Manutenção</label>
                    <Input
                      type="date"
                      defaultValue={camera.lastMaintenance}
                      className="bg-gray-700 border-gray-600"
                      onChange={(e) => setSettings({
                        ...settings,
                        lastMaintenance: e.target.value
                      })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Próxima Manutenção</label>
                    <Input
                      type="date"
                      defaultValue={camera.nextMaintenance}
                      className="bg-gray-700 border-gray-600"
                      onChange={(e) => setSettings({
                        ...settings,
                        nextMaintenance: e.target.value
                      })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Endereço IP</label>
                  <Input
                    defaultValue={camera.ipAddress}
                    className="bg-gray-700 border-gray-600"
                    onChange={(e) => setSettings({
                      ...settings,
                      ipAddress: e.target.value
                    })}
                  />
                </div>
                
                <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-700/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-blue-400" />
                    <h4 className="text-white font-medium">Calendário de Manutenção</h4>
                  </div>
                  <p className="text-sm text-gray-400">
                    Recomendamos realizar manutenção preventiva a cada 6 meses para garantir o funcionamento adequado da câmera e a precisão das leituras térmicas.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
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
              disabled={isSaving || Object.keys(settings).length === 0}
            >
              {isSaving ? 'Salvando...' : 'Salvar Configurações'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
};