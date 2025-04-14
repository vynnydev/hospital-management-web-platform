import React from 'react';
import { Check } from 'lucide-react';

interface IntegrationSuggestionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onToggle: () => void;
}

export const TeamsIntegrationSuggestion: React.FC<IntegrationSuggestionProps> = ({ 
  title, 
  description, 
  icon, 
  isSelected, 
  onToggle 
}) => (
  <div 
    onClick={onToggle}
    className={`flex items-start p-4 rounded-lg cursor-pointer transition-colors duration-200 ${
      isSelected 
        ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800' 
        : 'border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
    }`}
  >
    <div className={`p-2 rounded-md ${isSelected ? 'bg-blue-100 dark:bg-blue-800' : 'bg-gray-100 dark:bg-gray-800'}`}>
      {icon}
    </div>
    <div className="ml-4 flex-1">
      <h4 className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
        {title}
        {isSelected && <Check className="w-4 h-4 ml-2 text-blue-600 dark:text-blue-400" />}
      </h4>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        {description}
      </p>
    </div>
  </div>
);