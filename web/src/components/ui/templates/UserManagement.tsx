/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useUserManagement } from '@/services/hooks/user/useUserManagement';
import { hospitalsService } from '@/services/general/hospital/HospitalsService';
import { TRole, TPermission, IAppUser, ICreateUserData } from '@/types/auth-types';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  User, 
  Users, 
  UserPlus, 
  Stethoscope, 
  HeartPulse, 
  ClipboardCheck, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  AlertTriangle, 
  Save, 
  Trash2, 
  Building,
  Eye,
  EyeOff,
  MoreHorizontal,
  RefreshCw
} from 'lucide-react';
import { CreateEditUserModal } from './user/CreateEditUserModal';
import { ConfirmationModal } from './user/ConfirmationModal';
import Image from 'next/image';

const roles: { value: TRole, label: string, icon: React.ReactNode }[] = [
  { value: 'administrador', label: 'Administrador', icon: <User className="w-4 h-4" /> },
  { value: 'médico', label: 'Médico', icon: <Stethoscope className="w-4 h-4" /> },
  { value: 'enfermeiro', label: 'Enfermeiro', icon: <HeartPulse className="w-4 h-4" /> },
  { value: 'atendente', label: 'Atendente', icon: <ClipboardCheck className="w-4 h-4" /> },
  { value: 'paciente', label: 'Paciente', icon: <Users className="w-4 h-4" /> },
];

export const UserManagement: React.FC = () => {
  const {
    users,
    totalUsers,
    currentPage,
    totalPages,
    pageSize,
    isLoading,
    error,
    selectedUser,
    filterRole,
    searchQuery,
    hospitalId,
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
  } = useUserManagement();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<IAppUser | null>(null);
  const [hospitals, setHospitals] = useState<{ value: string; label: string }[]>([]);
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Carregar hospitais disponíveis
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const hospitalsData = await hospitalsService.getHospitalsForSelect();
        setHospitals(hospitalsData);
      } catch (error) {
        console.error('Erro ao buscar hospitais:', error);
      }
    };
    
    fetchHospitals();
  }, []);
  
  // Handler para criar usuário
  const handleCreateUser = async (userData: ICreateUserData) => {
    try {
      await createUser(userData);
      setIsCreateModalOpen(false);
      
      // Recarregar a lista após criar
      loadUsers();
      
      return { success: true, message: 'Usuário criado com sucesso!' };
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error 
          ? error.message 
          : 'Erro ao criar usuário.' 
      };
    }
  };
  
  // Handler para atualizar usuário
  const handleUpdateUser = async (userId: string, userData: Partial<IAppUser>) => {
    try {
      await updateUser(userId, userData);
      setIsEditModalOpen(false);
      selectUser(null);
      
      // Recarregar a lista após atualizar
      loadUsers();
      
      return { success: true, message: 'Usuário atualizado com sucesso!' };
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error 
          ? error.message 
          : 'Erro ao atualizar usuário.' 
      };
    }
  };
  
  // Handler para excluir usuário
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    
    try {
      await deleteUser(userToDelete.id);
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      
      // Recarregar a lista após excluir
      loadUsers();
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
    }
  };
  
  // Handler para abrir modal de edição
  const handleEditUser = (user: IAppUser) => {
    selectUser(user);
    setIsEditModalOpen(true);
  };
  
  // Handler para abrir modal de exclusão
  const handleDeleteClick = (user: IAppUser) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };
  
  // Handler para aplicar busca
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearchQuery);
  };

  // Handler para recarregar dados
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadUsers();
    setTimeout(() => setIsRefreshing(false), 500); // Simular carregamento para feedback visual
  };
  
  return (
    <div className="px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Gerenciamento de Usuários</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Crie, edite e gerencie usuários do sistema</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleRefresh}
            className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700 transition-colors"
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-md transition-colors shadow-sm"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            <span>Novo Usuário</span>
          </button>
        </div>
      </div>
      
      {/* Filtros */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">Filtros e Busca</h2>
        </div>
        <div className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Busca */}
            <div className="flex-1">
              <form onSubmit={handleSearch} className="flex items-center">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="text"
                    value={localSearchQuery}
                    onChange={(e) => setLocalSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Buscar por nome ou email"
                  />
                </div>
                <button
                  type="submit"
                  className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Buscar
                </button>
              </form>
            </div>
            
            {/* Filtro por função */}
            <div className="md:w-64">
              <label htmlFor="role-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Filtrar por Função
              </label>
              <div className="relative">
                <select
                  id="role-filter"
                  value={filterRole || ''}
                  onChange={(e) => setRoleFilter(e.target.value ? e.target.value as TRole : null)}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Todos os tipos</option>
                  {roles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <Filter className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                </div>
              </div>
            </div>
            
            {/* Filtro por hospital */}
            <div className="md:w-64">
              <label htmlFor="hospital-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Filtrar por Hospital
              </label>
              <div className="relative">
                <select
                  id="hospital-filter"
                  value={hospitalId || ''}
                  onChange={(e) => setHospitalFilter(e.target.value || null)}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Todos os hospitais</option>
                  {hospitals.map((hospital) => (
                    <option key={hospital.value} value={hospital.value}>
                      {hospital.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <Building className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mensagem de erro */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-500 dark:text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Tabela de usuários */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 flex items-center justify-center z-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          )}
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Contato
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Função
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Hospital
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Permissões
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {users.length === 0 && !isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      Nenhum usuário encontrado com os filtros selecionados.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => {
                    // Encontrar o hospital no array de hospitais
                    const userHospital = hospitals.find(h => h.value === user.hospitalId);
                    
                    // Função formatada com ícone
                    const userRole = roles.find(r => r.value === user.role);
                    
                    return (
                      <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                              {user.profileImage ? (
                                <Image 
                                  src={user.profileImage} 
                                  alt={user.name} 
                                  className="h-10 w-10 rounded-full"
                                />
                              ) : (
                                <User className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">ID: {user.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-gray-100">{user.email}</div>
                          {user.role === 'médico' && (
                            <div className="text-sm text-gray-500 dark:text-gray-400">CRM: {user.medicalLicense}</div>
                          )}
                          {user.role === 'enfermeiro' && (
                            <div className="text-sm text-gray-500 dark:text-gray-400">COREN: {user.nursingLicense}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                              ${user.role === 'administrador' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' : ''}
                              ${user.role === 'médico' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : ''}
                              ${user.role === 'enfermeiro' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : ''}
                              ${user.role === 'atendente' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' : ''}
                              ${user.role === 'paciente' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' : ''}
                            `}>
                              {userRole?.icon}
                              <span className="ml-1">{userRole?.label || user.role}</span>
                            </span>
                          </div>
                          {user.role === 'médico' && user.specialization && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{user.specialization}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {userHospital ? (
                            <div className="text-sm text-gray-900 dark:text-gray-100">{userHospital.label}</div>
                          ) : (
                            <div className="text-sm text-gray-500 dark:text-gray-400">Não vinculado</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {user.permissions.length > 3 ? (
                              <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs px-2 py-1 rounded">
                                {user.permissions.length} permissões
                              </span>
                            ) : (
                              user.permissions.map((permission, index) => (
                                <span 
                                  key={permission} 
                                  className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs px-2 py-1 rounded mr-1 mb-1"
                                >
                                  {permission.replace(/_/g, ' ')}
                                </span>
                              ))
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                              title="Editar"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteClick(user)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                              title="Excluir"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          
          {/* Paginação */}
          {totalPages > 1 && (
            <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md ${
                    currentPage === 1 
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  Anterior
                </button>
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md ${
                    currentPage === totalPages
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  Próximo
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Mostrando <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> a{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * pageSize, totalUsers)}
                    </span>{' '}
                    de <span className="font-medium">{totalUsers}</span> resultados
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium ${
                        currentPage === 1
                          ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span className="sr-only">Anterior</span>
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    
                    {/* Páginas */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      // Mostrar apenas a página atual, primeira, última e adjacentes
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === page
                                ? 'z-10 bg-blue-50 dark:bg-blue-900/30 border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-300'
                                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      }
                      
                      // Mostrar reticências (apenas uma vez entre intervalos)
                      if (
                        (page === 2 && currentPage > 3) ||
                        (page === totalPages - 1 && currentPage < totalPages - 2)
                      ) {
                        return (
                          <span
                            key={page}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            ...
                          </span>
                        );
                      }
                      
                      return null;
                    })}
                    
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium ${
                        currentPage === totalPages
                          ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span className="sr-only">Próximo</span>
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Modal para criar usuário */}
      {isCreateModalOpen && (
        <CreateEditUserModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleCreateUser}
          hospitals={hospitals}
          getDefaultPermissions={getDefaultPermissions}
          getAllPermissionsByCategory={getAllPermissionsByCategory}
          mode="create"
        />
      )}
      
      {/* Modal para editar usuário */}
      {isEditModalOpen && selectedUser && (
        <CreateEditUserModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            selectUser(null);
          }}
          onSave={(userData) => handleUpdateUser(selectedUser.id, userData)}
          hospitals={hospitals}
          getDefaultPermissions={getDefaultPermissions}
          getAllPermissionsByCategory={getAllPermissionsByCategory}
          mode="edit"
          user={selectedUser}
        />
      )}
      
      {/* Modal de confirmação para excluir */}
      {isDeleteModalOpen && userToDelete && (
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setUserToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
          title="Excluir Usuário"
          description={`Tem certeza que deseja excluir o usuário "${userToDelete.name}"? Esta ação não pode ser desfeita.`}
          confirmButtonText="Excluir"
          confirmButtonVariant="danger"
        />
      )}
    </div>
  );
};