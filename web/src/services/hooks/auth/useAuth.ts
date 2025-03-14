import { useState, useEffect } from 'react';
import { authService } from '@/services/auth/AuthService';
import { eventService } from '@/services/events/EventService';
import { userPreferencesService } from '@/services/preferences/userPreferencesService';
import type { IAppUser } from '@/types/auth-types';

export const LOGIN_SUCCESS_EVENT = 'auth:login:success';

export function useAuth() {
  const [user, setUser] = useState<IAppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    setUser(response.user);
    
    // Emitir evento de login bem-sucedido
    if (response.user) {
      // Registrar o login recente no serviço de preferências
      const userId = response.user.id || 'current-user';
      userPreferencesService.registerRecentLogin(userId);
      
      // Emitir o evento
      eventService.emit(LOGIN_SUCCESS_EVENT, response.user);
    }
    
    return response;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return {
    user,
    loading,
    login,
    logout
  };
}