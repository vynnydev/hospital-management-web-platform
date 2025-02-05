import React from 'react';
import { 
  UserPlus,
  UserMinus,
  Stethoscope,
  ClipboardCheck,
  Pill,
  ArrowRightLeft,
  Activity
} from 'lucide-react';
import { EventType } from './getEventColor';

/**
 * Retorna o ícone apropriado para um tipo de evento
 */
export const getEventIcon = (type: string): JSX.Element => {
  switch (type as EventType) {
    case 'admission':
      return <UserPlus className="w-4 h-4" />;
    case 'discharge':
      return <UserMinus className="w-4 h-4" />;
    case 'procedure':
      return <Stethoscope className="w-4 h-4" />;
    case 'exam':
      return <ClipboardCheck className="w-4 h-4" />;
    case 'medication':
      return <Pill className="w-4 h-4" />;
    case 'transfer':
      return <ArrowRightLeft className="w-4 h-4" />;
    default:
      return <Activity className="w-4 h-4" />;
  }
};