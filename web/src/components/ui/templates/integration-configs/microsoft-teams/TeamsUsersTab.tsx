/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Users, Shield, Clock, RefreshCw } from 'lucide-react';

interface TeamsUsersTabProps {
  settings: {
    allowTeamsAccess: boolean;
    limitTeamsAccessToWorkHours: boolean;
    teamsSyncFrequency: string;
    teamsLogLevel: string;
    enableTeamsSSO: boolean;
  };
  onSettingChange: (field: string, value: any) => void;
}

export const TeamsUsersTab: React.FC<TeamsUsersTabProps> = ({ 
  settings, 
  onSettingChange 
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Configurações de Usuários e Acesso</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Configure como os usuários do sistema hospitalar poderão acessar e interagir com o Microsoft Teams.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">Permitir Acesso via Teams</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Usuários poderão acessar dados do sistema hospitalar via Teams
            </p>
          </div>
          <button
            onClick={() => onSettingChange('allowTeamsAccess', !settings.allowTeamsAccess)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full ${
              settings.allowTeamsAccess ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
              settings.allowTeamsAccess ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>

        <div className={`flex items-center justify-between ${!settings.allowTeamsAccess ? 'opacity-50 pointer-events-none' : ''}`}>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">Limitar Acesso ao Horário de Trabalho</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Restringe o acesso fora do horário comercial definido
            </p>
          </div>
          <button
            onClick={() => onSettingChange('limitTeamsAccessToWorkHours', !settings.limitTeamsAccessToWorkHours)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full ${
              settings.limitTeamsAccessToWorkHours ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
            }`}
            disabled={!settings.allowTeamsAccess}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
              settings.limitTeamsAccessToWorkHours ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>

        <div className={!settings.allowTeamsAccess ? 'opacity-50 pointer-events-none' : ''}>
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Frequência de Sincronização</h4>
          <select
            value={settings.teamsSyncFrequency}
            onChange={(e) => onSettingChange('teamsSyncFrequency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            disabled={!settings.allowTeamsAccess}
          >
            <option value="realtime">Tempo real</option>
            <option value="5min">A cada 5 minutos</option>
            <option value="15min">A cada 15 minutos</option>
            <option value="30min">A cada 30 minutos</option>
            <option value="hourly">A cada hora</option>
            <option value="daily">Diariamente</option>
          </select>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Define com que frequência os dados serão sincronizados entre o sistema hospitalar e o Teams
          </p>
        </div>

        <div className={!settings.allowTeamsAccess ? 'opacity-50 pointer-events-none' : ''}>
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Nível de Log</h4>
          <select
            value={settings.teamsLogLevel}
            onChange={(e) => onSettingChange('teamsLogLevel', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            disabled={!settings.allowTeamsAccess}
          >
            <option value="error">Apenas erros</option>
            <option value="warning">Avisos e erros</option>
            <option value="info">Informações, avisos e erros</option>
            <option value="debug">Completo (Debug)</option>
          </select>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Define o nível de detalhamento dos logs da integração com Teams
          </p>
        </div>

        <div className={`flex items-center justify-between ${!settings.allowTeamsAccess ? 'opacity-50 pointer-events-none' : ''}`}>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">Habilitar Single Sign-On (SSO)</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Permite que usuários acessem o sistema sem precisar fazer login novamente
            </p>
          </div>
          <button
            onClick={() => onSettingChange('enableTeamsSSO', !settings.enableTeamsSSO)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full ${
              settings.enableTeamsSSO ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
            }`}
            disabled={!settings.allowTeamsAccess}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
              settings.enableTeamsSSO ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-2">
            <Users className="w-5 h-5 text-indigo-500 dark:text-indigo-400 mr-2" />
            <h4 className="font-medium text-gray-900 dark:text-white">Acesso de Usuários</h4>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Os usuários precisarão autorizar a integração na primeira vez que acessarem o Teams.
            Seus níveis de acesso serão baseados em suas permissões existentes no sistema.
          </p>
        </div>

        <div className="flex-1 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-2">
            <Clock className="w-5 h-5 text-orange-500 dark:text-orange-400 mr-2" />
            <h4 className="font-medium text-gray-900 dark:text-white">Horário de Acesso</h4>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Se o acesso for limitado ao horário de trabalho, os usuários não poderão acessar 
            informações sensíveis fora do horário definido pelas políticas do hospital.
          </p>
        </div>
      </div>
    </div>
  );
};