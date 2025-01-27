'use client';
import React from 'react';

import AIDAHealthAssistant from '@/components/ui/aida-assistant/AIDAHealthAssistant';
import { BedsManagement } from './components/BedsManagement';

const BedManagement: React.FC = () => {
  return (
    <div className="space-y-20 p-8 -mt-20">
      <BedsManagement />
      
      <AIDAHealthAssistant />
    </div>
  );
};

export default BedManagement; 