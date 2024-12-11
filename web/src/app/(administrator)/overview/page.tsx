'use client'
import React from 'react';

import AgrixiAssistant from '@/components/ui/agrixi-assistant/IAgrixiAssistant';

const Overview: React.FC = () => {
  
  return (
    <div className="px-4 mt-[-80px]">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        Overview
      </div>

      <AgrixiAssistant />
    </div>
  );
};

export default Overview;