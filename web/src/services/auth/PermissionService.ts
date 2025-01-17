import { Permission, PermissionCheck, Role } from "@/types/auth-types";

export class PermissionService {
    private static rolePermissions: Record<Role, Permission[]> = {
      'Admin': ['VIEW_ALL_HOSPITALS'],
      'Hospital Manager': ['VIEW_SINGLE_HOSPITAL'],
      'User': []
    };
  
    static validatePermission(
      userPermissions: Permission[],
      requiredPermission: Permission,
      userHospitalId?: string,
      targetHospitalId?: string
    ): PermissionCheck {
      // Verificar se o usuário tem a permissão explicitamente
      const hasPermission = userPermissions.includes(requiredPermission);
  
      // Para VIEW_SINGLE_HOSPITAL, verificar se o hospital alvo corresponde ao hospital do usuário
      if (requiredPermission === 'VIEW_SINGLE_HOSPITAL' && hasPermission) {
        return {
          hasPermission: userHospitalId === targetHospitalId,
          requiredHospitalId: targetHospitalId
        };
      }
  
      // Para VIEW_ALL_HOSPITALS, o usuário tem acesso completo
      if (requiredPermission === 'VIEW_ALL_HOSPITALS' && hasPermission) {
        return { hasPermission: true };
      }
  
      return { hasPermission: false };
    }
  
    static getRolePermissions(role: Role): Permission[] {
      return this.rolePermissions[role] || [];
    }
}