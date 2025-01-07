// components/PredictiveAnalysisBoard.tsx
'use client'
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend'; // Use o pacote correto

import AIDAHealthAssistant from '@/components/ui/aida-assistant/AIDAHealthAssistant';
import { PatientManagementComponent } from './components/PatientManagement';

const PatientManagement: React.FC = () => {
  return (
    <div className="px-4 -mt-20">
      <DndProvider backend={HTML5Backend}>
        <PatientManagementComponent />
      </DndProvider>
      
      <AIDAHealthAssistant />
    </div>
  );
};

export default PatientManagement;
