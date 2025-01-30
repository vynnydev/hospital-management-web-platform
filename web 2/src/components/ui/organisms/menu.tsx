import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/organisms/dropdown-menu';

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  description: string;
  action: string;
}

interface MenuProps {
  trigger: React.ReactNode;
  items: MenuItem[];
  onSelect: (action: string) => void;
  className?: string;
}

export const Menu = ({ trigger, items, onSelect, className }: MenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent className={className}>
        {items.map((item) => (
          <DropdownMenuItem
            key={item.action}
            onClick={() => onSelect(item.action)}
            className="flex items-center gap-3 p-3 hover:bg-gray-700 cursor-pointer"
          >
            <div className="text-blue-400">{item.icon}</div>
            <div>
              <div className="font-medium text-gray-200">{item.label}</div>
              <div className="text-sm text-gray-400">{item.description}</div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};