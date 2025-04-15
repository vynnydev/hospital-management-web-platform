// services/preferences/userPreferencesService.ts

// Interface para preferências do usuário
interface IUserPreferences {
  // Padrões de visualização
  defaultView: 'welcome' | 'recommendations' | 'alerts';
  showOnStartup: boolean;
  
  // Configurações de comportamento do assistente
  autoMinimizeAfterInactivity: boolean;
  inactivityTimeout: number; // segundos
  
  // Notificações
  soundNotifications: boolean;
  notifyOnNewAlerts: boolean;
  notifyOnNewRecommendations: boolean;
  
  // Outras configurações
  showDetailedStats: boolean;
  aiSuggestions: boolean;

  // Indica se o assistente deve ser maximizado após o login
  maximizeOnLogin: boolean;
}

// Preferências padrão
const DEFAULT_PREFERENCES: IUserPreferences = {
  defaultView: 'welcome',
  showOnStartup: true,
  autoMinimizeAfterInactivity: true,
  inactivityTimeout: 60, // 60 segundos
  soundNotifications: true,
  notifyOnNewAlerts: true,
  notifyOnNewRecommendations: true,
  showDetailedStats: false,
  aiSuggestions: true,
  maximizeOnLogin: true, // Por padrão, sempre maximiza após login
};

class UserPreferencesService {
  private getStorageKey(userId: string, key: string): string {
    return `h24_${userId}_${key}`;
  }
  
  /**
   * Obtém as preferências do usuário
   */
  getUserPreferences(userId: string): IUserPreferences {
    try {
      // Tentar obter as preferências do localStorage
      const storedPrefs = localStorage.getItem(this.getStorageKey(userId, 'preferences'));
      if (storedPrefs) {
        return JSON.parse(storedPrefs);
      }
    } catch (error) {
      console.error('Erro ao obter preferências do usuário:', error);
    }
    
    // Se não encontrar ou ocorrer erro, retorna os valores padrão
    return DEFAULT_PREFERENCES;
  }
  
  /**
   * Salva as preferências do usuário
   */
  saveUserPreferences(userId: string, preferences: Partial<IUserPreferences>): void {
    try {
      // Obter preferências atuais
      const currentPrefs = this.getUserPreferences(userId);
      
      // Mesclar com as novas preferências
      const updatedPrefs = { ...currentPrefs, ...preferences };
      
      // Salvar no localStorage
      localStorage.setItem(
        this.getStorageKey(userId, 'preferences'), 
        JSON.stringify(updatedPrefs)
      );
    } catch (error) {
      console.error('Erro ao salvar preferências do usuário:', error);
    }
  }
  
  /**
   * Verifica se é a primeira visita do usuário
   */
  isFirstVisit(userId: string): boolean {
    try {
      return localStorage.getItem(this.getStorageKey(userId, 'firstVisit')) === null;
    } catch (error) {
      console.error('Erro ao verificar primeira visita:', error);
      return true;
    }
  }

  /**
 * Método específico para verificar se o assistente deve ser maximizado após login
 */
  shouldMaximizeAfterLogin(userId: string): boolean {
    try {
      // Verificar se há uma configuração específica salva
      const preferences = this.getUserPreferences(userId);
      return preferences.maximizeOnLogin;
    } catch (error) {
      console.error('Erro ao verificar preferência de maximização após login:', error);
      return true; // Por padrão, maximiza
    }
  }

  /**
 * Método para registrar que o usuário acabou de fazer login
 * e resetar o estado de minimização para garantir que o assistente apareça maximizado
 */
  registerRecentLogin(userId: string): void {
    try {
      // Sempre definir o estado como não minimizado após login
      localStorage.setItem(
        this.getStorageKey(userId, 'assistantMinimized'), 
        'false'
      );
      
      // Registrar timestamp do login
      localStorage.setItem(
        this.getStorageKey(userId, 'lastLogin'),
        Date.now().toString()
      );
    } catch (error) {
      console.error('Erro ao registrar login recente:', error);
    }
  }

  /**
 * Verifica se o login foi recente (nos últimos 5 segundos)
 */
  isLoginRecent(userId: string): boolean {
    try {
      const lastLoginStr = localStorage.getItem(this.getStorageKey(userId, 'lastLogin'));
      if (!lastLoginStr) return false;
      
      const lastLogin = parseInt(lastLoginStr, 10);
      const now = Date.now();
      const fiveSecondsAgo = now - 5000; // 5 segundos
      
      return lastLogin > fiveSecondsAgo;
    } catch (error) {
      console.error('Erro ao verificar login recente:', error);
      return false;
    }
  }
  
  /**
   * Marca que o usuário já visitou o sistema
   */
  markAsVisited(userId: string): void {
    try {
      localStorage.setItem(this.getStorageKey(userId, 'firstVisit'), 'false');
    } catch (error) {
      console.error('Erro ao marcar como visitado:', error);
    }
  }
  
  /**
 * Sobrescrever o método de obtenção do estado minimizado
 * para considerar o login recente
 */
  getMinimizedState(userId: string): boolean {
    try {
      // Se o login foi recente, sempre retornar false (não minimizado)
      if (this.isLoginRecent(userId)) {
        return false;
      }
      
      // Caso contrário, retornar o estado salvo
      const state = localStorage.getItem(this.getStorageKey(userId, 'assistantMinimized'));
      return state === 'true';
    } catch (error) {
      console.error('Erro ao obter estado de minimização:', error);
      return false;
    }
  }
  
  /**
   * Salva o estado de minimização do assistente
   */
  saveMinimizedState(userId: string, isMinimized: boolean): void {
    try {
      localStorage.setItem(
        this.getStorageKey(userId, 'assistantMinimized'), 
        isMinimized.toString()
      );
    } catch (error) {
      console.error('Erro ao salvar estado de minimização:', error);
    }
  }
  
  /**
   * Verifica se uma recomendação já foi aplicada pelo usuário
   */
  isRecommendationApplied(userId: string, recommendationId: string): boolean {
    try {
      const appliedRecs = localStorage.getItem(this.getStorageKey(userId, 'appliedRecommendations'));
      if (appliedRecs) {
        const appliedList = JSON.parse(appliedRecs) as string[];
        return appliedList.includes(recommendationId);
      }
      return false;
    } catch (error) {
      console.error('Erro ao verificar recomendação aplicada:', error);
      return false;
    }
  }
  
  /**
   * Marca uma recomendação como aplicada pelo usuário
   */
  markRecommendationAsApplied(userId: string, recommendationId: string): void {
    try {
      let appliedRecs = [];
      const stored = localStorage.getItem(this.getStorageKey(userId, 'appliedRecommendations'));
      
      if (stored) {
        appliedRecs = JSON.parse(stored);
      }
      
      if (!appliedRecs.includes(recommendationId)) {
        appliedRecs.push(recommendationId);
        localStorage.setItem(
          this.getStorageKey(userId, 'appliedRecommendations'),
          JSON.stringify(appliedRecs)
        );
      }
    } catch (error) {
      console.error('Erro ao marcar recomendação como aplicada:', error);
    }
  }
  
  /**
   * Reseta todas as preferências do usuário para os valores padrão
   */
  resetUserPreferences(userId: string): void {
    try {
      localStorage.setItem(
        this.getStorageKey(userId, 'preferences'),
        JSON.stringify(DEFAULT_PREFERENCES)
      );
      localStorage.removeItem(this.getStorageKey(userId, 'appliedRecommendations'));
      localStorage.removeItem(this.getStorageKey(userId, 'assistantMinimized'));
    } catch (error) {
      console.error('Erro ao resetar preferências do usuário:', error);
    }
  }
}

// Exporta uma instância única do serviço
export const userPreferencesService = new UserPreferencesService();