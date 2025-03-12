'use client'
import { MediMindAIPatientAssistant } from "@/components/ui/templates/medimind-ai-assistant/MediMindAIPatientAssistant"
import { MainStaffPredictiveAnalysis } from "./components/MainStaffPredictiveAnalysis"

const PredictiveAnalisys = () => {
    return (
        <div className="px-6 -mt-12">
            <MainStaffPredictiveAnalysis />

            <MediMindAIPatientAssistant />
        </div>
    )
}

export default PredictiveAnalisys