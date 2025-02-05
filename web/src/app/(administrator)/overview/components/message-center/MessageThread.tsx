import React from 'react';
import Image from 'next/image';
import { Paperclip } from 'lucide-react';
import { ScrollArea } from '@/components/ui/organisms/scroll-area';
import type { IMessage } from '@/types/app-types';
import type { IAppUser } from '@/types/auth-types';

interface MessageThreadProps {
  messages: IMessage[];
  currentUser: IAppUser;
}

export const MessageThread = ({ messages, currentUser }: MessageThreadProps) => {
  return (
    <>  
        <ScrollArea className="h-96 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <div className="space-y-4 p-4">
                {messages.map((msg) => (
                <div
                    key={msg.id}
                    className={`flex gap-4 ${msg.user.id === currentUser.id ? 'justify-end' : 'justify-start'}`}
                >
                    {msg.user.id !== currentUser.id && (
                    <div className="flex-shrink-0">
                        <Image
                        src={msg.user.profileImage || '/images/default-avatar.png'}
                        alt={msg.user.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                        />
                    </div>
                    )}
                    
                    <div className={`max-w-[70%] ${
                    msg.user.id === currentUser.id 
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white' 
                        : 'bg-gray-100 dark:bg-gray-700'
                    } rounded-xl p-4`}>
                    <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-sm">{msg.user.name}</span>
                        <span className="text-xs opacity-70">{msg.timestamp}</span>
                    </div>
                    <p className="text-sm">{msg.content}</p>
                    {msg.attachments && msg.attachments.length > 0 && (
                        <div className="mt-3 space-y-2">
                        {msg.attachments.map((attachment, idx) => (
                            <div
                            key={idx}
                            className="flex items-center gap-2 bg-white/10 rounded-lg p-2 text-sm"
                            >
                            <Paperclip className="w-4 h-4" />
                            <span className="truncate">{attachment.name}</span>
                            </div>
                        ))}
                        </div>
                    )}
                    </div>
                    
                    {msg.user.id === currentUser.id && (
                    <div className="flex-shrink-0">
                        <Image
                        src={currentUser.profileImage || '/images/default-avatar.png'}
                        alt={currentUser.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                        />
                    </div>
                    )}
                </div>
                ))}
            </div>
        </ScrollArea>
    </>
  );
};