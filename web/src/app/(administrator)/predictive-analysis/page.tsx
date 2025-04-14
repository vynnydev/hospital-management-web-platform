'use client'

import { CognitivaAIPatientAssistant } from "@/components/ui/templates/cognitiva-ai-assistant/CognitivaAIPatientAssistant"
import { MainStaffPredictiveAnalysis } from "./components/MainStaffPredictiveAnalysis"

const PredictiveAnalisys = () => {
    return (
        <div className="px-6 -mt-12">
            <MainStaffPredictiveAnalysis />

            <CognitivaAIPatientAssistant />
        </div>
    )
}

export default PredictiveAnalisys