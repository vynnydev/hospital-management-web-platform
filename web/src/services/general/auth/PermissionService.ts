import { TPermission, IPermissionCheck, TRole } from "@/types/auth-types";

export class PermissionService {
    private static rolePermissions: Record<TRole, TPermission[]> = {
      'administrador': ['VIEW_ALL_HOSPITALS', 'VIEW_SINGLE_HOSPITAL'],
      'enfermeiro': ['NURSE_ACCESS', 'ADMINISTER_MEDICATION', 'RECORD_VITALS', 'MANAGE_BEDS', 'VIEW_PATIENT_RECORDS_NURSE', 'ASSIGN_TASKS'],
      'atendente': ['ATTENDANT_ACCESS', 'SCHEDULE_MANAGEMENT', 'PATIENT_REGISTRATION', 'VIEW_BASIC_PATIENT_INFO', 'MANAGE_APPOINTMENTS', 'VIEW_DOCTOR_SCHEDULE', 'GENERATE_REPORTS'],
      'system': [],
      'ai': [],
      'médico': ['DOCTOR_ACCESS', 'PRESCRIBE_MEDICATION', 'VIEW_PATIENT_RECORDS', 'USE_AI_DIAGNOSIS', 'APPROVE_AI_PRESCRIPTIONS'],
      'paciente': ['PATIENT_ACCESS', 'SCHEDULE_APPOINTMENTS', 'VIEW_OWN_RECORDS', 'REQUEST_TELEMEDICINE']
    };

    static validatePermission(
      userPermissions: TPermission[],
      requiredPermission: TPermission,
      userHospitalId?: string,
      targetHospitalId?: string
    ): IPermissionCheck {
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
  
    static getRolePermissions(role: TRole): TPermission[] {
      return this.rolePermissions[role] || [];
    }
}