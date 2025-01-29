// components/PredictiveAnalysisBoard.tsx
'use client'
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend'; // Use o pacote correto

import AIDAHealthAssistant from '@/components/ui/aida-assistant/AIDAHealthAssistant';
import { MainPatientManagementComponent } from './components/MainPatientManagementComponent';

const PatientManagement: React.FC = () => {
  return (
    <div className="px-4 -mt-20">
      {/* Implementar o lógica do departamento pelo hospital selecionado que o usuário faz parte */}
      {/* Implementar o "DepartmentDashboardMetrics" por departamento */}
      <DndProvider backend={HTML5Backend}>
        <MainPatientManagementComponent />
      </DndProvider>
      
      <AIDAHealthAssistant />
    </div>
  );
};

export default PatientManagement;
