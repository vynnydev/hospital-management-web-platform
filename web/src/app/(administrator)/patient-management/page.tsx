// components/PredictiveAnalysisBoard.tsx
'use client'
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { MediMindAIPatientAssistant } from '@/components/ui/templates/medimind-ai-assistant/MediMindAIPatientAssistant';
import { MainPatientManagement } from './components/MainPatientManagement';

const PatientManagement: React.FC = () => {
  return (
    <div className="px-4 -mt-20">
      <DndProvider backend={HTML5Backend}>
        <MainPatientManagement />
      </DndProvider>
      
      <MediMindAIPatientAssistant />
    </div>
  );
};

export default PatientManagement;
