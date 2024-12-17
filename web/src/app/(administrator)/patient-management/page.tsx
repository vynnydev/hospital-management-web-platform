// components/PredictiveAnalysisBoard.tsx
'use client'
import React from 'react';

import IAgrixiAssistant from '@/components/ui/aida-assistant/AIDAHealthAssistant';

const PatientManagement: React.FC = () => {
  return (
    <div className="px-4 -mt-20">
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8'>
          Patient Management
        </div>

        <IAgrixiAssistant />
    </div>
  );
};

export default PatientManagement;