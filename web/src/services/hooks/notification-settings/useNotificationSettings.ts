import api from "@/services/api";
import { INotificationSettings } from "@/types/notification-settings-types";
import { useCallback, useEffect, useState } from "react";

// Hook para gerenciar configurações de notificação
export const useNotificationSettings = () => {
    const [settings, setSettings] = useState<INotificationSettings | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    // Buscar configurações
    const fetchSettings = useCallback(async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await api.get<INotificationSettings>(`notification-settings`);
        setSettings(response.data);
      } catch (err) {
        console.error('Error fetching notification settings:', err);
        setError('Falha ao carregar configurações de notificação.');
      } finally {
        setLoading(false);
      }
    }, []);
    
    // Atualizar configurações
    const updateSettings = useCallback(async (updatedSettings: Partial<INotificationSettings>) => {
      try {
        const response = await api.patch<INotificationSettings>(
          `notification-settings`, 
          updatedSettings
        );
        
        setSettings(response.data);
        return true;
      } catch (err) {
        console.error('Error updating notification settings:', err);
        setError('Falha ao atualizar configurações de notificação.');
        return false;
      }
    }, []);
    
    // Efeito para carregar as configurações inicialmente
    useEffect(() => {
      fetchSettings();
    }, [fetchSettings]);
    
    return {
      settings,
      loading,
      error,
      fetchSettings,
      updateSettings
    };
  };