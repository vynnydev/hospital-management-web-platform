'use client';
import React from 'react';

import { MediMindAIAssistant } from '@/components/ui/medimind-ai-assistant/MediMindAIAssistant';
import { BedsManagement } from './components/BedsManagement';

const BedManagement: React.FC = () => {
  return (
    <>    
      <div className="space-y-20 p-8 -mt-20">
        <BedsManagement />
        
      </div>
      
      <MediMindAIAssistant />
    </>
  );
};

export default BedManagement; 