import React from 'react';
import Image from 'next/image';
import { IAppUser } from '@/types/auth-types';
import { authService } from '@/services/auth/AuthService';

interface ProfileContentProps {
  user: IAppUser | null;
}

export const ProfileContent: React.FC<ProfileContentProps> = ({ user }) => {
  if (!user) return null;
  
  const isDoctor = authService.isDoctor();
  const isAdmin = authService.isAdministrator();
  const isPatient = authService.isPatient();
  const isNurse = authService.isNurse();
  const isAttendant = authService.isAttendant();
  
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="mb-4 relative mx-auto">
          <div className="w-24 h-24 rounded-full overflow-hidden mx-auto border-4 border-blue-100 dark:border-blue-900">
            <Image 
              src={user.profileImage || '/images/default-avatar.png'} 
              alt="Foto do perfil"
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          </div>
          <button className="absolute bottom-0 right-1/2 transform translate-x-12 translate-y-1 bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
        <div className="text-gray-500 dark:text-gray-400 mt-1">{user.email}</div>
        
        <div className="flex justify-center mt-3">
          <span className={`
            text-xs font-medium px-2.5 py-0.5 rounded-full
            ${isDoctor ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : ''}
            ${isAdmin ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' : ''}
            ${isPatient ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : ''}
            ${isNurse ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' : ''}
            ${isAttendant ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' : ''}
          `}>
            {isDoctor ? 'Médico' : 
             isAdmin ? 'Administrador' : 
             isPatient ? 'Paciente' : 
             isNurse ? 'Enfermeiro' : 
             isAttendant ? 'Atendente' : 'Usuário'}
          </span>
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Informações do perfil */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Informações do Perfil</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">Detalhes pessoais e contato</p>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700">
            <dl>
              <div className="bg-gray-50 dark:bg-gray-900/20 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Nome completo</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-300 sm:mt-0 sm:col-span-2">{user.name}</dd>
              </div>
              <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-300 sm:mt-0 sm:col-span-2">{user.email}</dd>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900/20 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Função</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-300 sm:mt-0 sm:col-span-2 capitalize">{user.role}</dd>
              </div>
              
              {isDoctor && user.medicalLicense && (
                <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Registro Médico</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-300 sm:mt-0 sm:col-span-2">{user.medicalLicense}</dd>
                </div>
              )}
              
              {isDoctor && user.specialization && (
                <div className="bg-gray-50 dark:bg-gray-900/20 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Especialização</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-300 sm:mt-0 sm:col-span-2">{user.specialization}</dd>
                </div>
              )}
              
              {isPatient && user.healthInsurance && (
                <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Plano de Saúde</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-300 sm:mt-0 sm:col-span-2">{user.healthInsurance}</dd>
                </div>
              )}
              
              {(isAdmin || isDoctor || isNurse || isAttendant) && user.hospitalId && (
                <div className="bg-gray-50 dark:bg-gray-900/20 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Hospital</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-300 sm:mt-0 sm:col-span-2">
                    {user.hospitalId === 'RD4H-SP-ITAIM' ? 'Hospital Itaim' : 
                     user.hospitalId === 'RD4H-SP-MORUMBI' ? 'Hospital Morumbi' : 
                     user.hospitalId}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
        
        {/* Ações de perfil */}
        <div className="flex flex-col space-y-3">
          <button className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Editar Perfil
          </button>
          <button className="w-full py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Alterar Senha
          </button>
        </div>
      </div>
    </div>
  );
};