/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth/AuthService';
import { eventService } from '@/services/events/EventService';
import { userPreferencesService } from '@/services/preferences/userPreferencesService';
import type { IAppUser, TRole } from '@/types/auth-types';

export const LOGIN_SUCCESS_EVENT = 'auth:login:success';

export function useAuth() {
  const [user, setUser] = useState<IAppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  /**
   * Função de login com redirecionamento baseado na função do usuário
   */
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
    router.push('/login');
  };

  /**
   * Redireciona o usuário para a página apropriada com base na sua função
   */
  const redirectByRole = () => {
    if (!user) return;

    const redirectPath = authService.getRedirectPathByRole();
    router.push(redirectPath);
  };

  /**
   * Verifica se o usuário tem uma determinada função
   */
  const hasRole = (role: TRole): boolean => {
    return user?.role === role || false;
  };

  /**
   * Verifica se o usuário tem determinada permissão
   */
  const hasPermission = (permission: string): boolean => {
    return authService.hasPermission(permission as any);
  };

  /**
   * Verifica se o usuário atual é um médico
   */
  const isDoctor = (): boolean => {
    return hasRole('médico');
  };

  /**
   * Verifica se o usuário atual é um paciente
   */
  const isPatient = (): boolean => {
    return hasRole('paciente');
  };

  /**
   * Verifica se o usuário atual é um enfermeiro
   */
  const isNurse = (): boolean => {
    return hasRole('enfermeiro');
  };

  /**
   * Verifica se o usuário atual é um administrador
   */
  const isAdministrator = (): boolean => {
    return hasRole('administrador');
  };

  /**
   * Verifica se o usuário tem acesso à telemedicina
   */
  const canAccessTelemedicine = (): boolean => {
    return authService.canAccessTelemedicine();
  };

  return {
    user,
    loading,
    login,
    logout,
    redirectByRole,
    hasRole,
    hasPermission,
    isDoctor,
    isPatient,
    isNurse,
    isAdministrator,
    canAccessTelemedicine
  };
}