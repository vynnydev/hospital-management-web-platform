import React from 'react';
import Image from 'next/image';
import { Command } from 'lucide-react';
import type { IAppUser } from '@/types/auth-types';

interface HeaderProps {
  currentUser: IAppUser | null;
  onOpenCommand: () => void;
}

export const Header = ({ currentUser, onOpenCommand }: HeaderProps) => {
  if (!currentUser) return null;
  
  return (
    <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Image
            src={currentUser.profileImage || '/images/default-avatar.png'}
            alt="Profile"
            width={48}
            height={48}
            className="rounded-full ring-2 ring-blue-500"
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">{currentUser.name}</h2>
          <p className="text-sm text-gray-500">{currentUser.role}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenCommand}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          <Command className="w-4 h-4" />
          <span>Busca rápida</span>
          <kbd className="ml-2 text-xs bg-white dark:bg-gray-800 px-2 py-0.5 rounded">⌘K</kbd>
        </button>
      </div>
    </div>
  );
};