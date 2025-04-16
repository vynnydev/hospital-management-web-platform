/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Thermometer, 
  Camera, 
  RefreshCw,
  Plus,
  AlertCircle,
  Building2
} from 'lucide-react';
import { Button } from '@/components/ui/organisms/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/organisms/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/organisms/tabs';
import { useThermalCameraData } from '@/hooks/thermal-cameras/useThermalCameraData';
import { useNetworkData } from '@/hooks/network-hospital/useNetworkData';

import { GDPRCompliance } from './GDPRCompliance';
import type { IThermalCamera } from '@/types/thermal-cameras-types';
import { GeneralCameraSettingsTab } from './GeneralCameraSettingsTab';
import { PrivacySettingsTab } from './PrivacySettingsTab';
import { CamerasListTab } from './CamerasListTab';
import { AddCameraDialog } from './Dialogs';
import { CameraSettingsDialog } from './CameraSettingsDialog';
import { PrivacyDetailsDialog } from './PrivacyDetailsDialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../organisms/select';

interface ThermalCameraContentProps {
  hospitalId?: string;
}

export const ThermalCameraContent: React.FC<ThermalCameraContentProps> = ({ 
  hospitalId 
}) => {
  const [selectedTab, setSelectedTab] = useState('general');
  const [isAddingCamera, setIsAddingCamera] = useState(false);
  const [showPrivacyDetails, setShowPrivacyDetails] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState<IThermalCamera | null>(null);
  const [selectedHospitalId, setSelectedHospitalId] = useState(hospitalId || '');
  const [suggestedCameras, setSuggestedCameras] = useState<IThermalCamera[]>([]);

    // Estado e hooks existentes
    const [allCameras, setAllCameras] = useState<IThermalCamera[]>([]);
  
  const { 
    cameras, 
    cameraConfig, 
    loading: camerasLoading, 
    error: camerasError,
    fetchCamerasByHospital,
    updateCameraSettings,
    updateCameraConfig,
    toggleCameraStatus,
    getCamerasNeedingMaintenance
  } = useThermalCameraData();
  
  const { networkData, loading: networkLoading, error: networkError } = useNetworkData();

  console.log("ThermalCameraContent renderizado. HospitalId:", hospitalId);
  
  const loading = camerasLoading || networkLoading;
  const error = camerasError || networkError;
  
  // Primeiro, garantir que temos dados de hospitais antes de selecionar um
  useEffect(() => {
    if (!selectedHospitalId && networkData?.hospitals && networkData.hospitals.length > 0) {
      setSelectedHospitalId(networkData.hospitals[0].id);
    }
  }, [networkData, selectedHospitalId]);
  
  // Depois, carregar câmeras quando o hospital estiver selecionado
  useEffect(() => {
    if (selectedHospitalId) {
      fetchCamerasByHospital(selectedHospitalId);
    }
  }, [selectedHospitalId, fetchCamerasByHospital]);

  // Verificação se não há câmeras mas deveria haver
  useEffect(() => {
    if (cameras.length === 0 && hospitalId === "RD4H-SP-ITAIM") {
      console.log("Hospital selecionado deveria ter câmeras. Verificando problema...");
      
      // Mostrar informações de debug
      console.log("Estado atual:", {
        hospitalId,
        cameras,
        loading,
        error
      });
      
      // Tentar novamente a busca
      fetchCamerasByHospital(hospitalId);
    }
  }, [cameras, hospitalId, fetchCamerasByHospital, loading, error]);

  const hospital = networkData?.hospitals.find(h => h.id === hospitalId);
  
  // Garantir que não tentamos acessar métodos antes que os dados estejam prontos
  const camerasMaintenance = !cameras ? [] : getCamerasNeedingMaintenance();
  
  const handleHospitalChange = (hospitalId: string) => {
    setSelectedHospitalId(hospitalId);
  };
  
  const handleUpdateCameraStatus = async (cameraId: string, status: 'active' | 'inactive' | 'maintenance') => {
    await toggleCameraStatus(cameraId, status);
  };
  
  const handleSaveGeneralSettings = async () => {
    if (!cameraConfig || !selectedHospitalId) return;
    
    await updateCameraConfig(selectedHospitalId, {
      defaultSettings: {
        ...cameraConfig.defaultSettings
      },
      alertNotifications: {
        ...cameraConfig.alertNotifications
      }
    });
  };
  
  const handleSavePrivacySettings = async () => {
    if (!cameraConfig || !selectedHospitalId) return;
    
    await updateCameraConfig(selectedHospitalId, {
      defaultSettings: {
        ...cameraConfig.defaultSettings,
        privacyDefaults: {
          ...cameraConfig.defaultSettings.privacyDefaults
        }
      }
    });
  };
  
  const handleAddCamera = () => {
    setIsAddingCamera(false);
    if (selectedHospitalId) {
      fetchCamerasByHospital(selectedHospitalId);
    }
  };

  // Função para gerar sugestões de câmeras
  const generateCameraSuggestions = useCallback(() => {
    if (!hospital) return [];
    
    // Pegar todos os quartos do hospital
    const allRooms = hospital.departments.flatMap(dept => dept.rooms);
    
    // Quartos que já têm câmeras (para não sugerir duplicados)
    const roomsWithCameras = new Set(cameras.map(cam => cam.roomId));
    
    // Filtrar quartos sem câmeras
    const roomsWithoutCameras = allRooms.filter(room => !roomsWithCameras.has(room.roomNumber));
    
    // Gerar sugestões (limite para 4 sugestões)
    return roomsWithoutCameras.slice(0, 4).map((room, index) => ({
      id: `suggestion-${room.roomNumber}-${index}`,
      roomId: room.roomNumber,
      bedId: room.beds?.[0]?.id, // Primeiro leito do quarto se existir
      hospitalId,
      name: `Câmera Térmica ${room.roomNumber}`,
      model: "ESP32-CAM-MLX90640",
      status: "suggestion" as any, // Status especial para sugestões
      resolution: "32x24",
      ipAddress: "",
      lastMaintenance: new Date().toISOString(),
      nextMaintenance: new Date().toISOString(),
      thermalSettings: {
        temperatureRange: { min: 30, max: 45 },
        alertThreshold: 38.0,
        captureInterval: 60,
        sensitivity: 8
      },
      privacySettings: {
        dataRetentionDays: 30,
        maskingEnabled: true,
        gdprCompliant: true,
        recordingEnabled: false,
        authorizedAccessRoles: ["admin", "medico", "enfermeiro_chefe"]
      }
    }));
  }, [hospital, cameras, hospitalId]);

  // Efeito para combinar câmeras reais e sugeridas
  useEffect(() => {
    if (cameras.length === 0) {
      // Se não há câmeras reais, gerar sugestões
      const suggestions = generateCameraSuggestions();
      setAllCameras(suggestions as IThermalCamera[]); // Type assertion to match state type
    } else {
      // Se há câmeras reais, manter apenas elas
      setAllCameras(cameras);
    }
  }, [cameras, generateCameraSuggestions]);

  // Gerar sugestões quando o hospital muda ou quando não há câmeras
  useEffect(() => {
    if (hospital && cameras.length === 0) {
      const allRooms = hospital.departments.flatMap(dept => dept.rooms);
      const suggestions = generateCameraSuggestions();
      setSuggestedCameras(suggestions as IThermalCamera[]); // Type assertion to match state type
    }
  }, [hospital, cameras.length, hospitalId, generateCameraSuggestions]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin mr-2">
          <RefreshCw className="h-6 w-6 text-blue-500" />
        </div>
        <p>Carregando configurações das câmeras...</p>
      </div>
    );
  }

  console.log('cameras:', cameras);

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro ao carregar câmeras</AlertTitle>
        <AlertDescription>
          {error}. Por favor, tente novamente mais tarde.
        </AlertDescription>
      </Alert>
    );
  }
  
  // Verificação adicional para garantir que networkData existe
  if (!networkData || !networkData.hospitals) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro ao carregar dados da rede</AlertTitle>
        <AlertDescription>
          Não foi possível carregar a lista de hospitais. Por favor, tente novamente mais tarde.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-100 flex items-center gap-2">
          <Thermometer className="h-6 w-6 text-blue-400" />
          Câmeras Térmicas
        </h2>
        <Button 
          onClick={() => setIsAddingCamera(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600"
          disabled={!selectedHospitalId}
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Câmera
        </Button>
      </div>

      {/* Seletor de Hospital */}
      <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
        <div className="space-y-2">
          <label className="text-sm text-gray-400 font-medium">Selecione um Hospital</label>
          <Select 
            value={selectedHospitalId} 
            onValueChange={handleHospitalChange}
          >
            <SelectTrigger className="w-full bg-gray-700 border-gray-600 focus:ring-blue-500">
              <SelectValue placeholder="Selecione um hospital" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {networkData.hospitals.map(hospital => (
                <SelectItem 
                  key={hospital.id} 
                  value={hospital.id}
                  className="hover:bg-gray-700"
                >
                  <div className="flex items-center">
                    <Building2 className="mr-2 h-4 w-4 text-blue-400" />
                    <span>{hospital.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {!selectedHospitalId ? (
        <Alert className="bg-amber-500/20 border-amber-500/30">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <AlertTitle>Hospital não selecionado</AlertTitle>
          <AlertDescription>
            Selecione um hospital para configurar as câmeras térmicas.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <GDPRCompliance />

          {camerasMaintenance.length > 0 && (
            <Alert className="bg-amber-900/20 border-amber-700/50 text-amber-400">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Manutenção Necessária</AlertTitle>
              <AlertDescription>
                {camerasMaintenance.length} {camerasMaintenance.length === 1 ? 'câmera precisa' : 'câmeras precisam'} de manutenção.
              </AlertDescription>
            </Alert>
          )}

          {!cameras || cameras.length === 0 ? (
            <div className="bg-gray-800/30 p-8 text-center rounded-lg mt-8">
              <Camera className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-300 mb-2">
                Nenhuma câmera térmica configurada
              </h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                Adicione câmeras térmicas para monitorar automaticamente a temperatura e ocupação dos leitos.
              </p>
              <Button 
                onClick={() => setIsAddingCamera(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeira Câmera
              </Button>
            </div>
          ) : (
            <Tabs 
              value={selectedTab} 
              onValueChange={setSelectedTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="general">Geral</TabsTrigger>
                <TabsTrigger value="privacy">Privacidade e LGPD</TabsTrigger>
                <TabsTrigger value="cameras">Câmeras Instaladas</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general">
                <GeneralCameraSettingsTab 
                  cameraConfig={cameraConfig}
                  onSave={handleSaveGeneralSettings}
                />
              </TabsContent>
              
              <TabsContent value="privacy">
                <PrivacySettingsTab 
                  cameraConfig={cameraConfig}
                  onSave={handleSavePrivacySettings}
                  onShowDetails={() => setShowPrivacyDetails(true)}
                />
              </TabsContent>
              
              <TabsContent value="cameras">
                <CamerasListTab 
                  cameras={allCameras} // Usar allCameras em vez de apenas câmeras
                  onSelectCamera={setSelectedCamera}
                  onUpdateStatus={handleUpdateCameraStatus}
                />
              </TabsContent>
            </Tabs>
          )}
        </>
      )}

      {/* Diálogos */}
      {hospital && (
        <AddCameraDialog 
          open={isAddingCamera} 
          onOpenChange={setIsAddingCamera}
          onSave={handleAddCamera}
          hospitalId={selectedHospitalId}
          hospital={hospital}
        />
      )}
      
      {selectedCamera && (
        <CameraSettingsDialog 
          camera={selectedCamera}
          open={!!selectedCamera} 
          onOpenChange={(open) => !open && setSelectedCamera(null)}
          onSave={(settings) => updateCameraSettings(selectedCamera.id, settings)}
        />
      )}
      
      <PrivacyDetailsDialog 
        open={showPrivacyDetails} 
        onOpenChange={setShowPrivacyDetails}
      />
    </div>
  );
};