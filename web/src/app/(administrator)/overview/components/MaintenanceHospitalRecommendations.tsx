import { Card } from "@/components/ui/organisms/card"
import { Badge, CalendarDays } from "lucide-react" // Removemos o Calendar daqui
import { Calendar } from "@/components/ui/organisms/calendar" // Adicionamos esta importação

interface IMaintenanceHospitalRecommendationsProps {
    selectedDate: Date | undefined,
    setSelectedDate: React.Dispatch<React.SetStateAction<Date | undefined>>
}

export const MaintenanceHospitalRecommendations: React.FC<IMaintenanceHospitalRecommendationsProps> = ({
    selectedDate,
    setSelectedDate
}) => {
    return (
        <Card className="p-4 bg-gray-200 dark:bg-gray-700">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <CalendarDays className="h-5 w-5" />
                    Recomendações de Recursos para Rede Hospitalar
                </h3>
                <Badge className="bg-gradient-to-r from-blue-700 to-cyan-700">
                    IA Prediction
                </Badge>
            </div>
            <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
            />
            <div className="mt-4 text-sm text-muted-foreground">
                Previsão baseada em análise do Gemini AI
            </div>
        </Card>
    )
}