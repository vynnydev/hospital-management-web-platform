/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, AlertCircle, UserPlus, Save, Check, Shield, Clipboard, Building, Stethoscope, HeartPulse, User, Calendar, Mail, Lock, BadgeCheck } from 'lucide-react';
import { IAppUser, ICreateUserData, TPermission, TRole } from '@/types/auth-types';

// Tipos de funções de usuário
const userRoles = [
  { id: 'administrador', name: 'Administrador', icon: <Shield className="w-4 h-4 mr-1" /> },
  { id: 'médico', name: 'Médico', icon: <Stethoscope className="w-4 h-4 mr-1" /> },
  { id: 'enfermeiro', name: 'Enfermeiro', icon: <HeartPulse className="w-4 h-4 mr-1" /> },
  { id: 'atendente', name: 'Atendente', icon: <Clipboard className="w-4 h-4 mr-1" /> },
  { id: 'paciente', name: 'Paciente', icon: <User className="w-4 h-4 mr-1" /> }
];

interface CreateEditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: any) => Promise<{ success: boolean; message: string }>;
  hospitals: { value: string; label: string }[];
  getDefaultPermissions: (role: TRole) => TPermission[];
  getAllPermissionsByCategory: () => Record<string, TPermission[]>;
  mode: 'create' | 'edit';
  user?: IAppUser;
}

export const CreateEditUserModal: React.FC<CreateEditUserModalProps> = ({
  isOpen,
  onClose,
  onSave,
  hospitals,
  getDefaultPermissions,
  getAllPermissionsByCategory,
  mode,
  user
}) => {
  // Estado do formulário
  const [formData, setFormData] = useState<ICreateUserData | Partial<IAppUser>>({
    name: '',
    email: '',
    password: '',
    role: 'administrador' as TRole,
    permissions: [],
    hospitalId: '',
    // Campos específicos por função
    specialization: '',
    medicalLicense: '',
    nursingLicense: '',
    department: '',
    shift: 'manhã',
    patientId: '',
    healthInsurance: '',
    dateOfBirth: ''
  });
  
  // Tabs para o formulário
  const [activeTab, setActiveTab] = useState('info');
  
  // Gerenciamento de erros e sucesso
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Verificar se estamos em modo de edição para preencher dados
  useEffect(() => {
    if (mode === 'edit' && user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role,
        permissions: [...user.permissions],
        hospitalId: user.hospitalId || '',
        specialization: user.specialization || '',
        medicalLicense: user.medicalLicense || '',
        nursingLicense: user.nursingLicense || '',
        department: user.department || '',
        shift: user.shift || 'manhã',
        patientId: user.patientId || '',
        healthInsurance: user.healthInsurance || '',
        dateOfBirth: user.dateOfBirth || ''
      });
    } else {
      // No modo de criação, definir permissões padrão com base na função selecionada
      setFormData(prev => ({
        ...prev,
        permissions: getDefaultPermissions(prev.role as TRole)
      }));
    }
  }, [mode, user, getDefaultPermissions]);
  
  // Atualizar permissões quando a função é alterada
  useEffect(() => {
    if (mode === 'create') {
      setFormData(prev => ({
        ...prev,
        permissions: getDefaultPermissions(prev.role as TRole)
      }));
    }
  }, [formData.role, getDefaultPermissions, mode]);
  
  // Handler genérico para campos do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handler para alteração da função (role)
  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as TRole;
    setFormData(prev => ({
      ...prev,
      role: newRole,
      // Resetar campos específicos da função quando mudar
      specialization: '',
      medicalLicense: '',
      nursingLicense: '',
      department: '',
      shift: 'manhã',
      patientId: '',
      healthInsurance: '',
      dateOfBirth: ''
    }));
  };
  
  // Handler para checkbox de permissões
  const handlePermissionChange = (permission: TPermission, checked: boolean) => {
    setFormData(prev => {
      const currentPermissions = [...(prev.permissions || [])];
      
      if (checked && !currentPermissions.includes(permission)) {
        return { ...prev, permissions: [...currentPermissions, permission] };
      } else if (!checked && currentPermissions.includes(permission)) {
        return { 
          ...prev, 
          permissions: currentPermissions.filter(p => p !== permission) 
        };
      }
      
      return prev;
    });
  };
  
  // Handler para seleção de categoria de permissões
  const handleSelectAllInCategory = (categoryPermissions: TPermission[], isSelected: boolean) => {
    setFormData(prev => {
      const currentPermissions = [...(prev.permissions || [])];
      
      if (isSelected) {
        // Adicionar todas as permissões da categoria que ainda não estão selecionadas
        const newPermissions = [...currentPermissions];
        categoryPermissions.forEach(permission => {
          if (!newPermissions.includes(permission)) {
            newPermissions.push(permission);
          }
        });
        return { ...prev, permissions: newPermissions };
      } else {
        // Remover todas as permissões da categoria
        return {
          ...prev,
          permissions: currentPermissions.filter(p => !categoryPermissions.includes(p))
        };
      }
    });
  };
  
  // Verifica se todas as permissões de uma categoria estão selecionadas
  const areCategoryPermissionsSelected = (categoryPermissions: TPermission[]) => {
    return categoryPermissions.every(permission => 
      formData.permissions?.includes(permission)
    );
  };
  
  // Enviar formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);
    
    try {
      const result = await onSave(formData);
      
      if (result.success) {
        setSuccess(result.message);
        // Fechar modal após sucesso com pequeno delay para mostrar mensagem
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Erro ao salvar usuário. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Obter permissões por categoria
  const permissionsByCategory = getAllPermissionsByCategory();
  
  // Função para renderizar ícone do tipo de usuário
  const renderRoleIcon = (roleId: string) => {
    const role = userRoles.find(r => r.id === roleId);
    return role?.icon || null;
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog 
        as="div" 
        className="fixed inset-0 z-50 overflow-y-auto" 
        onClose={() => !isSubmitting && onClose()}
      >
        <div className="min-h-screen px-4 text-center">
          {/* Overlay de fundo */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50 dark:bg-black/70" aria-hidden="true" />
          </Transition.Child>

          {/* Este elemento é para centralizar verticalmente o modal */}
          <span className="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>
          
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-5xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                <Dialog.Title as="h3" className="text-xl font-semibold leading-6 text-gray-900 dark:text-gray-100 flex items-center">
                  {mode === 'create' ? (
                    <>
                      <UserPlus className="w-6 h-6 mr-2 text-blue-500 dark:text-blue-400" />
                      Criar Novo Usuário
                    </>
                  ) : (
                    <>
                      <Save className="w-6 h-6 mr-2 text-blue-500 dark:text-blue-400" />
                      Editar Usuário: {user?.name}
                    </>
                  )}
                </Dialog.Title>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 rounded-md"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  <span className="sr-only">Fechar</span>
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              {/* Navegação em Tabs */}
              <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
                <button
                  className={`py-2 px-4 font-medium text-sm focus:outline-none ${
                    activeTab === 'info'
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500 dark:border-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                  onClick={() => setActiveTab('info')}
                >
                  Informações Básicas
                </button>
                <button
                  className={`py-2 px-4 font-medium text-sm focus:outline-none ${
                    activeTab === 'role'
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500 dark:border-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                  onClick={() => setActiveTab('role')}
                >
                  Função e Especialização
                </button>
                <button
                  className={`py-2 px-4 font-medium text-sm focus:outline-none ${
                    activeTab === 'permissions'
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500 dark:border-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                  onClick={() => setActiveTab('permissions')}
                >
                  Permissões de Acesso
                </button>
              </div>
              
              {/* Mensagem de erro */}
              {error && (
                <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                </div>
              )}
              
              {/* Mensagem de sucesso */}
              {success && (
                <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 dark:border-green-400 flex items-start">
                  <Check className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-700 dark:text-green-400">{success}</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                {/* Tab: Informações Básicas */}
                {activeTab === 'info' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            <User className="w-4 h-4 inline mr-1" /> Nome completo *
                          </label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            <Mail className="w-4 h-4 inline mr-1" /> Email *
                          </label>
                          <input
                            type="email"
                            name="email"
                            id="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                        
                        {/* Senha - apenas no modo de criação */}
                        {mode === 'create' && (
                          <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              <Lock className="w-4 h-4 inline mr-1" /> Senha *
                            </label>
                            <input
                              type="password"
                              name="password"
                              id="password"
                              required
                              value={formData.password}
                              onChange={handleChange}
                              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            <BadgeCheck className="w-4 h-4 inline mr-1" /> Função *
                          </label>
                          <div className="mt-1 relative">
                            <select
                              id="role"
                              name="role"
                              required
                              value={formData.role}
                              onChange={handleRoleChange}
                              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                              disabled={mode === 'edit'} // Não permitir alterar a função no modo de edição
                            >
                              {userRoles.map((role) => (
                                <option key={role.id} value={role.id}>
                                  {role.name}
                                </option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                              {renderRoleIcon(formData.role as string)}
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="hospitalId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            <Building className="w-4 h-4 inline mr-1" /> Hospital {(formData.role === 'médico' || formData.role === 'enfermeiro' || formData.role === 'atendente') && '*'}
                          </label>
                          <select
                            id="hospitalId"
                            name="hospitalId"
                            value={formData.hospitalId || ''}
                            onChange={handleChange}
                            required={formData.role === 'médico' || formData.role === 'enfermeiro' || formData.role === 'atendente'}
                            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          >
                            <option value="">Selecione um hospital</option>
                            {hospitals.map((hospital) => (
                              <option key={hospital.value} value={hospital.value}>
                                {hospital.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Tab: Função e Especialização */}
                {activeTab === 'role' && (
                  <div className="space-y-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md mb-4">
                      <h4 className="text-blue-800 dark:text-blue-300 font-medium flex items-center">
                        {renderRoleIcon(formData.role as string)}
                        <span className="ml-1">
                          Configurando um usuário do tipo: {userRoles.find(r => r.id === formData.role)?.name}
                        </span>
                      </h4>
                      <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
                        Os campos a seguir são específicos para este tipo de usuário.
                      </p>
                    </div>
                    
                    {/* Campos específicos por função */}
                    <div className="space-y-4">
                      {/* Condicional para médicos */}
                      {formData.role === 'médico' && (
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Especialização Médica *
                            </label>
                            <input
                              type="text"
                              name="specialization"
                              id="specialization"
                              required
                              value={formData.specialization || ''}
                              onChange={handleChange}
                              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="Ex: Cardiologia, Dermatologia, etc."
                            />
                          </div>
                          <div>
                            <input
                              type="text"
                              name="medicalLicense"
                              id="medicalLicense"
                              required
                              value={formData.medicalLicense || ''}
                              onChange={handleChange}
                              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="Ex: CRM-SP-123456"
                            />
                          </div>
                        </div>
                      )}
                      
                      {/* Condicional para enfermeiros */}
                      {formData.role === 'enfermeiro' && (
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="nursingLicense" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              COREN (Registro de Enfermagem) *
                            </label>
                            <input
                              type="text"
                              name="nursingLicense"
                              id="nursingLicense"
                              required
                              value={formData.nursingLicense || ''}
                              onChange={handleChange}
                              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="Ex: COREN-SP-123456"
                            />
                          </div>
                          <div>
                            <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Departamento *
                            </label>
                            <input
                              type="text"
                              name="department"
                              id="department"
                              required
                              value={formData.department || ''}
                              onChange={handleChange}
                              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="Ex: Emergência, UTI, etc."
                            />
                          </div>
                          <div>
                            <label htmlFor="shift" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Turno *
                            </label>
                            <select
                              id="shift"
                              name="shift"
                              required
                              value={formData.shift || 'manhã'}
                              onChange={handleChange}
                              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                              <option value="manhã">Manhã</option>
                              <option value="tarde">Tarde</option>
                              <option value="noite">Noite</option>
                            </select>
                          </div>
                        </div>
                      )}
                      
                      {/* Condicional para pacientes */}
                      {formData.role === 'paciente' && (
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              ID do Paciente *
                            </label>
                            <input
                              type="text"
                              name="patientId"
                              id="patientId"
                              required
                              value={formData.patientId || ''}
                              onChange={handleChange}
                              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="Ex: PTH-SP-001"
                            />
                          </div>
                          <div>
                            <label htmlFor="healthInsurance" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Plano de Saúde *
                            </label>
                            <input
                              type="text"
                              name="healthInsurance"
                              id="healthInsurance"
                              required
                              value={formData.healthInsurance || ''}
                              onChange={handleChange}
                              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="Ex: Plano Saúde Total"
                            />
                          </div>
                          <div>
                            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Data de Nascimento *
                            </label>
                            <input
                              type="date"
                              name="dateOfBirth"
                              id="dateOfBirth"
                              required
                              value={formData.dateOfBirth || ''}
                              onChange={handleChange}
                              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                        </div>
                      )}
                      
                      {/* Condicional para atendentes */}
                      {formData.role === 'atendente' && (
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Departamento *
                            </label>
                            <input
                              type="text"
                              name="department"
                              id="department"
                              required
                              value={formData.department || ''}
                              onChange={handleChange}
                              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="Ex: Recepção, Agendamento, etc."
                            />
                          </div>
                        </div>
                      )}
                      
                      {/* Mensagem para administradores */}
                      {formData.role === 'administrador' && (
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-md">
                          <h4 className="text-purple-800 dark:text-purple-300 font-medium flex items-center">
                            <Shield className="w-4 h-4 mr-1" />
                            Configuração de Administrador
                          </h4>
                          <p className="mt-1 text-sm text-purple-700 dark:text-purple-400">
                            Administradores têm acesso a funções de gerenciamento do sistema.
                            Configure as permissões específicas na próxima aba.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Tab: Permissões */}
                {activeTab === 'permissions' && (
                  <div className="space-y-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
                      <p className="text-sm text-blue-700 dark:text-blue-400">
                        Configure as permissões de acesso para este usuário. As permissões determinam quais funcionalidades
                        o usuário poderá acessar no sistema.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {Object.entries(permissionsByCategory).map(([category, permissions]) => {
                        const allSelected = areCategoryPermissionsSelected(permissions);
                        
                        return (
                          <div key={category} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 flex justify-between items-center">
                              <h5 className="text-sm font-medium text-gray-800 dark:text-gray-200">{category}</h5>
                              <div className="flex items-center">
                                <input
                                  id={`select-all-${category}`}
                                  type="checkbox"
                                  checked={allSelected}
                                  onChange={(e) => handleSelectAllInCategory(permissions, e.target.checked)}
                                  className="h-4 w-4 text-blue-600 dark:text-blue-500 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                                />
                                <label htmlFor={`select-all-${category}`} className="ml-2 text-xs text-gray-600 dark:text-gray-400">
                                  Selecionar todas
                                </label>
                              </div>
                            </div>
                            <div className="p-4 max-h-[240px] overflow-y-auto bg-white dark:bg-gray-800">
                              <div className="space-y-2">
                                {permissions.map((permission) => (
                                  <div key={permission} className="flex items-start">
                                    <div className="flex items-center h-5">
                                      <input
                                        id={`permission-${permission}`}
                                        name={`permission-${permission}`}
                                        type="checkbox"
                                        checked={formData.permissions?.includes(permission) || false}
                                        onChange={(e) => handlePermissionChange(permission, e.target.checked)}
                                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 dark:text-blue-500 border-gray-300 dark:border-gray-600 rounded"
                                      />
                                    </div>
                                    <div className="ml-3 text-sm">
                                      <label htmlFor={`permission-${permission}`} className="font-medium text-gray-700 dark:text-gray-300">
                                        {permission.replace(/_/g, ' ')}
                                      </label>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                <div className="mt-8 flex justify-between">
                  {/* Navegação entre abas */}
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (activeTab === 'permissions') setActiveTab('role');
                        else if (activeTab === 'role') setActiveTab('info');
                      }}
                      disabled={activeTab === 'info' || isSubmitting}
                      className={`px-3 py-2 border rounded-md text-sm font-medium ${
                        activeTab === 'info' || isSubmitting
                          ? 'border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                          : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      Anterior
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (activeTab === 'info') setActiveTab('role');
                        else if (activeTab === 'role') setActiveTab('permissions');
                      }}
                      disabled={activeTab === 'permissions' || isSubmitting}
                      className={`px-3 py-2 border rounded-md text-sm font-medium ${
                        activeTab === 'permissions' || isSubmitting
                          ? 'border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                          : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      Próximo
                    </button>
                  </div>
                  
                  {/* Botões de ação */}
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={isSubmitting}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 flex items-center"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processando...
                        </>
                      ) : mode === 'create' ? (
                        <>
                          <UserPlus className="w-4 h-4 mr-2" />
                          Criar Usuário
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Salvar Alterações
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};