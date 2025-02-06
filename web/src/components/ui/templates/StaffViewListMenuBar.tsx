// StaffViewListMenuBar.tsx
import React from 'react';
import { BaseMenuBar, ViewType } from '../organisms/BaseMenuBar';
import { StaffAIMenu } from '../organisms/StaffAIMenu';
import { SearchBar } from './SearchBar';

interface StaffViewMenuBarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onSearch?: (query: string) => void;
  useAdvancedSearch?: boolean;
}

export const StaffViewListMenuBar: React.FC<StaffViewMenuBarProps> = ({
  currentView,
  onViewChange,
  onSearch,
  useAdvancedSearch = false
}) => {
  const SearchComponent = useAdvancedSearch 
    ? <SearchBar.StaffAdvanced onSearch={onSearch} />
    : <SearchBar.Staff onSearch={onSearch} />;

  return (
    <BaseMenuBar
      currentView={currentView}
      onViewChange={onViewChange}
      LeftMenu={<StaffAIMenu />}
      SearchComponent={SearchComponent}
    />
  );
};
