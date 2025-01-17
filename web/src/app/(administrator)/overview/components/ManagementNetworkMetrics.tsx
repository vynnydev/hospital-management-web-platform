import { Button } from "@/components/ui/organisms/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/organisms/select"
import { Hospital, NetworkData } from "@/types/hospital-network-types";

interface CurrentMetrics {
    totalBeds: number;
    totalPatients: number;
    averageOccupancy: number;
}

interface ManagementNetworkMetricsProps {
    networkData: NetworkData,
    filteredHospitals: Hospital[],
    selectedRegion: string,
    setSelectedRegion: React.Dispatch<React.SetStateAction<string>>,
    setDisplayMode: React.Dispatch<React.SetStateAction<"dashboard" | "tv">>,
    displayMode: string,
    currentMetrics: CurrentMetrics,
    canChangeRegion: boolean | undefined
}

export const ManagementNetworkMetrics: React.FC<ManagementNetworkMetricsProps> = ({
    networkData,
    selectedRegion,
    setSelectedRegion,
    setDisplayMode,
    displayMode,
    currentMetrics,
    filteredHospitals,
    canChangeRegion
}) => {


    // Get unique regions using Array.reduce
    const regions = networkData.hospitals
    .reduce<string[]>((acc, hospital) => {
        if (!acc.includes(hospital.unit.state)) {
        acc.push(hospital.unit.state);
        }
        return acc;
    }, []);

    return (
        <div>
            {/* Header Section */}
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    {/* <Image 
                        src={`/${networkData.networkInfo.logo}` || '/images/default-avatar.png'} 
                        alt="Network Logo" 
                        className="h-12 w-12" 
                        width={12}
                        height={12}
                    /> */}
                    <div>
                        <h1 className="text-2xl font-bold">{networkData.networkInfo.name}</h1>
                        <p className="text-muted-foreground">
                        {filteredHospitals.length} Hospitais • {currentMetrics.totalBeds} Leitos
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center space-x-4">
                    {canChangeRegion && (
                        <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                            <SelectTrigger className="w-36">
                                <SelectValue placeholder="Região" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas Regiões</SelectItem>
                                {regions.map(region => (
                                <SelectItem key={region} value={region}>{region}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}

                    <Button
                        variant="outline"
                        onClick={() => setDisplayMode(prev => prev === 'dashboard' ? 'tv' : 'dashboard')}
                    >
                        {displayMode === 'dashboard' ? 'Modo TV' : 'Modo Dashboard'}
                    </Button>
                </div>
            </div>
        </div>
    )
}