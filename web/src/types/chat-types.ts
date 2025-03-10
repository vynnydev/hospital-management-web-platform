/* eslint-disable @typescript-eslint/no-empty-object-type */
// Tipos básicos para o chat
export type MessageType = 'text' | 'image' | 'file' | 'patient-data' | 'ai-suggestion';
export type UserRole = 'médico' | 'enfermeiro' | 'atendente' | 'administrador' | 'ai';

// Interface para as mensagens
export interface IMessage {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    role: UserRole;
    avatar?: string;
  };
  timestamp: Date;
  type: MessageType;
  isRead: boolean;
  metadata?: {
    patientId?: string;
    fileUrl?: string;
    aiConfidence?: number;
    suggestion?: string;
  };
}

// Interface para os contatos do chat
export interface IChatContact {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
  online: boolean;
  isGroup?: boolean;
  members?: {id: string, name: string}[];
}

// Tipo para sugestões de mensagens
export interface ISuggestionType {
  text: string;
  category: 'greeting' | 'patient' | 'medical' | 'procedural';
}

// Props para os componentes
export interface IChatSidebarProps {
  contacts: IChatContact[];
  selectedContact: IChatContact | null;
  setSelectedContact: (contact: IChatContact) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeTab: 'individual' | 'groups';
  setActiveTab: (tab: 'individual' | 'groups') => void;
  formatTime: (date: Date) => string;
}

export interface IMessageAreaProps {
  messages: IMessage[];
  isLoading: boolean;
  isTyping: boolean;
  formatTime: (date: Date) => string;
  formatDate: (date: Date) => string;
  messageEndRef: React.RefObject<HTMLDivElement>;
}

export interface IMessageInputProps {
  messageInput: string;
  setMessageInput: (text: string) => void;
  sendMessage: (text: string) => void;
  placeholder: string;
  aiSuggestion: string | null;
  setAiSuggestion: (suggestion: string | null) => void;
}

export interface IContactAvatarProps {
  contact: IChatContact;
  size?: 'sm' | 'md' | 'lg';
}

export interface IWritingAssistantProps {
  onSuggestionSelect: (text: string) => void;
  inputText: string;
}

export interface IAiPanelProps {
  // Props opcionais para o painel de IA
}

export interface IEmptyStateProps {
  // Props opcionais para o estado vazio
}