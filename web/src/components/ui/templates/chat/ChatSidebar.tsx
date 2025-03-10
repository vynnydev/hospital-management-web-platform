import React from 'react';
import { User, Users, Search } from 'lucide-react';
import { IChatContact, IChatSidebarProps } from '@/types/chat-types';
import { ContactAvatar } from './ContactAvatar';

// Componente de contato individual
const ContactItem: React.FC<{
  contact: IChatContact;
  isSelected: boolean;
  onClick: () => void;
  formatTime: (date: Date) => string;
}> = ({ contact, isSelected, onClick, formatTime }) => {
  return (
    <div
      className={`flex items-start p-4 border-b dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
        isSelected ? 'bg-blue-50 dark:bg-blue-900/30' : ''
      }`}
      onClick={onClick}
    >
      <ContactAvatar contact={contact} size="lg" />
      
      <div className="ml-3 flex-1">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-gray-900 dark:text-gray-100">{contact.name}</h3>
          {contact.lastMessageTime && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatTime(contact.lastMessageTime)}
            </span>
          )}
        </div>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
          {contact.lastMessage}
        </p>
        
        {contact.isGroup && (
          <div className="flex items-center mt-1">
            <Users className="h-3 w-3 text-gray-400 dark:text-gray-500 mr-1" />
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {contact.members?.length || 0} membros
            </span>
          </div>
        )}
      </div>
      
      {contact.unreadCount > 0 && (
        <div className="ml-2 bg-blue-600 dark:bg-blue-500 text-white text-xs font-medium rounded-full h-5 min-w-5 flex items-center justify-center px-1">
          {contact.unreadCount}
        </div>
      )}
    </div>
  );
};

// Componente para a barra lateral completa
export const ChatSidebar: React.FC<IChatSidebarProps> = ({
  contacts,
  selectedContact,
  setSelectedContact,
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
  formatTime
}) => {
  return (
    <div className="w-1/3 border-r dark:border-gray-700 flex flex-col bg-gray-50 dark:bg-gray-800">
      {/* Search and tabs */}
      <div className="p-4 border-b dark:border-gray-700">
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Pesquisar..."
            className="w-full p-2 pl-10 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
        </div>
        
        <div className="flex border dark:border-gray-600 rounded-lg overflow-hidden">
          <button
            className={`flex-1 py-2 ${activeTab === 'individual' 
              ? 'bg-blue-600 dark:bg-blue-700 text-white' 
              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
            onClick={() => setActiveTab('individual')}
          >
            <User className="h-4 w-4 mx-auto mb-1" />
            <span className="text-xs">Individuais</span>
          </button>
          <button
            className={`flex-1 py-2 ${activeTab === 'groups' 
              ? 'bg-blue-600 dark:bg-blue-700 text-white' 
              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
            onClick={() => setActiveTab('groups')}
          >
            <Users className="h-4 w-4 mx-auto mb-1" />
            <span className="text-xs">Grupos</span>
          </button>
        </div>
      </div>
      
      {/* Contacts list */}
      <div className="flex-1 overflow-y-auto">
        {contacts.length > 0 ? (
          contacts.map(contact => (
            <ContactItem
              key={contact.id}
              contact={contact}
              isSelected={selectedContact?.id === contact.id}
              onClick={() => setSelectedContact(contact)}
              formatTime={formatTime}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-3">
              {activeTab === 'individual' ? (
                <User className="h-8 w-8 text-gray-400 dark:text-gray-500" />
              ) : (
                <Users className="h-8 w-8 text-gray-400 dark:text-gray-500" />
              )}
            </div>
            <p className="text-gray-500 dark:text-gray-400 mb-1">Nenhum contato encontrado</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              {searchQuery ? 'Tente outra pesquisa' : 'Adicione contatos para começar'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};