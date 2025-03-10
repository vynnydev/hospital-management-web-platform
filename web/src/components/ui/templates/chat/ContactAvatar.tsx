import React from 'react';
import { User, Users, Sparkles } from 'lucide-react';
import { IContactAvatarProps } from '@/types/chat-types';
import Image from 'next/image';

export const ContactAvatar: React.FC<IContactAvatarProps> = ({ contact, size = 'md' }) => {
  // Determinar classes com base no tamanho
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const indicatorSizes = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3'
  };

  const borderSizes = {
    sm: 'border-2',
    md: 'border-2',
    lg: 'border-2'
  };

  return (
    <div className="relative flex-shrink-0">
      {contact.avatar ? (
        // Avatar com imagem
        <div className={`${sizeClasses[size]} rounded-full overflow-hidden`}>
          <Image 
            src={contact.avatar} 
            alt={contact.name} 
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        // Avatar com ícone baseado no tipo de contato
        <div 
          className={`
            ${sizeClasses[size]} rounded-full flex items-center justify-center
            ${contact.role === 'ai' 
              ? 'bg-indigo-100 dark:bg-indigo-900/70 text-indigo-600 dark:text-indigo-300' 
              : contact.isGroup
                ? 'bg-green-100 dark:bg-green-900/70 text-green-600 dark:text-green-300'
                : 'bg-blue-100 dark:bg-blue-900/70 text-blue-600 dark:text-blue-300'
            }
          `}
        >
          {contact.role === 'ai' ? (
            <Sparkles className={iconSizes[size]} />
          ) : contact.isGroup ? (
            <Users className={iconSizes[size]} />
          ) : (
            <User className={iconSizes[size]} />
          )}
        </div>
      )}
      
      {/* Indicador de online */}
      {contact.online && (
        <div 
          className={`
            absolute bottom-0 right-0 
            ${indicatorSizes[size]} 
            bg-green-500 rounded-full 
            ${borderSizes[size]} border-white dark:border-gray-800
          `}
        ></div>
      )}
    </div>
  );
};