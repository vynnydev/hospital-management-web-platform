'use client'
import React from 'react';

import DashboardMetrics from './components/DashboardMetrics';
import AgrixiAssistant from '@/components/ui/agrixi-assistant/IAgrixiAssistant';

const Overview: React.FC = () => {
  
  return (
    <div className="px-4 -mt-[100px]">
      <DashboardMetrics />

      <AgrixiAssistant />
    </div>
  );
};

export default Overview;