// types/auth-types.ts
export type TPermission = 'VIEW_ALL_HOSPITALS' | 'VIEW_SINGLE_HOSPITAL';

export type TRole = 'Admin' | 'Hospital Manager' | 'User';

export interface IAppUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: TRole;
  profileImage: string,
  permissions: TPermission[];
  hospitalId?: string;
}

export interface IAuthResponse {
  user: IAppUser | null;
  token: string;
  isLoading: boolean;
  error: string | null;
}

export interface IPermissionCheck {
  hasPermission: boolean;
  requiredHospitalId?: string;
}

export interface ILoginCredentials {
  email: string;
  password: string;
}

export interface ICreateUserData {
  name: string;
  email: string;
  password: string;
  role?: string;
  permissions?: string[];
  hospitalId?: string;
}
