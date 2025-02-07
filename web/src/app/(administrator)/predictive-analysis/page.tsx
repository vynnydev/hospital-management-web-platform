'use client'
import { MediMindAIAssistant } from "@/components/ui/medimind-ai-assistant/MediMindAIAssistant"
import { MainStaffPredictiveAnalysis } from "./components/MainStaffPredictiveAnalysis"

const PredictiveAnalisys = () => {
    return (
        <div className="px-6 -mt-12">
            <MainStaffPredictiveAnalysis />

            <MediMindAIAssistant />
        </div>
    )
}

export default PredictiveAnalisys