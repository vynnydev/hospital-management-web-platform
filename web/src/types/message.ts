import { IAlert } from "./alert-types";

// Interface padrão para mensagens
export interface IMessage {
  id: string;
  content: string;
  user: {
    id: string;
    name: string;
    role: string;
    profileImage?: string;
    permissions: string[];
  };
  timestamp: string;
  createdAt?: string;
  attachments?: {
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
  }[];
}

// Interface estendida para mensagens que podem ser alertas
export interface IExtendedMessage extends IMessage {
  isAlert?: boolean;
  alertData?: IAlert;
  isEmergency?: boolean;
}

// Tipo para anexos em mensagens
export interface IAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}