'use client'
import { MediMindAIAssistant } from "@/components/ui/medimind-ai-assistant/MediMindAIAssistant"
import { ResourceManagementContainerWithProviders } from "./components/MainResourceManagementContainer"

const InventoryResources = () => {
    return (
       <div className="px-4 -mt-32">
            <h1 className="text-2xl font-bold mb-4">Gestão de Recursos</h1>
            <ResourceManagementContainerWithProviders />
            
            <MediMindAIAssistant />
      </div>
    )
}

export default InventoryResources