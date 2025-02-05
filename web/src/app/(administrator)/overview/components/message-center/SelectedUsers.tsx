import React from 'react';
import { Users, UserMinus, UserPlus, Building } from 'lucide-react';
import Image from 'next/image';
import type { IAppUser } from '@/types/auth-types';

interface ISelectedUsersProps {
  selectedUsers: IAppUser[];
  onRemoveUser: (userId: string) => void;
}

export const SelectedUsers: React.FC<ISelectedUsersProps> = ({ selectedUsers, onRemoveUser }) => {
  return (
    <div>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-3">
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Building className="w-5 h-5" />
                <h3 className="font-medium">Mensagens</h3>
            </div>
        </div>  

        <div className="bg-white dark:bg-gray-800 p-4 mt-4 rounded-xl mb-4 space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-3">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Users className="w-5 h-5" />
                <h3 className="font-medium">Destinatários selecionados</h3>
                </div>
                <span className="text-sm text-gray-500">
                    {selectedUsers.length} {selectedUsers.length === 1 ? 'usuário' : 'usuários'}
                </span>
            </div>

            {/* Content */}
            {selectedUsers.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {selectedUsers.map((user) => (
                    <div
                        key={user.id}
                        className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-full group hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                    >
                        <div className="relative w-6 h-6">
                            <Image
                                src={user.profileImage || '/images/default-avatar.png'}
                                alt={user.name}
                                fill
                                className="rounded-full object-cover"
                            />
                        </div>
                        <span className="text-sm font-medium">{user.name}</span>
                        <button
                            onClick={() => onRemoveUser(user.id)}
                            className="hover:text-red-500 transition-colors"
                            title="Remover usuário"
                        >
                            <UserMinus className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    </div>
                ))}
                </div>
            ) : (
                <div className="flex items-center gap-3 py-3 px-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <UserPlus className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            Selecione pelo menos um destinatário
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Clique em um usuário acima para enviar uma mensagem
                        </p>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};