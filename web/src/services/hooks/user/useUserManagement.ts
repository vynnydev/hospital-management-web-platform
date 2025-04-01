// hooks/useUserManagement.ts

import { useState, useCallback, useEffect } from 'react';
import { IAppUser, ICreateUserData, TPermission, TRole } from '@/types/auth-types';
import { IUserFilter } from '@/types/user-types';
import { userManagementService } from '@/services/general/user/UserManagementService';

export interface IUserManagementState {
  users: IAppUser[];
  totalUsers: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  isLoading: boolean;
  error: string | null;
  selectedUser: IAppUser | null;
  filterRole: TRole | null;
  searchQuery: string;
  hospitalId: string | null;
}

export function useUserManagement() {
  const [state, setState] = useState<IUserManagementState>({
    users: [],
    totalUsers: 0,
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    isLoading: false,
    error: null,
    selectedUser: null,
    filterRole: null,
    searchQuery: '',
    hospitalId: null
  });

  /**
   * Carrega a lista de usuários com os filtros atuais
   */
  const loadUsers = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const filters: IUserFilter = {
        page: state.currentPage,
        limit: state.pageSize
      };
      
      if (state.filterRole) {
        filters.role = state.filterRole;
      }
      
      if (state.searchQuery) {
        filters.search = state.searchQuery;
      }
      
      if (state.hospitalId) {
        filters.hospitalId = state.hospitalId;
      }
      
      const response = await userManagementService.listUsers(filters);
      
      setState(prev => ({
        ...prev,
        users: response.users,
        totalUsers: response.total,
        totalPages: response.totalPages,
        isLoading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao carregar usuários'
      }));
    }
  }, [
    state.currentPage, 
    state.pageSize, 
    state.filterRole,
    state.searchQuery,
    state.hospitalId
  ]);

  // Carregar usuários quando os filtros mudarem
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  /**
   * Altera o filtro de função/role
   */
  const setRoleFilter = useCallback((role: TRole | null) => {
    setState(prev => ({
      ...prev,
      filterRole: role,
      currentPage: 1 // Resetar para primeira página
    }));
  }, []);

  /**
   * Define a busca por texto
   */
  const setSearchQuery = useCallback((query: string) => {
    setState(prev => ({
      ...prev,
      searchQuery: query,
      currentPage: 1 // Resetar para primeira página
    }));
  }, []);

  /**
   * Define o filtro de hospital
   */
  const setHospitalFilter = useCallback((hospitalId: string | null) => {
    setState(prev => ({
      ...prev,
      hospitalId,
      currentPage: 1 // Resetar para primeira página
    }));
  }, []);

  /**
   * Muda para uma página específica
   */
  const goToPage = useCallback((page: number) => {
    setState(prev => ({
      ...prev,
      currentPage: page
    }));
  }, []);

  /**
   * Altera o tamanho da página
   */
  const setPageSize = useCallback((size: number) => {
    setState(prev => ({
      ...prev,
      pageSize: size,
      currentPage: 1 // Resetar para primeira página
    }));
  }, []);

  /**
   * Seleciona um usuário para edição
   */
  const selectUser = useCallback((user: IAppUser | null) => {
    setState(prev => ({
      ...prev,
      selectedUser: user
    }));
  }, []);

  /**
   * Cria um novo usuário
   */
  const createUser = useCallback(async (userData: ICreateUserData) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const newUser = await userManagementService.createUser(userData);
      
      setState(prev => ({
        ...prev,
        isLoading: false
      }));
      
      // Recarregar a lista após criar usuário
      loadUsers();
      
      return newUser;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao criar usuário'
      }));
      throw error;
    }
  }, [loadUsers]);

  /**
   * Atualiza um usuário existente
   */
  const updateUser = useCallback(async (userId: string, userData: Partial<IAppUser>) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const updatedUser = await userManagementService.updateUser(userId, userData);
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        // Atualizar o usuário na lista atual se ele estiver lá
        users: prev.users.map(user => 
          user.id === userId ? updatedUser : user
        ),
        // Atualizar o selectedUser se ele for o que está sendo editado
        selectedUser: prev.selectedUser?.id === userId 
          ? updatedUser 
          : prev.selectedUser
      }));
      
      return updatedUser;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao atualizar usuário'
      }));
      throw error;
    }
  }, []);

  /**
   * Remove um usuário
   */
  const deleteUser = useCallback(async (userId: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      await userManagementService.deleteUser(userId);
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        users: prev.users.filter(user => user.id !== userId),
        selectedUser: prev.selectedUser?.id === userId ? null : prev.selectedUser
      }));
      
      // Recarregar a lista para garantir paginação correta
      loadUsers();
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao excluir usuário'
      }));
      throw error;
    }
  }, [loadUsers]);

  /**
   * Obtém permissões padrão por função/role
   */
  const getDefaultPermissions = useCallback((role: TRole): TPermission[] => {
    return userManagementService.getDefaultPermissions(role);
  }, []);

  /**
   * Obtém todas as permissões disponíveis por categoria
   */
  const getAllPermissionsByCategory = useCallback(() => {
    return userManagementService.getAllPermissionsByCategory();
  }, []);

  return {
    ...state,
    loadUsers,
    setRoleFilter,
    setSearchQuery,
    setHospitalFilter,
    goToPage,
    setPageSize,
    selectUser,
    createUser,
    updateUser,
    deleteUser,
    getDefaultPermissions,
    getAllPermissionsByCategory
  };
}