// pages/Overview.tsx
'use client'
import React from 'react';
import DashboardMetrics from './components/DashboardMetrics';
import AIAnaliticsMetrics from './components/AIAnaliticsMetrics'

import AgrixiAssistant from '@/components/ui/aida-assistant/AIDAHealthAssistant';

const Overview: React.FC = () => {
  const handleRefreshAnalysis = () => {
    console.log('Análise atualizada');
  };
  
  return (
    <div className="px-4 -mt-[100px]">
      <DashboardMetrics onRefresh={handleRefreshAnalysis} />

      <AIAnaliticsMetrics />

      <AgrixiAssistant />
    </div>
  );
};

export default Overview;