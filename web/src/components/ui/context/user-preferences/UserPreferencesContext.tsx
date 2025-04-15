import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { authService } from '@/services/general/auth/AuthService';
import { UserPreferences } from '@/types/user-preferences-types';

interface UserPreferencesContextProps {
  preferences: UserPreferences | null;
  isLoading: boolean;
  error: string | null;
  updateTheme: (theme: 'system' | 'light' | 'dark') => Promise<boolean>;
  updateLayout: (layout: Partial<UserPreferences['layout']>) => Promise<boolean>;
  updateBranding: (branding: Partial<UserPreferences['branding']>) => Promise<boolean>;
  updateAccessibility: (accessibility: Partial<UserPreferences['accessibility']>) => Promise<boolean>;
  updateNotifications: (notifications: Partial<UserPreferences['notifications']>) => Promise<boolean>;
  applyTheme: () => void;
}

const defaultPreferences: UserPreferences = {
  id: 'default',
  userId: '',
  theme: 'system',
  layout: {
    compactSidebar: false,
    transparentSidebar: false,
    showHeader: true,
    tableView: 'default'
  },
  branding: {
    brandColor: '#2C68F6',
    useLogo: false
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

const UserPreferencesContext = createContext<UserPreferencesContextProps>({
  preferences: defaultPreferences,
  isLoading: true,
  error: null,
  updateTheme: async () => false,
  updateLayout: async () => false,
  updateBranding: async () => false,
  updateAccessibility: async () => false,
  updateNotifications: async () => false,
  applyTheme: () => {}
});

export const useUserPreferences = () => useContext(UserPreferencesContext);

interface UserPreferencesProviderProps {
  children: ReactNode;
}

export const UserPreferencesProvider: React.FC<UserPreferencesProviderProps> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = authService.getCurrentUser();

  useEffect(() => {
    const fetchPreferences = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        // Em um ambiente real, isso seria uma chamada à API
        // Simulação para desenvolvimento
        const storedPrefs = localStorage.getItem(`user_preferences_${user.id}`);
        
        if (storedPrefs) {
          setPreferences(JSON.parse(storedPrefs));
        } else {
          // Definir preferências padrão se não existirem
          const defaultUserPrefs = {
            ...defaultPreferences,
            userId: user.id
          };
          setPreferences(defaultUserPrefs);
          
          // Salvar no localStorage para simular API
          localStorage.setItem(`user_preferences_${user.id}`, JSON.stringify(defaultUserPrefs));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        
        // Definir preferências padrão se houver erro
        const defaultUserPrefs = {
          ...defaultPreferences,
          userId: user?.id || 'unknown'
        };
        setPreferences(defaultUserPrefs);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreferences();
    
    // Limpar ao desmontar
    return () => {
      setPreferences(null);
      setIsLoading(true);
      setError(null);
    };
  }, [user]);

  // Salva as preferências atualizadas
  const savePreferences = async (updatedPrefs: UserPreferences) => {
    if (!user) return false;
    
    try {
      // Em um ambiente real, isso seria uma chamada à API
      // Simulação para desenvolvimento
      localStorage.setItem(`user_preferences_${user.id}`, JSON.stringify(updatedPrefs));
      setPreferences(updatedPrefs);
      return true;
    } catch (error) {
      console.error('Erro ao salvar preferências:', error);
      return false;
    }
  };

  // Métodos para atualizar diferentes partes das preferências
  const updateTheme = async (theme: 'system' | 'light' | 'dark') => {
    if (!preferences) return false;
    
    const updatedPrefs = {
      ...preferences,
      theme
    };
    
    const success = await savePreferences(updatedPrefs);
    if (success) {
      applyTheme();
    }
    return success;
  };

  const updateLayout = async (layout: Partial<UserPreferences['layout']>) => {
    if (!preferences) return false;
    
    const updatedPrefs = {
      ...preferences,
      layout: { ...preferences.layout, ...layout }
    };
    
    return await savePreferences(updatedPrefs);
  };

  const updateBranding = async (branding: Partial<UserPreferences['branding']>) => {
    if (!preferences) return false;
    
    const updatedPrefs = {
      ...preferences,
      branding: { ...preferences.branding, ...branding }
    };
    
    return await savePreferences(updatedPrefs);
  };

  const updateAccessibility = async (accessibility: Partial<UserPreferences['accessibility']>) => {
    if (!preferences) return false;
    
    const updatedPrefs = {
      ...preferences,
      accessibility: { ...preferences.accessibility, ...accessibility }
    };
    
    return await savePreferences(updatedPrefs);
  };

  const updateNotifications = async (notifications: Partial<UserPreferences['notifications']>) => {
    if (!preferences) return false;
    
    const updatedPrefs = {
      ...preferences,
      notifications: { 
        ...preferences.notifications, 
        ...notifications,
        categories: {
          ...preferences.notifications.categories,
          ...(notifications.categories || {})
        }
      }
    };
    
    return await savePreferences(updatedPrefs);
  };

  // Aplicar o tema com base nas preferências
  const applyTheme = () => {
    if (!preferences) return;
    
    if (preferences.theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', prefersDark);
    } else {
      document.documentElement.classList.toggle('dark', preferences.theme === 'dark');
    }
    
    // Aplicar outras configurações de acessibilidade
    if (preferences.accessibility.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    
    document.documentElement.classList.remove('text-sm', 'text-base', 'text-lg');
    if (preferences.accessibility.textSize === 'small') {
      document.documentElement.classList.add('text-sm');
    } else if (preferences.accessibility.textSize === 'large') {
      document.documentElement.classList.add('text-lg');
    } else {
      document.documentElement.classList.add('text-base');
    }
    
    // Aplicar cor principal
    if (preferences.branding.brandColor) {
      document.documentElement.style.setProperty('--color-primary', preferences.branding.brandColor);
    }
  };

  // Aplicar o tema quando as preferências forem carregadas
  useEffect(() => {
    if (preferences) {
      applyTheme();
    }
  }, [preferences]);

  const value = {
    preferences,
    isLoading,
    error,
    updateTheme,
    updateLayout,
    updateBranding,
    updateAccessibility,
    updateNotifications,
    applyTheme
  };

  return (
    <UserPreferencesContext.Provider value={value}>
      {children}
    </UserPreferencesContext.Provider>
  );
};