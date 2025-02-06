'use client'
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { MediMindAIAssistant } from "@/components/ui/medimind-ai-assistant/MediMindAIAssistant";
import { MainStaffManagement } from './components/MainStaffManagement';

const StaffManagement: React.FC = () => {
  return (
    <div className="px-4 -mt-20">
      <DndProvider backend={HTML5Backend}>
        <MainStaffManagement />
      </DndProvider>

      <MediMindAIAssistant />
    </div>
  );
};

export default StaffManagement;