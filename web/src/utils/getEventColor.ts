export type EventType = 'admission' | 'discharge' | 'procedure' | 'exam' | 'medication' | 'transfer';
export type ColorVariant = 'bg' | 'border' | 'text';

export const getEventColor = (type: EventType, variant: ColorVariant = 'bg'): string => {
  const colors = {
    admission: {
      bg: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
      border: 'border-emerald-500',
      text: 'text-emerald-100'
    },
    discharge: {
      bg: 'bg-gradient-to-r from-blue-500 to-blue-600',
      border: 'border-blue-500',
      text: 'text-blue-100'
    },
    procedure: {
      bg: 'bg-gradient-to-r from-purple-500 to-purple-600',
      border: 'border-purple-500',
      text: 'text-purple-100'
    },
    exam: {
      bg: 'bg-gradient-to-r from-amber-500 to-amber-600',
      border: 'border-amber-500',
      text: 'text-amber-100'
    },
    medication: {
      bg: 'bg-gradient-to-r from-rose-500 to-rose-600',
      border: 'border-rose-500',
      text: 'text-rose-100'
    },
    transfer: {
      bg: 'bg-gradient-to-r from-cyan-500 to-cyan-600',
      border: 'border-cyan-500',
      text: 'text-cyan-100'
    }
  };

  return colors[type]?.[variant] ?? 
    (variant === 'bg' ? 'bg-gradient-to-r from-gray-500 to-gray-600' : 
     variant === 'text' ? 'text-gray-100' : 'border-gray-500');
};