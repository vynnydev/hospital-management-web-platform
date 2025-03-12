'use client'
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { MediMindAIPatientAssistant } from "@/components/ui/templates/medimind-ai-assistant/MediMindAIPatientAssistant";
import { MainStaffManagement } from './components/MainStaffManagement';

const StaffManagement: React.FC = () => {
  return (
    <div className="px-4 -mt-20">
      <DndProvider backend={HTML5Backend}>
        <MainStaffManagement />
      </DndProvider>

      <MediMindAIPatientAssistant />
    </div>
  );
};

export default StaffManagement;