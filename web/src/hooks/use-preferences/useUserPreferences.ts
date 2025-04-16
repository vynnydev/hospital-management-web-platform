/* eslint-disable @typescript-eslint/no-explicit-any */
import { authService } from "@/services/general/auth/AuthService";
import { useEffect, useState } from "react";

// user-preferences-types.ts
export interface UserPreferences {
    id: string;
    userId: string;
    theme: 'system' | 'light' | 'dark';
    layout: {
      compactSidebar: boolean;
      transparentSidebar: boolean;
      showHeader: boolean;
      tableView: 'default' | 'compact';
    };
    branding: {
      brandColor: string;
      useLogo: boolean;
      customLogoUrl?: string;
    };
    accessibility: {
      highContrast: boolean;
      visualAlerts: boolean;
      closedCaptions: boolean;
      textSize: 'small' | 'medium' | 'large';
    };
    notifications: {
      email: boolean;
      inApp: boolean;
      desktop: boolean;
      mobile: boolean;
      categories: {
        [key: string]: boolean;
      };
    };
  }
  
  // Agora, vamos corrigir o hook useUserPreferences
  export const useUserPreferences = () => {
    const [preferences, setPreferences] = useState<UserPreferences | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const user = authService.getCurrentUser();
  
    // Função para atualizar as preferências (geral)
    const updatePreferences = async (updatedPrefs: Partial<UserPreferences>): Promise<boolean> => {
      try {
        // Em um ambiente real, isso seria uma chamada à API
        // Simulação para desenvolvimento
        if (!preferences) return false;
        
        const newPreferences = {
          ...preferences,
          ...updatedPrefs
        };
        
        // Salvar no localStorage para simular API
        localStorage.setItem(`user_preferences_${user?.id}`, JSON.stringify(newPreferences));
        setPreferences(newPreferences);
        return true;
      } catch (error) {
        console.error('Erro ao atualizar preferências:', error);
        return false;
      }
    };
  
    // Atualizar tema
    const updateTheme = (theme: 'system' | 'light' | 'dark') => {
      return updatePreferences({ theme });
    };
  
    // Atualizar layout
    const updateLayout = (layout: Partial<UserPreferences['layout']>) => {
      if (!preferences) return false;
      
      return updatePreferences({ 
        layout: { 
          ...preferences.layout, 
          ...layout 
        } 
      });
    };
  
    // Atualizar branding
    const updateBranding = (branding: Partial<UserPreferences['branding']>) => {
      if (!preferences) return false;
      
      return updatePreferences({ 
        branding: { 
          ...preferences.branding, 
          ...branding 
        } 
      });
    };
  
    // Atualizar acessibilidade
    const updateAccessibility = (accessibility: Partial<UserPreferences['accessibility']>) => {
      if (!preferences) return false;
      
      return updatePreferences({ 
        accessibility: { 
          ...preferences.accessibility, 
          ...accessibility 
        } 
      });
    };
  
    // Atualizar notificações
    const updateNotifications = (notifications: Partial<UserPreferences['notifications']>) => {
      if (!preferences) return false;
      
      const updatedCategories = notifications.categories 
        ? { ...preferences.notifications.categories, ...notifications.categories }
        : preferences.notifications.categories;
      
      return updatePreferences({ 
        notifications: { 
          ...preferences.notifications, 
          ...(notifications as any), // Usando any para evitar problemas com a tipagem das categorias
          categories: updatedCategories
        } 
      });
    };
  
    // Carregar preferências
    useEffect(() => {
      const fetchPreferences = async () => {
        if (!user) {
          setIsLoading(false);
          return;
        }
        
        setIsLoading(true);
        try {
          // Simulação de chamada à API
          const storedPrefs = localStorage.getItem(`user_preferences_${user.id}`);
          
          if (storedPrefs) {
            setPreferences(JSON.parse(storedPrefs));
          } else {
            // Definir preferências padrão
            const defaultPrefs: UserPreferences = {
              id: 'default',
              userId: user.id,
              theme: 'system',
              layout: {
                compactSidebar: false,
                transparentSidebar: false,
                showHeader: true,
                tableView: 'default'
              },
              branding: {
                brandColor: '#2C68F6',
                useLogo: false,
              },
              accessibility: {
                highContrast: false,
                visualAlerts: true,
                closedCaptions: true,
                textSize: 'medium'
              },
              notifications: {
                email: true,
                inApp: true,
                desktop: false,
                mobile: false,
                categories: {
                  appointments: true,
                  messages: true,
                  results: true,
                  system: true
                }
              }
            };
            
            setPreferences(defaultPrefs);
            localStorage.setItem(`user_preferences_${user.id}`, JSON.stringify(defaultPrefs));
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Erro desconhecido');
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchPreferences();
    }, [user]);
  
    // Aplicar tema quando as preferências forem carregadas
    useEffect(() => {
      if (preferences) {
        // Lógica para aplicar o tema
        if (preferences.theme === 'system') {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          document.documentElement.classList.toggle('dark', prefersDark);
        } else {
          document.documentElement.classList.toggle('dark', preferences.theme === 'dark');
        }
      }
    }, [preferences]);
  
    return {
      preferences,
      isLoading,
      error,
      updatePreferences,
      updateTheme,
      updateLayout,
      updateBranding,
      updateAccessibility,
      updateNotifications
    };
  };