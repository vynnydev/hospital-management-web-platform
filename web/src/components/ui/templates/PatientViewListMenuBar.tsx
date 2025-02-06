// PatientViewListMenuBar.tsx
import React from 'react';
import { BaseMenuBar, ViewType } from '../organisms/BaseMenuBar';
import { PatientAIMenu } from '../organisms/PatientAIMenu';
import { SearchBar } from './SearchBar';

interface PatientViewMenuBarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onSearch?: (query: string) => void;
}

export const PatientViewListMenuBar: React.FC<PatientViewMenuBarProps> = ({
  currentView,
  onViewChange,
  onSearch
}) => {
  return (
    <BaseMenuBar
      currentView={currentView}
      onViewChange={onViewChange}
      LeftMenu={<PatientAIMenu />}
      SearchComponent={<SearchBar.Patient onSearch={onSearch} />}
    />
  );
};