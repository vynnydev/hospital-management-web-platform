import { IAlert } from "./alert-types";
import { IAppUser } from "./auth-types";

export type ViewType = 'board' | 'list' | 'calendar';

export interface IAttachment {
    name: string;
    url?: string;
    type?: string;
  }
  
  export interface IMessage {
    id: string;
    content: string;
    user: IAppUser;
    timestamp: string;
    createdAt?: string;
    attachments?: IAttachment[];
    isAlert?: boolean;
    alertData?: IAlert;
  }
  
  export interface IChannel {
    id: string;
    name: string;
    unreadCount: number;
    type: 'hospital' | 'department' | 'general';
}