'use client';
import React from 'react';

import AIDAHealthAssistant from '@/components/ui/aida-assistant/AIDAHealthAssistant';

const BedManagement: React.FC = () => {
  return (
    <div className="flex-1">
      <div className="flex h-full">
        Bed Management
      </div>
      <AIDAHealthAssistant />
    </div>
  );
};

export default BedManagement; 