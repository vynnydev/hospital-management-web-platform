/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/hooks/thermal-cameras/useThermalCameraData.ts
import { useState, useEffect, useCallback } from 'react';
import { IThermalAlert, IThermalCamera, IThermalCameraConfiguration, IThermalCameraReading, IThermalMaintenance } from '@/types/thermal-cameras-types';
import { thermalCameraService } from '@/services/general/thermal-camera/thermalCameraService';

interface UseThermalCameraDataReturn {
  cameras: IThermalCamera[];
  cameraReadings: Record<string, IThermalCameraReading[]>;
  cameraConfig: IThermalCameraConfiguration | null;
  cameraAlerts: IThermalAlert[];
  cameraMaintenance: IThermalMaintenance[];
  loading: boolean;
  error: string | null;
  fetchCamerasByHospital: (hospitalId: string) => Promise<void>;
  fetchCamerasByRoom: (hospitalId: string, roomId: string) => Promise<void>;
  fetchCameraReadings: (cameraId: string, limit?: number) => Promise<void>;
  fetchCameraAlerts: (hospitalId: string, status?: 'open' | 'resolved' | 'all') => Promise<void>;
  fetchCameraMaintenance: (hospitalId: string, cameraId?: string) => Promise<void>;
  updateCameraSettings: (cameraId: string, settings: Partial<IThermalCamera>) => Promise<void>;
  updateCameraConfig: (hospitalId: string, config: Partial<IThermalCameraConfiguration>) => Promise<void>;
  toggleCameraStatus: (cameraId: string, status: 'active' | 'inactive' | 'maintenance') => Promise<void>;
  acknowledgeAlert: (alertId: string, userId: string) => Promise<void>;
  resolveAlert: (alertId: string, userId: string, notes: string) => Promise<void>;
  scheduleMaintenance: (cameraId: string, hospitalId: string, date: string, type: string) => Promise<void>;
  completeMaintenance: (maintenanceId: string, details: Partial<IThermalMaintenance>) => Promise<void>;
  getCameraForBed: (bedId: string) => IThermalCamera | null;
  getLatestReading: (cameraId: string) => IThermalCameraReading | null;
  getCamerasNeedingMaintenance: () => IThermalCamera[];
  getOpenAlerts: () => IThermalAlert[];
  getAlertsByBed: (bedId: string) => IThermalAlert[];
  getMaintenanceHistory: (cameraId: string) => IThermalMaintenance[];
}

interface UseThermalCameraDataReturn {
  cameras: IThermalCamera[];
  cameraReadings: Record<string, IThermalCameraReading[]>;
  cameraConfig: IThermalCameraConfiguration | null;
  cameraAlerts: IThermalAlert[];
  cameraMaintenance: IThermalMaintenance[];
  loading: boolean;
  error: string | null;
  fetchCamerasByHospital: (hospitalId: string) => Promise<void>;
  fetchCamerasByRoom: (hospitalId: string, roomId: string) => Promise<void>;
  fetchCameraReadings: (cameraId: string, limit?: number) => Promise<void>;
  fetchCameraAlerts: (hospitalId: string, status?: 'open' | 'resolved' | 'all') => Promise<void>;
  fetchCameraMaintenance: (hospitalId: string, cameraId?: string) => Promise<void>;
  updateCameraSettings: (cameraId: string, settings: Partial<IThermalCamera>) => Promise<void>;
  updateCameraConfig: (hospitalId: string, config: Partial<IThermalCameraConfiguration>) => Promise<void>;
  toggleCameraStatus: (cameraId: string, status: 'active' | 'inactive' | 'maintenance') => Promise<void>;
  acknowledgeAlert: (alertId: string, userId: string) => Promise<void>;
  resolveAlert: (alertId: string, userId: string, notes: string) => Promise<void>;
  scheduleMaintenance: (cameraId: string, hospitalId: string, date: string, type: string) => Promise<void>;
  completeMaintenance: (maintenanceId: string, details: Partial<IThermalMaintenance>) => Promise<void>;
  getCameraForBed: (bedId: string) => IThermalCamera | null;
  getLatestReading: (cameraId: string) => IThermalCameraReading | null;
  getCamerasNeedingMaintenance: () => IThermalCamera[];
  getOpenAlerts: () => IThermalAlert[];
  getAlertsByBed: (bedId: string) => IThermalAlert[];
  getMaintenanceHistory: (cameraId: string) => IThermalMaintenance[];
}

export const useThermalCameraData = (initialHospitalId?: string): UseThermalCameraDataReturn => {
  const [cameras, setCameras] = useState<IThermalCamera[]>([]);
  const [cameraReadings, setCameraReadings] = useState<Record<string, IThermalCameraReading[]>>({});
  const [cameraConfig, setCameraConfig] = useState<IThermalCameraConfiguration | null>(null);
  const [cameraAlerts, setCameraAlerts] = useState<IThermalAlert[]>([]);
  const [cameraMaintenance, setCameraMaintenance] = useState<IThermalMaintenance[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Busca todas as câmeras de um hospital específico
   */
  const fetchCamerasByHospital = useCallback(async (hospitalId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const cameraData = await thermalCameraService.getCamerasByHospital(hospitalId);
      setCameras(cameraData);
      
      // Buscar também a configuração global do hospital
      const configData = await thermalCameraService.getConfigByHospital(hospitalId);
      setCameraConfig(configData);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao buscar câmeras térmicas:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Busca as câmeras específicas de um quarto
   */
  const fetchCamerasByRoom = useCallback(async (hospitalId: string, roomId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const cameraData = await thermalCameraService.getCamerasByRoom(hospitalId, roomId);
      setCameras(cameraData);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao buscar câmeras térmicas do quarto:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Busca as leituras de uma câmera específica
   */
  const fetchCameraReadings = useCallback(async (cameraId: string, limit: number = 10) => {
    setLoading(true);
    setError(null);
    
    try {
      const readingsData = await thermalCameraService.getReadingsByCamera(cameraId, limit);
      
      setCameraReadings(prev => ({
        ...prev,
        [cameraId]: readingsData
      }));
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao buscar leituras da câmera térmica:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Busca os alertas gerados pelas câmeras térmicas
   */
  const fetchCameraAlerts = useCallback(async (
    hospitalId: string, 
    status: 'open' | 'resolved' | 'all' = 'all'
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      let alertsData: IThermalAlert[];
      
      if (status === 'all') {
        alertsData = await thermalCameraService.getAlertsByHospital(hospitalId);
      } else {
        alertsData = await thermalCameraService.getAlertsByHospital(hospitalId, status);
      }
      
      setCameraAlerts(alertsData);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao buscar alertas das câmeras térmicas:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Busca o histórico de manutenção das câmeras
   */
  const fetchCameraMaintenance = useCallback(async (hospitalId: string, cameraId?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      let maintenanceData: IThermalMaintenance[];
      
      if (cameraId) {
        maintenanceData = await thermalCameraService.getMaintenanceByCamera(cameraId);
      } else {
        maintenanceData = await thermalCameraService.getMaintenanceByHospital(hospitalId);
      }
      
      setCameraMaintenance(maintenanceData);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao buscar histórico de manutenção das câmeras:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Atualiza as configurações de uma câmera específica
   */
  const updateCameraSettings = useCallback(async (cameraId: string, settings: Partial<IThermalCamera>) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedCamera = await thermalCameraService.updateCameraSettings(cameraId, settings);
      
      // Atualiza a câmera no state
      setCameras(prev => 
        prev.map(camera => 
          camera.id === cameraId ? updatedCamera : camera
        )
      );
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao atualizar configurações da câmera:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Atualiza a configuração global das câmeras de um hospital
   */
  const updateCameraConfig = useCallback(async (
    hospitalId: string, 
    config: Partial<IThermalCameraConfiguration>
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      if (!cameraConfig) {
        throw new Error('Configuração não encontrada');
      }
      
      const updatedConfig = await thermalCameraService.updateConfig(
        cameraConfig.id, 
        config
      );
      
      setCameraConfig(updatedConfig);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao atualizar configuração global das câmeras:', err);
    } finally {
      setLoading(false);
    }
  }, [cameraConfig]);

  /**
   * Altera o status de uma câmera (ativar/desativar/manutenção)
   */
  const toggleCameraStatus = useCallback(async (
    cameraId: string, 
    status: 'active' | 'inactive' | 'maintenance'
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedCamera = await thermalCameraService.updateCameraStatus(cameraId, status);
      
      // Atualiza a câmera no state
      setCameras(prev => 
        prev.map(camera => 
          camera.id === cameraId ? updatedCamera : camera
        )
      );
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao atualizar status da câmera:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Registra o reconhecimento de um alerta
   */
  const acknowledgeAlert = useCallback(async (alertId: string, userId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedAlert = await thermalCameraService.acknowledgeAlert(alertId, userId);
      
      // Atualiza o alerta no state
      setCameraAlerts(prev => 
        prev.map(alert => 
          alert.id === alertId ? updatedAlert : alert
        )
      );
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao reconhecer alerta:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Registra a resolução de um alerta
   */
  const resolveAlert = useCallback(async (alertId: string, userId: string, notes: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedAlert = await thermalCameraService.resolveAlert(alertId, userId, notes);
      
      // Atualiza o alerta no state
      setCameraAlerts(prev => 
        prev.map(alert => 
          alert.id === alertId ? updatedAlert : alert
        )
      );
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao resolver alerta:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Agenda uma nova manutenção para uma câmera
   */
  const scheduleMaintenance = useCallback(async (
    cameraId: string, 
    hospitalId: string, 
    date: string, 
    type: string
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const camera = cameras.find(c => c.id === cameraId);
      if (!camera) {
        throw new Error('Câmera não encontrada');
      }
      
      const newMaintenance: Partial<IThermalMaintenance> = {
        cameraId,
        hospitalId,
        technician: 'user-tech-001', // Simulação - em produção seria o usuário atual
        type: type as any,
        status: 'scheduled',
        startDate: date,
        issues: [],
        notes: "Manutenção agendada",
        parts: [],
        totalCost: 0
      };
      
      const createdMaintenance = await thermalCameraService.scheduleMaintenance(newMaintenance as IThermalMaintenance);
      
      setCameraMaintenance(prev => [createdMaintenance, ...prev]);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao agendar manutenção:', err);
    } finally {
      setLoading(false);
    }
  }, [cameras]);

  /**
   * Marca uma manutenção como concluída
   */
  const completeMaintenance = useCallback(async (
    maintenanceId: string, 
    details: Partial<IThermalMaintenance>
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const maintenanceItem = cameraMaintenance.find(m => m.id === maintenanceId);
      if (!maintenanceItem) {
        throw new Error('Manutenção não encontrada');
      }
      
      const updatedDetails = {
        issues: details.issues || [],
        notes: details.notes || '',
        parts: details.parts || [],
        totalCost: details.totalCost || 0,
        nextScheduledDate: details.nextScheduledDate
      };
      
      const updatedMaintenance = await thermalCameraService.completeMaintenance(
        maintenanceId, 
        {
          ...updatedDetails,
          issues: updatedDetails.issues.map(issue => ({
            ...issue,
            resolution: issue.resolution || '' // Convert null to empty string
          })),
          nextScheduledDate: updatedDetails.nextScheduledDate || undefined
        }
      );
      
      setCameraMaintenance(prev => 
        prev.map(maintenance =>
          maintenance.id === maintenanceId ? updatedMaintenance : maintenance
        )
      );
      
      // Se a manutenção foi para uma câmera em estado de manutenção, atualizar o status
      const camera = cameras.find(c => c.id === maintenanceItem.cameraId);
      if (camera && camera.status === 'maintenance') {
        await toggleCameraStatus(camera.id, 'active');
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao concluir manutenção:', err);
    } finally {
      setLoading(false);
    }
  }, [cameraMaintenance, cameras, toggleCameraStatus]);

  /**
   * Obtém a câmera associada a um leito específico
   */
  const getCameraForBed = useCallback((bedId: string) => {
    return cameras.find(camera => camera.bedId === bedId) || null;
  }, [cameras]);

  /**
   * Obtém a leitura mais recente de uma câmera
   */
  const getLatestReading = useCallback((cameraId: string) => {
    if (!cameraReadings[cameraId] || cameraReadings[cameraId].length === 0) {
      return null;
    }
    
    return cameraReadings[cameraId][0];
  }, [cameraReadings]);

  /**
   * Obtém todas as câmeras que precisam de manutenção
   */
  const getCamerasNeedingMaintenance = useCallback(() => {
    const today = new Date();
    
    return cameras.filter(camera => {
      // Câmeras já em manutenção
      if (camera.status === 'maintenance') {
        return true;
      }
      
      // Câmeras com manutenção vencida
      const nextMaintenance = new Date(camera.nextMaintenance);
      return nextMaintenance <= today;
    });
  }, [cameras]);

  /**
   * Obtém todos os alertas abertos
   */
  const getOpenAlerts = useCallback(() => {
    return cameraAlerts.filter(alert => alert.status === 'open');
  }, [cameraAlerts]);

  /**
   * Obtém alertas específicos para um leito
   */
  const getAlertsByBed = useCallback((bedId: string) => {
    return cameraAlerts.filter(alert => alert.bedId === bedId);
  }, [cameraAlerts]);

  /**
   * Obtém o histórico de manutenção para uma câmera específica
   */
  const getMaintenanceHistory = useCallback((cameraId: string) => {
    return cameraMaintenance.filter(maintenance => maintenance.cameraId === cameraId);
  }, [cameraMaintenance]);

  // Carrega as câmeras iniciais ao montar o componente
  useEffect(() => {
    if (initialHospitalId) {
      fetchCamerasByHospital(initialHospitalId);
    }
  }, [initialHospitalId, fetchCamerasByHospital]);

  return {
    cameras,
    cameraReadings,
    cameraConfig,
    cameraAlerts,
    cameraMaintenance,
    loading,
    error,
    fetchCamerasByHospital,
    fetchCamerasByRoom,
    fetchCameraReadings,
    fetchCameraAlerts,
    fetchCameraMaintenance,
    updateCameraSettings,
    updateCameraConfig,
    toggleCameraStatus,
    acknowledgeAlert,
    resolveAlert,
    scheduleMaintenance,
    completeMaintenance,
    getCameraForBed,
    getLatestReading,
    getCamerasNeedingMaintenance,
    getOpenAlerts,
    getAlertsByBed,
    getMaintenanceHistory
  };
};