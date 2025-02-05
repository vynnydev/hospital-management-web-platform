import { IAppUser } from "./auth-types";

export type ViewType = 'board' | 'list' | 'calendar';

export interface IAttachment {
    name: string;
    url?: string;
    type?: string;
  }
  
  export interface IMessage {
    id: number;
    user: IAppUser;
    content: string;
    timestamp: string;
    attachments: IAttachment[];
  }
  
  export interface IChannel {
    id: string;
    name: string;
    unreadCount: number;
    type: 'hospital' | 'department' | 'general';
}