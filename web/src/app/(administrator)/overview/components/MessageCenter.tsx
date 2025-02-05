/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import type { INetworkData, IHospital } from '@/types/hospital-network-types';
import type { IAppUser } from '@/types/auth-types';
import type { IMessage } from '@/types/app-types';

// Importando os componentes
import { Header } from './message-center/Header';
import { NavigationTabs } from './message-center/NavigationTabs';
import { UsersList } from './message-center/UsersList';
import { HospitalsList } from './message-center/HospitalsList';
import { MessageComposer } from './message-center/MessageComposer';
import { MessageThread } from './message-center/MessageThread';
import { AISuggestions } from './message-center/AISuggestions';
import { CommandMenu } from './message-center/CommandMenu';
import { SelectedUsers } from './message-center/SelectedUsers';
import { SelectedHospitalsTag } from './message-center/SelectedHospitalsTag';

interface IMessageCenterProps {
  networkData: INetworkData;
  currentUser: IAppUser | null;
  loading: boolean;
  hospitals: IHospital[];
  onHospitalSelect: (hospitalId: string) => void;
  onRemoveUser: (userId: string) => void;
}

export const MessageCenter: React.FC<IMessageCenterProps> = ({
  networkData,
  currentUser,
  loading,
  hospitals,
  onHospitalSelect: parentHospitalSelect,
  onRemoveUser
}) => {
  // Estados
  const [selectedTab, setSelectedTab] = useState('announcements');
  const [message, setMessage] = useState('');
  const [selectedHospitals, setSelectedHospitals] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<IAppUser[]>([]);
  const [commandOpen, setCommandOpen] = useState(false);
  
  // Mock de mensagens para exemplo
  const messages: IMessage[] = [
    {
      id: 1,
      user: currentUser as IAppUser,
      content: "Bom dia! Precisamos discutir a situação do Hospital A.",
      timestamp: "09:30",
      attachments: []
    }
  ];
  
  // Handler para seleção múltipla de hospitais
  const handleHospitalSelect = (hospitalId: string) => {
    setSelectedHospitals(prev => {
      // Se já está selecionado, remove
      if (prev.includes(hospitalId)) {
        return prev.filter(id => id !== hospitalId);
      }
      // Se não está selecionado, adiciona
      return [...prev, hospitalId];
    });
    // Notifica o componente pai
    parentHospitalSelect(hospitalId);
  };

  // Handler para remover um hospital específico
  const handleRemoveHospital = (hospitalId: string) => {
    setSelectedHospitals(prev => prev.filter(id => id !== hospitalId));
    parentHospitalSelect(hospitalId);
  };

  // Busca o hospital selecionado
  const selectedHospital = selectedHospitals.length > 0 
    ? hospitals.find(h => h.id === selectedHospitals[0])
    : undefined;

  // Busca os hospitais selecionados
  const selectedHospitalsList = hospitals.filter(h => selectedHospitals.includes(h.id));

  // Handlers
  const handleTabChange = (tabId: string) => {
    setSelectedTab(tabId);
  };

  const handleUserSelect = (user: IAppUser) => {
    if (!selectedUsers.find(u => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleMessageChange = (newMessage: string) => {
    setMessage(newMessage);
  };

  const handleSendMessage = () => {
    // Implementar lógica de envio
    setMessage('');
  };

  const handleAISuggestionSelect = (suggestion: string) => {
    setMessage(suggestion);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="space-y-4 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto" />
          <p className="text-gray-500 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (selectedTab) {
      case 'announcements':
        return (
          <>
            <HospitalsList 
              hospitals={hospitals}
              selectedHospitals={selectedHospitals}
              onHospitalSelect={handleHospitalSelect}
            />
            <SelectedUsers 
              selectedUsers={selectedUsers}
              onRemoveUser={onRemoveUser}
            />
            <MessageComposer 
              message={message}
              onMessageChange={setMessage}
              onSendMessage={handleSendMessage}
            />
          </>
        );
      case 'messages':
        return (
          <>
            <HospitalsList 
              hospitals={hospitals}
              selectedHospitals={selectedHospitals}
              onHospitalSelect={handleHospitalSelect}
            />
            <SelectedUsers 
              selectedUsers={selectedUsers}
              onRemoveUser={onRemoveUser}
            />
            <MessageThread 
              messages={messages}
              currentUser={currentUser as IAppUser}
            />
            <MessageComposer 
              message={message}
              onMessageChange={setMessage}
              onSendMessage={handleSendMessage}
            />
          </>
        );
      case 'ai-assist':
        return (
          <>
            <AISuggestions onSuggestionSelect={handleAISuggestionSelect} />
            <HospitalsList 
              hospitals={hospitals}
              selectedHospitals={selectedHospitals}
              onHospitalSelect={handleHospitalSelect}
            />
            <SelectedUsers 
              selectedUsers={selectedUsers}
              onRemoveUser={onRemoveUser}
            />
            <MessageThread 
              messages={messages}
              currentUser={currentUser as IAppUser}
            />
            <MessageComposer 
              message={message}
              onMessageChange={setMessage}
              onSendMessage={handleSendMessage}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 bg-gray-50 dark:bg-gray-900 p-6 rounded-xl">
      <Header 
        currentUser={currentUser}
        onOpenCommand={() => setCommandOpen(true)}
      />
      
      <NavigationTabs 
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
      />
      
      <UsersList 
        networkData={networkData}
        onUserSelect={handleUserSelect}
        onDropdownToggle={() => {}}
      />

      {/* Agora o SelectedHospitalsTag é sempre renderizado, independente da seleção */}
      <SelectedHospitalsTag 
        hospitals={hospitals}
        selectedHospitals={selectedHospitalsList}
        onRemove={handleRemoveHospital}
      />
      
      {renderContent()}
      
      <CommandMenu 
        isOpen={commandOpen}
        onClose={() => setCommandOpen(false)}
      />
    </div>
  );
};