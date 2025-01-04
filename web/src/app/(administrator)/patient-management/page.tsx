// components/PredictiveAnalysisBoard.tsx
'use client'
import React from 'react';

import AIDAHealthAssistant from '@/components/ui/aida-assistant/AIDAHealthAssistant';

import { PatientManagementComponent } from './components/PatientManagement';

const PatientManagement: React.FC = () => {
  return (
    <div className="px-4 -mt-20">
        <PatientManagementComponent />

        <AIDAHealthAssistant />
    </div>
  );
};

export default PatientManagement;