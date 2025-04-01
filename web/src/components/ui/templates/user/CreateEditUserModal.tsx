/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// components/admin/users/CreateEditUserModal.tsx

import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, AlertCircle, UserPlus, Save, Check } from 'lucide-react';
import { IAppUser, ICreateUserData, TPermission, TRole } from '@/types/auth-types';

// Tipos de funções de usuário
const userRoles = [
  { id: 'administrador', name: 'Administrador' },
  { id: 'médico', name: 'Médico' },
  { id: 'enfermeiro', name: 'Enfermeiro' },
  { id: 'atendente', name: 'Atendente' },
  { id: 'paciente', name: 'Paciente' }
];

interface ICreateEditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: any) => Promise<{ success: boolean; message: string }>;
  hospitals: { value: string; label: string }[];
  getDefaultPermissions: (role: TRole) => TPermission[];
  getAllPermissionsByCategory: () => Record<string, TPermission[]>;
  mode: 'create' | 'edit';
  user?: IAppUser;
}

export const CreateEditUserModal: React.FC<ICreateEditUserModalProps> = ({
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

  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog 
        as="div" 
        className="fixed inset-0 z-50 overflow-y-auto" 
        onClose={() => !isSubmitting && onClose()}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            {/* <Dialog className="fixed inset-0 bg-black bg-opacity-30" /> */}
          </Transition>

          {/* Centralizar o modal */}
          <span className="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>
          
          <Transition
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <div className="flex justify-between items-center mb-4">
                <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900 flex items-center">
                  {mode === 'create' ? (
                    <>
                      <UserPlus className="w-5 h-5 mr-2 text-blue-500" />
                      Criar Novo Usuário
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2 text-blue-500" />
                      Editar Usuário
                    </>
                  )}
                </Dialog.Title>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  <span className="sr-only">Fechar</span>
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              {/* Mensagem de erro */}
              {error && (
                <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
              
              {/* Mensagem de sucesso */}
              {success && (
                <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Informações básicas */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-3">Informações Básicas</h4>
                    
                    <div className="space-y-4">
                      {/* Nome */}
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Nome completo *
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      
                      {/* Email */}
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      
                      {/* Senha - apenas no modo de criação */}
                      {mode === 'create' && (
                        <div>
                          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Senha *
                          </label>
                          <input
                            type="password"
                            name="password"
                            id="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                      )}
                      
                      {/* Função */}
                      <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                          Função *
                        </label>
                        <select
                          id="role"
                          name="role"
                          required
                          value={formData.role}
                          onChange={handleRoleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          disabled={mode === 'edit'} // Não permitir alterar a função no modo de edição
                        >
                          {userRoles.map((role) => (
                            <option key={role.id} value={role.id}>
                              {role.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      {/* Hospital */}
                      <div>
                        <label htmlFor="hospitalId" className="block text-sm font-medium text-gray-700">
                          Hospital {(formData.role === 'médico' || formData.role === 'enfermeiro' || formData.role === 'atendente') && '*'}
                        </label>
                        <select
                          id="hospitalId"
                          name="hospitalId"
                          value={formData.hospitalId || ''}
                          onChange={handleChange}
                          required={formData.role === 'médico' || formData.role === 'enfermeiro' || formData.role === 'atendente'}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                  
                  {/* Campos específicos por função */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-3">Informações Específicas</h4>
                    
                    <div className="space-y-4">
                      {/* Campos para médicos */}
                      {formData.role === 'médico' && (
                        <>
                          <div>
                            <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">
                              Especialização *
                            </label>
                            <input
                              type="text"
                              name="specialization"
                              id="specialization"
                              required
                              value={formData.specialization || ''}
                              onChange={handleChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label htmlFor="medicalLicense" className="block text-sm font-medium text-gray-700">
                              CRM (Registro Médico) *
                            </label>
                            <input
                              type="text"
                              name="medicalLicense"
                              id="medicalLicense"
                              required
                              value={formData.medicalLicense || ''}
                              onChange={handleChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                        </>
                      )}
                      
                      {/* Campos para enfermeiros */}
                      {formData.role === 'enfermeiro' && (
                        <>
                          <div>
                            <label htmlFor="nursingLicense" className="block text-sm font-medium text-gray-700">
                              COREN (Registro de Enfermagem) *
                            </label>
                            <input
                              type="text"
                              name="nursingLicense"
                              id="nursingLicense"
                              required
                              value={formData.nursingLicense || ''}
                              onChange={handleChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                              Departamento *
                            </label>
                            <input
                              type="text"
                              name="department"
                              id="department"
                              required
                              value={formData.department || ''}
                              onChange={handleChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label htmlFor="shift" className="block text-sm font-medium text-gray-700">
                              Turno *
                            </label>
                            <select
                              id="shift"
                              name="shift"
                              required
                              value={formData.shift || 'manhã'}
                              onChange={handleChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                              <option value="manhã">Manhã</option>
                              <option value="tarde">Tarde</option>
                              <option value="noite">Noite</option>
                            </select>
                          </div>
                        </>
                      )}
                      
                      {/* Campos para pacientes */}
                      {formData.role === 'paciente' && (
                        <>
                          <div>
                            <label htmlFor="patientId" className="block text-sm font-medium text-gray-700">
                              ID do Paciente *
                            </label>
                            <input
                              type="text"
                              name="patientId"
                              id="patientId"
                              required
                              value={formData.patientId || ''}
                              onChange={handleChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label htmlFor="healthInsurance" className="block text-sm font-medium text-gray-700">
                              Plano de Saúde *
                            </label>
                            <input
                              type="text"
                              name="healthInsurance"
                              id="healthInsurance"
                              required
                              value={formData.healthInsurance || ''}
                              onChange={handleChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                              Data de Nascimento *
                            </label>
                            <input
                              type="date"
                              name="dateOfBirth"
                              id="dateOfBirth"
                              required
                              value={formData.dateOfBirth || ''}
                              onChange={handleChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                        </>
                      )}
                      
                      {/* Campos para atendentes */}
                      {formData.role === 'atendente' && (
                        <>
                          <div>
                            <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                              Departamento *
                            </label>
                            <input
                              type="text"
                              name="department"
                              id="department"
                              required
                              value={formData.department || ''}
                              onChange={handleChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="Ex: Recepção, Agendamento, etc."
                            />
                          </div>
                        </>
                      )}
                      
                      {/* Mensagem para administradores */}
                      {formData.role === 'administrador' && (
                        <div className="bg-blue-50 p-4 rounded-md">
                          <p className="text-sm text-blue-700">
                            Administradores têm acesso a funções de gerenciamento do sistema.
                            Configure as permissões específicas abaixo.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Seção de permissões */}
                <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-3">Permissões</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(permissionsByCategory).map(([category, permissions]) => (
                      <div key={category} className="space-y-2">
                        <h5 className="text-sm font-medium text-gray-800">{category}</h5>
                        <div className="space-y-1">
                          {permissions.map((permission) => (
                            <div key={permission} className="flex items-start">
                              <div className="flex items-center h-5">
                                <input
                                  id={`permission-${permission}`}
                                  name={`permission-${permission}`}
                                  type="checkbox"
                                  checked={formData.permissions?.includes(permission) || false}
                                  onChange={(e) => handlePermissionChange(permission, e.target.checked)}
                                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label htmlFor={`permission-${permission}`} className="font-medium text-gray-700">
                                  {permission.replace(/_/g, ' ')}
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
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
              </form>
            </div>
          </Transition>
        </div>
      </Dialog>
    </Transition>
  );
};