import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { useNetworkData } from "@/services/hooks/network-hospital/useNetworkData";
import { ChatModal } from "../ChatModal";

// Componente do botão que abre o modal
export const ChatButton = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { networkData } = useNetworkData();
    const selectedHospitalId = networkData?.hospitals[0]?.id || 'RD4H-SP-ITAIM';
  
    return (
      <>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-full shadow-md transition-all duration-300 hover:shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
          <span>Chat H24</span>
        </button>
        
        <ChatModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          hospitalId={selectedHospitalId}
        />
      </>
    );
  };