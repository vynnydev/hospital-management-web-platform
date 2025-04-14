'use client'

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { CognitivaAIPatientAssistant } from "@/components/ui/templates/cognitiva-ai-assistant/CognitivaAIPatientAssistant";
import { MainStaffManagement } from './components/MainStaffManagement';

const StaffManagement: React.FC = () => {
  return (
    <div className="px-4 -mt-20">
      <DndProvider backend={HTML5Backend}>
        <MainStaffManagement />
      </DndProvider>

      <CognitivaAIPatientAssistant />
    </div>
  );
};

export default StaffManagement;