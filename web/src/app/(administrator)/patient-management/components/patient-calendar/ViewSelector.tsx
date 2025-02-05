import React from 'react';
import { Button } from '@/components/ui/organisms/button';

interface ViewSelectorProps {
  view: 'day' | 'week' | 'month';
  setView: (view: 'day' | 'week' | 'month') => void;
}

export const ViewSelector: React.FC<ViewSelectorProps> = ({
  view,
  setView,
}) => {
  const views = [
    { key: 'day', label: 'Dia' },
    { key: 'week', label: 'Semana' },
    { key: 'month', label: 'Mês' },
  ] as const;

  return (
    <div className="flex rounded-lg overflow-y-auto bg-blue-900/20">
      {views.map(({ key, label }) => (
        <Button
          key={key}
          variant={view === key ? 'default' : 'outline'}
          size="sm"
          className={view === key 
            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 border-0' 
            : 'border-blue-800/30 text-blue-300/80 hover:text-white'}
          onClick={() => setView(key)}
        >
          {label}
        </Button>
      ))}
    </div>
  );
};