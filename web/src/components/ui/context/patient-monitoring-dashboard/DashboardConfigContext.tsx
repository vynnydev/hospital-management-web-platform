import React, { createContext, useContext, ReactNode } from 'react';

interface DashboardConfigContextType {
  isRealTimeMode: boolean;
  setIsRealTimeMode: (mode: boolean) => void;
  refreshInterval: number;
  setRefreshInterval: (interval: number) => void;
  viewMode: 'full' | 'compact';
  setViewMode: (mode: 'full' | 'compact') => void;
  isRefreshing: boolean;
  lastUpdated: Date;
  handleRefresh: () => void;
}

// Criar o contexto com valor padrão
const DashboardConfigContext = createContext<DashboardConfigContextType>({
  isRealTimeMode: true,
  setIsRealTimeMode: () => {},
  refreshInterval: 30,
  setRefreshInterval: () => {},
  viewMode: 'full',
  setViewMode: () => {},
  isRefreshing: false,
  lastUpdated: new Date(),
  handleRefresh: () => {},
});

// Hook personalizado para usar o contexto
export const useDashboardConfig = () => useContext(DashboardConfigContext);

// Provider para o contexto
interface DashboardConfigProviderProps {
  children: ReactNode;
  value: DashboardConfigContextType;
}

export const DashboardConfigProvider: React.FC<DashboardConfigProviderProps> = ({ 
  children, 
  value 
}) => {
  return (
    <DashboardConfigContext.Provider value={value}>
      {children}
    </DashboardConfigContext.Provider>
  );
};