import { 
    IThermalAlert, 
    IThermalCamera, 
    IThermalCameraConfiguration, 
    IThermalCameraReading, 
    IThermalMaintenance, 
    ThermalEndpointNames 
} from "@/types/thermal-cameras-types";

  
  /**
   * Serviço para gerenciar a comunicação com a API de câmeras térmicas
   */
class ThermalCameraService {
    private baseUrl: string;
    
    constructor(baseUrl: string = 'http://localhost:3001') {
      this.baseUrl = baseUrl;
    }

    // Método genérico de atualização para reutilização
    private async updateData<T>(endpoint: ThermalEndpointNames, id: string, data: Partial<T>): Promise<T> {
        try {
          const response = await fetch(`${this.baseUrl}/${endpoint}/${id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          });
          
          if (!response.ok) {
            throw new Error(`Erro ao atualizar dados em ${endpoint}: ${response.status}`);
          }
          
          return await response.json() as T;
        } catch (error) {
          console.error(`Erro ao atualizar dados em ${endpoint}:`, error);
          throw error;
        }
    }
    
    /**
     * Método genérico para buscar dados de um endpoint
     */
    private async fetchData<T>(endpoint: ThermalEndpointNames): Promise<T[]> {
      try {
        console.log(`Buscando dados do endpoint: ${endpoint}`);
        const response = await fetch(`${this.baseUrl}/${endpoint}`);
        
        if (!response.ok) {
          throw new Error(`Erro ao buscar dados de ${endpoint}: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`Dados recebidos:`, data);
        
        // Verificar se é um array ou um objeto com a propriedade nomeada
        if (Array.isArray(data)) {
          console.log(`Dados recebidos como array com ${data.length} itens`);
          return data as unknown as T[];
        } 
        else if (data && data[endpoint]) {
          console.log(`Dados recebidos como objeto com propriedade ${endpoint}`);
          return data[endpoint] as T[];
        }
        else {
          console.error(`Formato inválido recebido para ${endpoint}:`, data);
          return [];
        }
      } catch (error) {
        console.error(`Erro ao buscar dados de ${endpoint}:`, error);
        return [];
      }
    }
    
    /**
     * Método genérico para criar dados em um endpoint
     */
    private async createData<T>(endpoint: ThermalEndpointNames, data: T): Promise<T> {
      try {
        const response = await fetch(`${this.baseUrl}/${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
        
        if (!response.ok) {
          throw new Error(`Erro ao criar dados em ${endpoint}: ${response.status}`);
        }
        
        return await response.json() as T;
      } catch (error) {
        console.error(`Erro ao criar dados em ${endpoint}:`, error);
        throw error;
      }
    }
    
    /**
     * Busca todas as câmeras térmicas
     */
    async getAllCameras(): Promise<IThermalCamera[]> {
      return this.fetchData<IThermalCamera>('thermal-cameras');
    }
    
    /**
     * Busca câmeras por hospital
     */
    async getCamerasByHospital(hospitalId: string): Promise<IThermalCamera[]> {
      console.log("Buscando câmeras para hospitalId:", hospitalId);
      const cameras = await this.getAllCameras();
      console.log("Total de câmeras:", cameras.length);
      
      // Debug para verificar IDs
      cameras.forEach(camera => {
        console.log("Camera:", camera.id, "HospitalId:", camera.hospitalId);
      });
      
      const filtered = cameras.filter(camera => camera.hospitalId === hospitalId);
      console.log("Câmeras filtradas:", filtered.length);
      return filtered;
    }
    
    /**
     * Busca câmeras por quarto
     */
    async getCamerasByRoom(hospitalId: string, roomId: string): Promise<IThermalCamera[]> {
      const cameras = await this.getCamerasByHospital(hospitalId);
      return cameras.filter(camera => camera.roomId === roomId);
    }
    
    /**
     * Busca câmera por leito
     */
    async getCameraByBed(bedId: string): Promise<IThermalCamera | null> {
      const cameras = await this.getAllCameras();
      return cameras.find(camera => camera.bedId === bedId) || null;
    }
    
    /**
     * Atualiza configurações de uma câmera
     */
    async updateCameraSettings(cameraId: string, settings: Partial<IThermalCamera>): Promise<IThermalCamera> {
      try {
        const response = await fetch(`${this.baseUrl}/thermal-cameras/${cameraId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(settings)
        });

        if (!response.ok) {
          throw new Error(`Error updating camera settings: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        console.error('Error updating camera settings:', error);
        throw error;
      }
    }
    
    /**
     * Altera o status de uma câmera
     */
    async updateCameraStatus(cameraId: string, status: 'active' | 'inactive' | 'maintenance'): Promise<IThermalCamera> {
      try {
        const response = await fetch(`${this.baseUrl}/thermal-cameras/${cameraId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status })
        });

        if (!response.ok) {
          throw new Error(`Error updating camera status: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        console.error('Error updating camera status:', error);
        throw error;
      }
    }
    
    /**
     * Busca todas as leituras
     */
    async getAllReadings(): Promise<IThermalCameraReading[]> {
      return this.fetchData<IThermalCameraReading>('thermal-readings');
    }
    
    /**
     * Busca leituras por câmera
     */
    async getReadingsByCamera(cameraId: string, limit: number = 10): Promise<IThermalCameraReading[]> {
      const readings = await this.getAllReadings();
      return readings
        .filter(reading => reading.cameraId === cameraId)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit);
    }
    
    /**
     * Busca leituras por leito
     */
    async getReadingsByBed(bedId: string, limit: number = 10): Promise<IThermalCameraReading[]> {
      const readings = await this.getAllReadings();
      return readings
        .filter(reading => reading.bedId === bedId)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit);
    }
    
    /**
     * Busca a leitura mais recente de uma câmera
     */
    async getLatestReading(cameraId: string): Promise<IThermalCameraReading | null> {
      const readings = await this.getReadingsByCamera(cameraId, 1);
      return readings.length > 0 ? readings[0] : null;
    }
    
    /**
     * Cria uma nova leitura
     */
    async createReading(reading: IThermalCameraReading): Promise<IThermalCameraReading> {
      return this.createData<IThermalCameraReading>('thermal-readings', reading);
    }
    
    /**
     * Busca todas as configurações
     */
    async getAllConfigs(): Promise<IThermalCameraConfiguration[]> {
      return this.fetchData<IThermalCameraConfiguration>('thermal-configs');
    }
    
    /**
     * Busca configuração por hospital
     */
    async getConfigByHospital(hospitalId: string): Promise<IThermalCameraConfiguration | null> {
      const configs = await this.getAllConfigs();
      return configs.find(config => config.hospitalId === hospitalId) || null;
    }
    
    /**
     * Atualiza configuração de um hospital
     */
    async updateConfig(configId: string, config: Partial<IThermalCameraConfiguration>): Promise<IThermalCameraConfiguration> {
        return this.updateData<IThermalCameraConfiguration>('thermal-configs', configId, config);
    }
    
    /**
     * Busca todos os alertas
     */
    async getAllAlerts(): Promise<IThermalAlert[]> {
      return this.fetchData<IThermalAlert>('thermal-alerts');
    }
    
    /**
     * Busca alertas por hospital
     */
    async getAlertsByHospital(hospitalId: string, status?: 'open' | 'resolved'): Promise<IThermalAlert[]> {
      const alerts = await this.getAllAlerts();
      
      let filtered = alerts.filter(alert => alert.hospitalId === hospitalId);
      
      if (status) {
        filtered = filtered.filter(alert => alert.status === status);
      }
      
      return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
    
    /**
     * Busca alertas por leito
     */
    async getAlertsByBed(bedId: string): Promise<IThermalAlert[]> {
      const alerts = await this.getAllAlerts();
      return alerts
        .filter(alert => alert.bedId === bedId)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
    
    /**
     * Reconhece um alerta
     */
    async acknowledgeAlert(alertId: string, userId: string): Promise<IThermalAlert> {
        const now = new Date().toISOString();
        return this.updateData<IThermalAlert>('thermal-alerts', alertId, {
          acknowledgedBy: userId,
          acknowledgedAt: now
        });
    }
    
    /**
     * Resolve um alerta
     */
    async resolveAlert(alertId: string, userId: string, notes: string): Promise<IThermalAlert> {
        const now = new Date().toISOString();
        return this.updateData<IThermalAlert>('thermal-alerts', alertId, {
          status: 'resolved',
          resolution: {
            timestamp: now,
            resolvedBy: userId,
            notes
          }
        });
    }
    
    /**
     * Cria um novo alerta
     */
    async createAlert(alert: IThermalAlert): Promise<IThermalAlert> {
      return this.createData<IThermalAlert>('thermal-alerts', alert);
    }
    
    /**
     * Busca todos os registros de manutenção
     */
    async getAllMaintenance(): Promise<IThermalMaintenance[]> {
      return this.fetchData<IThermalMaintenance>('thermal-maintenance');
    }
    
    /**
     * Busca manutenções por hospital
     */
    async getMaintenanceByHospital(hospitalId: string): Promise<IThermalMaintenance[]> {
      const maintenance = await this.getAllMaintenance();
      return maintenance
        .filter(item => item.hospitalId === hospitalId)
        .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    }
    
    /**
     * Busca manutenções por câmera
     */
    async getMaintenanceByCamera(cameraId: string): Promise<IThermalMaintenance[]> {
      const maintenance = await this.getAllMaintenance();
      return maintenance
        .filter(item => item.cameraId === cameraId)
        .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    }
    
    /**
     * Agenda uma nova manutenção
     */
    async scheduleMaintenance(maintenance: IThermalMaintenance): Promise<IThermalMaintenance> {
      return this.createData<IThermalMaintenance>('thermal-maintenance', maintenance);
    }
    
    /**
     * Atualiza um registro de manutenção
     */
    async updateMaintenance(maintenanceId: string, data: Partial<IThermalMaintenance>): Promise<IThermalMaintenance> {
        return this.updateData<IThermalMaintenance>('thermal-maintenance', maintenanceId, data);
    }
    
    /**
     * Conclui uma manutenção
     */
    async completeMaintenance(maintenanceId: string, details: {
        issues: Array<{ category: string; description: string; resolution: string }>;
        notes: string;
        parts: Array<{ name: string; quantity: number; cost: number }>;
        totalCost: number;
        nextScheduledDate?: string;
      }): Promise<IThermalMaintenance> {
        const now = new Date().toISOString();
        return this.updateData<IThermalMaintenance>('thermal-maintenance', maintenanceId, {
          ...details,
          status: 'completed',
          endDate: now
        });
    }
}
  
  // Exporta uma instância do serviço para uso em toda a aplicação
export const thermalCameraService = new ThermalCameraService();
  