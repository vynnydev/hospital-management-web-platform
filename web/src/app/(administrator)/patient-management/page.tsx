// components/PredictiveAnalysisBoard.tsx
'use client'
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { MediMindAIAssistant } from '@/components/ui/medimind-ai-assistant/MediMindAIAssistant';
import { MainPatientManagement } from './components/MainPatientManagement';

const PatientManagement: React.FC = () => {
  return (
    <div className="px-4 -mt-20">
      <DndProvider backend={HTML5Backend}>
        <MainPatientManagement />
      </DndProvider>
      
      <MediMindAIAssistant />
    </div>
  );
};

export default PatientManagement;
