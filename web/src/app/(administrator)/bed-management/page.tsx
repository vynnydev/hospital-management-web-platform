'use client';
import React from 'react';

import { MediMindAIPatientAssistant } from '@/components/ui/templates/medimind-ai-assistant/MediMindAIPatientAssistant';
import { BedsManagement } from './components/BedsManagement';

const BedManagement: React.FC = () => {
  return (
    <>    
      <div className="space-y-20 p-8 -mt-24">
        <BedsManagement />
        
      </div>
      
      <MediMindAIPatientAssistant />
    </>
  );
};

export default BedManagement; 