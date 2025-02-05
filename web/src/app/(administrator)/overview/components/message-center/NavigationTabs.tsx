import React from 'react';
import { Bell, MessageSquare, Sparkles } from 'lucide-react';

interface NavigationTabsProps {
  selectedTab: string;
  onTabChange: (tabId: string) => void;
}

export const NavigationTabs = ({ selectedTab, onTabChange }: NavigationTabsProps) => {
  const tabs = [
    { id: 'announcements', label: 'Avisos', icon: Bell },
    { id: 'messages', label: 'Chat', icon: MessageSquare },
    { id: 'ai-assist', label: 'IA', icon: Sparkles }
  ];

  return (
    <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
            selectedTab === tab.id
              ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-sm'
              : 'text-gray-600 hover:bg-white/50 dark:hover:bg-gray-600'
          }`}
        >
          <tab.icon className="w-4 h-4" />
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};