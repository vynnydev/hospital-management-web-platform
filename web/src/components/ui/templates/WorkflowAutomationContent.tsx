import React, { useState, useEffect } from 'react';
import { WorkflowContent } from './workflow/WorkflowContent';
import { authService } from '@/services/auth/AuthService';

export const WorkflowAutomationContent = () => {
  const [userHasAccess, setUserHasAccess] = useState<boolean>(false);
  const user = authService.getCurrentUser();

  // Verificar se o usuário tem acesso às funcionalidades de workflow
  useEffect(() => {
    if (user) {
      const isAdmin = authService.isAdministrator();
      const isDoctor = authService.isDoctor();
      const isNurse = authService.isNurse();
      
      // Definir regras de acesso: Admin e médicos têm acesso total,
      // enfermeiros têm acesso limitado
      setUserHasAccess(isAdmin || isDoctor || isNurse);
    } else {
      setUserHasAccess(false);
    }
  }, [user]);

  return (
    <div className="w-full h-full">
      {userHasAccess ? (
        <WorkflowContent />
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-red-100 dark:bg-red-900/30 p-6 rounded-full mb-6">
            <svg className="w-10 h-10 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            Acesso restrito
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
            Você não tem permissão para acessar as configurações de Fluxos & Automações. 
            Entre em contato com o administrador do sistema para solicitar acesso.
          </p>
        </div>
      )}
    </div>
  );
};