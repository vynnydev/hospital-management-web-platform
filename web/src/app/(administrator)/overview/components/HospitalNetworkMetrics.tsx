import { Card } from "@/components/ui/organisms/card"
import { NetworkData } from "@/types/hospital-network-types"
import { Activity, Bed, Building2, Users } from "lucide-react"

interface CurrentMetrics {
    totalBeds: number;
    totalPatients: number;
    averageOccupancy: number;
}

interface HospitalNetworkMetricsProps {
    networkData: NetworkData,
    selectedRegion: string,
    currentMetrics: CurrentMetrics
}

export const HospitalNetworkMetrics: React.FC<HospitalNetworkMetricsProps> = ({
    networkData,
    selectedRegion,
    currentMetrics
}) => {
    return (
        <div>
            {/* Network Overview Cards with updated background */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4 flex items-center space-x-4 bg-gray-200 dark:bg-gray-700">
                <div className="p-3 bg-blue-100 rounded-lg">
                    <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Total de Hospitais</p>
                    <h3 className="text-2xl font-bold">
                    {selectedRegion === 'all' 
                        ? networkData.networkInfo.totalHospitals 
                        : networkData.networkInfo.networkMetrics.regionalMetrics[selectedRegion].hospitals}
                    </h3>
                </div>
                </Card>

                <Card className="p-4 flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-lg">
                    <Users className="h-6 w-6 text-green-600" />
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Pacientes Internados</p>
                    <h3 className="text-2xl font-bold">{currentMetrics.totalPatients}</h3>
                </div>
                </Card>

                <Card className="p-4 flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                    <Bed className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Total de Leitos</p>
                    <h3 className="text-2xl font-bold">{currentMetrics.totalBeds}</h3>
                </div>
                </Card>

                <Card className="p-4 flex items-center space-x-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                    <Activity className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Ocupação Média</p>
                    <h3 className="text-2xl font-bold">
                    {currentMetrics.averageOccupancy.toFixed(1)}%
                    </h3>
                </div>
                </Card>
            </div>
        </div>
    )
}