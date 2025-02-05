/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import Image from 'next/image';
import { ChevronDown, UserPlus, Plus, Hash } from 'lucide-react';
import type { INetworkData, IHospital } from '@/types/hospital-network-types';
import type { IAppUser } from '@/types/auth-types';
import type { IChannel } from '@/types/app-types';

interface UsersListProps {
  networkData: INetworkData;
  onUserSelect: (user: IAppUser) => void;
  onDropdownToggle: () => void;
}

export const UsersList = ({ networkData, onUserSelect, onDropdownToggle }: UsersListProps) => {
  const [channels] = React.useState<IChannel[]>([
    { id: '1', name: 'emergência', unreadCount: 3, type: 'department' },
    { id: '2', name: 'geral', unreadCount: 1, type: 'general' },
    { id: '3', name: 'coordenação', unreadCount: 0, type: 'hospital' },
    { id: '4', name: 'enfermagem', unreadCount: 2, type: 'department' }
  ]);
  const [isDiscordConnected, setIsDiscordConnected] = React.useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm divide-y divide-gray-200 dark:divide-gray-700">
      {/* Direct Messages Section */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <ChevronDown className="w-4 h-4" />
            MENSAGENS DIRETAS
          </h3>
          <button
            onClick={onDropdownToggle}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            title="Adicionar novo contato"
          >
            <UserPlus className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex flex-wrap gap-3 py-2">
          {networkData?.users?.map(user => (
            <button
              key={user.id}
              onClick={() => onUserSelect(user)}
              className="flex flex-col items-center gap-2 group cursor-pointer hover:scale-105 transition-transform"
            >
              <div className="relative">
                <Image
                  src={user.profileImage || '/images/default-avatar.png'}
                  alt={user.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
              </div>
              <div className="text-center group-hover:bg-gray-50 dark:group-hover:bg-gray-700 rounded-lg p-1 transition-colors">
                <p className="text-xs font-medium">{user.name}</p>
                <p className="text-xs text-gray-500">
                  {networkData?.hospitals?.find(h => h.id === user.hospitalId)?.name || 'Admin'}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Channels Section */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <ChevronDown className="w-4 h-4" />
            CANAIS
          </h3>
          <div className="flex items-center gap-2">
            <button
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              title="Criar novo canal"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsDiscordConnected(!isDiscordConnected)}
              className="flex items-center gap-2 px-2 py-1 text-xs bg-[#5865F2] text-white rounded-md hover:bg-[#4752C4] transition-colors"
            >
              <Image
                src="/images/integrations/discord.png"
                alt="Discord"
                width={16}
                height={16}
              />
              {isDiscordConnected ? 'Conectado' : 'Conectar Discord'}
            </button>
          </div>
        </div>
        
        {channels.length > 0 ? (
          <div className="space-y-1">
            {channels.map(channel => (
              <button
                key={channel.id}
                className="flex items-center justify-between w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg group"
              >
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{channel.name}</span>
                  {channel.type !== 'general' && (
                    <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      {channel.type === 'hospital' ? '• Hospital' : '• Departamento'}
                    </span>
                  )}
                </div>
                {channel.unreadCount > 0 && (
                  <span className="px-2 py-1 text-xs font-medium bg-red-500 text-white rounded-full">
                    {channel.unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">Nenhum canal disponível</p>
            <p className="text-xs text-gray-400">Conecte-se ao Discord para sincronizar canais</p>
          </div>
        )}
      </div>
    </div>
  );
};