'use client';

import React from 'react';

import { CognitivaAIPatientAssistant } from '@/components/ui/templates/cognitiva-ai-assistant/CognitivaAIPatientAssistant';
import { BedsManagement } from './components/BedsManagement';

const BedManagement: React.FC = () => {
  return (
    <>    
      <div className="space-y-20 p-8 -mt-24">
        <BedsManagement />
        
      </div>
      
      <CognitivaAIPatientAssistant />
    </>
  );
};

export default BedManagement; 