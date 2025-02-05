import React from 'react';
import { Button } from '@/components/ui/organisms/button';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface DateNavigatorProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

export const DateNavigator: React.FC<DateNavigatorProps> = ({
  selectedDate,
  setSelectedDate,
}) => {
  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setSelectedDate(newDate);
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 border-blue-800/30 text-blue-300/80 hover:text-white"
        onClick={() => setSelectedDate(new Date())}
      >
        <CalendarIcon className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 border-blue-800/30 text-blue-300/80 hover:text-white"
        onClick={() => navigateDate('prev')}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 border-blue-800/30 text-blue-300/80 hover:text-white"
        onClick={() => navigateDate('next')}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
};