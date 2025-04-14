'use client'
import { CognitivaAIPatientAssistant } from "@/components/ui/templates/cognitiva-ai-assistant/CognitivaAIPatientAssistant"
import { ResourceManagementContainerWithProviders } from "./components/MainResourceManagementContainer"

const InventoryResources = () => {
    return (
       <div className="px-4 -mt-28">
            <h1 className="text-center text-2xl font-bold mb-4">Gestão de Recursos</h1>
            <ResourceManagementContainerWithProviders />
            
            <CognitivaAIPatientAssistant />
      </div>
    )
}

export default InventoryResources