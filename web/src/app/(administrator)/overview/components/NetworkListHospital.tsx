import { Card } from "@/components/ui/organisms/card"
import { AppUser } from "@/types/auth-types"
import { Hospital } from "@/types/hospital-network-types"
import { Building2 } from "lucide-react"

interface NetworkListHospitalProps {
    filteredHospitals: Hospital[],
    setSelectedHospital: React.Dispatch<React.SetStateAction<string | null>>
    currentUser: AppUser | null
}

export const NetworkListHospital: React.FC<NetworkListHospitalProps> = ({
    filteredHospitals,
    setSelectedHospital,
    currentUser
}) => {

    return (
       <div>
            {/* Hospital List */}
            <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4">
                    {currentUser?.permissions.includes('VIEW_ALL_HOSPITALS') 
                    ? 'Hospitais da Rede'
                    : 'Seu Hospital'}
                </h3>
                <div className="space-y-4">
                    {filteredHospitals.map(hospital => (
                    <div
                        key={hospital.id}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 cursor-pointer"
                        onClick={() => setSelectedHospital(hospital.id)}
                    >
                        <div className="flex items-center space-x-3">
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <p className="font-medium">{hospital.name}</p>
                            <p className="text-sm text-muted-foreground">
                            {hospital.unit.city}, {hospital.unit.state}
                            </p>
                        </div>
                        </div>
                        <div className="text-right">
                        <p className="font-medium">{hospital.metrics.overall.occupancyRate}%</p>
                        <p className="text-sm text-muted-foreground">Ocupação</p>
                        </div>
                    </div>
                    ))}
                </div>
            </Card>
       </div> 
    )
}