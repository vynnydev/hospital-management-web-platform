/**
 * Serviço para gerenciar preferências do usuário relacionadas ao Assistente H24
 * Armazena as preferências no localStorage para persistência entre sessões
 */

const STORAGE_PREFIX = 'h24_assistant_';

// Keys para armazenamento
const KEYS = {
  FIRST_VISIT: `${STORAGE_PREFIX}first_visit`,
  DISMISSED_ALERTS: `${STORAGE_PREFIX}dismissed_alerts`,
  APPLIED_RECOMMENDATIONS: `${STORAGE_PREFIX}applied_recommendations`,
  MINIMIZED_STATE: `${STORAGE_PREFIX}minimized_state`,
  USER_PREFERENCES: `${STORAGE_PREFIX}user_preferences`,
};

interface AssistantPreferences {
  showOnStartup: boolean;
  defaultView: 'welcome' | 'recommendations' | 'alerts';
  notificationsEnabled: boolean;
  autoMinimizeAfterInactivity: boolean;
  inactivityTimeout: number; // em segundos
}

// Preferências padrão
const DEFAULT_PREFERENCES: AssistantPreferences = {
  showOnStartup: true,
  defaultView: 'welcome',
  notificationsEnabled: true,
  autoMinimizeAfterInactivity: true,
  inactivityTimeout: 300, // 5 minutos
};

/**
 * Verifica se é a primeira vez que o usuário vê o assistente
 * @param userId ID do usuário
 * @returns boolean indicando se é a primeira visita
 */
export const isFirstVisit = (userId: string): boolean => {
  if (typeof window === 'undefined') return false; // SSR check
  
  const visitedUsers = localStorage.getItem(KEYS.FIRST_VISIT);
  
  if (!visitedUsers) {
    // Se não houver registro, é a primeira visita
    markAsVisited(userId);
    return true;
  }
  
  try {
    const users = JSON.parse(visitedUsers) as string[];
    if (!users.includes(userId)) {
      // Se o usuário não estiver na lista, é a primeira visita dele
      markAsVisited(userId);
      return true;
    }
  } catch (error) {
    console.error('Erro ao verificar primeira visita:', error);
    // Em caso de erro, marca como visitado e retorna false
    markAsVisited(userId);
    return false;
  }
  
  return false;
};

/**
 * Marca um usuário como tendo visitado o assistente
 * @param userId ID do usuário
 */
export const markAsVisited = (userId: string): void => {
  if (typeof window === 'undefined') return; // SSR check
  
  try {
    const visitedUsers = localStorage.getItem(KEYS.FIRST_VISIT);
    const users = visitedUsers ? JSON.parse(visitedUsers) as string[] : [];
    
    if (!users.includes(userId)) {
      users.push(userId);
      localStorage.setItem(KEYS.FIRST_VISIT, JSON.stringify(users));
    }
  } catch (error) {
    console.error('Erro ao marcar usuário como visitado:', error);
  }
};

/**
 * Salva o ID de um alerta descartado para não mostrá-lo novamente
 * @param userId ID do usuário
 * @param alertId ID do alerta
 */
export const dismissAlert = (userId: string, alertId: string): void => {
  if (typeof window === 'undefined') return; // SSR check
  
  try {
    const key = `${KEYS.DISMISSED_ALERTS}_${userId}`;
    const dismissedAlerts = localStorage.getItem(key);
    const alerts = dismissedAlerts ? JSON.parse(dismissedAlerts) as string[] : [];
    
    if (!alerts.includes(alertId)) {
      alerts.push(alertId);
      localStorage.setItem(key, JSON.stringify(alerts));
    }
  } catch (error) {
    console.error('Erro ao salvar alerta descartado:', error);
  }
};

/**
 * Verifica se um alerta foi descartado pelo usuário
 * @param userId ID do usuário
 * @param alertId ID do alerta
 * @returns boolean indicando se o alerta foi descartado
 */
export const isAlertDismissed = (userId: string, alertId: string): boolean => {
  if (typeof window === 'undefined') return false; // SSR check
  
  try {
    const key = `${KEYS.DISMISSED_ALERTS}_${userId}`;
    const dismissedAlerts = localStorage.getItem(key);
    
    if (!dismissedAlerts) return false;
    
    const alerts = JSON.parse(dismissedAlerts) as string[];
    return alerts.includes(alertId);
  } catch (error) {
    console.error('Erro ao verificar alerta descartado:', error);
    return false;
  }
};

/**
 * Marca uma recomendação como aplicada pelo usuário
 * @param userId ID do usuário
 * @param recommendationId ID da recomendação
 */
export const markRecommendationAsApplied = (userId: string, recommendationId: string): void => {
  if (typeof window === 'undefined') return; // SSR check
  
  try {
    const key = `${KEYS.APPLIED_RECOMMENDATIONS}_${userId}`;
    const appliedRecs = localStorage.getItem(key);
    const recommendations = appliedRecs ? JSON.parse(appliedRecs) as string[] : [];
    
    if (!recommendations.includes(recommendationId)) {
      recommendations.push(recommendationId);
      localStorage.setItem(key, JSON.stringify(recommendations));
    }
  } catch (error) {
    console.error('Erro ao marcar recomendação como aplicada:', error);
  }
};

/**
 * Verifica se uma recomendação foi aplicada pelo usuário
 * @param userId ID do usuário
 * @param recommendationId ID da recomendação
 * @returns boolean indicando se a recomendação foi aplicada
 */
export const isRecommendationApplied = (userId: string, recommendationId: string): boolean => {
  if (typeof window === 'undefined') return false; // SSR check
  
  try {
    const key = `${KEYS.APPLIED_RECOMMENDATIONS}_${userId}`;
    const appliedRecs = localStorage.getItem(key);
    
    if (!appliedRecs) return false;
    
    const recommendations = JSON.parse(appliedRecs) as string[];
    return recommendations.includes(recommendationId);
  } catch (error) {
    console.error('Erro ao verificar recomendação aplicada:', error);
    return false;
  }
};

/**
 * Salva o estado de minimização do assistente
 * @param userId ID do usuário
 * @param isMinimized Estado de minimização
 */
export const saveMinimizedState = (userId: string, isMinimized: boolean): void => {
  if (typeof window === 'undefined') return; // SSR check
  
  try {
    localStorage.setItem(`${KEYS.MINIMIZED_STATE}_${userId}`, JSON.stringify(isMinimized));
  } catch (error) {
    console.error('Erro ao salvar estado de minimização:', error);
  }
};

/**
 * Obtém o estado de minimização salvo do assistente
 * @param userId ID do usuário
 * @returns Estado de minimização, por padrão false
 */
export const getMinimizedState = (userId: string): boolean => {
  if (typeof window === 'undefined') return false; // SSR check
  
  try {
    const state = localStorage.getItem(`${KEYS.MINIMIZED_STATE}_${userId}`);
    return state ? JSON.parse(state) : false;
  } catch (error) {
    console.error('Erro ao obter estado de minimização:', error);
    return false;
  }
};

/**
 * Salva as preferências do usuário para o assistente
 * @param userId ID do usuário
 * @param preferences Preferências do usuário
 */
export const saveUserPreferences = (userId: string, preferences: Partial<AssistantPreferences>): void => {
  if (typeof window === 'undefined') return; // SSR check
  
  try {
    const currentPrefs = getUserPreferences(userId);
    const updatedPrefs = { ...currentPrefs, ...preferences };
    
    localStorage.setItem(`${KEYS.USER_PREFERENCES}_${userId}`, JSON.stringify(updatedPrefs));
  } catch (error) {
    console.error('Erro ao salvar preferências do usuário:', error);
  }
};

/**
 * Obtém as preferências do usuário para o assistente
 * @param userId ID do usuário
 * @returns Preferências do usuário, com valores padrão se não existirem
 */
export const getUserPreferences = (userId: string): AssistantPreferences => {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES; // SSR check
  
  try {
    const prefs = localStorage.getItem(`${KEYS.USER_PREFERENCES}_${userId}`);
    return prefs ? { ...DEFAULT_PREFERENCES, ...JSON.parse(prefs) } : DEFAULT_PREFERENCES;
  } catch (error) {
    console.error('Erro ao obter preferências do usuário:', error);
    return DEFAULT_PREFERENCES;
  }
};

/**
 * Reseta todas as preferências e estados do assistente para um usuário
 * @param userId ID do usuário
 */
export const resetAssistantPreferences = (userId: string): void => {
  if (typeof window === 'undefined') return; // SSR check
  
  try {
    localStorage.removeItem(`${KEYS.DISMISSED_ALERTS}_${userId}`);
    localStorage.removeItem(`${KEYS.APPLIED_RECOMMENDATIONS}_${userId}`);
    localStorage.removeItem(`${KEYS.MINIMIZED_STATE}_${userId}`);
    localStorage.removeItem(`${KEYS.USER_PREFERENCES}_${userId}`);
    
    // Não remove do FIRST_VISIT para manter o histórico de quem já viu o assistente
  } catch (error) {
    console.error('Erro ao resetar preferências do assistente:', error);
  }
};

export const userPreferencesService = {
  isFirstVisit,
  markAsVisited,
  dismissAlert,
  isAlertDismissed,
  markRecommendationAsApplied,
  isRecommendationApplied,
  saveMinimizedState,
  getMinimizedState,
  saveUserPreferences,
  getUserPreferences,
  resetAssistantPreferences,
};