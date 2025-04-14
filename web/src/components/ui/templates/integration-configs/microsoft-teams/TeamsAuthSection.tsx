/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Lock, Database } from 'lucide-react';

interface TeamsAuthSectionProps {
  credentials: {
    tenantId: string;
    clientId: string;
    clientSecret: string;
    redirectUri: string;
  };
  onCredentialChange: (field: string, value: string) => void;
}

export const TeamsAuthSection: React.FC<TeamsAuthSectionProps> = ({
  credentials,
  onCredentialChange
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
        Autenticação Microsoft
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tenant ID (Directory ID)
          </label>
          <input
            type="text"
            value={credentials.tenantId}
            onChange={(e) => onCredentialChange('tenantId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            placeholder="ex: 9a8b7c6d-5e4f-3g2h-1i0j-9k8l7m6n5o4p"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Client ID (App ID)
          </label>
          <input
            type="text"
            value={credentials.clientId}
            onChange={(e) => onCredentialChange('clientId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            placeholder="ex: 1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Client Secret
          </label>
          <input
            type="password"
            value={credentials.clientSecret}
            onChange={(e) => onCredentialChange('clientSecret', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            placeholder="••••••••••••••••••••••••"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            URI de Redirecionamento
          </label>
          <input
            type="text"
            value={credentials.redirectUri}
            onChange={(e) => onCredentialChange('redirectUri', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white bg-gray-50 dark:bg-gray-700"
            readOnly
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Este URI precisa ser configurado no Portal Azure como uma URL de resposta válida
          </p>
        </div>
      </div>
      
      <div className="flex items-start bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
        <div className="ml-3">
          <h4 className="text-sm font-medium text-blue-600 dark:text-blue-400">Sobre as credenciais</h4>
          <p className="text-sm text-blue-500 dark:text-blue-300 mt-1">
            Para criar estas credenciais, acesse o <a href="https://portal.azure.com" target="_blank" rel="noopener noreferrer" className="underline">Portal Azure</a>, 
            registre um novo aplicativo e configure as permissões necessárias (Microsoft Graph e Teams).
            As credenciais são armazenadas com criptografia e acessíveis apenas pelos administradores do sistema.
          </p>
        </div>
      </div>
    </div>
  );
};