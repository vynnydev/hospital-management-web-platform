import React from 'react';
import { 
  Lock, 
  ShieldAlert, 
  Eye,
  FileText
} from 'lucide-react';
import { Input } from '@/components/ui/organisms/input';
import { Switch } from '@/components/ui/organisms/switch';
import { Button } from '@/components/ui/organisms/button';
import { Slider } from '@/components/ui/organisms/slider';
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

interface PrivacySettingsTabProps {
  cameraConfig: IThermalCameraConfiguration | null;
  onSave: () => Promise<void>;
  onShowDetails: () => void;
}

export const PrivacySettingsTab: React.FC<PrivacySettingsTabProps> = ({ 
  cameraConfig, 
  onSave,
  onShowDetails
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
      <Alert className="bg-blue-900/20 border-blue-700/50 text-blue-400">
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>Conformidade com LGPD</AlertTitle>
        <AlertDescription className="flex flex-col space-y-2">
          <p>
            As configurações de privacidade das câmeras devem estar em conformidade com a Lei Geral de Proteção de Dados.
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-fit border-blue-700/50 text-blue-400 hover:bg-blue-900/30"
            onClick={onShowDetails}
          >
            <FileText className="h-4 w-4 mr-2" />
            Ver Detalhes da LGPD
          </Button>
        </AlertDescription>
      </Alert>
      
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <Lock className="h-5 w-5 text-purple-400" />
            Configurações de Privacidade
          </CardTitle>
          <CardDescription className="text-gray-400">
            Configure as políticas de privacidade para todas as câmeras
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 block mb-2">
              Retenção de Dados (dias)
            </label>
            <div className="flex items-center gap-4">
              <Slider 
                defaultValue={[cameraConfig.defaultSettings.privacyDefaults.dataRetentionDays]} 
                min={1} 
                max={90}
                step={1}
                className="flex-1"
              />
              <Input 
                type="number" 
                value={cameraConfig.defaultSettings.privacyDefaults.dataRetentionDays} 
                className="w-20 bg-gray-700 border-gray-600"
                min={1}
                max={90}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Períodos mais longos podem violar a LGPD. Recomendamos 30 dias ou menos.
            </p>
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
                checked={cameraConfig.defaultSettings.privacyDefaults.maskingEnabled} 
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
                checked={cameraConfig.defaultSettings.privacyDefaults.recordingEnabled} 
              />
            </div>
          </div>
          
          <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-700/30">
            <h4 className="text-white flex items-center gap-2 mb-2">
              <Eye className="h-4 w-4 text-purple-400" />
              Funções com Acesso Autorizado
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="role-admin" className="rounded bg-gray-700 border-gray-600 text-purple-500" checked />
                <label htmlFor="role-admin" className="text-gray-300">Administradores</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="role-doctor" className="rounded bg-gray-700 border-gray-600 text-purple-500" checked />
                <label htmlFor="role-doctor" className="text-gray-300">Médicos</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="role-nurse" className="rounded bg-gray-700 border-gray-600 text-purple-500" checked />
                <label htmlFor="role-nurse" className="text-gray-300">Enfermeiros Chefe</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="role-tech" className="rounded bg-gray-700 border-gray-600 text-purple-500" />
                <label htmlFor="role-tech" className="text-gray-300">Equipe Técnica</label>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t border-gray-700 pt-4">
          <Button 
            onClick={onSave}
            className="ml-auto bg-gradient-to-r from-purple-600 to-indigo-600"
          >
            Salvar Configurações de Privacidade
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};