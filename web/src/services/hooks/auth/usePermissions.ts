import { useState, useEffect, useCallback } from 'react';
import { Permission } from '@/types/auth-types';
import { authService } from '@/services/auth/AuthService';

export function usePermissions() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPermissions = () => {
      const userPermissions = authService.getUserPermissions();
      setPermissions(userPermissions);
      setLoading(false);
    };

    loadPermissions();

    // Listener para mudanças de autenticação
    window.addEventListener('storage', (e) => {
      if (e.key === 'auth_user') {
        loadPermissions();
      }
    });

    return () => {
      window.removeEventListener('storage', loadPermissions);
    };
  }, []);

  const checkPermission = useCallback((
    permission: Permission,
    hospitalId?: string
  ) => authService.checkPermission(permission, hospitalId), []);

  const canAccessHospital = useCallback(
    (hospitalId: string) => authService.canAccessHospital(hospitalId),
    []
  );

  const hasAnyPermission = useCallback(
    (requiredPermissions: Permission[]) => 
      requiredPermissions.some(permission => permissions.includes(permission)),
    [permissions]
  );

  return {
    permissions,
    loading,
    checkPermission,
    canAccessHospital,
    hasAnyPermission,
    isAdmin: permissions.includes('VIEW_ALL_HOSPITALS'),
    isHospitalManager: permissions.includes('VIEW_SINGLE_HOSPITAL')
  };
}