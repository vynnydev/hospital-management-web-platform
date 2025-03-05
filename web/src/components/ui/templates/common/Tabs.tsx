import React, { useState, ReactNode } from 'react';

interface TabProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

const Tab: React.FC<TabProps> = ({ label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
        active
          ? 'bg-gray-700 dark:bg-gray-700 text-blue-400 dark:text-blue-300 border-l border-t border-r border-gray-600 dark:border-gray-600'
          : 'text-gray-400 dark:text-gray-400 hover:text-gray-300 dark:hover:text-gray-300 hover:bg-gray-700/50 dark:hover:bg-gray-700/50'
      }`}
    >
      {label}
    </button>
  );
};

interface TabPanelProps {
  active: boolean;
  children: ReactNode;
}

export const TabPanel: React.FC<TabPanelProps> = ({ active, children }) => {
  if (!active) return null;
  
  return (
    <div className="bg-gray-700 dark:bg-gray-700 border border-gray-600 dark:border-gray-600 rounded-b-lg rounded-tr-lg p-4">
      {children}
    </div>
  );
};

interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabContainerProps {
  tabs: TabItem[];
  defaultTab?: string;
}

export const TabContainer: React.FC<TabContainerProps> = ({ tabs, defaultTab }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  
  return (
    <div>
      <div className="flex border-b border-gray-600 dark:border-gray-600 bg-gray-800 dark:bg-gray-800">
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            label={tab.label}
            active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          />
        ))}
      </div>
      
      {tabs.map((tab) => (
        <TabPanel key={tab.id} active={activeTab === tab.id}>
          {tab.content}
        </TabPanel>
      ))}
    </div>
  );
};