// components/PredictiveAnalysisBoard.tsx
'use client'

import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { CognitivaAIPatientAssistant } from '@/components/ui/templates/cognitiva-ai-assistant/CognitivaAIPatientAssistant';
import { MainPatientManagement } from './components/MainPatientManagement';

const PatientManagement: React.FC = () => {
  return (
    <div className="px-4 -mt-20">
      <DndProvider backend={HTML5Backend}>
        <MainPatientManagement />
      </DndProvider>
      
      <CognitivaAIPatientAssistant />
    </div>
  );
};

export default PatientManagement;
