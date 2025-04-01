import { IAppUser, TRole } from "./auth-types";

/**
 * Interface para paginação e filtragem de usuários
 */
export interface IUserFilter {
  page?: number;
  limit?: number;
  role?: TRole | TRole[];
  hospitalId?: string;
  search?: string; // Busca por nome ou email
}

/**
 * Resposta paginada de usuários
 */
export interface IUserResponse {
  users: IAppUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}