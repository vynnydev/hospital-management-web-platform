// types/auth-types.ts
export type Permission = 'VIEW_ALL_HOSPITALS' | 'VIEW_SINGLE_HOSPITAL';

export type Role = 'Admin' | 'Hospital Manager' | 'User';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: Role;
  profileImage: string,
  permissions: Permission[];
  hospitalId?: string;
}

export interface AuthResponse {
  user: AppUser | null;
  token: string;
  isLoading: boolean;
  error: string | null;
}

export interface PermissionCheck {
  hasPermission: boolean;
  requiredHospitalId?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role?: string;
  permissions?: string[];
  hospitalId?: string;
}